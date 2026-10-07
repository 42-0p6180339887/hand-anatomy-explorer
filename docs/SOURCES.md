# 来源、许可与模型边界

核对日期：2026-10-03。以下资料用于核对一般解剖及检查动作，不构成针对个人的医学判断。

## 骨模型

采用 [LluisV/Z-Anatomy](https://github.com/LluisV/Z-Anatomy) 的 `PC-Version/Resources/Models/FBX/SkeletalSystem100.fbx`。下载地址：[原始 FBX](https://raw.githubusercontent.com/LluisV/Z-Anatomy/PC-Version/Resources/Models/FBX/SkeletalSystem100.fbx)。使用其中 19 个右手掌骨和指骨网格，另新增 8 个右腕骨网格，共 27 个。没有引入其他器官资源。

保留上游要求的署名：

- **BodyParts3D — The Database Center for Life Science — CC-BY-SA 2.1 Japan**。原始模型作者 Kousaku OKUBO。[原始项目](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html)
- **Z-Anatomy — The libre 3D atlas of anatomy — CC-BY-SA 4.0**。Gauthier KERVYN（设计、3D、解剖），Marcin ZIELINSKI（Blender 插件），Lluís VINENT（Unity 应用分发）。[上游署名说明](https://github.com/Z-Anatomy/Models-of-human-anatomy/blob/master/License.txt)

改动：提取指定网格，应用原场景变换；依据骨两端点簇重定向长轴；每块骨分别归一化，再按教学手形重排与缩放；合并重合顶点、一次 Loop 细分及平滑法线；左右手通过镜像切换。因此保留的是骨轮廓来源，而非原始整手的精确几何、比例、接触面配准或个人形态。原始网格名保存在 `source/bones.json` 及 `source/wrist-bones.json`。腕骨按原场景坐标变换后归一化，教学重排为两排；并非整腕影像配准。桡尺骨远端与钩骨钩强调部分为程序轮廓。

软骨覆盖区、皮肤包络、软组织及检查动作图为本项目程序建模/绘图。它们以文献核对的关系为基础，不是原始扫描分割，也不宣称达到手术定位精度。改编模型和图示按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 提供。上游许可原文与署名一并保存。

## 解剖依据及落实方式

| 结构 | 主要依据 | 模型中的落实与简化 |
|---|---|---|
| MCP 骨面、伸肌装置、矢状带、掌侧组织 | [Fenech, 2023, Boxer's knuckle](https://pmc.ncbi.nlm.nih.gov/articles/PMC10716571/) | 伸肌走背侧；中央束及两侧束概括连接；矢状带绕 MCP。深浅层与精细腱帽纤维合并。 |
| FDS/FDP 与腱鞘 | [Ultrasound anatomy of the fingers, 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7418857/)；[Flexor tendon injuries, 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6739511/) | FDS 在掌部浅于 FDP，分叉后两束止于中节；FDP 继续至远节。Camper 交叉概括表示。 |
| A1/A2 | [López-Casero 等, 2024, 192 指解剖研究](https://pubmed.ncbi.nlm.nih.gov/38419199/) | A1 位于 MCP 掌侧，A2 沿近节指骨；宽度、厚度为示意，未宣称固定尺寸或统一形态。 |
| 关节囊、掌板、侧副韧带 | [MCP collateral ligament reconstruction and anatomy](https://pmc.ncbi.nlm.nih.gov/articles/PMC2603350/) | 囊从掌骨颈至近节基底；主侧副韧带至近节基底，副束至掌板；掌板处于屈肌腱深面。 |
| 蚓状肌 | [Biomechanical and evolutionary perspective, 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4155599/) | 从 FDP 腱起，绕桡侧至伸肌扩张；第 3/4 蚓状肌双起点概括。 |
| 骨间肌 | [Ultrasound of the palmar aspect of the hand, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10508329/) | 显示相关掌侧/背侧肌束；不作为完整肌肉分型或肌力图。 |
| 神经与血管 | Fenech 2023 同上 | 指掌外侧主干为示意；静脉仅画概括走向，未构建完整网状回流系统。 |

未照搬论文图像。配色、宽度及透明度以区分结构为目的。动画采用几何变换，不涉及本构、真实肌腱滑移量、力学接触、应变或碰撞验证。

## 检查动作依据

| 项目 | 依据 | 解释限制 |
|---|---|---|
| 掌板平移 / 稳定性 | [Jam Injuries of the Finger, 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5010131/)；[IFSSH 2012 手部运动损伤报告](https://www.ifssh.info/pdf/2012_Sports_Injuries_in_the_Hand.pdf)；[BSSH 掌板损伤说明](https://www.bssh.ac.uk/patients/conditions/1021/volar_plate_injury) | 中文名称未见统一标准。将文献所述掌向松动评估与常规被动过伸稳定性评估并列。主图为 PIP；绝不将其称为推动掌板本体。 |
| 弓弦征 | [7T MRI 离体滑车破裂研究, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8303165/)；[A2 滑车影像综述](https://pubmed.ncbi.nlm.nih.gov/34342037/) | 仅展示离骨概念；不规定统一毫米阈值，也不将不明显视为排除损伤。 |
| 钩骨钩牵拉试验 | [Wright 等, 2010, 原始 HHPT 报告](https://doi.org/10.1016/j.jhsa.2010.08.024)；[ASSH 尺侧腕痛检查课程](https://www.assh.org/annualmeeting/servlet/servlet.FileDownload?file=00P0a00000mN3NGEA0) | 腕尺偏，屈曲无名/小指抵抗牵拉。原报告仅 5 例，不宣传确定的诊断性能。不与尺腕撞击检查混同。 |
| MCP 侧副韧带 | [Hand Surgery Resource 检查说明](https://www.handsurgeryresource.net/clst)；上述 MCP 解剖文章 | 主侧副韧带在 MCP 屈曲位评估；不套用 PIP 体位或阈值。 |
| FDS/FDP | [Royal College of Emergency Medicine 检查教学](https://www.rcemlearning.org/modules/soft-tissue-injuries-of-the-hand/lessons/flexor-tendon-injuries/topic/tendon-evaluation-tests/)；[荷兰专业屈肌腱损伤指南](https://richtlijnendatabase.nl/richtlijn/flexorpeesletsel/diagnostiek_van_het_acute_flexorpeesletsel.html) | 区分 PIP 与 DIP，说明食指 FDP 独立性、小指 FDS 变异；存在主动运动仍不能排除部分损伤。 |
| A1 压痛 / 弹响 | [ASSH Handthology — Tendinopathies](https://handthology.assh.org/chapters/hand-wrist-soft-tissue/tendinopathies?sec=summary&tab=summary) | 将局部症状与运动时卡顿相联系；不将所有指根痛归于弹响指。 |

所有演示均为教育图示，不设真实力值，不模拟病理变形，不收集“阳性/阴性”让程序下诊断。由专业人员确定是否适合应力检查。主图谱已加入八块腕骨与钩骨钩，检查页可返回对应 3D 区域。

## 1.1 腕部与掌部扩展

新增 26 个可选结构条目，提供全手/手指/手掌/腕部四种观察范围。医学内容为原创概括，不复制文献图片或视频。

| 内容 | 核对来源 | 实现边界 |
|---|---|---|
| 腕骨与两排位置 | [ASSH：上肢骨骼](https://assh.my.site.com/handcare/safety/bones) | 八块源网格重排；尺桡骨远端为程序示意，不作为骨折判读工具。 |
| 腕管、正中神经、九条屈肌腱 | [ASSH：腕管](https://assh.my.site.com/handcare/condition/carpal-tunnel-syndrome) | 4 FDS + 4 FDP + 1 FPL；正中神经在支持带深面，FCR 单独走行。没有模拟神经压力或症状。 |
| 掌部肌群 | [Palmar hand ultrasound anatomy, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10508329/) | 鱼际、小鱼际按肌群简化；拇收肌以代表束表示；神经分支不完整。 |
| TFCC、Guyon 管及尺侧结构 | [ASSH 尺侧腕痛课程](https://www.assh.org/annualmeeting/servlet/servlet.FileDownload?file=00P0a00000mN3NGEA0) | TFCC 仅代表盘与连接；透明管形是通道空间；不把尺侧腕痛直接标成 TFCC 损伤。 |
| 攀岩腕部定位入口 | [Wrist Injuries in Climbers, 2023](https://pubmed.ncbi.nlm.nih.gov/37800447/) | 一所专科中心病例系列，用于提示病因多样性，非普通攀岩人群发病率。 |
| 蚓状肌与分指示意 | [Lutter 等，2018，全文](https://d-nb.info/1209741490/34) | 参照 Fig.2：握拳时被动伸环指，再同步伸中指进行比较。病例筛入依赖阳性检查，不外推准确率。 |
| 尺骨窝征 | [Tay 等，2007 原始研究](https://www.sciencedirect.com/science/article/pii/S0363502307001748) | 定位 FCU、尺骨茎突、尺骨头掌面与豌豆骨间的区域；不声称单独诊断所有 TFCC 病变。 |
| ECU 协同检查 | [Ruland & Hogan，2008](https://pubmed.ncbi.nlm.nih.gov/19084177/)；[ECU subluxation，2021](https://pubmed.ncbi.nlm.nih.gov/34602128/) | 前臂旋后、腕中立、拇指桡侧外展对抗，观察 ECU 区疼痛；不等同脱位确诊。 |

本版不提供损伤概率、临床诊断、康复处方或恢复训练许可。未做临床专家审校、影像或生物力学验证。
