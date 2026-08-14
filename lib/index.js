// @zrsio4-y/dsh-explorer — host half.
// Workspace-scoped file API for the web GUI's file explorer:
//   GET  /api/explorer/roots                     -> { roots, ignore }
//   GET  /api/explorer/list?path=...             -> { path, entries, truncated }
//   GET  /api/explorer/search?q=...&path=...     -> recursive filename search
//   GET  /api/explorer/text?path=...             -> { text, size, truncated } | { error }
//   GET  /api/explorer/highlight?path=...        -> { html, stats } (shiki + line numbers + find)
//   GET  /api/explorer/markdown?path=...         -> { html }   (micromark)
//   GET  /api/explorer/csv?path=...              -> { html }   (delimiter auto-detect)
//   GET  /api/explorer/xlsx?path=...             -> { html }   (SheetJS, optional dep)
//   GET  /api/explorer/docx?path=...             -> { html }   (mammoth, optional dep)
//   GET  /api/explorer/zip?path=...              -> { entries } (jszip archive listing)
//   GET  /api/explorer/zipfile?path=...&inner=.. -> inner file bytes
//   GET  /api/explorer/raw?path=...              -> raw bytes with MIME + byte ranges
//   GET  /api/explorer/balance                   -> DeepSeek account balance
//   GET  /api/explorer/version                   -> GitHub release check {current, latest, hasUpdate}
//   GET  /api/explorer/usage?sessionId=...       -> per-session token usage + cost
//   POST /api/explorer/rename  {path, name}      -> rename file/dir (same parent)
//   POST /api/explorer/delete  {path, recycle}   -> delete (recycle bin or permanent)
//   POST /api/explorer/mkdir   {path, name}      -> create a child directory
//   POST /api/explorer/touch   {path, name}      -> create an empty file
//   POST /api/explorer/copy    {path, src}       -> copy src into the target dir
// Every path is validated to stay inside the configured workspace roots
// (symlinks/junctions resolving outside are rejected). Configured protected
// directories reject all mutations.

import { cp, mkdir, open, readdir, readFile, realpath, rename, rm, stat } from "node:fs/promises";
import { basename, dirname, extname, join, resolve, sep } from "node:path";
import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import z from "@deepseek-ai/schemastery";

const name = "explorer";
const inject = ["webServer", "credentials"];

const Config = z.object({
  roots: z.array(z.string()).min(1).required(),
  textCap: z.number().default(2 * 1024 * 1024),
  listCap: z.number().default(2000),
  // Basenames (exact match) that recursive search skips and that the tree
  // hides by default: dependency/cache/build noise. Toggleable in the UI.
  ignore: z.array(z.string()).default([
    "node_modules", ".git", ".svn", ".hg", ".venv", "venv", "env",
    "__pycache__", ".cache", ".next", ".nuxt", ".idea", ".vscode",
    ".DS_Store", "Thumbs.db", "dist", "build", "target",
    ".pytest_cache", ".mypy_cache", ".ruff_cache", ".ipynb_checkpoints",
  ]),
  searchCap: z.number().default(500),
  searchDepth: z.number().default(16),
  // Optional update check against GitHub Releases. The repo is auto-derived
  // from package.json `repository`; `updateRepo` (owner/repo) overrides it
  // (useful for forks).
  updateCheck: z.boolean().default(true),
  updateRepo: z.string().default(""),
  // Absolute paths (or prefixes) that reject all mutations. Kept empty here so
  // no author-specific path ships in the public source — configure locally.
  protected: z.array(z.string()).default([]),
  // Token pricing (CNY per 1M tokens) used to estimate per-session spend.
  // DeepSeek: cache-miss input 2, cache-hit input 0.5, output 8.
  prices: z.object({
    input: z.number().default(2),
    cacheRead: z.number().default(0.5),
    cacheWrite: z.number().default(2),
    output: z.number().default(8),
  }).default({}),
});

// Shared base styling for HTML previews (rendered inside sandboxed iframes).
const PREVIEW_CSS =
  "<style>" +
  "body{margin:18px 20px;font-family:system-ui,'Segoe UI','Microsoft YaHei',sans-serif;color:#1f2328;background:#fff;line-height:1.6;font-size:14px}" +
  "h1,h2,h3,h4{margin:1em 0 .5em;line-height:1.3}" +
  "h1{font-size:1.6em;border-bottom:1px solid #e5e7eb;padding-bottom:.3em}" +
  "h2{font-size:1.35em;border-bottom:1px solid #eef0f3;padding-bottom:.25em}" +
  "code{background:#f3f4f6;padding:.15em .4em;border-radius:4px;font-size:.9em;font-family:Consolas,'Courier New',monospace}" +
  "pre{background:#f6f8fa;padding:12px 14px;border-radius:8px;overflow:auto}" +
  "pre code{background:transparent;padding:0}" +
  "blockquote{margin:0 0 1em;padding:2px 14px;border-left:3px solid #d1d5db;color:#57606a}" +
  "table{border-collapse:collapse;margin:10px 0}" +
  "th,td{border:1px solid #d8dee4;padding:4px 10px;text-align:left}" +
  "a{color:#0969da}" +
  "img{max-width:100%}" +
  "hr{border:none;border-top:1px solid #e5e7eb;margin:18px 0}" +
  ".dshx-table-wrap{max-height:100%;overflow:auto}" +
  ".dshx-table{position:relative;border-collapse:collapse;font-size:13px;white-space:nowrap}" +
  ".dshx-table th{position:sticky;top:0;background:#f6f8fa;z-index:1;font-weight:600}" +
  ".dshx-note{color:#8a919c;font-size:12px;margin:8px 0}" +
  ".dshx-code{margin:0;font-size:13px;line-height:1.5}" +
  ".dshx-doc{max-width:860px}" +
  ".dshx-doc table{max-width:100%}" +
  // Code line numbers (shiki emits one <span class="line"> per source line).
  ".shiki code{counter-reset:dshx-line 0}" +
  ".shiki .line{counter-increment:dshx-line}" +
  ".shiki .line::before{content:counter(dshx-line);display:inline-block;min-width:2.5ch;padding-right:1.25em;margin-right:.5em;color:#6e7681;text-align:right;user-select:none}" +
  "</style>";

