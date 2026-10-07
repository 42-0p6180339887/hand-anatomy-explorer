# 指间 · 手部解剖探索

面向攀岩与健身学习者的中文交互式手部解剖图谱。可观察手指、手掌和腕部，切换组织图层、选择结构、查看动作相关位置，以及阅读 10 项检查动作的教学示意。

**在线地址（部署后生效）：** <https://42-0p6180339887.github.io/hand-anatomy-explorer/>

## 使用与边界

打开在线地址，或下载 `docs/index.html` 后直接用现代浏览器打开。页面已包含模型数据、样式和运行代码；初次打开需要浏览器支持 WebGL。

这是通用解剖教学示意，不是个人医学影像，也不用于诊断损伤。组织比例、精细几何与检查动画均有简化；动画不代表实测位移、组织受力或经过临床验证的模拟。检查内容用于理解医生的检查，不应用于自行反复施压或寻找阳性反应。具体模型边界和文献对应见 [SOURCES.md](SOURCES.md)。

## 目录

- `docs/`：可直接发布的完整网页，以及来源和许可文件。
- `source/`：模型数据、界面与检查动画源码、构建脚本。
- `SOURCES.md`：解剖与检查动作来源、建模方式及边界。
- `THIRD_PARTY_NOTICES.txt`、`Z-Anatomy-ATTRIBUTION.txt`、`Z-Anatomy-LICENSE.txt`：第三方许可与署名。

## 本地构建

安装 Node.js 和 npm 后，在仓库根目录运行：

```sh
cd source
npm install
npm run build
```

构建会更新 `docs/index.html`。发布目录已包含可用成品，因此访问网站无需在浏览器中安装任何依赖。`bones.json` 与 `wrist-bones.json` 已包含所需骨网格；`extract-bones.mjs` 和 `extract-wrist.mjs` 是重新提取上游 FBX 的辅助脚本，常规构建不需要 FBX 文件。

## GitHub Pages 发布

在仓库 **Settings → Pages → Build and deployment** 中选择 **Deploy from a branch**，分支为 **main**，目录为 **/docs**，保存后等待部署完成。后续更新源码时先重新构建，再将源码和更新后的 `docs/index.html` 一同提交至 `main`。

## 来源与许可

骨网格来自 Z-Anatomy 分发的 `SkeletalSystem100.fbx`；本项目提取并调整了手部网格的方向、比例和位置。改编的解剖模型及教学图示依现有声明按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 提供。上游署名包括 BodyParts3D / Kousaku OKUBO，以及 Z-Anatomy / Gauthier KERVYN、Marcin ZIELINSKI、Lluís VINENT。

Three.js 使用 MIT 许可。完整上游许可与署名保存在本仓库及发布目录；详情见 [第三方声明](THIRD_PARTY_NOTICES.txt)、[上游署名](Z-Anatomy-ATTRIBUTION.txt)和[上游许可全文](Z-Anatomy-LICENSE.txt)。
