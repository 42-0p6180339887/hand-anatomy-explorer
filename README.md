# 指间 · 攀岩身体日志 v2.1

面向抱石、运动攀岩和其他攀爬训练的全身伤情与症状变化记录工具。

**在线使用：** <https://42-0p6180339887.github.io/hand-anatomy-explorer/>

## 可以做什么

- 全身定位：手指、手腕、手掌、肩、肘、腰背、髋、大腿、膝、踝、足、头颈及其他部位；记录侧别、精细位置与发生机制。
- 三个入口：我的伤情、身体部位、解剖与帮助。
- 保留症状与功能变化、就医提醒，去掉训练记录、负荷统计及训练反馈。
- 多处伤情独立建档：追踪疼痛、日常功能、症状变化和专业人员给出的计划；支持归档和重新追踪。
- 导出就医摘要、JSON 备份 / 恢复；虚构示例与真实数据分开。
- 旧版 48 项手部结构和 10 项检查教学内容保留在 [三维图谱](https://42-0p6180339887.github.io/hand-anatomy-explorer/anatomy.html)。

旧版训练数据不再展示或参与提醒，仅保留在本地存储和 JSON 备份中；更新不会自动删除它。旧的 `#training` 和 `#recovery` 链接跳转到我的伤情。

## 使用边界与隐私

**记录与就医沟通工具，不提供诊断、受伤概率、康复处方或复攀许可。** 提醒规则未经过临床验证；没有触发提醒不代表没有风险。具体规则、阅读范围与资料对应见 [CARE-EVIDENCE.md](CARE-EVIDENCE.md)。

健康记录保存在当前浏览器本地，不上传、不跨设备同步；本地存储未加密。请定期导出备份，清理浏览器数据或隐私模式结束可能丢失记录。没有后台通知，提醒仅在打开应用时显示。多人共用浏览器不适合保存私人健康记录。

## 构建与验证

```sh
cd source
npm install
node --test care-logic.test.mjs
npm run build
```

构建生成两份自包含网页：`docs/index.html` 为身体日志，`docs/anatomy.html` 为三维解剖。两者与资料文件保存在同一目录，适用于 GitHub Pages；也可整包下载后在现代浏览器中打开，文件方式存储行为依浏览器而异。身体日志无需 WebGL，三维图谱需要支持 WebGL 的浏览器。

GitHub Pages 沿用 `main:/docs`。修改后将 `source/` 与构建后的 `docs/` 一同提交。`docs/CARE-EVIDENCE.md` 与根目录证据表保持相同。

本次功能与浏览器验证见 [ACCEPTANCE-v2.md](ACCEPTANCE-v2.md)。解剖来源保留在 [SOURCES.md](SOURCES.md)。

## 来源与许可

骨网格来自 Z-Anatomy 分发的 `SkeletalSystem100.fbx`；本项目提取并调整了手部网格的方向、比例和位置。改编的解剖模型及教学图示依现有声明按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 提供。上游署名包括 BodyParts3D / Kousaku OKUBO，以及 Z-Anatomy / Gauthier KERVYN、Marcin ZIELINSKI、Lluís VINENT。

Three.js 使用 MIT 许可。完整上游许可与署名保存在本仓库及发布目录；详情见 [第三方声明](THIRD_PARTY_NOTICES.txt)、[上游署名](Z-Anatomy-ATTRIBUTION.txt)和[上游许可全文](Z-Anatomy-LICENSE.txt)。