// Self-contained find-in-file widget injected into code previews. The iframe
// runs it with `sandbox="allow-scripts"` in an opaque origin, so it can only
// touch its own document. Ctrl/Cmd+F opens the bar; Enter / Shift+Enter
// cycles matches; Escape closes.
const FIND_WIDGET =
  "<style>" +
  ".dshx-findbar{position:sticky;top:0;z-index:10;display:none;align-items:center;gap:6px;background:#1f2428;color:#e1e4e8;padding:6px 10px;font:13px/1.4 system-ui,sans-serif;border-bottom:1px solid #30363d}" +
  ".dshx-findbar[data-open='1']{display:flex}" +
  ".dshx-findbar input{flex:1;min-width:0;background:#0d1117;color:#e1e4e8;border:1px solid #30363d;border-radius:6px;padding:3px 8px;font:inherit;outline:none}" +
  ".dshx-findbar button{background:transparent;color:#e1e4e8;border:1px solid #30363d;border-radius:6px;padding:2px 8px;cursor:pointer;font:inherit}" +
  ".dshx-findbar button:hover{background:#30363d}" +
  ".dshx-find-count{color:#8b949e;min-width:7ch;text-align:center}" +
  "mark.dshx-hit{background:#ffd33d;color:#24292e;border-radius:2px}" +
  "mark.dshx-cur{background:#f0883e;color:#fff;border-radius:2px}" +
  "</style>" +
  "<div class=\"dshx-findbar\" id=\"dshx-fb\">" +
  "<input id=\"dshx-fq\" placeholder=\"查找…\" spellcheck=\"false\" />" +
  "<button id=\"dshx-prev\" title=\"上一个\">▲</button>" +
  "<button id=\"dshx-next\" title=\"下一个\">▼</button>" +
  "<span class=\"dshx-find-count\" id=\"dshx-fc\"></span>" +
  "<button id=\"dshx-close\" title=\"关闭\">✕</button>" +
  "</div>" +
  "<script>" +
  "(function(){var bar=document.getElementById('dshx-fb');var input=document.getElementById('dshx-fq');var count=document.getElementById('dshx-fc');var hits=[];var idx=-1;" +
  "function openBar(){bar.setAttribute('data-open','1');input.focus();input.select();}" +
  "function closeBar(){bar.setAttribute('data-open','0');clear();}" +
  "function clear(){hits.forEach(function(m){var p=m.parentNode;if(p)p.replaceChild(document.createTextNode(m.textContent),m);});hits=[];idx=-1;count.textContent='';}" +
  "function collect(node,acc){var k=node.childNodes;for(var i=0;i<k.length;i++){var c=k[i];if(c.nodeType===3){if(c.nodeValue)acc.push(c);}else if(c.nodeType===1&&c.tagName!=='SCRIPT'&&c.tagName!=='STYLE'&&c!==bar){collect(c,acc);}}}" +
  "function focusHit(i){if(!hits.length)return;idx=(i+hits.length)%hits.length;hits.forEach(function(m){m.className='dshx-hit';});var cur=hits[idx];cur.className='dshx-cur';cur.scrollIntoView({block:'center'});count.textContent=(idx+1)+'/'+hits.length;}" +
  "function run(q){clear();if(!q)return;var ql=q.toLowerCase();var tns=[];collect(document.body,tns);tns.forEach(function(tn){var text=tn.nodeValue;var lower=text.toLowerCase();var parts=[];var last=0;var from=0;var at;while((at=lower.indexOf(ql,from))>=0){if(at>last)parts.push(document.createTextNode(text.slice(last,at)));var mk=document.createElement('mark');mk.className='dshx-hit';mk.textContent=text.slice(at,at+q.length);parts.push(mk);hits.push(mk);last=at+q.length;from=last;}if(last===0)return;if(last<text.length)parts.push(document.createTextNode(text.slice(last)));if(parts.length){var frag=document.createDocumentFragment();parts.forEach(function(p){frag.appendChild(p);});tn.parentNode.replaceChild(frag,tn);}});if(hits.length){count.textContent=hits.length+' 处';focusHit(0);}else{count.textContent='无结果';}}" +
  "input.addEventListener('input',function(){run(input.value);});" +
  "input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();focusHit(e.shiftKey?idx-1:idx+1);}else if(e.key==='Escape'){closeBar();}});" +
  "document.getElementById('dshx-next').addEventListener('click',function(){focusHit(idx+1);});" +
  "document.getElementById('dshx-prev').addEventListener('click',function(){focusHit(idx-1);});" +
  "document.getElementById('dshx-close').addEventListener('click',closeBar);" +
  "document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&(e.key==='f'||e.key==='F')){e.preventDefault();openBar();}else if(e.key==='Escape'&&bar.getAttribute('data-open')==='1'){closeBar();}});" +
  "})();" +
  "</script>";

