<p align="center">
  <img src="https://img.shields.io/badge/DeepSeek%20Harness-plugin-4d6bfe?style=for-the-badge&logo=github" alt="DeepSeek Harness plugin">
  <img src="https://img.shields.io/github/v/tag/ZrSiO4-y/dsh-explorer?label=version&style=for-the-badge" alt="version">
  <img src="https://img.shields.io/github/license/ZrSiO4-y/dsh-explorer?style=for-the-badge" alt="license">
</p>

<h1 align="center">📁 dsh-explorer</h1>

<p align="center">
  <b>DeepSeek Harness 的 VS Code 风格文件资源管理器</b><br>
  侧边栏文件树 + 多标签预览面板 · 纯插件架构 · 官方包零改动
</p>

<p align="center">
  <sub>一键安装，打开就能用 —— 像在 VS Code 里浏览项目一样浏览你的工作区</sub>
</p>

---

## ✨ 特性

**🗂️ 侧边栏文件树**
- 嵌入侧边栏下半区，不遮挡会话列表，拖动把手调节上下比例
- 文件名实时搜索、按名称/大小/时间排序、隐藏项与依赖目录一键过滤
- 完整右键菜单：预览、系统程序打开、分屏、复制路径、重命名、新建文件/文件夹、删除
- 键盘导航（↑↓ 移动、→ 展开、← 折叠、Enter 打开、F2 重命名、Delete 删除）

**🖥️ 多标签预览面板**
- 多标签多开、分屏对比（左右/上下）、换边、拖宽，状态自动记忆
- 点击文件即预览，对话自动让出空间，绝不额外占屏

**🔬 丰富预览格式**

| 格式 | 预览方式 |
| --- | --- |
| 代码 / 文本 | shiki 语法高亮 + 行号 + 文件内查找 |
| 图片 | 适应窗口、滚轮缩放（以鼠标为中心）、拖动平移 |
| PDF | 浏览器内嵌 |
| PPT / PPTX | 服务器端转 PDF，100% 保真 |
| Markdown | 渲染预览 |
| CSV / Excel / Word | 表格 / 文档渲染 |
| 压缩包 (zip) | 浏览包内文件并预览内层 |
| 音视频 | 内嵌播放器，支持进度拖动 |

**🔍 更多**
- 文件名递归搜索整个工作区
- 🎈 余额胶囊：右下角实时显示账户余额
- 🆕 自动更新提示：有新版本时右下角提醒

## 🚀 安装

```sh
dsh plugin --profile web add github:ZrSiO4-y/dsh-explorer
```

装完重启 `dsh --profile web`，刷新页面即可。

## ⚙️ 配置工作区

插件只浏览你配置的目录。编辑你的 profile `cordis.patch.yml`（通常在 `%USERPROFILE%\.dsh\profiles\web\cordis.patch.yml`），加上：

```yaml
- id: explorer
  config:
    roots:
      - 'D:\你的项目'
      # - 'E:\另一个目录'   # 可配置多个
```

> 💡 文件只在你本机预览，不会上传到任何服务器。

## 🆕 更新

有新版本时，界面右下角会自动提示。重新执行安装命令覆盖即可：

```sh
dsh plugin --profile web add github:ZrSiO4-y/dsh-explorer
```

## 🧱 技术栈

纯 Cordis 插件（官方 bundle 形态）· React 客户端 · 零改动官方包

<!-- 想放一张界面截图？上线后取消下面的注释即可：
<p align="center"><img src="https://你的截图地址" alt="screenshot" width="720"></p>
-->

## 📄 License

[MIT](LICENSE)
