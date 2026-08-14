# dsh-explorer

VS Code 风格的文件资源管理器插件（DeepSeek Harness / DSH）：侧边栏文件树 + 右侧多标签预览面板（代码/图片/PDF/音视频/Markdown/CSV/Excel/Word/zip），支持文件名搜索、排序过滤、复制粘贴、分屏对比、图片缩放、PPT 转 PDF、余额胶囊、npm 自动更新提示。官方包零改动，纯插件架构。

A VS Code-style file explorer plugin for DeepSeek Harness: sidebar file tree + multi-tab preview panel. Install as an official bundle via:

```sh
dsh plugin --profile web add github:ZrSiO4-y/dsh-explorer
```

（安装后重启 `dsh --profile web`。）

## 配置工作区（重要）

插件只浏览 `roots` 里配置的目录。默认示例是作者的 `G:\KIMI`，请改成你自己的目录——编辑你的 profile `cordis.patch.yml`（通常在 `%USERPROFILE%\.dsh\profiles\web\cordis.patch.yml`），加一行覆盖：

```yaml
- id: explorer
  config:
    roots:
      - 'D:\你的项目目录'
```

## 功能

- **文件栏**：侧边栏下半区文件树，拖动上缘把手调比例，刷新/收起
- **右键菜单**：预览 / 系统程序打开 / 左右屏分屏 / 打开所在文件夹 / 下载 / 复制路径 / 重命名 / 新建文件·文件夹 / 删除（回收站或永久）
- **预览面板**：多标签、分屏对比、换边、拖宽；代码 shiki 高亮 + 行号 + 文件内查找、图片缩放平移、PDF、PPT 转 PDF、Markdown、CSV/Excel/Word、zip 浏览内层、音视频播放
- **搜索**：顶部搜索框递归搜索整个工作区文件名
- **更新检测**：检测到 GitHub 有新 Release 时右下角提示升级

## 安全

- 只接受本机 127.0.0.1/localhost 访问，不对外暴露文件
- 路径经 realpath 校验，无法越出 `roots`
- `反重力备份/` 目录拒绝一切增删改

## 更新

作者每次发版会在 GitHub 打 Release tag（如 `v0.8.0`），你刷新页面后右下角会自动提示「新版本可用」，重新执行上面的 `dsh plugin add` 覆盖安装即可。

## License

MIT