const MIME = {  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".markdown": "text/markdown; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".tsv": "text/tab-separated-values; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".zip": "application/zip",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".ogv": "video/ogg",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".oga": "audio/ogg",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".opus": "audio/ogg",
  ".wma": "audio/x-ms-wma",
};

// shiki language by extension (curated subset; unknown -> plain text)
const LANG_BY_EXT = {
  py: "python", r: "r", sh: "bash", bash: "bash", zsh: "bash",
  js: "javascript", mjs: "javascript", cjs: "javascript",
  ts: "typescript", tsx: "tsx", jsx: "jsx",
  json: "json", yaml: "yaml", yml: "yaml", toml: "toml", ini: "ini", conf: "ini", cfg: "ini",
  html: "html", htm: "html", css: "css", scss: "scss", less: "less",
  sql: "sql", c: "c", h: "c", cpp: "cpp", hpp: "cpp", java: "java", go: "go", rs: "rust",
  kt: "kotlin", swift: "swift", lua: "lua", php: "php", rb: "ruby", pl: "perl",
  docker: "docker", dockerfile: "docker", xml: "xml", tex: "latex", make: "make",
  mk: "make", cmake: "cmake", diff: "diff", patch: "diff", bat: "bat", cmd: "bat",
  ps1: "powershell", jl: "julia", scala: "scala", vue: "vue", svelte: "svelte",
  vim: "vim", groovy: "groovy", f: "fortran", for: "fortran",
};

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function tableHtml(rows, maxRows, maxCols) {
  const head = rows[0] ?? [];
  const cols = Math.min(head.length || 1, maxCols);
  const body = [];
  for (const row of rows.slice(1, maxRows + 1)) {
    body.push("<tr>" + row.slice(0, cols).map((cell) => `<td>${escapeHtml(cell)}</td>`).join("") + "</tr>");
  }
  return {
    html:
      `<div class="dshx-table-wrap"><table class="dshx-table"><thead><tr>` +
      head.slice(0, cols).map((cell) => `<th>${escapeHtml(cell)}</th>`).join("") +
      `</tr></thead><tbody>${body.join("")}</tbody></table></div>`,
    truncated: rows.length > maxRows + 1,
  };
}

function parseDelimited(text, delim) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += ch;
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === delim) {
      row.push(cur); cur = "";
    } else if (ch === "\n") {
      row.push(cur); rows.push(row); row = []; cur = "";
    } else if (ch !== "\r") {
      cur += ch;
    }
  }
  if (cur.length > 0 || row.length > 0) { row.push(cur); rows.push(row); }
  return rows;
}

function csvHtml(text) {
  const firstLine = text.split("\n", 1)[0] ?? "";
  const delim = (firstLine.match(/\t/g) ?? []).length >= (firstLine.match(/,/g) ?? []).length ? "\t" : ",";
  const rows = parseDelimited(text, delim);
  const { html, truncated } = tableHtml(rows, 300, 60);
  return { html: PREVIEW_CSS + html + (truncated ? `<p class="dshx-note">仅显示前 300 行</p>` : ""), truncated };
}

async function xlsxHtml(buf) {
  try {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buf, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
    const { html, truncated } = tableHtml(rows, 500, 60);
    return { html: PREVIEW_CSS + html + (truncated ? `<p class="dshx-note">仅显示前 500 行</p>` : ""), truncated };
  } catch (e) {
    const err = new Error(`xlsx preview unavailable: ${e?.message ?? e}`);
    err.code = "unavailable";
    throw err;
  }
}

async function docxHtml(buf) {
  try {
    const mod = await import("mammoth");
    const mammoth = mod.default ?? mod;
    const result = await mammoth.convertToHtml({ buffer: buf });
    return { html: PREVIEW_CSS + `<div class="dshx-doc">${result.value}</div>`, truncated: false };
  } catch (e) {
    const err = new Error(`docx preview unavailable: ${e?.message ?? e}`);
    err.code = "unavailable";
    throw err;
  }
}

let jszipPromise;
function getJszip() {
  if (!jszipPromise) jszipPromise = import("jszip");
  return jszipPromise;
}

let highlighterPromise;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighter, bundledLanguages } = await import("shiki");
      const wanted = [
        "python", "r", "bash", "javascript", "typescript", "tsx", "jsx", "json", "yaml",
        "toml", "ini", "html", "css", "scss", "less", "sql", "c", "cpp", "java", "go",
        "rust", "kotlin", "swift", "lua", "php", "ruby", "perl", "docker", "xml", "latex",
        "make", "cmake", "diff", "bat", "powershell", "julia", "scala", "vue", "svelte",
        "vim", "groovy", "markdown", "csv", "text",
      ];
      const langs = wanted.filter((lang) => bundledLanguages[lang] !== undefined);
      return await createHighlighter({ themes: ["github-dark", "github-light"], langs });
    })();
  }
  return highlighterPromise;
}

function langOf(path) {
  const ext = extname(path).slice(1).toLowerCase();
  if (ext === "md" || ext === "markdown") return "markdown";
  if (ext === "csv" || ext === "tsv") return "csv";
  return LANG_BY_EXT[ext] ?? "text";
}

function codeStats(text) {
  const lines = text.split("\n").length;
  const chars = text.length;
  const words = (text.match(/[\p{L}\p{N}_]+/gu) ?? []).length;
  return { lines, chars, words };
}

