window.__ModuleLoader__.load({
	id: "@zrsio4-y/dsh-explorer",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const react = require("react");
		const runtime = require("@deepseek-ai/dsh-client-runtime/client");
		const P = require("@deepseek-ai/dsh-client-ui-primitives");
		const { useState, useEffect, useRef, useCallback } = react;

		// ── own styles ─────────────────────────────────────────────────────
		const css = `.dshx-treePanel{position:absolute;left:0;display:flex;flex-direction:column;background:var(--dsw-specific-sidebar-fill);border-right:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);font-size:13px;overflow:visible;box-shadow:0 -6px 18px rgba(0,0,0,.15)}.dshx-panelHead{flex:none;display:flex;align-items:center;gap:4px;height:32px;padding:0 8px 0 10px}.dshx-panelTitle{flex:1;min-width:0;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dshx-iconBtn{cursor:pointer;width:24px;height:24px;color:var(--dsw-alias-label-tertiary);background:0 0;border:none;border-radius:6px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex;transition:background .12s var(--ds-ease-in-out)}.dshx-iconBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshx-tree{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:0 8px 10px 4px;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}.dshx-row{display:flex;align-items:center;gap:5px;height:26px;border-radius:6px;cursor:pointer;user-select:none;white-space:nowrap;color:var(--dsw-alias-label-primary);transition:background .1s var(--ds-ease-in-out)}.dshx-row:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshx-rowActive,.dshx-rowActive:hover{background:var(--dsw-alias-interactive-bg-hover-accent)}.dshx-rootRow .dshx-name{font-weight:500}.dshx-chev{flex:none;width:14px;color:var(--dsw-alias-label-tertiary);display:inline-flex;justify-content:center;align-items:center;transition:transform .12s var(--ds-ease-in-out)}.dshx-chevOpen{transform:rotate(90deg)}.dshx-icon{flex:none;width:16px;display:inline-flex;justify-content:center;align-items:center;color:var(--dsw-alias-label-secondary);transition:color .1s var(--ds-ease-in-out)}.dshx-row:hover .dshx-icon{color:var(--dsw-alias-label-primary)}.dshx-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;line-height:26px}.dshx-size{flex:none;font-size:11px;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary);padding-right:6px}.dshx-noteRow{padding-left:36px;height:22px;display:flex;align-items:center;font-size:11px;color:var(--dsw-alias-label-tertiary)}.dshx-resize{position:absolute;z-index:6;touch-action:none;display:flex;align-items:center;justify-content:center}.dshx-resizeV{top:0;bottom:0;width:14px;cursor:col-resize}.dshx-resizeH{left:0;right:0;height:14px;cursor:row-resize}.dshx-resize:after{content:"";border-radius:3px;background:var(--dsw-alias-border-l3,rgba(140,150,165,.45));transition:background .12s var(--ds-ease-in-out)}.dshx-resizeV:after{width:3px;height:44px}.dshx-resizeH:after{width:44px;height:3px}.dshx-resize:hover:after,.dshx-resize:active:after{background:var(--dsw-alias-brand-primary,#4d6bfe)}.dshx-prevPanel{position:absolute;top:0;bottom:0;display:flex;flex-direction:column;background:var(--dsw-alias-bg-overlay,#23252b);color:var(--dsw-alias-label-primary);overflow:hidden;box-shadow:-8px 0 24px rgba(0,0,0,.18)}.dshx-paneTabs{flex:none;display:flex;align-items:stretch;height:38px;border-bottom:1px solid var(--dsw-alias-border-l2);min-width:0;background:var(--dsw-alias-bg-base)}.dshx-paneTabsSub{flex:none;display:flex;align-items:stretch;height:30px;border-bottom:1px solid var(--dsw-alias-border-l2);min-width:0;background:var(--dsw-alias-bg-base);padding-left:6px}.dshx-tabStrip{flex:1;min-width:0;display:flex;align-items:stretch;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}.dshx-tabStrip::-webkit-scrollbar{display:none}.dshx-tab{flex:0 1 auto;min-width:0;max-width:200px;display:inline-flex;align-items:center;gap:6px;padding:0 6px 0 10px;margin:6px 2px 0;border-radius:8px 8px 0 0;cursor:pointer;user-select:none;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1;border:1px solid transparent;border-bottom:none}.dshx-tabSmall{margin:4px 2px 0;height:22px;padding:0 6px 0 8px;border-radius:7px 7px 0 0}.dshx-tab:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshx-tabActive,.dshx-tabActive:hover{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2)}.dshx-tabIcon{flex:none;display:inline-flex;color:var(--dsw-alias-label-tertiary)}.dshx-tabActive .dshx-tabIcon{color:var(--dsw-alias-label-secondary)}.dshx-tabName{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dshx-tabClose{flex:none;width:16px;height:16px;border:none;background:0 0;border-radius:4px;cursor:pointer;color:var(--dsw-alias-label-tertiary);display:inline-flex;align-items:center;justify-content:center;padding:0}.dshx-tabClose:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.dshx-paneActions{flex:none;display:flex;align-items:center;gap:2px;padding:0 8px}.dshx-paneBtn{cursor:pointer;display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 8px;border:none;border-radius:7px;background:0 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1;text-decoration:none}.dshx-paneBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshx-paneBtnActive,.dshx-paneBtnActive:hover{background:var(--dsw-alias-interactive-bg-hover-accent);color:var(--dsw-alias-label-primary)}.dshx-paneBody{flex:1 1 auto;min-height:0;position:relative;overflow:hidden;display:flex;flex-direction:column}.dshx-splitRow{flex:1 1 auto;min-height:0;display:flex;position:relative}.dshx-splitRowV{flex-direction:column}.dshx-splitCell{flex:1 1 auto;min-width:0;min-height:0;position:relative;overflow:hidden;display:flex;flex-direction:column}.dshx-cellTabs{flex:none;display:flex;align-items:stretch;height:28px;border-bottom:1px solid var(--dsw-alias-border-l2);min-width:0;background:var(--dsw-alias-bg-base);padding-left:4px}.dshx-cellBody{flex:1 1 auto;min-height:0;position:relative;overflow:hidden}.dshx-frame{position:absolute;inset:0;width:100%;height:100%;border:none;background:#fff}.dshx-bodyCenter{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-tertiary);font-size:13px;padding:16px}.dshx-bodyMeta{padding:28px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.8}.dshx-errorBox{margin:auto;max-width:420px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.7}.dshx-toggle{cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:36px;width:100%;padding:0 12px;border:none;border-radius:8px;background:0 0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1;text-align:left}.dshx-toggle:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshx-imgWrap{position:absolute;inset:0;overflow:hidden;cursor:grab;background:repeating-conic-gradient(#16171b 0% 25%,#1d1f24 0% 50%) 50%/24px 24px}.dshx-imgWrap:active{cursor:grabbing}.dshx-img{position:absolute;top:50%;left:50%;max-width:none;transform-origin:center;user-select:none;-webkit-user-drag:none}.dshx-imgBar{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);display:flex;align-items:center;gap:2px;padding:3px;border-radius:10px;background:var(--dsw-alias-bg-mask-3,rgba(0,0,0,.55));backdrop-filter:blur(6px)}.dshx-imgBtn{cursor:pointer;min-width:28px;height:26px;padding:0 8px;border:none;border-radius:7px;background:0 0;color:#fff;font-size:12px;line-height:1;display:inline-flex;align-items:center;justify-content:center}.dshx-imgBtn:hover{background:rgba(255,255,255,.14)}.dshx-imgPct{min-width:46px;text-align:center;color:#fff;font-size:11px;font-variant-numeric:tabular-nums}.dshx-balance{position:absolute;right:14px;bottom:12px;display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border:none;border-radius:14px;background:var(--dsw-alias-bg-mask-3,rgba(0,0,0,.55));backdrop-filter:blur(6px);color:var(--dsw-alias-label-primary);font-size:12px;line-height:1;cursor:pointer;user-select:none;box-shadow:0 2px 10px rgba(0,0,0,.2)}.dshx-balance:hover{background:var(--dsw-alias-bg-mask-2,rgba(0,0,0,.45))}.dshx-balanceErr{color:var(--dsw-alias-state-warn-primary,#e6a23c)}.dshx-menu{position:fixed;z-index:2147483000;min-width:212px;padding:4px;border-radius:10px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-overlay,#23252b));border:1px solid var(--dsw-alias-border-l2);box-shadow:0 10px 36px rgba(0,0,0,.4);font-size:13px;color:var(--dsw-alias-label-primary)}.dshx-menuItem{display:flex;align-items:center;width:100%;height:30px;padding:0 10px;border:none;border-radius:6px;background:0 0;color:inherit;font-size:13px;text-align:left;cursor:pointer;white-space:nowrap}.dshx-menuItem:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshx-menuDanger,.dshx-menuDanger:hover{color:var(--dsw-alias-state-error-primary)}.dshx-menuSep{height:1px;margin:4px 6px;background:var(--dsw-alias-border-l2)}.dshx-menuTitle{padding:8px 10px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}.dshx-renameInput{flex:1;min-width:0;height:22px;padding:0 6px;border:1px solid var(--dsw-alias-brand-primary,#4d6bfe);border-radius:5px;background:var(--dsw-alias-bg-layer-2,#1e2025);color:var(--dsw-alias-label-primary);font-size:13px;outline:none}.dshx-notice{flex:none;margin:2px 8px;padding:6px 10px;border-radius:8px;background:var(--dsw-alias-interactive-bg-hover-accent);color:var(--dsw-alias-label-primary);font-size:12px}.dshx-row:focus-visible{outline:1px solid var(--dsw-alias-brand-primary,#4d6bfe);outline-offset:-1px}.dshx-toolbar{flex:none;display:flex;align-items:center;gap:4px;padding:0 8px 6px}.dshx-search{flex:1;min-width:0;display:flex;align-items:center;gap:4px;height:24px;padding:0 7px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}.dshx-search input{flex:1;min-width:0;background:0 0;border:none;outline:none;color:inherit;font-size:12px;font-family:inherit}.dshx-searchIcon{flex:none;color:var(--dsw-alias-label-tertiary);display:inline-flex}.dshx-toggleBtn{cursor:pointer;flex:none;height:24px;padding:0 7px;border:none;border-radius:6px;background:0 0;color:var(--dsw-alias-label-tertiary);font-size:11px;display:inline-flex;align-items:center;gap:2px;transition:background .12s var(--ds-ease-in-out)}.dshx-toggleBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshx-toggleOn,.dshx-toggleOn:hover{background:var(--dsw-alias-interactive-bg-hover-accent);color:var(--dsw-alias-brand-primary,#4d6bfe)}.dshx-sortKey{cursor:pointer;flex:none;height:24px;padding:0 6px;border:none;border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary);font-size:11px;display:inline-flex;align-items:center}.dshx-sortKey:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshx-sortDir{cursor:pointer;flex:none;width:20px;height:24px;border:none;border-radius:6px;background:0 0;color:var(--dsw-alias-label-tertiary);display:inline-flex;align-items:center;justify-content:center}.dshx-sortDir:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshx-match{background:var(--dsw-alias-brand-primary,#4d6bfe);color:#fff;border-radius:2px;padding:0 1px}.dshx-resultRow{display:flex;align-items:center;gap:6px;height:26px;border-radius:6px;cursor:pointer;user-select:none;white-space:nowrap;color:var(--dsw-alias-label-primary);padding:0 8px 0 6px}.dshx-resultRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshx-resultName{flex:none;max-width:55%;overflow:hidden;text-overflow:ellipsis;font-size:13px}.dshx-resultPath{flex:1;min-width:0;color:var(--dsw-alias-label-tertiary);font-size:11px;overflow:hidden;text-overflow:ellipsis;direction:rtl;text-align:left}.dshx-media{width:100%;height:100%;background:#000;outline:none;border:none}.dshx-audioWrap{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;height:100%;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}.dshx-audioWrap audio{width:min(480px,90%)}.dshx-metaBar{position:absolute;right:8px;bottom:8px;z-index:2;display:flex;align-items:center;gap:10px;height:22px;padding:0 10px;border-radius:11px;color:var(--dsw-alias-label-tertiary);font-size:11px;background:var(--dsw-alias-bg-layer-2,#1e2025);box-shadow:0 1px 4px rgba(0,0,0,.25)}.dshx-zipList{flex:1;min-height:0;overflow:auto;padding:6px 0;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}.dshx-zipRow{display:flex;align-items:center;gap:6px;height:24px;padding:0 10px;cursor:pointer;color:var(--dsw-alias-label-primary);white-space:nowrap}.dshx-zipRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshx-zipRowActive,.dshx-zipRowActive:hover{background:var(--dsw-alias-interactive-bg-hover-accent)}.dshx-zipIcon{flex:none;width:16px;display:inline-flex;justify-content:center;color:var(--dsw-alias-label-secondary)}.dshx-zipName{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;font-size:12px}.dshx-zipSize{flex:none;color:var(--dsw-alias-label-tertiary);font-size:11px}.dshx-zipInner{flex:1;min-height:0;border-top:1px solid var(--dsw-alias-border-l2);display:flex;flex-direction:column;min-width:0}.dshx-updateChip{position:absolute;right:14px;bottom:48px;display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border:none;border-radius:14px;background:var(--dsw-alias-brand-primary,#4d6bfe);color:#fff;font-size:12px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)}.dshx-updateChip:hover{filter:brightness(1.08)}.dshx-spend{display:inline-flex;align-items:center;gap:3px;color:var(--dsw-alias-state-warn-primary,#e6a23c)}`;
		const tagId = "@zrsio4-y/dsh-explorer/explorer.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@zrsio4-y/dsh-explorer";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const cls = {
			treePanel: "dshx-treePanel", panelHead: "dshx-panelHead", panelTitle: "dshx-panelTitle",
			iconBtn: "dshx-iconBtn", tree: "dshx-tree", row: "dshx-row", rowActive: "dshx-rowActive",
			rootRow: "dshx-rootRow", chev: "dshx-chev", chevOpen: "dshx-chevOpen", icon: "dshx-icon",
			name: "dshx-name", size: "dshx-size", noteRow: "dshx-noteRow",
			resize: "dshx-resize", resizeV: "dshx-resizeV", resizeH: "dshx-resizeH",
			prevPanel: "dshx-prevPanel", paneTabs: "dshx-paneTabs", paneTabsSub: "dshx-paneTabsSub",
			tabStrip: "dshx-tabStrip", tab: "dshx-tab", tabSmall: "dshx-tabSmall", tabActive: "dshx-tabActive",
			tabIcon: "dshx-tabIcon", tabName: "dshx-tabName", tabClose: "dshx-tabClose",
			paneActions: "dshx-paneActions", paneBtn: "dshx-paneBtn", paneBtnActive: "dshx-paneBtnActive",
			paneBody: "dshx-paneBody", splitRow: "dshx-splitRow", splitRowV: "dshx-splitRowV", splitCell: "dshx-splitCell",
			cellTabs: "dshx-cellTabs", cellBody: "dshx-cellBody",
			frame: "dshx-frame", bodyCenter: "dshx-bodyCenter", bodyMeta: "dshx-bodyMeta",
			errorBox: "dshx-errorBox", toggle: "dshx-toggle",
			imgWrap: "dshx-imgWrap", img: "dshx-img", imgBar: "dshx-imgBar", imgBtn: "dshx-imgBtn", imgPct: "dshx-imgPct",
			balance: "dshx-balance", balanceErr: "dshx-balanceErr",
			menu: "dshx-menu", menuItem: "dshx-menuItem", menuDanger: "dshx-menuDanger", menuSep: "dshx-menuSep",
			menuTitle: "dshx-menuTitle", renameInput: "dshx-renameInput", notice: "dshx-notice",
			toolbar: "dshx-toolbar", search: "dshx-search", searchIcon: "dshx-searchIcon",
			toggleBtn: "dshx-toggleBtn", toggleOn: "dshx-toggleOn",
			sortKey: "dshx-sortKey", sortDir: "dshx-sortDir", match: "dshx-match",
			resultRow: "dshx-resultRow", resultName: "dshx-resultName", resultPath: "dshx-resultPath",
			media: "dshx-media", audioWrap: "dshx-audioWrap", metaBar: "dshx-metaBar",
			zipList: "dshx-zipList", zipRow: "dshx-zipRow", zipRowActive: "dshx-zipRowActive",
			zipIcon: "dshx-zipIcon", zipName: "dshx-zipName", zipSize: "dshx-zipSize", zipInner: "dshx-zipInner",
			updateChip: "dshx-updateChip", spend: "dshx-spend",
		};

		// ── locale ─────────────────────────────────────────────────────────
		const NS = "explorer";
		const zh = {
			title: "文件",
			refresh: "刷新",
			openInApp: "用系统程序打开",
			closeAll: "关闭全部",
			closeTab: "关闭标签",
			swap: "换边",
			split: "分屏对比",
			splitToV: "改为上下",
			splitToH: "改为左右",
			copyPath: "复制路径",
			copied: "已复制",
			collapseTree: "收起文件栏",
			loading: "加载中…",
			empty: "空文件夹",
			noRoots: "没有可用工作区",
			loadFailed: "加载失败，请刷新重试",
			binary: "二进制文件，无法预览文本",
			outside: "文件在工作区之外，无法预览",
			notFound: "文件不存在",
			noPreview: "此格式暂不支持预览",
			download: "下载",
			fit: "适应",
			actual: "100%",
			balance: "余额",
			balanceLoading: "余额查询中…",
			balanceFailed: "余额查询失败（点击重试）",
			balanceUnset: "未配置密钥（点击重试）",
			menuOpenPreview: "打开预览",
			menuOpenApp: "用系统程序打开",
			menuOpenLeft: "在左屏打开",
			menuOpenRight: "在右屏打开",
			menuShowInFolder: "打开所在文件夹",
			menuDownload: "下载",
			menuCopyPath: "复制路径",
			menuCopyRelPath: "复制相对路径",
			menuRename: "重命名…",
			menuNewFolder: "新建文件夹…",
			menuRefresh: "刷新",
			menuExpand: "展开",
			menuCollapse: "收起",
			menuDeleteRecycle: "删除（回收站）",
			menuDeletePermanent: "永久删除…",
			menuConfirmDelete: "确认永久删除",
			menuConfirm: "确认删除",
			menuCancel: "取消",
			noticeRenamed: "已重命名",
			noticeDeleted: "已删除",
			noticeCreated: "已新建文件夹",
			noticeFileCreated: "已新建文件",
			noticePasted: "已粘贴",
			noticeProtected: "该目录受保护（只读）",
			noticeFailed: "操作失败",
			pptxConverting: "PPT 转换中（首次约 2~5 秒）…",
			pptxFailed: "PPT 转换失败，请用系统程序打开",
			search: "搜索文件名…",
			searchResults: "个结果",
			searchNoResults: "无匹配",
			searchTooMany: "结果过多，请收窄关键字",
			sortName: "名称",
			sortSize: "大小",
			sortMtime: "时间",
			sortAsc: "升序",
			sortDesc: "降序",
			showHidden: "隐藏项",
			showNoise: "过滤",
			showHiddenTitle: "显示/隐藏点开头文件",
			showNoiseTitle: "显示/隐藏依赖与构建目录",
			menuNewFile: "新建文件…",
			menuCopy: "复制",
			menuPaste: "粘贴",
			copiedClip: "已复制，可在文件夹上「粘贴」",
			pasteNothing: "剪贴板为空",
			statLines: "行",
			statWords: "词",
			statChars: "字符",
			zipLoading: "读取压缩包…",
			zipEmpty: "空压缩包",
			zipFailed: "无法读取压缩包",
			zipInnerTooLarge: "内层文件过大",
			zipBack: "返回列表",
			updateAvailable: "新版本可用",
			updateTitle: "点击查看新版本",
			spendTitle: "本会话消费",
		};
		const en = {
			title: "Files",
			refresh: "Refresh",
			openInApp: "Open in system app",
			closeAll: "Close all",
			closeTab: "Close tab",
			swap: "Swap",
			split: "Split view",
			splitToV: "Stack vertically",
			splitToH: "Side by side",
			copyPath: "Copy path",
			copied: "Copied",
			collapseTree: "Collapse file panel",
			loading: "Loading…",
			empty: "Empty folder",
			noRoots: "No workspace available",
			loadFailed: "Failed to load, please retry",
			binary: "Binary file, cannot preview as text",
			outside: "File is outside the workspace",
			notFound: "File not found",
			noPreview: "Preview not supported for this format",
			download: "Download",
			fit: "Fit",
			actual: "100%",
			balance: "Balance",
			balanceLoading: "Checking balance…",
			balanceFailed: "Balance check failed (click to retry)",
			balanceUnset: "No API key (click to retry)",
			menuOpenPreview: "Open preview",
			menuOpenApp: "Open with system app",
			menuOpenLeft: "Open in left pane",
			menuOpenRight: "Open in right pane",
			menuShowInFolder: "Show in folder",
			menuDownload: "Download",
			menuCopyPath: "Copy path",
			menuCopyRelPath: "Copy relative path",
			menuRename: "Rename…",
			menuNewFolder: "New folder…",
			menuRefresh: "Refresh",
			menuExpand: "Expand",
			menuCollapse: "Collapse",
			menuDeleteRecycle: "Delete (Recycle Bin)",
			menuDeletePermanent: "Delete permanently…",
			menuConfirmDelete: "Permanently delete",
			menuConfirm: "Confirm delete",
			menuCancel: "Cancel",
			noticeRenamed: "Renamed",
			noticeDeleted: "Deleted",
			noticeCreated: "Folder created",
			noticeFileCreated: "File created",
			noticePasted: "Pasted",
			noticeProtected: "This folder is protected (read-only)",
			noticeFailed: "Operation failed",
			pptxConverting: "Converting PPT (first time ~2-5s)…",
			pptxFailed: "PPT conversion failed, use the system app instead",
			search: "Search filenames…",
			searchResults: "results",
			searchNoResults: "No matches",
			searchTooMany: "Too many results, narrow the query",
			sortName: "Name",
			sortSize: "Size",
			sortMtime: "Modified",
			sortAsc: "ascending",
			sortDesc: "descending",
			showHidden: "Hidden",
			showNoise: "Filter",
			showHiddenTitle: "Toggle dot-files",
			showNoiseTitle: "Toggle dependency/build folders",
			menuNewFile: "New file…",
			menuCopy: "Copy",
			menuPaste: "Paste",
			copiedClip: "Copied — paste onto a folder",
			pasteNothing: "Clipboard is empty",
			statLines: "lines",
			statWords: "words",
			statChars: "chars",
			zipLoading: "Reading archive…",
			zipEmpty: "Empty archive",
			zipFailed: "Cannot read archive",
			zipInnerTooLarge: "Inner file too large",
			zipBack: "Back to list",
			updateAvailable: "Update available",
			updateTitle: "Click to view the new version",
			spendTitle: "This session's spend",
		};

		// ── helpers ────────────────────────────────────────────────────────
		const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "ico", "avif"]);
		const AUDIO_EXT = new Set(["mp3", "wav", "ogg", "oga", "m4a", "aac", "flac", "opus", "wma"]);
		const VIDEO_EXT = new Set(["mp4", "m4v", "webm", "ogv", "mov", "avi", "mkv", "flv", "wmv"]);
		const TEXT_EXT = new Set(["txt", "py", "r", "sh", "bash", "zsh", "js", "mjs", "cjs", "ts", "tsx", "jsx", "json", "yaml", "yml", "html", "htm", "css", "scss", "less", "sql", "c", "h", "cpp", "hpp", "java", "go", "rs", "toml", "ini", "bat", "cmd", "ps1", "pl", "rb", "docker", "xml", "tex", "make", "mk", "cmake", "diff", "patch", "vim", "jl", "scala", "kt", "swift", "lua", "php", "vcf", "ped", "map", "bim", "fam", "bed", "gff", "gtf", "fa", "fasta", "fq", "fastq", "sam", "nwk", "log", "conf", "cfg", "env", "ipynb", "gitignore", "npmrc", "editorconfig"]);
		function extOf(name) {
			const i = name.lastIndexOf(".");
			return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
		}
		function classify(name) {
			const ext = extOf(name);
			if (IMAGE_EXT.has(ext)) return "image";
			if (AUDIO_EXT.has(ext)) return "audio";
			if (VIDEO_EXT.has(ext)) return "video";
			if (ext === "zip") return "zip";
			if (ext === "pdf") return "pdf";
			if (ext === "xlsx" || ext === "xls") return "xlsx";
			if (ext === "pptx" || ext === "ppt") return "pptx";
			if (ext === "docx") return "docx";
			if (ext === "csv" || ext === "tsv") return "csv";
			if (ext === "md" || ext === "markdown") return "md";
			if (TEXT_EXT.has(ext)) return "text";
			return "other";
		}
		function fmtSize(n) {
			if (!n) return "";
			if (n < 1024) return n + " B";
			if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
			if (n < 1073741824) return (n / 1048576).toFixed(1) + " MB";
			return (n / 1073741824).toFixed(2) + " GB";
		}
		function rawUrl(path) {
			return "/api/explorer/raw?path=" + encodeURIComponent(path);
		}
		function rootBase(path) {
			const base = String(path).replace(/[/\\]+$/, "").split(/[/\\]/).pop();
			return base || path;
		}
		function FileGlyph({ kind }) {
			if (kind === "image") return react.createElement(P.IconBrowseOutline16, { size: 13 });
			if (kind === "pdf") return react.createElement(P.IconListPenOutline16, { size: 13 });
			if (kind === "xlsx" || kind === "csv" || kind === "pptx") return react.createElement(P.IconDataOutline16, { size: 13 });
			if (kind === "docx" || kind === "md") return react.createElement(P.IconListPenOutline16, { size: 13 });
			if (kind === "zip") return react.createElement(P.IconArchiveOutline20, { size: 13 });
			if (kind === "audio" || kind === "video") return react.createElement(P.IconPlayOutline16, { size: 13 });
			if (kind === "text") return react.createElement(P.IconCodeOutline16, { size: 13 });
			return react.createElement(P.IconLinkOutline16, { size: 13 });
		}
		// Document-level drag with a full-screen shield: pointer events keep
		// flowing to the parent document even while the cursor crosses iframes
		// (preview contents), so resizes never stutter or drop.
		function beginDrag(e, onMove, onEnd, cursor = "col-resize") {
			e.preventDefault();
			e.stopPropagation();
			const shield = document.createElement("div");
			shield.style.cssText = `position:fixed;inset:0;z-index:2147483647;cursor:${cursor};`;
			document.body.appendChild(shield);
			const move = (ev) => onMove(ev.clientX, ev.clientY);
			const up = () => {
				shield.remove();
				shield.removeEventListener("pointermove", move);
				shield.removeEventListener("pointerup", up);
				shield.removeEventListener("pointercancel", up);
				shield.removeEventListener("pointerdown", up);
				document.body.style.userSelect = "";
				onEnd();
			};
			document.body.style.userSelect = "none";
			shield.addEventListener("pointermove", move);
			shield.addEventListener("pointerup", up);
			shield.addEventListener("pointercancel", up);
			shield.addEventListener("pointerdown", up);
		}

		// ── zero-patch layout reflow machinery ─────────────────────────────
		const FRAME_SELECTOR = "div:has(> [data-shell-overlay])";
		function frameEl() {
			try {
				return document.querySelector(FRAME_SELECTOR);
			} catch {
				return null;
			}
		}
		function frameRect() {
			const el = frameEl();
			if (el) {
				const r = el.getBoundingClientRect();
				if (r.width > 0) return r;
			}
			return { left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight };
		}
		function sidebarWidthOf() {
			const el = frameEl();
			if (!el) return 0;
			const m = /^(\d+(?:\.\d+)?)px/.exec(el.style.gridTemplateColumns || "");
			return m ? parseFloat(m[1]) : 0;
		}
		function layoutStyleEl() {
			let el = document.querySelector('style[data-plugin="dshx-layout"]');
			if (el === null) {
				el = document.createElement("style");
				el.dataset.plugin = "dshx-layout";
				document.head.append(el);
			}
			return el;
		}
		function applyLayout(s) {
			const styleEl = layoutStyleEl();
			const el = frameEl();
			if (el === null || !s.previewOpen) {
				styleEl.textContent = "";
				return;
			}
			const transition = s.dragging ? "transition:none" : "transition:margin .25s var(--ds-ease-in-out)";
			const chat = `${FRAME_SELECTOR}>div:nth-child(2)`;
			const side = s.swapped ? "margin-left" : "margin-right";
			styleEl.textContent = `${chat}{${side}:${s.previewW}px;${transition}}`;
		}
		function clampPreviewW(w, s) {
			const rect = frameRect();
			const sidebar = sidebarWidthOf();
			const max = Math.max(320, rect.width - sidebar - 380);
			return Math.min(max, Math.max(320, Math.round(w)));
		}

		// ── shared store (persisted) ───────────────────────────────────────
		const store = runtime.defineStore({
			init: () => ({
				treeOpen: true,
				treeRatio: 0.4,
				previewOpen: false,
				previewW: 600,
				swapped: false,
				dragging: false,
				split: false,
				splitDir: "h",
				splitRatio: 0.5,
				tabs: [],
				activeA: 0,
				activeB: 0,
				query: "",
				showHidden: false,
				showNoise: false,
				sortKey: "name",
				sortDir: "asc",
			}),
			persist: "dsh.explorer.ui.v7",
			actions: {
				toggleTree: (d) => { d.treeOpen = !d.treeOpen; },
				setQuery: (d, q) => { d.query = q; },
				toggleHidden: (d) => { d.showHidden = !d.showHidden; },
				toggleNoise: (d) => { d.showNoise = !d.showNoise; },
				cycleSort: (d) => { d.sortKey = d.sortKey === "name" ? "size" : d.sortKey === "size" ? "mtime" : "name"; },
				toggleSortDir: (d) => { d.sortDir = d.sortDir === "asc" ? "desc" : "asc"; },
				// FIX 2026-08-15 (kimi): setUsage/usage 已随 UsageCollector 一并移除。
				setTreeRatio: (d, r) => { d.treeRatio = Math.min(0.85, Math.max(0.15, r)); },
				setPreviewW: (d, w) => { d.previewW = clampPreviewW(w, d); },
				setDragging: (d, dragging) => { d.dragging = dragging; },
				swap: (d) => { d.swapped = !d.swapped; },
				toggleSplit: (d) => {
					if (!d.split) {
						if (d.tabs.length >= 1) {
							d.split = true;
							d.activeB = d.activeA === d.tabs.length - 1 ? 0 : d.activeA + 1;
						}
					} else {
						d.split = false;
					}
				},
				activateA: (d, i) => { d.activeA = i; },
				activateB: (d, i) => { d.activeB = i; },
				setSplitDir: (d, dir) => { d.splitDir = dir === "v" ? "v" : "h"; },
				setSplitRatio: (d, r) => { d.splitRatio = Math.min(0.75, Math.max(0.25, r)); },
				openFile: (d, file) => {
					const i = d.tabs.findIndex((t) => t.path === file.path);
					if (i >= 0) d.activeA = i;
					else {
						d.tabs.push({ ...file, key: file.path });
						d.activeA = d.tabs.length - 1;
					}
					d.previewOpen = true;
				},
				openFileTo: (d, file, pane) => {
					let i = d.tabs.findIndex((t) => t.path === file.path);
					if (i < 0) {
						d.tabs.push({ ...file, key: file.path });
						i = d.tabs.length - 1;
					}
					if (pane === "B") {
						d.activeB = i;
						if (!d.split) d.split = true;
					} else {
						d.activeA = i;
					}
					d.previewOpen = true;
				},
				closeTab: (d, i) => {
					d.tabs.splice(i, 1);
					const len = d.tabs.length;
					if (len === 0) {
						d.previewOpen = false;
						d.split = false;
						d.activeA = 0;
						d.activeB = 0;
					} else {
						const fix = (a) => (a === i ? Math.min(a, len - 1) : a > i ? a - 1 : a);
						d.activeA = fix(d.activeA);
						d.activeB = fix(d.activeB);
						if (d.activeB === d.activeA) d.activeB = d.activeA === len - 1 ? 0 : d.activeA + 1;
					}
				},
				closeAll: (d) => {
					d.tabs = [];
					d.previewOpen = false;
					d.split = false;
					d.activeA = 0;
					d.activeB = 0;
				},
			},
		});

		// ── invisible layout engine (shell.overlay entry) ─────────────────
		function LayoutEngine({ useStore }) {
			const s = useStore((x) => x);
			const stateRef = useRef(s);
			stateRef.current = s;
			useEffect(() => {
				const styleEl = layoutStyleEl();
				let mo = null;
				const el = frameEl();
				if (el !== null) {
					mo = new MutationObserver(() => {
						applyLayout(stateRef.current);
						window.dispatchEvent(new CustomEvent("dshx:frame-style"));
					});
					mo.observe(el, { attributes: true, attributeFilter: ["style"] });
				}
				applyLayout(stateRef.current);
				return () => {
					if (mo !== null) mo.disconnect();
					styleEl.textContent = "";
				};
			}, []);
			useEffect(() => {
				applyLayout(s);
			}, [s]);
			return null;
		}

		// ── file tree panel: bottom region of the sidebar column ──────────
		function FileTree({ t, actions, useStore, openPath }) {
			const currentPath = useStore((s) => (s.previewOpen && s.tabs[s.activeA] ? s.tabs[s.activeA].path : null));
			const query = useStore((s) => s.query);
			const showHidden = useStore((s) => s.showHidden);
			const showNoise = useStore((s) => s.showNoise);
			const sortKey = useStore((s) => s.sortKey);
			const sortDir = useStore((s) => s.sortDir);
			const [roots, setRoots] = useState(null);
			const [rootPath, setRootPath] = useState(null);
			const [expanded, setExpanded] = useState({});
			const [nodes, setNodes] = useState({});
			const [bootErr, setBootErr] = useState(null);
			const [menu, setMenu] = useState(null);            // {x, y, entry}
			const [renaming, setRenaming] = useState(null);    // path being renamed
			const [confirmDel, setConfirmDel] = useState(null); // {path, name}
			const [newDir, setNewDir] = useState(null);        // parent path creating a folder under
			const [notice, setNotice] = useState(null);
			const seq = useRef(0);
			const noticeTimer = useRef(null);
			const [ignoreList, setIgnoreList] = useState(new Set());
			const [newFile, setNewFile] = useState(null);      // parent path creating a file under
			const [searchRes, setSearchRes] = useState(null);  // { query, results, truncated }
			const [searching, setSearching] = useState(false);
			const [focusPath, setFocusPath] = useState(null);
			const searchSeq = useRef(0);
			const clipboardRef = useRef(null);
			const expandedRef = useRef(expanded);
			expandedRef.current = expanded;
			const rowRefs = useRef({});
			const flatRef = useRef([]);
			const parentOf = (p) => {
				const i = Math.max(p.lastIndexOf("\\"), p.lastIndexOf("/"));
				return i > 0 ? p.slice(0, i) : p;
			};
			const flash = (msg) => {
				setNotice(msg);
				if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
				noticeTimer.current = window.setTimeout(() => setNotice(null), 3000);
			};
			const apiPost = useCallback((endpoint, path, payload) => fetch("/api/explorer/" + endpoint + "?path=" + encodeURIComponent(path), {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload ?? {}),
			}).then((r) => r.json()), []);
			const loadDir = useCallback(async (path) => {
				const id = ++seq.current;
				// Silent refresh: only show "loading" when there is no data yet.
				// A refresh of an already-loaded directory keeps the old entries
				// visible until the new listing arrives (no flicker).
				setNodes((n) => {
					const prev = n[path];
					return { ...n, [path]: { loading: prev?.entries == null, error: null, entries: prev?.entries ?? null, truncated: prev?.truncated } };
				});
				try {
					const res = await fetch("/api/explorer/list?path=" + encodeURIComponent(path));
					const data = await res.json();
					if (id !== seq.current) return;
					if (!res.ok || data.error) throw new Error(data.error || "HTTP " + res.status);
					setNodes((n) => ({ ...n, [path]: { loading: false, error: null, entries: data.entries, truncated: !!data.truncated } }));
				} catch (e) {
					if (id !== seq.current) return;
					setNodes((n) => {
						const prev = n[path];
						const keep = prev?.entries ?? null;
						// A failed background refresh keeps the old listing; a failed
						// first load surfaces the error.
						return { ...n, [path]: { loading: false, error: keep == null ? String(e?.message ?? e) : null, entries: keep, truncated: prev?.truncated } };
					});
				}
			}, []);
			useEffect(() => {
				let dead = false;
				fetch("/api/explorer/roots")
					.then((r) => r.json())
					.then((d) => {
						if (dead) return;
						if (d.roots && d.roots.length > 0) {
							setRoots(d.roots);
							setIgnoreList(new Set((d.ignore ?? []).map((n) => String(n).toLowerCase())));
							const root = d.roots[0];
							setRootPath(root);
							setExpanded({ [root]: true });
							loadDir(root);
						} else setBootErr("noRoots");
					})
					.catch(() => { if (!dead) setBootErr("loadFailed"); });
				return () => { dead = true; };
			}, [loadDir]);
			useEffect(() => {
				if (menu === null) return;
				const onDown = (e) => {
					if (!(e.target instanceof Element) || e.target.closest(".dshx-menu") === null) {
						setMenu(null);
						setConfirmDel(null);
					}
				};
				const onKey = (e) => {
					if (e.key === "Escape") {
						setMenu(null);
						setConfirmDel(null);
					}
				};
				document.addEventListener("pointerdown", onDown, true);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("pointerdown", onDown, true);
					document.removeEventListener("keydown", onKey);
				};
			}, [menu]);
			const toggle = (path) => {
				const isOpen = !!expanded[path];
				setExpanded((e) => ({ ...e, [path]: !isOpen }));
				if (!isOpen) loadDir(path);
			};
			const refresh = useCallback(() => {
				for (const p of Object.keys(expandedRef.current)) if (expandedRef.current[p]) loadDir(p);
			}, [loadDir]);
			// Filter + sort a directory's entries for display (dirs always first).
			const sortEntries = (list) => {
				const dir = sortDir === "asc" ? 1 : -1;
				return [...list].sort((a, b) => {
					if ((a.kind === "dir") !== (b.kind === "dir")) return a.kind === "dir" ? -1 : 1;
					if (sortKey === "size") return (a.size - b.size) * dir;
					if (sortKey === "mtime") return (a.mtimeMs - b.mtimeMs) * dir;
					return a.name.localeCompare(b.name, "zh") * dir;
				});
			};
			const filterEntries = (list) => {
				let out = list;
				if (!showHidden) out = out.filter((e) => !e.hidden);
				if (!showNoise) out = out.filter((e) => !ignoreList.has(e.name.toLowerCase()));
				return sortEntries(out);
			};
			const expandTo = (path) => {
				const parts = [];
				let p = path;
				while (p && p !== rootPath) {
					parts.push(p);
					const par = parentOf(p);
					if (par === p) break;
					p = par;
				}
				if (rootPath) parts.push(rootPath);
				setExpanded((e) => {
					const n = { ...e };
					for (const q of parts) n[q] = true;
					return n;
				});
				for (const q of parts) loadDir(q);
			};
			const moveFocus = (delta) => {
				const order = flatRef.current;
				const i = order.indexOf(focusPath);
				const ni = i < 0 ? 0 : Math.max(0, Math.min(order.length - 1, i + delta));
				const next = order[ni];
				if (next) setFocusPath(next);
			};
			const focusParent = (path) => {
				const parent = parentOf(path);
				if (parent && flatRef.current.includes(parent)) setFocusPath(parent);
			};
			// Debounced filename search (clears when the query empties).
			useEffect(() => {
				const q = query.trim();
				if (!q) { setSearchRes(null); setSearching(false); return; }
				if (!rootPath) return;
				setSearching(true);
				const id = ++searchSeq.current;
				const timer = window.setTimeout(() => {
					fetch("/api/explorer/search?q=" + encodeURIComponent(q) + "&path=" + encodeURIComponent(rootPath))
						.then((r) => r.json())
						.then((d) => {
							if (id !== searchSeq.current) return;
							setSearching(false);
							setSearchRes(d);
						})
						.catch(() => {
							if (id === searchSeq.current) { setSearching(false); setSearchRes({ query: q, results: [], truncated: false }); }
						});
				}, 250);
				return () => window.clearTimeout(timer);
			}, [query, rootPath]);
			// Auto-refresh expanded dirs quietly: every 60s, and once when the tab
			// becomes visible again (not on focus — that fires far too often with
			// embedded preview iframes).
			useEffect(() => {
				const id = window.setInterval(refresh, 60000);
				const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
				document.addEventListener("visibilitychange", onVisible);
				return () => {
					window.clearInterval(id);
					document.removeEventListener("visibilitychange", onVisible);
				};
			}, [refresh]);
			// Move DOM focus to the row at focusPath (keyboard navigation).
			useEffect(() => {
				const el = rowRefs.current[focusPath];
				if (el && document.activeElement !== el) el.focus();
			}, [focusPath]);
			const closeMenu = () => {
				setMenu(null);
				setConfirmDel(null);
			};
			const openEntry = (entry, pane) => {
				const file = { name: entry.name, path: entry.path, kind: classify(entry.name), size: entry.size, mtimeMs: entry.mtimeMs };
				if (pane) actions.openFileTo(file, pane);
				else actions.openFile(file);
			};
			const relPath = (p) => (rootPath !== null && p.startsWith(rootPath + "\\") ? p.slice(rootPath.length + 1) : p);
			const copyText = async (text) => {
				try {
					await navigator.clipboard.writeText(text);
					flash(t("copied"));
				} catch {
					flash(t("noticeFailed"));
				}
			};
			const startRename = (path) => {
				closeMenu();
				setRenaming(path);
			};
			const commitRename = async (path, name) => {
				setRenaming(null);
				const parent = parentOf(path);
				const res = await apiPost("rename", path, { name });
				if (res.ok) { flash(t("noticeRenamed")); loadDir(parent); }
				else flash(res.error === "protected" ? t("noticeProtected") : t("noticeFailed"));
			};
			const doDelete = async (path, permanent) => {
				closeMenu();
				const parent = parentOf(path);
				const res = await apiPost("delete", path, { recycle: !permanent });
				if (res.ok) { flash(t("noticeDeleted")); loadDir(parent); }
				else flash(res.error === "protected" ? t("noticeProtected") : t("noticeFailed"));
			};
			const commitMkdir = async (parent, name) => {
				setNewDir(null);
				const res = await apiPost("mkdir", parent, { name });
				if (res.ok) { flash(t("noticeCreated")); loadDir(parent); }
				else flash(res.error === "protected" ? t("noticeProtected") : t("noticeFailed"));
			};
			const commitNewFile = async (parent, name) => {
				setNewFile(null);
				const res = await apiPost("touch", parent, { name });
				if (res.ok) { flash(t("noticeFileCreated")); loadDir(parent); }
				else flash(res.error === "protected" ? t("noticeProtected") : t("noticeFailed"));
			};
			const copyToClipboard = (entry) => {
				clipboardRef.current = entry.path;
				closeMenu();
				flash(t("copiedClip"));
			};
			const pasteInto = (dirPath) => {
				closeMenu();
				if (!clipboardRef.current) { flash(t("pasteNothing")); return; }
				apiPost("copy", dirPath, { src: clipboardRef.current }).then((res) => {
					if (res.ok) { flash(t("noticePasted")); loadDir(dirPath); }
					else flash(res.error === "protected" ? t("noticeProtected") : t("noticeFailed"));
				});
			};
			const startNewFile = (dirPath) => {
				setExpanded((e) => ({ ...e, [dirPath]: true }));
				loadDir(dirPath);
				setNewFile(dirPath);
				closeMenu();
			};
			const downloadEntry = (entry) => {
				const a = document.createElement("a");
				a.href = rawUrl(entry.path);
				a.download = entry.name;
				a.click();
			};
			const renderEntry = (entry, depth) => {
				const isDir = entry.kind === "dir";
				const isOpen = !!expanded[entry.path];
				const node = nodes[entry.path];
				const isCurrent = entry.path === currentPath;
				const isRenaming = renaming === entry.path;
				flatRef.current.push(entry.path);
				const row = react.createElement("div", {
					key: entry.path,
					className: [cls.row, isCurrent ? cls.rowActive : ""].join(" "),
					style: { paddingLeft: 6 + depth * 14 },
					title: entry.path,
					tabIndex: 0,
					ref: (el) => { if (el) rowRefs.current[entry.path] = el; else delete rowRefs.current[entry.path]; },
					onFocus: () => setFocusPath(entry.path),
					onClick: () => { if (isRenaming) return; if (isDir) toggle(entry.path); else openEntry(entry); },
					onContextMenu: (e) => {
						e.preventDefault();
						e.stopPropagation();
						setConfirmDel(null);
						setMenu({ x: e.clientX, y: e.clientY, entry });
					},
					onKeyDown: (e) => {
						if (isRenaming) return;
						if (e.key === "Enter") {
							e.preventDefault();
							if (isDir) toggle(entry.path);
							else openEntry(entry);
						} else if (e.key === "F2") {
							e.preventDefault();
							startRename(entry.path);
						} else if (e.key === "Delete") {
							e.preventDefault();
							doDelete(entry.path, false);
						} else if (e.key === "ArrowDown") {
							e.preventDefault();
							moveFocus(1);
						} else if (e.key === "ArrowUp") {
							e.preventDefault();
							moveFocus(-1);
						} else if (e.key === "ArrowRight") {
							e.preventDefault();
							if (isDir && !isOpen) toggle(entry.path);
							else if (isDir) moveFocus(1);
						} else if (e.key === "ArrowLeft") {
							e.preventDefault();
							if (isDir && isOpen) toggle(entry.path);
							else focusParent(entry.path);
						}
					},
				},
					react.createElement("span", { className: [cls.chev, isDir && isOpen ? cls.chevOpen : ""].join(" ") }, isDir ? react.createElement(P.IconTriangleRightFill14, { size: 12 }) : null),
					react.createElement("span", { className: cls.icon }, isDir ? (isOpen ? react.createElement(P.IconFolderOpen16, { size: 14 }) : react.createElement(P.IconFolderClose16, { size: 14 })) : react.createElement(FileGlyph, { kind: classify(entry.name) })),
					isRenaming
						? react.createElement("input", {
							className: cls.renameInput,
							autoFocus: true,
							defaultValue: entry.name,
							spellCheck: false,
							onClick: (e) => e.stopPropagation(),
							onContextMenu: (e) => e.stopPropagation(),
							onKeyDown: (e) => {
								e.stopPropagation();
								if (e.key === "Enter") commitRename(entry.path, e.currentTarget.value);
								else if (e.key === "Escape") setRenaming(null);
							},
							onBlur: (e) => { if (renaming === entry.path) commitRename(entry.path, e.currentTarget.value); },
						})
						: react.createElement("span", { className: cls.name, style: entry.hidden ? { opacity: 0.55 } : undefined }, entry.name),
					entry.kind === "file" && !isRenaming ? react.createElement("span", { className: cls.size }, fmtSize(entry.size)) : null);
				if (!isDir || !isOpen) return row;
				const mkInput = newDir === entry.path
					? react.createElement("div", { key: entry.path + ":newdir", className: cls.row, style: { paddingLeft: 6 + (depth + 1) * 14 } },
						react.createElement("span", { className: cls.chev }),
						react.createElement("span", { className: cls.icon }, react.createElement(P.IconFolderClose16, { size: 14 })),
						react.createElement("input", {
							className: cls.renameInput,
							autoFocus: true,
							placeholder: t("menuNewFolder"),
							spellCheck: false,
							onKeyDown: (e) => {
								e.stopPropagation();
								if (e.key === "Enter") commitMkdir(entry.path, e.currentTarget.value);
								else if (e.key === "Escape") setNewDir(null);
							},
							onBlur: (e) => { if (newDir === entry.path) commitMkdir(entry.path, e.currentTarget.value); },
						}))
					: null;
				const newFileInput = newFile === entry.path
					? react.createElement("div", { key: entry.path + ":newfile", className: cls.row, style: { paddingLeft: 6 + (depth + 1) * 14 } },
						react.createElement("span", { className: cls.chev }),
						react.createElement("span", { className: cls.icon }, react.createElement(FileGlyph, { kind: "text" })),
						react.createElement("input", {
							className: cls.renameInput,
							autoFocus: true,
							placeholder: t("menuNewFile"),
							spellCheck: false,
							onKeyDown: (e) => {
								e.stopPropagation();
								if (e.key === "Enter") commitNewFile(entry.path, e.currentTarget.value);
								else if (e.key === "Escape") setNewFile(null);
							},
							onBlur: (e) => { if (newFile === entry.path) commitNewFile(entry.path, e.currentTarget.value); },
						}))
					: null;
				let kids = null;
				if (node?.loading) kids = react.createElement("div", { className: cls.noteRow }, t("loading"));
				else if (node?.error) kids = react.createElement("div", { className: cls.noteRow }, node.error);
				else if (node?.entries) {
					const visible = filterEntries(node.entries);
					if (visible.length === 0) kids = react.createElement("div", { className: cls.noteRow }, t("empty"));
					else kids = visible.map((e) => renderEntry(e, depth + 1));
				}
				return react.createElement("div", { key: entry.path + ":sub" },
					row,
					mkInput,
					newFileInput,
					kids,
					node?.truncated ? react.createElement("div", { className: cls.noteRow }, "…") : null);
			};
			const sortLabel = sortKey === "size" ? t("sortSize") : sortKey === "mtime" ? t("sortMtime") : t("sortName");
			const header = react.createElement("div", { className: cls.panelHead },
				react.createElement("span", { className: cls.panelTitle }, t("title")),
				react.createElement("button", { type: "button", className: cls.sortKey, title: t("sortName") + " / " + t("sortSize") + " / " + t("sortMtime"), onClick: actions.cycleSort }, sortLabel),
				react.createElement("button", { type: "button", className: cls.sortDir, title: sortDir === "asc" ? t("sortAsc") : t("sortDesc"), onClick: actions.toggleSortDir },
					sortDir === "asc" ? react.createElement(P.IconChevronUpOutline14, { size: 14 }) : react.createElement(P.IconChevronDownOutline14, { size: 14 })),
				react.createElement("button", { type: "button", className: cls.iconBtn, "aria-label": t("refresh"), onClick: refresh }, react.createElement(P.IconRefreshOutline16, { size: 14 })),
				react.createElement("button", { type: "button", className: cls.iconBtn, "aria-label": t("collapseTree"), onClick: actions.toggleTree }, react.createElement(P.IconCloseOutline16, { size: 14 })));
			const toolbar = react.createElement("div", { className: cls.toolbar },
				react.createElement("div", { className: cls.search },
					react.createElement("span", { className: cls.searchIcon }, react.createElement(P.IconSearchOutline16, { size: 13 })),
					react.createElement("input", {
						value: query,
						placeholder: t("search"),
						spellCheck: false,
						onChange: (e) => actions.setQuery(e.currentTarget.value),
						onKeyDown: (e) => { if (e.key === "Escape") actions.setQuery(""); },
					})),
				react.createElement("button", { type: "button", className: [cls.toggleBtn, showHidden ? cls.toggleOn : ""].join(" "), title: t("showHiddenTitle"), onClick: actions.toggleHidden }, t("showHidden")),
				react.createElement("button", { type: "button", className: [cls.toggleBtn, showNoise ? cls.toggleOn : ""].join(" "), title: t("showNoiseTitle"), onClick: actions.toggleNoise }, t("showNoise")));
			const noticeEl = notice === null ? null : react.createElement("div", { className: cls.notice }, notice);

			const menuItem = (label, onClick, danger) => react.createElement("button", {
				type: "button",
				className: [cls.menuItem, danger ? cls.menuDanger : ""].join(" "),
				onClick: () => { closeMenu(); onClick(); },
			}, label);
			const menuSep = react.createElement("div", { className: cls.menuSep });
			let menuEl = null;
			if (menu !== null) {
				const entry = menu.entry;
				const isRoot = entry.isRoot === true;
				const isDir = entry.kind === "dir";
				const isOpen = !!expanded[entry.path];
				const items = [];
				if (confirmDel !== null) {
					menuEl = react.createElement("div", {
						className: cls.menu,
						style: { left: Math.min(menu.x, window.innerWidth - 230), top: Math.min(menu.y, window.innerHeight - 180) },
						onClick: (e) => e.stopPropagation(),
					},
						react.createElement("div", { className: cls.menuTitle }, t("menuConfirmDelete") + "「" + confirmDel.name + "」"),
						react.createElement("button", { type: "button", className: [cls.menuItem, cls.menuDanger].join(" "), onClick: () => doDelete(confirmDel.path, true) }, t("menuConfirm")),
						react.createElement("button", { type: "button", className: cls.menuItem, onClick: closeMenu }, t("menuCancel")));
				} else {
					if (!isDir) {
						items.push(menuItem(t("menuOpenPreview"), () => openEntry(entry)));
						items.push(menuItem(t("menuOpenApp"), () => openPath(entry.path)));
						items.push(menuItem(t("menuOpenLeft"), () => openEntry(entry, "A")));
						items.push(menuItem(t("menuOpenRight"), () => openEntry(entry, "B")));
						items.push(menuItem(t("menuShowInFolder"), () => openPath(parentOf(entry.path))));
						items.push(menuItem(t("menuDownload"), () => downloadEntry(entry)));
					} else {
						items.push(menuItem(isOpen ? t("menuCollapse") : t("menuExpand"), () => toggle(entry.path)));
						items.push(menuItem(t("menuOpenApp"), () => openPath(entry.path)));
						items.push(menuItem(t("menuRefresh"), () => loadDir(entry.path)));
						items.push(menuItem(t("menuNewFolder"), () => {
							setExpanded((e) => ({ ...e, [entry.path]: true }));
							loadDir(entry.path);
							setNewDir(entry.path);
							closeMenu();
						}));
						items.push(menuItem(t("menuNewFile"), () => startNewFile(entry.path)));
						items.push(menuItem(t("menuPaste"), () => pasteInto(entry.path)));
					}
					items.push(menuSep);
					items.push(menuItem(t("menuCopyPath"), () => copyText(entry.path)));
					items.push(menuItem(t("menuCopyRelPath"), () => copyText(relPath(entry.path))));
					if (!isRoot) {
						items.push(menuSep);
						items.push(menuItem(t("menuCopy"), () => copyToClipboard(entry)));
						items.push(menuItem(t("menuRename"), () => startRename(entry.path)));
						items.push(menuItem(t("menuDeleteRecycle"), () => doDelete(entry.path, false)));
						items.push(menuItem(t("menuDeletePermanent"), () => {
							setConfirmDel({ path: entry.path, name: entry.name });
						}, true));
					}
					menuEl = react.createElement("div", {
						className: cls.menu,
						style: { left: Math.min(menu.x, window.innerWidth - 230), top: Math.min(menu.y, window.innerHeight - 60 - items.length * 30) },
						onClick: (e) => e.stopPropagation(),
					}, items);
				}
			}
			const queryActive = query.trim().length > 0;
			// Reset the flat focus order each render; renderEntry/rootRow repopulate it.
			flatRef.current = [];
			const renderSearch = () => {
				if (searching) return react.createElement("div", { className: cls.noteRow }, t("loading"));
				const results = searchRes?.results ?? [];
				const total = results.length;
				if (total === 0) {
					return react.createElement(react.Fragment, null,
						react.createElement("div", { className: cls.noteRow }, t("searchNoResults")),
						searchRes?.truncated ? react.createElement("div", { className: cls.noteRow }, t("searchTooMany")) : null);
				}
				const rows = results.map((r) => {
					const isDir = r.kind === "dir";
					const open = () => { if (isDir) { actions.setQuery(""); expandTo(r.path); } else openEntry(r); };
					return react.createElement("div", {
						key: r.path,
						className: cls.resultRow,
						title: r.path,
						tabIndex: 0,
						onClick: open,
						onKeyDown: (e) => { if (e.key === "Enter") { e.preventDefault(); open(); } },
					},
						react.createElement("span", { className: cls.icon }, isDir ? react.createElement(P.IconFolderClose16, { size: 14 }) : react.createElement(FileGlyph, { kind: classify(r.name) })),
						react.createElement("span", { className: cls.resultName }, r.name),
						react.createElement("span", { className: cls.resultPath }, relPath(r.path)));
				});
				return react.createElement(react.Fragment, null,
					react.createElement("div", { className: cls.noteRow }, total + " " + t("searchResults") + (searchRes?.truncated ? " · " + t("searchTooMany") : "")),
					rows);
			};
			if (bootErr) {
				return react.createElement(react.Fragment, null,
					header,
					toolbar,
					noticeEl,
					react.createElement("div", { className: cls.tree },
						react.createElement("div", { className: cls.noteRow }, t(bootErr))),
					menuEl);
			}
			if (!roots || !rootPath) {
				return react.createElement(react.Fragment, null,
					header,
					toolbar,
					noticeEl,
					react.createElement("div", { className: cls.tree },
						react.createElement("div", { className: cls.noteRow }, t("loading"))),
					menuEl);
			}
			const rootNode = nodes[rootPath];
			const rootOpen = !!expanded[rootPath];
			const rootEntry = { path: rootPath, name: rootBase(rootPath), kind: "dir", isRoot: true };
			const rootRow = react.createElement("div", {
				className: cls.row + " " + cls.rootRow,
				style: { paddingLeft: 6 },
				tabIndex: 0,
				ref: (el) => { if (el) rowRefs.current[rootPath] = el; else delete rowRefs.current[rootPath]; },
				onFocus: () => setFocusPath(rootPath),
				onClick: () => toggle(rootPath),
				onContextMenu: (e) => {
					e.preventDefault();
					e.stopPropagation();
					setConfirmDel(null);
					setMenu({ x: e.clientX, y: e.clientY, entry: rootEntry });
				},
				onKeyDown: (e) => {
					if (e.key === "Enter") { e.preventDefault(); toggle(rootPath); }
					else if (e.key === "ArrowDown") { e.preventDefault(); moveFocus(1); }
					else if (e.key === "ArrowUp") { e.preventDefault(); moveFocus(-1); }
					else if (e.key === "ArrowRight") { e.preventDefault(); if (!rootOpen) toggle(rootPath); else moveFocus(1); }
					else if (e.key === "ArrowLeft") { e.preventDefault(); if (rootOpen) toggle(rootPath); }
				},
				title: rootPath,
			},
				react.createElement("span", { className: [cls.chev, rootOpen ? cls.chevOpen : ""].join(" ") }, react.createElement(P.IconTriangleRightFill14, { size: 12 })),
				react.createElement("span", { className: cls.icon }, rootOpen ? react.createElement(P.IconFolderOpen16, { size: 14 }) : react.createElement(P.IconFolderClose16, { size: 14 })),
				react.createElement("span", { className: cls.name }, rootBase(rootPath)));
			flatRef.current.push(rootPath);
			const treeContent = queryActive
				? renderSearch()
				: react.createElement(react.Fragment, null,
					rootRow,
					rootOpen && (rootNode?.loading ? react.createElement("div", { className: cls.noteRow }, t("loading"))
						: rootNode?.error ? react.createElement("div", { className: cls.noteRow }, rootNode.error)
						: rootNode?.entries ? filterEntries(rootNode.entries).map((e) => renderEntry(e, 1))
						: null),
					rootOpen && rootNode?.truncated ? react.createElement("div", { className: cls.noteRow }, "…") : null);
			return react.createElement(react.Fragment, null,
				header,
				toolbar,
				noticeEl,
				react.createElement("div", { className: cls.tree }, treeContent),
				menuEl);
		}

		function TreePanel({ useStore, actions, t, openPath }) {
			const s = useStore((x) => x);
			const [, setTick] = useState(0);
			useEffect(() => {
				const onStyle = () => setTick((v) => v + 1);
				window.addEventListener("dshx:frame-style", onStyle);
				return () => window.removeEventListener("dshx:frame-style", onStyle);
			}, []);
			const sidebarW = sidebarWidthOf();
			const startDrag = (e) => {
				const rect = frameRect();
				actions.setDragging(true);
				beginDrag(e, (clientX, clientY) => {
					if (rect.height > 0) actions.setTreeRatio((rect.bottom - clientY) / rect.height);
				}, () => actions.setDragging(false));
			};
			if (!s.treeOpen || sidebarW < 100) return null;
			return react.createElement("div", {
				className: cls.treePanel,
				style: { top: `${(1 - s.treeRatio) * 100}%`, bottom: 0, width: sidebarW },
			},
				react.createElement("div", { className: [cls.resize, cls.resizeH].join(" "), style: { top: 0 }, onPointerDown: startDrag }),
				react.createElement(FileTree, { useStore, actions, t, openPath }));
		}

		// ── preview body ───────────────────────────────────────────────────
		const HTML_ENDPOINTS = { text: "highlight", md: "markdown", csv: "csv", xlsx: "xlsx", docx: "docx" };
		function errorText(message, t) {
			if (message === "binary") return t("binary");
			if (message === "outside-workspace") return t("outside");
			if (message === "not-found") return t("notFound");
			if (message === "load-failed") return t("loadFailed");
			return message;
		}
		function PptxBody({ file, t }) {
			const url = "/api/explorer/pptx?path=" + encodeURIComponent(file.path);
			const [st, setSt] = useState({ phase: "checking" });
			useEffect(() => {
				let dead = false;
				fetch(url)
					.then((r) => {
						if (dead) return;
						if ((r.headers.get("content-type") ?? "").includes("application/pdf")) setSt({ phase: "ready" });
						else setSt({ phase: "error" });
					})
					.catch(() => { if (!dead) setSt({ phase: "error" }); });
				return () => { dead = true; };
			}, [url]);
			if (st.phase === "checking") {
				return react.createElement("div", { className: cls.bodyCenter }, t("pptxConverting"));
			}
			if (st.phase === "error") {
				return react.createElement("div", { className: cls.bodyCenter },
					react.createElement("div", { className: cls.errorBox }, t("pptxFailed")));
			}
			return react.createElement("iframe", { className: cls.frame, style: { width: "100%", height: "100%" }, src: url, title: file.name });
		}

		function ZipBody({ file, t }) {
			const [st, setSt] = useState({ phase: "loading" });
			const [entries, setEntries] = useState([]);
			const [active, setActive] = useState(null); // {name, kind, url}
			const loadList = useCallback(() => {
				setSt({ phase: "loading" });
				fetch("/api/explorer/zip?path=" + encodeURIComponent(file.path))
					.then((r) => r.json())
					.then((d) => {
						if (d.error) { setSt({ phase: "error", message: d.error }); return; }
						setEntries(d.entries ?? []);
						setSt({ phase: "list" });
					})
					.catch(() => setSt({ phase: "error", message: "zipFailed" }));
			}, [file.path]);
			useEffect(() => { loadList(); }, [loadList]);
			if (st.phase === "loading") return react.createElement("div", { className: cls.bodyCenter }, t("zipLoading"));
			if (st.phase === "error") return react.createElement("div", { className: cls.bodyCenter }, react.createElement("div", { className: cls.errorBox }, errorText(st.message, t)));
			if (active !== null) {
				let body;
				if (active.kind === "image") {
					body = react.createElement("div", { style: { flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 } },
						react.createElement("img", { src: active.url, alt: active.name, style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } }));
				} else if (active.kind === "text" || active.kind === "md" || active.kind === "csv") {
					body = react.createElement("iframe", { className: cls.frame, style: { width: "100%", height: "100%" }, src: active.url, title: active.name });
				} else {
					body = react.createElement("div", { className: cls.bodyCenter }, react.createElement("div", { className: cls.errorBox }, active.name + " · " + t("noPreview")));
				}
				return react.createElement("div", { className: cls.zipInner },
					react.createElement("div", { className: cls.toolbar },
						react.createElement("button", { type: "button", className: cls.toggleBtn, onClick: () => setActive(null) }, "← " + t("zipBack")),
						react.createElement("span", { className: cls.zipSize, style: { padding: "0 4px" } }, active.name)),
					body);
			}
			if (entries.length === 0) return react.createElement("div", { className: cls.bodyCenter }, t("zipEmpty"));
			const rows = entries.map((e) => {
				const isDir = e.dir;
				return react.createElement("div", {
					key: e.name,
					className: cls.zipRow,
					title: e.name,
					onClick: () => { if (!isDir) setActive({ name: e.name, kind: classify(e.name), url: "/api/explorer/zipfile?path=" + encodeURIComponent(file.path) + "&inner=" + encodeURIComponent(e.name) }); },
				},
					react.createElement("span", { className: cls.zipIcon }, isDir ? react.createElement(P.IconFolderClose16, { size: 13 }) : react.createElement(FileGlyph, { kind: classify(e.name) })),
					react.createElement("span", { className: cls.zipName }, e.name),
					!isDir ? react.createElement("span", { className: cls.zipSize }, fmtSize(e.size)) : null);
			});
			return react.createElement("div", { className: cls.zipList }, rows);
		}

		function Body({ file, t }) {
			const kind = file.kind ?? classify(file.name);
			const [st, setSt] = useState({ phase: "loading" });
			useEffect(() => {
				let dead = false;
				const ep = HTML_ENDPOINTS[kind];
				if (!ep) { setSt({ phase: "ready" }); return; }
				setSt({ phase: "loading" });
				fetch("/api/explorer/" + ep + "?path=" + encodeURIComponent(file.path))
					.then((r) => r.json())
					.then((d) => {
						if (dead) return;
						if (d.error) setSt({ phase: "error", message: d.error });
						else setSt({ phase: "html", html: d.html, stats: d.stats });
					})
					.catch((e) => { if (!dead) setSt({ phase: "error", message: String(e?.message ?? e) }); });
				return () => { dead = true; };
			}, [file.path, kind]);
			if (kind === "image") {
				return react.createElement(ImageBody, { file, t });
			}
			if (kind === "audio") {
				return react.createElement("div", { className: cls.audioWrap },
					react.createElement("audio", { controls: true, src: rawUrl(file.path) }),
					react.createElement("p", { style: { margin: 0, fontSize: 13, color: "var(--dsw-alias-label-secondary)" } }, file.name));
			}
			if (kind === "video") {
				return react.createElement("video", { className: cls.media, controls: true, src: rawUrl(file.path) });
			}
			if (kind === "zip") {
				return react.createElement(ZipBody, { file, t });
			}
			if (kind === "pptx") {
				return react.createElement(PptxBody, { file, t });
			}
			if (kind === "pdf") {
				return react.createElement("iframe", { className: cls.frame, style: { width: "100%", height: "100%" }, src: rawUrl(file.path), title: file.name });
			}
			if (st.phase === "loading") {
				return react.createElement("div", { className: cls.bodyCenter }, t("loading"));
			}
			if (st.phase === "error") {
				return react.createElement("div", { className: cls.bodyCenter },
					react.createElement("div", { className: cls.errorBox }, errorText(st.message, t)));
			}
			if (st.phase === "html") {
				const allowScripts = kind === "text";
				const frame = react.createElement("iframe", { className: cls.frame, style: { width: "100%", height: "100%" }, srcDoc: st.html, sandbox: allowScripts ? "allow-scripts" : "", title: file.name });
				const metaBar = (kind === "text" && st.stats) ? react.createElement("div", { className: cls.metaBar },
					react.createElement("span", null, st.stats.lines + " " + t("statLines")),
					react.createElement("span", null, st.stats.words + " " + t("statWords")),
					react.createElement("span", null, st.stats.chars + " " + t("statChars"))) : null;
				if (metaBar === null) return frame;
				return react.createElement(react.Fragment, null, frame, metaBar);
			}
			return react.createElement("div", { className: cls.bodyMeta },
				react.createElement("p", null, file.name),
				react.createElement("p", null, `${fmtSize(file.size)} · ${t("noPreview")}`));
		}

		// ── image viewer: fit by default, anchored zoom, adaptive refit ────
		// view.mode === "fit"  -> the image follows the container size (live
		//                           re-fit while the split panes are resized)
		// view.mode === "manual" -> user zoom/pan owns the view (no refit)
		function ImageBody({ file, t }) {
			const [view, setView] = useState(null);
			const [natural, setNatural] = useState(null);
			const dragRef = useRef(null);
			const wrapRef = useRef(null);
			const fitFor = (nat) => {
				const wrap = wrapRef.current;
				if (wrap === null || nat === null) return 1;
				const rect = wrap.getBoundingClientRect();
				if (rect.width <= 0 || rect.height <= 0) return 1;
				return Math.min(8, Math.max(0.05, Math.min(rect.width / nat.w, rect.height / nat.h)));
			};
			const zoomBy = (factor, cx, cy) => {
				setView((v) => {
					if (v === null) return v;
					const wrap = wrapRef.current;
					if (wrap === null) return v;
					const rect = wrap.getBoundingClientRect();
					// Anchor math relative to the wrap CENTER: the image center sits
					// at wrapCenter + offset, so offset' = offset*f + u*(1-f) keeps
					// the image point under the cursor exactly in place.
					const px = cx === undefined ? rect.left + rect.width / 2 : cx;
					const py = cy === undefined ? rect.top + rect.height / 2 : cy;
					const ux = px - rect.left - rect.width / 2;
					const uy = py - rect.top - rect.height / 2;
					const next = Math.min(12, Math.max(0.15, v.scale * factor));
					const k = next / v.scale;
					return {
						mode: "manual",
						scale: next,
						offset: {
							x: ux - (ux - v.offset.x) * k,
							y: uy - (uy - v.offset.y) * k,
						},
					};
				});
			};
			useEffect(() => {
				const wrap = wrapRef.current;
				if (wrap === null) return;
				const onWheel = (e) => {
					e.preventDefault();
					zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
				};
				wrap.addEventListener("wheel", onWheel, { passive: false });
				return () => wrap.removeEventListener("wheel", onWheel);
			}, []);
			// Live re-fit while in fit mode (split resize, panel resize, swap…)
			useEffect(() => {
				const wrap = wrapRef.current;
				if (wrap === null) return;
				const ro = new ResizeObserver(() => {
					setView((v) => {
						if (v === null || v.mode !== "fit") return v;
						return { mode: "fit", scale: fitFor(natural), offset: { x: 0, y: 0 } };
					});
				});
				ro.observe(wrap);
				return () => ro.disconnect();
			}, [natural]);
			const onPointerDown = (e) => {
				// Pan only from the backdrop or the image itself; the toolbar
				// buttons keep their normal click behavior (preventDefault on
				// pointerdown would otherwise swallow the button's click).
				const target = e.target;
				if (target !== wrapRef.current && target.tagName !== "IMG") return;
				if (view === null) return;
				e.preventDefault();
				dragRef.current = { x: e.clientX, y: e.clientY, ox: view.offset.x, oy: view.offset.y };
				beginDrag(e, (clientX, clientY) => {
					const d = dragRef.current;
					if (d === null) return;
					setView((v) => (v === null ? v : { mode: "manual", scale: v.scale, offset: { x: d.ox + (clientX - d.x), y: d.oy + (clientY - d.y) } }));
				}, () => { dragRef.current = null; }, "grabbing");
			};
			const reset = (s) => setView((v) => (v === null ? v : { mode: "manual", scale: s, offset: { x: 0, y: 0 } }));
			const fitNow = () => setView((v) => (v === null ? v : { mode: "fit", scale: fitFor(natural), offset: { x: 0, y: 0 } }));
			return react.createElement("div", {
				className: cls.imgWrap,
				ref: wrapRef,
				onPointerDown,
			},
				react.createElement("img", {
					className: cls.img,
					src: rawUrl(file.path),
					alt: file.name,
					draggable: false,
					onLoad: (e) => {
						const el = e.currentTarget;
						if (el.naturalWidth <= 0) return;
						const nat = { w: el.naturalWidth, h: el.naturalHeight };
						setNatural(nat);
						setView({ mode: "fit", scale: fitFor(nat), offset: { x: 0, y: 0 } });
					},
					style: view === null
						? { visibility: "hidden" }
						: { transform: `translate(-50%, -50%) translate(${view.offset.x}px, ${view.offset.y}px) scale(${view.scale})` },
				}),
				react.createElement("div", { className: cls.imgBar },
					react.createElement("button", { type: "button", className: cls.imgBtn, onClick: () => zoomBy(1 / 1.25) }, "−"),
					react.createElement("span", { className: cls.imgPct }, view === null ? "…" : Math.round(view.scale * 100) + "%"),
					react.createElement("button", { type: "button", className: cls.imgBtn, onClick: () => zoomBy(1.25) }, "＋"),
					react.createElement("button", { type: "button", className: cls.imgBtn, onClick: fitNow }, t("fit")),
					react.createElement("button", { type: "button", className: cls.imgBtn, onClick: () => reset(1) }, t("actual"))));
		}

		// ── tab strip (shared by split panes) ─────────────────────────────
		function TabStrip({ tabs, active, onActivate, onClose, t, small }) {
			return react.createElement("div", { className: cls.tabStrip },
				tabs.map((tab, i) =>
					react.createElement("div", {
						key: tab.path,
						className: [cls.tab, small ? cls.tabSmall : "", i === active ? cls.tabActive : ""].join(" "),
						title: tab.path,
						onClick: () => onActivate(i),
					},
						react.createElement("span", { className: cls.tabIcon }, react.createElement(FileGlyph, { kind: tab.kind })),
						react.createElement("span", { className: cls.tabName }, tab.name),
						react.createElement("button", {
							type: "button",
							className: cls.tabClose,
							"aria-label": t("closeTab"),
							onClick: (e) => { e.stopPropagation(); onClose(i); },
						}, react.createElement(P.IconCloseFill14, { size: 12 })))));
		}

		// ── preview panel (shell.overlay entry) ───────────────────────────
		function PreviewPanel({ useStore, actions, openPath, closeDetails, t }) {
			const s = useStore((x) => x);
			const open = s.previewOpen && s.tabs.length > 0;
			const activeA = Math.min(s.activeA, Math.max(0, s.tabs.length - 1));
			const activeB = Math.min(s.activeB, Math.max(0, s.tabs.length - 1));
			const [, setTick] = useState(0);
			const [copied, setCopied] = useState(false);
			useEffect(() => {
				if (open && typeof closeDetails === "function") closeDetails();
			}, [open, closeDetails]);
			useEffect(() => {
				if (!open) return;
				const onKey = (e) => {
					if (e.key === "Escape") actions.closeAll();
					else if (e.ctrlKey && (e.key === "w" || e.key === "W")) {
						e.preventDefault();
						actions.closeTab(activeA);
					}
				};
				document.addEventListener("keydown", onKey);
				return () => document.removeEventListener("keydown", onKey);
			}, [open, activeA, actions]);
			useEffect(() => {
				const onStyle = () => setTick((v) => v + 1);
				window.addEventListener("dshx:frame-style", onStyle);
				return () => window.removeEventListener("dshx:frame-style", onStyle);
			}, []);
			const startDrag = (e) => {
				const startX = e.clientX;
				const startW = s.previewW;
				const swapped = s.swapped;
				actions.setDragging(true);
				beginDrag(e, (clientX) => {
					const delta = clientX - startX;
					actions.setPreviewW(swapped ? startW + delta : startW - delta);
				}, () => actions.setDragging(false));
			};
			const startRatioDrag = (e) => {
				const dir = s.splitDir;
				const startX = e.clientX;
				const startY = e.clientY;
				const startRatio = s.splitRatio;
				const panelW = s.previewW || 600;
				const panelH = frameRect().height || 600;
				actions.setDragging(true);
				beginDrag(e, (clientX, clientY) => {
					if (dir === "v") {
						actions.setSplitRatio(startRatio + (clientY - startY) / panelH);
					} else {
						actions.setSplitRatio(startRatio + (clientX - startX) / panelW);
					}
				}, () => actions.setDragging(false), dir === "v" ? "row-resize" : "col-resize");
			};
			if (!open) return null;
			const fileA = s.tabs[activeA];
			const fileB = s.tabs[activeB];
			const left = s.swapped ? sidebarWidthOf() : "auto";
			const copyPath = () => {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText(fileA.path).then(() => {
						setCopied(true);
						window.setTimeout(() => setCopied(false), 1600);
					}).catch(() => {});
				}
			};
			// One independent preview screen: its own tab strip + body.
			const previewScreen = (file, active, onActivate) =>
				react.createElement(react.Fragment, null,
					react.createElement("div", { className: cls.cellTabs },
						react.createElement(TabStrip, { tabs: s.tabs, active, onActivate, onClose: actions.closeTab, t, small: true })),
					react.createElement("div", { className: cls.cellBody },
						react.createElement(Body, { file, t, key: file.path })));
			return react.createElement("div", {
				className: cls.prevPanel,
				style: { width: s.previewW, left: s.swapped ? left : "auto", right: s.swapped ? "auto" : 0 },
			},
				react.createElement("div", { className: cls.paneTabs },
					!s.split && react.createElement(TabStrip, { tabs: s.tabs, active: activeA, onActivate: actions.activateA, onClose: actions.closeTab, t }),
					react.createElement("div", { className: cls.paneActions },
						react.createElement("button", { type: "button", className: [cls.paneBtn, s.split ? cls.paneBtnActive : ""].join(" "), title: t("split"), onClick: actions.toggleSplit },
							react.createElement(P.IconChecklistOutline14, { size: 14 }),
							react.createElement("span", null, t("split"))),
						s.split && react.createElement("button", { type: "button", className: cls.paneBtn, title: s.splitDir === "h" ? t("splitToV") : t("splitToH"), onClick: () => actions.setSplitDir(s.splitDir === "h" ? "v" : "h") },
							react.createElement(P.IconPanelLeftOutline16, { size: 14, style: { transform: s.splitDir === "h" ? "rotate(90deg)" : "none" } }),
							react.createElement("span", null, s.splitDir === "h" ? t("splitToV") : t("splitToH"))),
						react.createElement("button", { type: "button", className: cls.paneBtn, title: t("swap"), onClick: actions.swap },
							react.createElement(P.IconPanelLeftOutline16, { size: 14 }),
							react.createElement("span", null, t("swap"))),
						react.createElement("button", { type: "button", className: cls.paneBtn, title: t("copyPath"), onClick: copyPath },
							react.createElement(P.IconLinkOutline14, { size: 14 }),
							react.createElement("span", null, copied ? t("copied") : t("copyPath"))),
						react.createElement("button", { type: "button", className: cls.paneBtn, title: t("openInApp"), onClick: () => openPath(fileA.path) },
							react.createElement(P.IconRightUpOutline16, { size: 14 })),
						react.createElement("a", { className: cls.paneBtn, href: rawUrl(fileA.path), download: fileA.name, title: t("download") },
							react.createElement(P.IconDownloadOutline16, { size: 14 })),
						react.createElement("button", { type: "button", className: cls.paneBtn, title: t("closeAll"), onClick: actions.closeAll },
							react.createElement(P.IconCloseOutline16, { size: 14 })))),
				react.createElement("div", { className: cls.paneBody },
					s.split
						? react.createElement("div", { className: [cls.splitRow, s.splitDir === "v" ? cls.splitRowV : ""].join(" ") },
							react.createElement("div", { className: cls.splitCell, style: { flex: `0 0 ${s.splitRatio * 100}%` } },
								previewScreen(fileA, activeA, actions.activateA)),
							react.createElement("div", {
								className: [cls.resize, s.splitDir === "v" ? cls.resizeH : cls.resizeV].join(" "),
								style: s.splitDir === "v" ? { top: `calc(${s.splitRatio * 100}% - 7px)` } : { left: `calc(${s.splitRatio * 100}% - 7px)` },
								onPointerDown: startRatioDrag,
							}),
							react.createElement("div", { className: cls.splitCell, style: { flex: "1 1 auto" } },
								previewScreen(fileB, activeB, actions.activateB)))
						: react.createElement(Body, { file: fileA, t, key: fileA.path })),
				react.createElement("div", {
					className: [cls.resize, cls.resizeV].join(" "),
					style: s.swapped ? { right: 0 } : { left: 0 },
					onPointerDown: startDrag,
				}));
		}

		// ── sidebar footer toggle (sidebar.footer.action entry) ───────────
		function TreeToggle({ wide, useStore, actions, t }) {
			const open = useStore((s) => s.treeOpen);
			return react.createElement("button", {
				type: "button",
				className: cls.toggle,
				title: t("title"),
				"aria-label": t("title"),
				style: wide ? undefined : { justifyContent: "center", padding: 0 },
				onClick: actions.toggleTree,
			},
				react.createElement(P.IconFolderClose16, { size: wide ? 14 : 18 }),
				wide && react.createElement("span", null, t("title")));
		}

		// ── spend glyph (minimal line mushroom-cloud, currentColor stroke) ──
		// FIX/CHG 2026-08-15 (session-fix): 旧版是四个实心圆拼的蘑菇云，密而糙；
		// 换成单色细线条（云帽 + 细柄 + 底座），与界面的线框图标风格一致。
		function MushroomIcon() {
			return react.createElement("svg", {
				width: 13,
				height: 13,
				viewBox: "0 0 16 16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 1.3,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": true,
				style: { flex: "none", display: "inline-block" },
			},
				react.createElement("path", { d: "M7.8 2.4c-1.9 0-3.4 1.4-3.4 3.2 0 .2 0 .4.1.6-1.2.3-2 1.3-2 2.6 0 1.5 1.2 2.7 2.7 2.7h5.6c1.5 0 2.7-1.2 2.7-2.7 0-1.3-.8-2.3-2-2.6.1-.2.1-.4.1-.6 0-1.8-1.5-3.2-3.4-3.2z" }),
				react.createElement("path", { d: "M8 10.2v3.3" }),
				react.createElement("path", { d: "M5.8 13.5h4.4" }));
		}

		// ── balance chip (shell.overlay entry, bottom-right) ───────────────
		// FIX 2026-08-15 (kimi 代改): usage 改由本组件本地 state 拉取，
		// 不再由 session 作用域的 UsageCollector 写入共享 root store ——
		// 框架强制 "one handle, one scope"（dsh-client-ui-slots），跨作用域
		// 共享同一 store 句柄会在 register 时直接抛错。当前会话 id 通过全局
		// 注入的 useSessions 钩子读取（SessionListState.current）。
		function BalanceChip({ t, useSessions }) {
			const sessionId = useSessions((s) => s.current);
			const [usage, setUsage] = useState(null);
			// FIX: 轮询当前会话的 token 用量/花费（逻辑自被删除的 UsageCollector 迁入）。
			useEffect(() => {
				if (!sessionId) { setUsage(null); return; }
				let dead = false;
				const loadUsage = () => {
					fetch("/api/explorer/usage?sessionId=" + encodeURIComponent(sessionId))
						.then((r) => r.json())
						.then((d) => {
							if (dead) return;
							if (d && typeof d.cost === "number") setUsage({ totalTokens: d.totalTokens, cost: d.cost, tokens: d.tokens });
							else setUsage(null);
						})
						.catch(() => { if (!dead) setUsage(null); });
				};
				loadUsage();
				const id = window.setInterval(loadUsage, 20000);
				return () => { dead = true; window.clearInterval(id); };
			}, [sessionId]);
			const [state, setState] = useState({ phase: "loading" });
			const load = useCallback(() => {
				setState((s) => (s.phase === "success" ? s : { phase: "loading" }));
				fetch("/api/explorer/balance")
					.then((r) => r.json())
					.then((d) => {
						if (d.error === "no-key") setState({ phase: "error", message: t("balanceUnset") });
						else if (d.error) setState({ phase: "error", message: t("balanceFailed") });
						else setState({ phase: "success", total: d.total });
					})
					.catch(() => setState({ phase: "error", message: t("balanceFailed") }));
			}, [t]);
			useEffect(() => {
				load();
				const id = window.setInterval(load, 60000);
				return () => window.clearInterval(id);
			}, [load]);
			let body;
			if (state.phase === "loading") {
				body = react.createElement("span", null, t("balanceLoading"));
			} else if (state.phase === "error") {
				body = react.createElement("span", { className: cls.balanceErr }, state.message);
			} else {
				const spend = usage && typeof usage.cost === "number" && usage.cost > 0
					? react.createElement(react.Fragment, null,
						react.createElement("span", { style: { opacity: 0.45 } }, "/"),
						react.createElement("span", { className: cls.spend, title: usage.totalTokens != null ? t("spendTitle") + " · " + usage.totalTokens + " tokens" : t("spendTitle") },
							react.createElement(MushroomIcon),
							react.createElement("span", null, "¥" + usage.cost.toFixed(2))))
					: null;
				body = react.createElement(react.Fragment, null,
					react.createElement("span", { style: { opacity: 0.75 } }, t("balance")),
					react.createElement("span", null, "¥" + (state.total !== null && state.total !== undefined ? state.total : "--")),
					spend);
			}
			return react.createElement("button", { type: "button", className: cls.balance, title: t("balance") + " · " + t("refresh"), onClick: load }, body);
		}

		// ── session usage collector — REMOVED (FIX 2026-08-15, kimi 代改) ────
		// 原实现注册在 session 作用域的 conversation.composer.dock 并共享 root
		// store 句柄，触发加载错误；其用量拉取逻辑已并入上方 BalanceChip。

		// ── update chip (shell.overlay entry, above the balance chip) ─────
		function VersionChip({ t }) {
			const [state, setState] = useState({ phase: "idle" });
			const load = useCallback(() => {
				fetch("/api/explorer/version")
					.then((r) => r.json())
					.then((d) => {
						if (d.hasUpdate && d.latest) setState({ phase: "update", latest: d.latest, url: d.url });
						else setState({ phase: "ok" });
					})
					.catch(() => setState({ phase: "ok" }));
			}, []);
			useEffect(() => {
				load();
				const id = window.setInterval(load, 6 * 3600 * 1000);
				return () => window.clearInterval(id);
			}, [load]);
			if (state.phase !== "update") return null;
			return react.createElement("button", {
				type: "button",
				className: cls.updateChip,
				title: t("updateTitle") + " · v" + state.latest,
				onClick: () => { if (state.url) window.open(state.url, "_blank", "noopener"); },
			},
				react.createElement("span", { style: { fontSize: 14, lineHeight: 1 } }, "↑"),
				react.createElement("span", null, t("updateAvailable") + " v" + state.latest));
		}

		// ── plugin body ────────────────────────────────────────────────────
		const inject = ["slots", "workspaces", "locale", "layout"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "explorer: dictionaries");
			ctx.effect(() => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "explorer-tree-toggle",
				order: 10,
				locale: NS,
				store,
			}, TreeToggle), "explorer: sidebar toggle");
			ctx.effect(() => ctx.slots.register({
				name: "shell.overlay",
				id: "explorer-layout-engine",
				order: 1,
				store,
			}, LayoutEngine), "explorer: layout engine");
			ctx.effect(() => ctx.slots.register({
				name: "shell.overlay",
				id: "explorer-balance",
				order: 5,
				locale: NS,
			}, BalanceChip), "explorer: balance chip");
			// FIX 2026-08-15 (kimi 代改): "explorer: usage collector" 注册已移除 ——
			// conversation.composer.dock 是 session 作用域槽位，而本插件的 store
			// 句柄已被 root 作用域槽位占用（"one handle, one scope"），注册必抛错。
			// 用量拉取已并入 BalanceChip（通过全局 useSessions 钩子自取会话 id）。
			ctx.effect(() => ctx.slots.register({
				name: "shell.overlay",
				id: "explorer-version-check",
				order: 6,
				locale: NS,
			}, VersionChip), "explorer: update chip");
			ctx.effect(() => ctx.slots.register({
				name: "shell.overlay",
				id: "explorer-tree-panel",
				order: 10,
				locale: NS,
				store,
				inject: () => ({ openPath: (path) => ctx.workspaces.openPath(path) }),
			}, TreePanel), "explorer: tree panel");
			ctx.effect(() => ctx.slots.register({
				name: "shell.overlay",
				id: "explorer-preview-panel",
				order: 20,
				locale: NS,
				store,
				inject: () => ({
					openPath: (path) => ctx.workspaces.openPath(path),
					closeDetails: () => ctx.layout.closeDetails(),
				}),
			}, PreviewPanel), "explorer: preview panel");
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