async function highlightedHtml(text, path) {
  const lang = langOf(path);
  const stats = codeStats(text);
  if (lang === "text") {
    return { html: PREVIEW_CSS + FIND_WIDGET + `<pre class="dshx-code">${escapeHtml(text)}</pre>`, stats };
  }
  try {
    const highlighter = await getHighlighter();
    const body = highlighter.codeToHtml(text, { lang, theme: "github-dark" });
    return { html: PREVIEW_CSS + FIND_WIDGET + body, stats };
  } catch {
    return { html: PREVIEW_CSS + FIND_WIDGET + `<pre class="dshx-code">${escapeHtml(text)}</pre>`, stats };
  }
}

function apply(ctx, config) {
  const roots = (config.roots ?? []).map((p) => resolve(p));
  const textCap = config.textCap;
  const listCap = config.listCap;
  const ignore = new Set((config.ignore ?? []).map((n) => String(n).toLowerCase()));
  const searchCap = config.searchCap;
  const searchDepth = config.searchDepth;
  const updateCheck = config.updateCheck !== false;
  const updateRepo = config.updateRepo;
  const priceInput = config.prices?.input ?? 2;
  const priceCacheRead = config.prices?.cacheRead ?? 0.5;
  const priceCacheWrite = config.prices?.cacheWrite ?? 2;
  const priceOutput = config.prices?.output ?? 8;
  // Optional services for the per-session usage endpoint (absent → endpoint
  // returns empty rather than blocking the whole plugin on their load order).
  const sessions = ctx.get?.("sessions");
  const sessionProjections = ctx.get?.("sessionProjections");

  const json = (res, status, body) => {
    res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(body));
  };

  // Validate that an absolute path stays inside one of the workspace roots,
  // following symlinks/junctions so nothing can escape through them. Roots are
  // themselves realpath'd once so a junction-backed root still validates.
  let realRootsPromise;
  function getRealRoots() {
    if (!realRootsPromise) {
      realRootsPromise = Promise.all(roots.map(async (r) => {
        try { return await realpath(r); } catch { return r; }
      }));
    }
    return realRootsPromise;
  }
  async function withinRoot(input) {
    if (typeof input !== "string" || input.length === 0) return null;
    let abs;
    try {
      abs = resolve(input);
    } catch {
      return null;
    }
    const realRoots = await getRealRoots();
    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      const realRoot = realRoots[i];
      const inside = abs === root || abs.startsWith(root + sep);
      if (!inside) continue;
      try {
        const real = await realpath(abs);
        if (real === realRoot || real.startsWith(realRoot + sep)) return abs;
      } catch {
        return null;
      }
    }
    return null;
  }

  // DeepSeek account balance, resolved per request through the official
  // credential service (the API key never leaves the server process).
  let balanceCache = { at: 0, value: null };
  async function fetchBalance() {
    const hit = await ctx.credentials.resolve("DEEPSEEK_API_KEY");
    if (hit === undefined || !hit.value) return { error: "no-key" };
    const upstream = await fetch("https://api.deepseek.com/user/balance", {
      method: "GET",
      headers: { Authorization: "Bearer " + hit.value, Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) return { error: "upstream-" + upstream.status };
    const data = await upstream.json();
    const cny = Array.isArray(data.balance_infos) ? data.balance_infos.find((b) => b && b.currency === "CNY") : undefined;
    // The upstream API returns balances as strings ("83.97"); coerce to number
    // so the client can render them (and null stays null when absent).
    const num = (v) => {
      if (typeof v === "number") return v;
      if (typeof v === "string" && v.trim() !== "") return Number(v);
      return null;
    };
    return {
      ok: true,
      isAvailable: !!data.is_available,
      total: cny ? num(cny.total_balance) : null,
      granted: cny ? num(cny.granted_balance) : null,
      toppedUp: cny ? num(cny.topped_up_balance) : null,
    };
  }

  // Optional GitHub update check: reads the plugin's own package.json for its
  // version + `repository` URL, then asks the GitHub API for the latest
  // release tag. Cached for 6 hours so it never spams the API.
  let versionCache = { at: 0, value: null };
  async function readOwnPackage() {
    try {
      const pkgPath = join(dirname(fileURLToPath(import.meta.url)), "../package.json");
      return JSON.parse(await readFile(pkgPath, "utf8"));
    } catch {
      return null;
    }
  }
  function githubRepoOf(pkg) {
    const repo = pkg?.repository;
    const url = typeof repo === "string" ? repo : repo?.url;
    if (typeof url !== "string") return null;
    const m = /github\.com[:/]([^/]+)\/([^/\s#]+?)(?:\.git)?$/i.exec(url.replace(/^git\+/, ""));
    return m ? { owner: m[1], repo: m[2] } : null;
  }
  function parseVersion(v) {
    const m = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(String(v).trim());
    if (!m) return null;
    return [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)];
  }
  // Pick the highest semver tag from a list like ["v0.8.0", "v0.7.1", ...].
  function newestVersion(names) {
    let best = null;
    for (const name of names) {
      const v = parseVersion(name);
      if (v === null) continue;
      if (best === null) { best = { name, v }; continue; }
      for (let i = 0; i < 3; i++) {
        if (v[i] === best.v[i]) continue;
        if (v[i] > best.v[i]) best = { name, v };
        break;
      }
    }
    return best ? best.name.replace(/^v/i, "") : null;
  }
  async function fetchVersion() {
    const pkg = await readOwnPackage();
    const current = pkg?.version ?? "0.0.0";
    let gh = githubRepoOf(pkg);
    if (updateRepo) {
      const parts = String(updateRepo).split("/");
      if (parts.length >= 2) gh = { owner: parts[0], repo: parts[1] };
    }
    const repoStr = gh ? `${gh.owner}/${gh.repo}` : null;
    const url = gh ? `https://github.com/${gh.owner}/${gh.repo}` : null;
    if (!updateCheck || !gh || !gh.owner || !gh.repo) {
      return { current, latest: null, hasUpdate: false, repo: repoStr, url, disabled: true };
    }
    try {
      const upstream = await fetch(`https://api.github.com/repos/${gh.owner}/${gh.repo}/tags`, {
        method: "GET",
        headers: { Accept: "application/vnd.github+json", "User-Agent": "dsh-explorer" },
        signal: AbortSignal.timeout(10000),
      });
      if (!upstream.ok) return { current, latest: null, hasUpdate: false, repo: repoStr, url, error: "upstream-" + upstream.status };
      const tags = await upstream.json();
      const latest = newestVersion(Array.isArray(tags) ? tags.map((t) => t?.name).filter(Boolean) : []);
      return { current, latest, hasUpdate: !!latest && latest !== current, repo: repoStr, url };
    } catch {
      return { current, latest: null, hasUpdate: false, repo: repoStr, url, error: "network" };
    }
  }

  async function readTextCapped(path) {
    const st = await stat(path);
    const size = st.size;
    const truncated = size > textCap;
    const fh = await open(path, "r");
    try {
      const buf = Buffer.alloc(truncated ? textCap : size);
      await fh.read(buf, 0, buf.length, 0);
      return { buf, size, truncated };
    } finally {
      await fh.close();
    }
  }

  async function textOf(path) {
    const { buf, size, truncated } = await readTextCapped(path);
    try {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(buf);
      return { text, size, truncated };
    } catch {
      return null;
    }
  }

  // ── mutations (rename / delete / mkdir) ────────────────────────────────
  const protectedDirs = (config.protected ?? []).map((p) => resolve(p));
  function isProtected(p) {
    return protectedDirs.some((d) => p === d || p.startsWith(d + sep));
  }
  function validSegment(name) {
    return typeof name === "string" && /^[^\\/:*?"<>|]+$/.test(name) && name !== "." && name !== ".." && name.trim() !== "";
  }
  async function recyclePath(p, isDir) {
    const safe = p.replace(/'/g, "''");
    const method = isDir ? "DeleteDirectory" : "DeleteFile";
    const script = `Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::${method}('${safe}', 'OnlyErrorDialogs', 'SendToRecycleBin')`;
    await new Promise((res, rej) => {
      execFile("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], { windowsHide: true, timeout: 20000 }, (err) => (err ? rej(err) : res()));
    });
  }

  // ── PPT/PPTX preview: convert to PDF via installed PowerPoint (COM) ───
  // Cached by (path, size, mtime) for 10 minutes; the converted PDF lives
  // only in memory and a short-lived temp file.
  const pptxCache = new Map();
  const PPT_SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "ppt-convert.ps1");
  function convertPptToPdf(p) {
    return new Promise((resolvePpt, rejectPpt) => {
      const out = join(tmpdir(), `dshx-ppt-${Date.now()}-${Math.floor(Math.random() * 1e6)}.pdf`);
      execFile(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", PPT_SCRIPT, "-Src", p, "-Dst", out],
        { windowsHide: true, timeout: 90000 },
        async (err) => {
          if (err) {
            try { await rm(out, { force: true }); } catch { /* ignore */ }
            rejectPpt(err);
            return;
          }
          try {
            const buf = await readFile(out);
            await rm(out, { force: true });
            resolvePpt(buf);
          } catch (e) {
            rejectPpt(e);
          }
        },
      );
    });
  }

  ctx.effect(() =>
    ctx.webServer.register({
      kind: "prefix",
      path: "/api/explorer",
      handler: async (req, res) => {
        if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "POST") {
          res.writeHead(405); res.end();
          return;
        }
        // Loopback-only: the explorer serves local workspace files.
        const host = String(req.headers.host ?? "");
        if (!/^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(host)) {
          res.writeHead(403); res.end();
          return;
        }
        try {
          const url = new URL(req.url ?? "/", "http://x");
          const sub = url.pathname.replace(/^\/api\/explorer\/?/, "");
          const q = url.searchParams.get("path") ?? "";
          let body = null;
          if (req.method === "POST") {
            body = await new Promise((resolveBody) => {
              const chunks = [];
              req.on("data", (c) => chunks.push(c));
              req.on("end", () => {
                try { resolveBody(JSON.parse(Buffer.concat(chunks).toString("utf8"))); } catch { resolveBody(null); }
              });
              req.on("error", () => resolveBody(null));
            });
          }

          if (sub === "" || sub === "roots") {
            json(res, 200, { roots, ignore: [...ignore] });
            return;
          }

          if (sub === "balance") {
            const now = Date.now();
            if (balanceCache.value !== null && now - balanceCache.at < 15000) {
              json(res, 200, balanceCache.value);
              return;
            }
            let out;
            try {
              out = await fetchBalance();
            } catch {
              out = { error: "network" };
            }
            balanceCache = { at: now, value: out };
            json(res, 200, out);
            return;
          }

          if (sub === "version") {
            const now = Date.now();
            if (versionCache.value !== null && now - versionCache.at < 6 * 3600 * 1000) {
              json(res, 200, versionCache.value);
              return;
            }
            const out = await fetchVersion();
            versionCache = { at: now, value: out };
            json(res, 200, out);
            return;
          }

          if (sub === "usage") {
            const sid = url.searchParams.get("sessionId") ?? "";
            if (!sid) { json(res, 400, { error: "bad-session" }); return; }
            if (sessions === undefined || sessionProjections === undefined) {
              json(res, 200, { sessionId: sid, tokens: null, totalTokens: null, cost: null });
              return;
            }
            const session = sessions.get(sid);
            if (session === undefined) { json(res, 404, { error: "not-found" }); return; }
            let usage = null;
            try {
              usage = sessionProjections.snapshot(session).tokenUsage ?? null;
            } catch { usage = null; }
            if (usage === null) { json(res, 200, { sessionId: sid, tokens: null, totalTokens: null, cost: null }); return; }
            const tokens = {
              uncachedInput: usage.uncachedInputTokens ?? 0,
              cacheRead: usage.cacheReadTokens ?? 0,
              cacheWrite: usage.cacheWriteTokens ?? 0,
              output: usage.outputTokens ?? 0,
            };
            const totalTokens = tokens.uncachedInput + tokens.cacheRead + tokens.cacheWrite + tokens.output;
            const cost = (tokens.uncachedInput * priceInput + tokens.cacheRead * priceCacheRead + tokens.cacheWrite * priceCacheWrite + tokens.output * priceOutput) / 1e6;
            json(res, 200, { sessionId: sid, tokens, totalTokens, cost });
            return;
          }

          if (sub === "search") {
            const term = (url.searchParams.get("q") ?? "").trim().toLowerCase();
            if (term.length === 0) {
              json(res, 200, { query: "", base: null, results: [], truncated: false, visited: 0 });
              return;
            }
            const baseInput = url.searchParams.get("path") ?? "";
            const base = baseInput ? await withinRoot(baseInput) : roots[0];
            if (base === null) { json(res, 403, { error: "outside-workspace" }); return; }
            let bst;
            try { bst = await stat(base); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!bst.isDirectory()) { json(res, 400, { error: "not-directory" }); return; }

            const results = [];
            let truncated = false;
            let visited = 0;
            const visitCap = searchCap * 10;
            const stack = [{ path: base, depth: 0 }];
            while (stack.length > 0 && results.length < searchCap && visited < visitCap) {
              const { path: dir, depth } = stack.pop();
              let dirents;
              try { dirents = await readdir(dir, { withFileTypes: true }); } catch { continue; }
              for (const d of dirents) {
                if (results.length >= searchCap || visited >= visitCap) { truncated = true; break; }
                visited++;
                if (d.name.startsWith(".")) continue;
                if (ignore.has(d.name.toLowerCase())) continue;
                const child = join(dir, d.name);
                const isDir = d.isDirectory();
                if (d.name.toLowerCase().includes(term)) {
                  let size = 0;
                  let mtimeMs = 0;
                  if (!isDir) {
                    try { const s = await stat(child); size = s.size; mtimeMs = s.mtimeMs; } catch { /* raced */ }
                  }
                  results.push({ path: child, name: d.name, kind: isDir ? "dir" : "file", size, mtimeMs });
                }
                // Only descend real directories (never symlinks: they can escape the root).
                if (isDir && depth + 1 < searchDepth) stack.push({ path: child, depth: depth + 1 });
              }
            }
            results.sort((a, b) =>
              (a.kind === "dir") !== (b.kind === "dir")
                ? a.kind === "dir" ? -1 : 1
                : a.name.localeCompare(b.name, "zh"));
            json(res, 200, { query: term, base, results, truncated, visited });
            return;
          }

          const target = await withinRoot(q);
          if (target === null) {
            // Distinguish a missing path inside the workspace (404) from a
            // forbidden one (403): a path that cannot be stat'ed at all is missing.
            let missing = false;
            try {
              const probe = resolve(q);
              if (typeof probe === "string" && probe.length > 0) await stat(probe);
            } catch {
              missing = true;
            }
            json(res, missing ? 404 : 403, { error: missing ? "not-found" : "outside-workspace" });
            return;
          }

          if (sub === "pptx" || sub === "ppt") {
            let st;
            try { st = await stat(target); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!st.isFile()) { json(res, 400, { error: "not-file" }); return; }
            const key = target + "|" + st.size + "|" + st.mtimeMs;
            const cached = pptxCache.get(key);
            if (cached !== undefined && Date.now() - cached.at < 600000) {
              res.writeHead(200, { "content-type": "application/pdf", "content-length": cached.pdf.length });
              res.end(cached.pdf);
              return;
            }
            try {
              const pdf = await convertPptToPdf(target);
              if (pptxCache.size > 8) {
                const oldest = pptxCache.keys().next().value;
                pptxCache.delete(oldest);
              }
              pptxCache.set(key, { at: Date.now(), pdf });
              res.writeHead(200, { "content-type": "application/pdf", "content-length": pdf.length });
              res.end(pdf);
            } catch (e) {
              json(res, 501, { error: "pptx-convert-failed: " + String(e?.message ?? e) });
            }
            return;
          }

          // ── mutations (POST only) ───────────────────────────────────────
          if (req.method === "POST") {
            if (isProtected(target)) { json(res, 403, { error: "protected" }); return; }

            if (sub === "rename") {
              const name = body?.name;
              if (!validSegment(name)) { json(res, 400, { error: "bad-name" }); return; }
              const parent = dirname(target);
              const newPath = join(parent, name);
              if (newPath === target) { json(res, 200, { ok: true, path: target }); return; }
              let exists = false;
              try { await stat(newPath); exists = true; } catch { /* absent */ }
              if (exists) { json(res, 409, { error: "already-exists" }); return; }
              try {
                await rename(target, newPath);
                json(res, 200, { ok: true, path: newPath });
              } catch (e) {
                json(res, 500, { error: String(e?.message ?? e) });
              }
              return;
            }

            if (sub === "delete") {
              try {
                const st = await stat(target);
                if (body?.recycle === true) {
                  await recyclePath(target, st.isDirectory());
                } else {
                  await rm(target, { recursive: true, force: true });
                }
                json(res, 200, { ok: true });
              } catch (e) {
                json(res, 500, { error: String(e?.message ?? e) });
              }
              return;
            }

            if (sub === "mkdir") {
              const name = body?.name;
              if (!validSegment(name)) { json(res, 400, { error: "bad-name" }); return; }
              try {
                await mkdir(join(target, name));
                json(res, 200, { ok: true, path: join(target, name) });
              } catch (e) {
                json(res, 500, { error: String(e?.message ?? e) });
              }
              return;
            }

            if (sub === "touch") {
              const name = body?.name;
              if (!validSegment(name)) { json(res, 400, { error: "bad-name" }); return; }
              const dest = join(target, name);
              try {
                const fh = await open(dest, "wx");
                await fh.close();
                json(res, 200, { ok: true, path: dest });
              } catch (e) {
                json(res, e?.code === "EEXIST" ? 409 : 500, { error: e?.code === "EEXIST" ? "already-exists" : String(e?.message ?? e) });
              }
              return;
            }

            if (sub === "copy") {
              const src = body?.src;
              if (typeof src !== "string" || src.length === 0) { json(res, 400, { error: "bad-src" }); return; }
              const srcAbs = await withinRoot(src);
              if (srcAbs === null) { json(res, 403, { error: "outside-workspace" }); return; }
              if (target === srcAbs || target.startsWith(srcAbs + sep)) { json(res, 400, { error: "cannot-copy-into-self" }); return; }
              const srcName = basename(srcAbs);
              const dot = srcName.lastIndexOf(".");
              const stem = dot > 0 ? srcName.slice(0, dot) : srcName;
              const ext = dot > 0 ? srcName.slice(dot) : "";
              let dest = join(target, srcName);
              let n = 1;
              while (true) {
                let exists = false;
                try { await stat(dest); exists = true; } catch { /* absent */ }
                if (!exists) break;
                n += 1;
                dest = join(target, `${stem} (${n})${ext}`);
              }
              try {
                await cp(srcAbs, dest, { recursive: true, errorOnExist: true });
                json(res, 200, { ok: true, path: dest });
              } catch (e) {
                json(res, 500, { error: String(e?.message ?? e) });
              }
              return;
            }

            json(res, 404, { error: "unknown-endpoint" });
            return;
          }

          if (sub === "list") {
            let st;
            try { st = await stat(target); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!st.isDirectory()) { json(res, 400, { error: "not-directory" }); return; }
            let dirents;
            try { dirents = await readdir(target, { withFileTypes: true }); } catch (e) { json(res, 500, { error: String(e?.message ?? e) }); return; }
            const raw = [];
            for (const d of dirents) {
              const child = join(target, d.name);
              let kind = "other";
              let size = 0;
              let mtimeMs = 0;
              if (d.isDirectory()) {
                kind = "dir";
              } else if (d.isFile()) {
                kind = "file";
              } else if (d.isSymbolicLink()) {
                try {
                  const s = await stat(child);
                  kind = s.isDirectory() ? "dir" : s.isFile() ? "file" : "other";
                } catch { kind = "broken"; }
              }
              if (kind === "file" || kind === "dir") {
                try {
                  const s = await stat(child);
                  size = kind === "file" ? s.size : 0;
                  mtimeMs = s.mtimeMs;
                } catch { /* raced */ }
              }
              raw.push({ name: d.name, path: child, kind, size, mtimeMs, hidden: d.name.startsWith(".") });
            }
            raw.sort((a, b) =>
              (a.kind === "dir") !== (b.kind === "dir")
                ? a.kind === "dir" ? -1 : 1
                : a.name.localeCompare(b.name, "zh"));
            const entries = raw.slice(0, listCap);
            const truncated = raw.length > listCap;
            json(res, 200, { path: target, entries, truncated });
            return;
          }

          if (sub === "text" || sub === "highlight") {
            let st;
            try { st = await stat(target); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!st.isFile()) { json(res, 400, { error: "not-file" }); return; }
            const text = await textOf(target);
            if (text === null) { json(res, 200, { error: "binary", size: st.size }); return; }
            if (sub === "text") {
              json(res, 200, text);
            } else {
              const { html, stats } = await highlightedHtml(text.text, target);
              json(res, 200, { html, stats, size: text.size, truncated: text.truncated });
            }
            return;
          }

          if (sub === "markdown") {
            let st;
            try { st = await stat(target); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!st.isFile()) { json(res, 400, { error: "not-file" }); return; }
            const text = await textOf(target);
            if (text === null) { json(res, 200, { error: "binary" }); return; }
            try {
              const { micromark } = await import("micromark");
              const html = micromark(text.text);
              json(res, 200, { html: PREVIEW_CSS + `<div class="dshx-md">${html}</div>` });
            } catch (e) {
              json(res, 501, { error: `markdown unavailable: ${e?.message ?? e}` });
            }
            return;
          }

          if (sub === "csv") {
            let st;
            try { st = await stat(target); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!st.isFile()) { json(res, 400, { error: "not-file" }); return; }
            const text = await textOf(target);
            if (text === null) { json(res, 200, { error: "binary" }); return; }
            json(res, 200, csvHtml(text.text));
            return;
          }

          if (sub === "xlsx" || sub === "docx") {
            let st;
            try { st = await stat(target); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!st.isFile()) { json(res, 400, { error: "not-file" }); return; }
            if (st.size > 50 * 1024 * 1024) { json(res, 200, { error: "too-large" }); return; }
            let buf;
            try { buf = await readFile(target); } catch (e) { json(res, 500, { error: String(e?.message ?? e) }); return; }
            try {
              const out = sub === "xlsx" ? await xlsxHtml(buf) : await docxHtml(buf);
              json(res, 200, out);
            } catch (e) {
              if (e?.code === "unavailable") json(res, 501, { error: e.message });
              else json(res, 500, { error: String(e?.message ?? e) });
            }
            return;
          }

          if (sub === "raw") {
            let st;
            try { st = await stat(target); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!st.isFile()) { json(res, 400, { error: "not-file" }); return; }
            const type = MIME[extname(target).toLowerCase()] ?? "application/octet-stream";
            const disposition = `inline; filename*=UTF-8''${encodeURIComponent(basename(target))}`;
            try {
              // Byte-range support so <video>/<audio> can seek without loading
              // the whole file into memory.
              const range = String(req.headers.range ?? "").trim();
              const m = /^bytes=(\d*)-(\d*)$/.exec(range);
              if (m && st.size > 0 && (m[1] !== "" || m[2] !== "")) {
                let start = m[1] === "" ? null : parseInt(m[1], 10);
                let end = m[2] === "" ? null : parseInt(m[2], 10);
                if (start === null) {
                  start = Math.max(0, st.size - (end ?? 0));
                  end = st.size - 1;
                } else if (end === null || end >= st.size) {
                  end = st.size - 1;
                }
                if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= st.size) {
                  res.writeHead(416, { "content-range": `bytes */${st.size}` });
                  res.end();
                  return;
                }
                const len = end - start + 1;
                const fh = await open(target, "r");
                try {
                  const buf = Buffer.alloc(len);
                  await fh.read(buf, 0, len, start);
                  res.writeHead(206, {
                    "content-type": type,
                    "content-length": len,
                    "content-range": `bytes ${start}-${end}/${st.size}`,
                    "accept-ranges": "bytes",
                    "cache-control": "no-store",
                    "content-disposition": disposition,
                  });
                  res.end(buf);
                } finally {
                  await fh.close();
                }
                return;
              }
              const body = await readFile(target);
              res.writeHead(200, {
                "content-type": type,
                "content-length": body.length,
                "accept-ranges": "bytes",
                "cache-control": "no-store",
                "content-disposition": disposition,
              });
              res.end(body);
            } catch (e) {
              json(res, 500, { error: String(e?.message ?? e) });
            }
            return;
          }

          if (sub === "zip" || sub === "zipfile") {
            let st;
            try { st = await stat(target); } catch { json(res, 404, { error: "not-found" }); return; }
            if (!st.isFile()) { json(res, 400, { error: "not-file" }); return; }
            if (st.size > 200 * 1024 * 1024) { json(res, 200, { error: "too-large" }); return; }
            let buf;
            try { buf = await readFile(target); } catch (e) { json(res, 500, { error: String(e?.message ?? e) }); return; }
            try {
              const mod = await getJszip();
              const JSZip = mod.default ?? mod;
              const zip = await JSZip.loadAsync(buf);
              // Some archivers store "\" separators; normalize to "/" for a
              // consistent listing and so inner lookups match the same keys.
              const norm = (n) => n.replace(/\\/g, "/");
              if (sub === "zip") {
                const files = Object.keys(zip.files).filter((n) => !n.endsWith("/") && !n.endsWith("\\"));
                const dirs = Object.keys(zip.files).filter((n) => n.endsWith("/") || n.endsWith("\\"));
                files.sort((a, b) => a.localeCompare(b, "zh"));
                dirs.sort((a, b) => a.localeCompare(b, "zh"));
                const entries = [];
                for (const n of dirs.slice(0, 2000)) entries.push({ name: norm(n), dir: true, size: 0 });
                for (const n of files.slice(0, 2000)) {
                  const f = zip.files[n];
                  entries.push({ name: norm(n), dir: false, size: f?._data?.uncompressedSize ?? 0 });
                }
                json(res, 200, { path: target, entries, truncated: files.length > 2000 || dirs.length > 2000 });
              } else {
                const inner = url.searchParams.get("inner") ?? "";
                let entry = zip.file(inner);
                if ((entry === null || entry.dir) && inner.includes("/")) entry = zip.file(inner.replace(/\//g, "\\"));
                if ((entry === null || entry.dir) && inner.includes("\\")) entry = zip.file(inner.replace(/\\/g, "/"));
                if (entry === null || entry.dir) { json(res, 404, { error: "not-found" }); return; }
                const data = await entry.async("nodebuffer");
                if (data.length > 50 * 1024 * 1024) { json(res, 200, { error: "too-large" }); return; }
                const type = MIME[extname(inner).toLowerCase()] ?? "application/octet-stream";
                res.writeHead(200, { "content-type": type, "content-length": data.length, "cache-control": "no-store" });
                res.end(data);
              }
            } catch (e) {
              json(res, 501, { error: `zip unavailable: ${e?.message ?? e}` });
            }
            return;
          }

          json(res, 404, { error: "unknown-endpoint" });
        } catch (e) {
          json(res, 500, { error: String(e?.message ?? e) });
        }
      },
    }),
  );
}

export { apply, inject, name, Config };
