# 赋形造物工作室学院 14.0 / ZTH Studio Academy

一个面向动手实践的离线双语工程学院。14.0 用四条清晰的学习赛道组织内容：电控与电子、机械设计与制造、编程与自主系统、内容与运营。先选择自己的主线，按先修补课，再用小项目把几组的接口连接起来；电脑操作不再占据所有人的共同起点。

本版共有 **186 节课程**。提供 **31 个主要实验操作台**，另增加 **5 类机械与运营课内操作台**及 **5 类自主系统课内操作台**。这是不同范围的教学计算、可编辑练习与视觉模型，不应把这些数字相加宣传为全功能物理仿真器。

建议每周投入 **4–6 小时**，交替阅读、复习、独立实践与项目验收；1–2 年是可调整的学习安排，不是掌握全部学科的保证。原有 96 周参考路线继续提供，四赛道按各自先修与交付物推进，不要求所有人先学完电脑基础。

## 14.0 大更新 / Major update

新增12节工作流衔接课，把单位、坐标、检测/分割、数据泄漏、评价指标、屏幕迁移、首次亮屏、交接和备份连到实际任务。单位操作台可修改输入、观察计算结果并保存在当前学员的加密练习草稿中。

Twelve new bridge lessons connect units, coordinates, detection/segmentation, leakage, metrics, screen migration, first light, handoff and recovery. Editable calculation benches retain inputs in the current learner’s encrypted drafts.

3D场景优先使用WebGL；显卡不支持时自动采用同一三维结构、坐标、镜头与控制的三维矢量绘制，明确提示简化光照和模型细分。软件仿真不代表实物验收。

3D scenes prefer WebGL and automatically use the same geometry/camera/controls through a vector renderer where GPU support is unavailable, with simplified lighting and tessellation clearly labelled. Simulation is not hardware acceptance.

以下机器人内容沿用上一大版本，并在本版继续提供：

创作者与权利人：理工阿白菌 / TechABJ（阿白菌）。为赋形造物工作室制作，关注将工程学习、动手制作与工作室运营连接起来的工具。赋形造物工作室是向阳科创工作室旗下的子工作室。公开代码账户：Zeruik。联系：zeruik@qq.com。

Created by 理工阿白菌 / TechABJ for Fuxing Zaowu Studio, a sub-studio of Xiangyang Science & Technology Studio, connecting engineering learning, making and studio operations. Public code account: Zeruik. Contact: zeruik@qq.com.

- 新增18节双语机器人课：机械臂的结构/坐标/逆解/夹持/接口/项目；机械狗的结构/步态/腿部逆解/空间目标/ROS/项目；无人机的装配/推力/混控/PD/航点/项目。每节有三段解释、示例、操作任务和可修改答案的检查题。
- 新的原创关节式3D教学模型：机械臂实际附着并搬运工件；机械狗四腿独立运动并走向点击目标；无人机四电机输出、姿态、风扰、五阶段航点和降落。近景、跟随镜头、任务路径、旋转/缩放、暂停/单步/复位可分别操作。
- 三条九阶段项目路线。先定义判据，再操作、注入失败、重复实验、保存证据，最后交接。阶段完成需要填写实际观察；程序不会把按钮点击记成硬件成功。
- 答题、反思与独立仿真报告进入当前学员的完整加密.zth。仅进度分享继续排除私有笔记和练习正文。实验报告可以另行下载JSON；报告本身不是加密存档，分享前检查内容。
- 修复抓取高度故障可能被后续动作意外修正、暂停任务继续时丢失原阶段、失效旋翼仍旋转，以及上一/下一课反思归属等问题。

The update adds 18 bilingual robotics lessons, three nine-stage project routes, articulated 3D missions, close/follow cameras, mission paths and private evidence integrated with the encrypted full learner archive. These are declared teaching models: arm geometry/attachment, flat-ground gait kinematics and simplified drone rigid-body/PD/allocation. They are neither vendor digital twins nor deployable controllers. Real contact dynamics, hardware, USB/OTA and physical flight need separate acceptance.

打开左侧“机器人三维学院”，或在“全部课程”查找新机器人课；“项目路线”提供九阶段任务。原有174节课程编号与四条赛道保留，新增12节工作流衔接课；主要实验操作台现为31个。建议每周4–6小时，学习年限按实践与复习调整。

源码复现：安装 qa/desktop-runtime/package-lock.json 中锁定的开发依赖，运行 node build.cjs。桌面打包使用 node build-desktop-v14.cjs、Inno Setup和node package-release-v14.cjs；运行时通过 desktop/runtime-lock.json 从官方归档校验。离线烧录工具链及其对应源材料需先按build-flashing.cjs准备，不能仅复制个人Arduino环境。个人运行安装包无需这些开发依赖。当前目录已有输出时构建器会保留或拒绝，不删除学习数据。

当前回归入口：node shared-robotics/qa-core.cjs、node qa/integration-v14.cjs；实际WebGL、桌面存储和安装生命周期需另行运行原生验收。仓库内旧版编号测试用于对应模块/历史版本，不应把历史整包数量断言当作14.0验收。测试日志、截图和实际学员数据不在发行包。

升级沿用原安装目录、AppId和保护密钥目录；先导出完整.zth备份并退出程序。卸载默认保留Archives及独立保护材料，不自动删学习数据，也不回滚并未修改的PATH。旧版本不认识新课程时应停止写入并提示使用新版；不要强行降级覆盖新存档。高级隔离启动参数--zth-profile-dir=<绝对目录>用于单独配置/QA，不会改变默认配置目录。


## 安装后就能学习

完整解压 `ZeroToHand-Academy-Windows-v14.0.0.zip`，双击 `Install-ZeroToHand-v14.exe`。向导按系统或上次安装语言显示中文/英文，并提供使用许可确认、安装位置和存档位置选择；快捷方式默认勾选，可取消。安装与存档目录按页面提示使用英文路径，应用自建目录使用英文名称。桌面运行环境包含在安装包中，学习者不需要另装浏览器、Node.js 或 Python，不需要修改系统 PATH。

也可以用现代浏览器打开 `免安装版/ZeroToHand-Engineering-Academy.html`。课程、界面和模型在单文件中，日常学习不需要联网；主动打开外部参考资料或启用可选天气时才需要网络。源码仓库根目录提供同一个 HTML。

先选择主赛道，电子方向从电路主线开始；不熟悉文件、工具或编程时再打开对应基础课程。每课先写预测，再按任务操作，记录结果并解释原因，最后检查完成标准。进度文档记录个人学习过程，不是机构颁发的资格证书。

安装从一个可拖动的欢迎窗口开始，后续协议、路径、快捷方式与进度页使用同一个窗口。需要指定安装语言时可运行 `Install-ZeroToHand-v14.exe /LANG=english` 或 `/LANG=chinesesimp`；应用内仍可随时切换中英文。

## 四条赛道与本版新增内容

| 赛道 | 从哪里开始 | 本版重点与交付物 |
|---|---|---|
| 电控与电子 | 回路、测量、分压与元件 | 保留 v11 强化的电路、选型、焊接、接线与排错；交付可解释的测量和修复记录 |
| 机械设计与制造 | 测量基准、草图约束、参数 | 12 节新增机械课，覆盖拉伸/旋转、组件、装配运动、工程图/公差、紧固件、切片、校准与支架项目 |
| 编程与自主系统 | 保存并运行一个 Python 小脚本 | 14 节新增课：CSV、数据/标注、检测/分割、指标、YOLO、相机、手眼、抓取、地图/导航、无人机、RL/动作模仿与研究阅读 |
| 内容与运营 | 明确受众、目标与素材来源 | 6 节新增课，覆盖文章结构、秀米/Canva 工作流、版式、活动执行与复盘 |

机械与运营的五类操作台是几何/孔位、旋转体、关节、切片估算和版式。自主系统的五类是标注、指标、平面变换、栅格地图/规划和动作相位；矩形框与多边形属于同一个标注模式，不重复计数。标注支持实际图片与独立 JSON 项目，标签导出用于对应任务，不能把检测行和分割行混在一起。

Python 课程提供从文件后缀、缩进、if、运行命令，到完整平均值函数与 CSV 脚本的步骤、预期输出和错误排查。课程代码以文本展示，不在学院网页中执行 Python。YOLO 例子区分模型系列与工具版本，并给出独立环境、训练/验证/导出命令和数据前提；权重、Python、GPU 工具与训练数据不在学院安装包内。

## 两个独立开源工具

本次同时维护两个独立软件项目，**不等于学院内部增加高权限后台**，也不继承学院原创课程的非商用许可：

| 工具 | 已实现的用途 | 使用边界 |
|---|---|---|
| ZTH Screen Studio 1.0 | 离线 ESP32 屏幕可视化编辑，组件/页面/交互预览，撤销重做，完整项目文件，导出 Arduino 代码、真实字形/图片资源、接口文档和 AI 功能提示词 | 基于固定 Adafruit 库；三类屏幕导出已做实际编译链接，不代表实物接线、触摸、颜色或刷新效果已验收；不直接烧录 |
| ZTH Studio Forge 1.0 | 只读环境检测、可审阅安装计划、明确确认后的独立 WSL/Ubuntu/ROS 与微软工具安装任务 | 会执行真实系统动作，可能需要管理员和重启；不静默操作。rootfs 本地缓存不代表 ROS apt/微软组件全部可离线安装 |

两者代码按 MIT 发布，各自说明、许可、更新与安装包独立。学院自身的许可保持不变。屏幕工具的编辑运行环境可随桌面包提供，但导出固件的首次编译需要另外安装对应工具链与库。Forge 的大体积系统组件需要官方网络下载或明确提供的可验证缓存，不把“助手离线可打开”写成“全部环境离线安装成功”。

## 可以练习什么

- **按需补习的电脑与命令行**：Windows 文件、路径、压缩包与工具基础，Linux 文件和命令基础。新增可切换 Windows/Linux 风格的虚拟文件窗口：创建文件夹和文本、选择/打开、复制/粘贴、重命名，与命令行共享同一目录。按任务整理机器人项目、核对副本并记录检查结果；练习可随个人完整档案保存，不访问真实磁盘。随后按课程完成真实电脑上的只读迁移任务。
- **RTOS 与有线入门**：用单步时间轴观察任务状态、抢占与等待，区分教学调度与真实 FreeRTOS；UNO R3 / Nano ATmega328P 提供有线学习路线，它们不在本版本 ESP32 真实烧录后端的目标范围。
- **C 基础**：变量、整数运算、条件与循环的可编辑语句训练。每题有三组输入用例、变量表和执行轨迹，支持预测、单步、查看终点和比较测试结果。
- **电学与仪器**：回路、元件、万用表、可调电源、RC、信号、示波器、PWM 与闭环控制。万用表的功能、量程、插孔和表笔位置独立选择；分压、电容、电感各有课内解析台。
- **元件与接线**：辨认元件引脚、观察 MOSFET 与三极管的教学状态；UART、SWD、SPI、I²C 接线台可选择端点、检查电平、供电、共地及上拉等条件，通电前先完成连接检查。
- **编程与烧录工作区**：模拟 VS Code 和 Arduino IDE 的文件树、编辑、虚拟保存、终端、构建检查、板卡/端口/库选择、上传与串口监视器。编译器缺失、语法错误、端口不符、TX/RX、供电、BOOT 和波特率问题分别给出原因，修改后可以重新检查。
- **ESP32 OTA 工作区**：先用 USB 安装含 OTA 服务的 Arduino 示例，再检查可达网络、目标和鉴权；随后学习独立的 ESP-IDF 流程，包括分区表、非活动槽、校验、重启、待确认、诊断确认和回滚。选择条件会改变结果，传输动画不代替前置检查。
- **制造与机器人**：面包板、洞洞板、焊接、钢网、回流、PCB 间距、四旋翼装配与无桨台架；平面机械臂、差速车和本地消息流程。Go2 与 UR5 使用官方公开描述及真实视觉网格，展示运动链、关节限位与姿态插值。
- **学习记录**：中英文、暖色/明亮/深色主题、独立学员、笔记、任务证据、练习草稿和路线周次。新建或编辑学员时填写姓名和所属组（机械、电控、编程、运营、其他）；学号、专业、学院、学校、性别与生日均可选，不支持头像。旧档案继续可读，编辑时再补齐组别。每次提交的答题选择与检查结果保留历史；原生 `.zth` 档案强制口令加密。

“学习记录”提供按月日历、笔记入口和答题正确率。日历只统计实际记录的阅读秒数、提交答案与完成标记，不补造旧版缺失的按日时长。成绩按每题最新一次结果计算；课程完成勾选不计入成绩。

## 离线学员管理

管理者可以收集学员主动导出的加密 `.zth` 档案，在管理界面输入对应口令后导入，查看课程完成情况、答题选项与历史，以及需要复习的内容。它不连接远程账号或自动获取他人学习记录；数据刷新需要学员重新导出并分享档案。完成标记与答题记录来自学习档案，不构成身份认证、考试防作弊或掌握程度证明。

管理资料独立于当前学员，导入不会把自己的学习进度替换为别人的。管理副本保留姓名/编号、组别、已填写的学号/专业/学院/学校、进度、答题和学习时间，可按组别、学校与待复习情况筛选。正确率按每题最新结果计算，完成勾选不加分。学校等字段是自行填写的信息，不验证学籍。管理副本不保留生日、性别、私人笔记和代码草稿，并删去终端/C 练习提交正文与反馈。原始完整 `.zth` 仍可能含这些信息，请只在取得学员同意后接收；优先请学员导出“仅学习进度与成绩”。管理库使用独立口令加密；导出 `.zthm` 管理备份用于迁移，忘记口令无法恢复。

桌面端管理库在所选存档目录中的 `manager-store.zthdb`，与个人学习库分开；浏览器使用当前站点本地存储。管理操作会保存独立管理库，个人学员的自动保存开关不控制它。CSV 汇总属于明文，包含学员编号、姓名、组别、学校和进度统计，不包含逐题正文，应限制分享范围；管理界面删除记录不会删除已导出的报告、他人原件或已有备份。

## 新增教学能力的准确范围

- **标注与数据**：可操作真实图片并编辑框/简单多边形，能导出项目和任务标签；不自动识别物体、不训练 YOLO。图片与轮廓需保存为独立 JSON 项目，**不包含在 .zth 学员档案中**；离开或换学员前按界面提示导出并核对。
- **视觉指标**：计算给定框的 IoU 与给定 TP/FP/FN 的比例，演示阈值概念；不把两项比例平均叫 mAP，不把人工计数当作完整检测评测。
- **相机与手眼**：讲解针孔投影、单位和变换方向；课内台是二维旋转/平移与可达范围示意，不求解真实三维相机内参或手眼外参，不验证碰撞与抓取力。
- **地图与导航**：用已知位姿投射射线，区分未知/空闲/占据，并展示四邻域 A* 与障碍膨胀；不运行 SLAM 的位姿估计、回环优化、Nav2 控制器或底盘动力学。
- **无人机**：给 PX4 SITL/QGroundControl 的角色、坐标和复现路线；学院不连接 MAVLink，不解锁真实飞行器，不发送飞行指令。
- **强化学习与 SuperMimic**：展示参考相位、一阶滞后和误差，讲解奖励/数据/验证方法，并按原始论文做阅读；没有内置策略训练、刚体接触求解或论文模型，不能声称在本机复现作者结果。
- **机械与制造**：几何和层数是明确公式的教学估算；不是完整 CAD 约束求解、有限元分析或真实切片器，不生成可直接送机的加工安全结论。

更完整的功能、保存、网络与验收边界见 [SCOPE-v14.md](SCOPE-v14.md)。这些限制用于区分“可在本软件验证的结果”和“必须在真实工具/实物继续完成的工作”。

## 保留教学模型的边界

三维外观与可交互状态用于解释原理。每课说明覆盖的现象和未模拟的因素，不能把画面当作真实设备的安全验证。

终端台是**内存中的虚拟文件系统，不是真实 Shell**，不会读取本机文件或执行系统命令。C 台是**受限整型语句教学器，不是 C 编译器**：支持初始化的 `int`、基础表达式、`if/else`、`while` 和有限 `printf`，拒绝未支持的语法，最多执行 400 步。

两个软件工作区同样是**教学模拟**，不调用真实 VS Code、Arduino CLI、编译器、串口或网络。VS Code 示例通过受限教学器计算结果；Arduino 示例执行有限语法与条件检查，ESP-IDF 示例是流程要点而非完整可编译项目。错误提示与输出来自明确的教学状态。独立的真实 C 开发环境、Arduino IDE、ESP-IDF SDK、Linux 和 ROS 2 需要按课程另外配置；桌面版专用 USB 助手已附带其支持范围内的 Arduino 编译工具链。

OTA 台使用示例网络与条件选择，不需要输入真实 Wi-Fi 名称、密码或服务器密钥。ArduinoOTA 与 ESP-IDF 的流程分别建模：普通 ArduinoOTA 更新不假定具备 IDF 自动回滚；IDF 的待确认与回滚依赖教学配置中的回滚功能和有效旧版本。跨网段目标需要显式地址及可达路由，并非所有场景都必须同网段。BOOT 引脚按示例芯片区分，真实开发板仍须查其手册。

Go2 和 UR5 的公开视觉网格经过坐标/法线量化后离线嵌入，保留三角面拓扑与材质分组。关节动画是运动学与姿态插值，不求解碰撞、力矩、接触、平衡或稳定步态；UR5 使用名义参数，不代表实物标定。Go2 提供带地面位移的运动学行走示教；四旋翼飞行模式展示起飞与给定路径，不模拟完整空气动力和飞控。ROS 台演示本地消息与超时，没有连接真实 DDS 或机器人。

## 运行、保存与换电脑

- Windows 桌面版面向 Windows 10/11 64 位系统。完整三维画面需要 WebGL 2；图形环境不可用时会提示并保留课程与可用的兼容反馈。
- 实验和传输初始待启动。暂停保留位置；停止结束当前回放并复位相应动态状态。软件工作区停止未完成的传输时保留此前已完成的虚拟固件与编辑草稿；真实刷写中断的风险须按芯片工具说明处理。减少动态效果会暂停当前动画，之后仍可手动开始。
- 安装器未签名，Windows 可能提示无法确认发布者。请核对来源并按设备管理要求处理。
- 客户端默认在安装位置的 Archives 目录保存 Windows 保护的本机数据库，可在安装时选择其他可写目录，并保留上次有效副本；浏览器使用当前站点的本地存储。默认自动保存，也可关闭后手动保存。关闭自动保存时更改先留在内存，退出前需要保存或导出。应用不自动上传资料。
- 工具工作区中的“保存文件”只把编辑内容写入**虚拟项目文件**；学员资料是否持久保存仍服从全局自动保存设置。文件、设置和预测/解释草稿可随学员档案保存；重新打开应用会重置虚拟设备固件、编译产物与进行中的传输，需要重新检查，不会把草稿当成已完成烧录。
- 换电脑、浏览器、移动网页文件、清理数据或卸载前先导出 `.zth`。档案使用 PBKDF2-SHA256 与 AES-256-GCM；口令不会保存，忘记后无法恢复。可导入旧 `.zthprogress` 档案；应用 14.0 继续使用第 9 版档案结构，不因应用升版更改存储格式。
- 导出时选择范围：完整个人档案含已填资料、笔记、答题和草稿；“仅学习进度与成绩”含姓名/组别/已填学籍信息和答题结果，不含性别、生日、笔记、代码、草稿或任务正文。两者均为口令加密 .zth。进度分享不能恢复未分享的资料，导入只创建独立副本；该来源标记在后续备份中保留。请只分享给合适的人。本机自动保存与动效设置独立，不随导入改变。同编号导入会创建新编号副本，保留本地原档案。
- 进度文档只汇总学习与练习记录，不包含预测、解释或代码草稿正文，也不作为资格证书。

## 离线更新、卸载与环境

应用不在后台检查或下载更新。更新前，为每个需要保留的本地学员分别导出加密 `.zth` 并保管口令，如已使用管理系统，也导出加密 `.zthm` 备份并保管独立口令；然后正常关闭应用，完整解压可信来源的新发行包并运行安装器。新版安装器优先沿用已有安装和存档位置；运行中的应用需要正常退出，安装器不会强制终止它。

安装前，已有固定数据库文件会备份到原存档目录的 `UpgradeBackups/before-版本-时间戳/`。仅复制存在的 `learning-store.zthdb`、`manager-store.zthdb` 及它们的 `.previous`、`.pending` 六种固定文件，不递归复制其他个人资料。改变存档目录须明确选择复制现有存档；目标已有数据库时停止，原目录仍保留。个人库依赖 Windows 本机保护，管理库使用独立口令；迁移前分别导出并核验完整个人 `.zth` 和管理 `.zthm`。

新版安装器会检查已注册版本和目标程序版本，阻止降级覆盖；过去的旧安装器无法被追溯加上此保护，因此不要运行旧包覆盖新版。当前程序识别到来自更新版本的数据库、学员记录或不认识的课程内容时停止写入，保留文件。请用相同或更高版本打开，不能靠删除备份、修改版本字段强行降级。`.previous` 只是最近一次写入的副本，不是长期版本回滚备份。

从 Windows 设置卸载会移除应用程序及相应快捷方式，**默认保留学习存档、升级备份、`storage-location.json` 和旧 AppData 中的数据**，以便重装或恢复。若要彻底清除，先分别导出所需学员、确认备份，再由你删除已核实的存档和缓存位置；旧 AppData 可能含迁移前原件，不提供一键递归抹除。导出的 `.zth`、下载代码、分享副本、剪贴板历史、外部备份和异常终止留下的临时文件也可能需要分别处理。不要递归删除混有其他个人文件的目录。

显示名称升级为赋形工作室学院后，应用ID和Windows本机保护目录保持兼容。Windows AppData 下固定的 `ZeroToHand Academy` 目录还保存本机加密所需的 `Local State`，**它不是可随手删除的普通缓存**。在继续使用或恢复本机数据库时保留该目录；仅备份 Archives 中的数据库，不保证在保护密钥丢失后仍能恢复。清理、重装系统或换电脑前，以已验证可导入的 `.zth` 作为可移植备份。

应用和离线工具使用包内固定路径，**不修改系统或用户的环境变量，也不写入系统 PATH**。编译所用的隔离环境只作用于本次子进程，结束即失效；卸载无需恢复 PATH，不会拿安装前的整个 PATH 覆盖用户或其他软件后来做的修改。另行安装的 USB 驱动、Arduino IDE 和其他开发环境不由本应用卸载。

## 可选天气与 OTA 代码生成

首页时间取自本机。天气默认关闭，点击“联网查找城市”会通过 HTTPS 向 Open-Meteo 发送输入的城市名；选择城市并启用后才请求天气；不调用设备定位。服务会接收 IP、所选城市坐标及常规请求信息，不接收学习档案。天气按 Open-Meteo 的条款与 CC BY 4.0 署名要求使用；关闭天气不影响离线课程。详见 [服务与隐私条款](https://open-meteo.com/en/terms)。

OTA 代码生成器在页面内存中处理填写的配置，不会自动烧录或验证实机。只生成代码、尚未选择真实编译时，配置仅在页面内存处理；Wi-Fi 名称、密码和鉴权值不进入学习档案的自动保存；下载或复制的代码可能含明文凭据，分享前须移除真实值。它与不需要真实凭据的 OTA 教学工作区用途不同。桌面版另有明确标示的“真实 USB 编译/烧录”：使用附带的 Arduino 工具链，支持经典 ESP32、ESP32-C3、ESP32-S3；编译成功后还要选择实际串口并确认，才向设备写入。板型不能只按外观判断，S3 SuperMini 的 Flash/PSRAM 需核对具体厂商版本。编译通过不等于已完成实物验证。

真实编译会在本机临时目录写入源代码并生成可能包含凭据的固件。编译成功后清理源码，固件上传有效期为 15 分钟；上传结束、放弃、过期或正常退出时清理相应材料；异常终止可能留下临时文件。应用不会把这些内容写入学习档案或上传作者。完整说明见 `PRIVACY-ZH.txt`。

真实 USB 助手需要 Windows 已能识别的可用 COM 口。Windows 10/11 的标准 USB CDC 设备通常可使用系统驱动；CP210x、CH340 等桥接芯片可能需要厂商驱动，本包未附这些驱动。N16R8 或 SuperMini 名称不能确定 USB 实现，因此不保证每台新电脑、每块开发板都能完全离线完成首次 USB 烧录。应用学习和附带工具链编译不依赖这些串口驱动。UNO R3、Nano ATmega328P 属于课程中的有线教学路线，不在本版真实 USB 助手的烧录目标内。

## 从源码复现

学习者只需成品安装包。开发者在 Windows 上需要 Node.js、依赖下载网络与 Inno Setup 7。当前依赖支持 Node.js 22.22.2 及以上的 22.x，或 24.15.0 及以上的 24.x；开发使用 22.23.2。两套 `package-lock.json` 固定依赖解析结果。

在源码目录根部执行：

```powershell
Push-Location qa/dom-runtime
npm ci
Pop-Location --ignore-scripts
Push-Location qa/desktop-runtime
npm ci
Pop-Location
node build-brand-v8.cjs
node build.cjs
node qa/tracks-content-v12.cjs
node qa/tracks-v12.cjs
node qa/autonomy-v12.cjs
node qa/integration-v14.cjs
node qa/archive-compatibility-v14.cjs
node qa/protection-native-v14.cjs
node qa/storage-upgrade-v14.cjs
node qa/installer-lifecycle-v14.cjs
node qa/navigation-shell-v11.cjs
node qa/electronics-v11.cjs
node qa/connections-v11.cjs
node qa/manager-v11.cjs
node qa/manager-storage-v11.cjs
node qa/learner-v11.cjs
node qa/computer-v11.cjs
node qa/robot-interaction-v11.cjs
```

桌面构建器另外从官方归档下载并校验锁定的Electron；npm只安装开发工具。以上模块检查不代替 Windows 原生存储保护验收；本机保护接口需要在 Electron/Windows 下使用隔离测试资料单独验证，不能只依据浏览器或模拟接口判断成功。品牌脚本从附带原始图稿生成图标和安装器图片；`build-exe-brand-v14.cjs` 为 Windows 程序嵌入图标与产品版本，打包时从原始 Electron 重放资源编辑并比较结果；网页构建使用附带的机器人几何 JavaScript，不需要 ROS、Python/xacro 或重新下载网格。`assets/robots-v8/` 保存来源与许可，不是可直接运行的完整 ROS 软件包。

`qa/installer-lifecycle-v14.cjs` 需要本机 Inno Setup 7，在隔离目录和随机安装器 ID 下用很小的测试程序检查安装、更新、迁移、防降级和卸载；它不安装正式产品，也不能代替完整发行包的安装验收。工具链实际上传测试需要匹配的开发板，代码检查和编译测试不表示已经完成实物刷写。

测试会自行创建 `dev-notes/` 保存结果，不需要复制发布者的开发记录。以上命令选用本版适用的模块检查，覆盖电子内容、接线、虚拟电脑、学习记录、离线管理、存档兼容和界面集成；`integration-v14.cjs` 核对本版186课、四赛道和保留的30个主要操作台；新增课内模式按独立模块检查。保留的旧测试可能带有旧课程数量或旧入口假设，不应批量运行后当作 v12 验收清单；例如四赛道首页与路线使用 `tracks-v12.cjs` 检验，不再采用旧首页的固定入口假设。测试文件名保留模块版本，并不表示应用版本倒退。`protection-native-v14.cjs` 是 Windows 专用的本机加密跨进程检查；本版已验证三个独立进程间保护数据可读，并非跨 Windows 账号或换系统恢复保证。JSDOM、数值和几何检查不等于真实浏览器、原生安装或第二台电脑验收，实际画面和安装流程仍需单独检查。

如果要复现带真实烧录功能的离线桌面包，还需要 Arduino CLI 1.5.1 和 `esp32:esp32@3.3.10` 的安装目录及其下载归档。使用 Espressif 官方稳定索引安装该固定核心；随后运行 `node build-flashing.cjs`，或通过 `--cli`、`--arduino-data` 指定这些工具的位置。编译器与板卡库体积较大，最终用户无需自行安装；开发复现需要保留相同版本。工具链和对应源码/许可必须完成配对核验，不能把未完成的负载直接分发。

构建完整发行包前，把同版本发行 ZIP 中的整个 `ThirdPartySources/` 目录复制为源码根目录的 `dist/flashing-sources-v10/`，保留 `distribution-manifest.json` 及全部子目录，再运行工具链构建。它包含固定版本的对应源码、构建资料与许可；打包器会核对逐项哈希及与工具链的配对关系。不要把该目录改名后留在开发记录目录中，也不要用其他版本的源码清单代替。

质量检查后生成桌面负载和安装器：

```powershell
powershell -ExecutionPolicy Bypass -File build-desktop.ps1
ISCC.exe ZeroToHand-Desktop.iss
node package-release-v14.cjs --check
node package-release-v14.cjs
Compress-Archive -Path 'release/ZeroToHand-Academy-Windows-v14.0.0' -DestinationPath 'release/ZeroToHand-Academy-Windows-v14.0.0.zip' -Force
```

`ISCC.exe` 来自已安装的 Inno Setup 7；也可在 Inno 编辑器打开 `.iss` 编译。输出安装器为 `dist/Install-ZeroToHand-v14.exe`。缺少 Electron 时桌面构建会停止，先解决依赖安装问题。

打包器采用逐文件白名单，核对桌面负载、文件哈希、应用版本、安装器身份与时效，并扫描机器路径、账号及常见凭据样式。`--plan` 只列计划；`--check` 校验输入但不生成公开目录。正式更新仍由用户手动下载安装包，不自动发布或拉取远端代码。正常执行生成：

- `publish/zerotohand-academy-v14/`：手动上传 GitHub 的源码、资源、测试和锁文件。
- `release/ZeroToHand-Academy-Windows-v14.0.0/`：安装器、快速开始、使用许可、隐私说明、第三方许可、可选免安装网页，以及`ThirdPartySources/` 中单独的第三方工具链对应源码材料（不安装进应用）。

ZIP 保留一个版本文件夹作为根目录。输出目录出现清单外内容会停止，不自动删除。开发日志、QA 结果、截图、提示词、个人档案、缓存、依赖目录和 Git 元数据不进入公开目录。验证记录只留在本地 `dev-notes/`，不要上传整个开发工作区。

## 许可与来源

第三方许可与材料位置见 `THIRD-PARTY-LICENSES.txt`，Electron/Chromium 许可随桌面环境安装。Arduino、Espressif、GCC 等工具的许可保留在安装位置的 `resources/flashing-v10/NOTICE-THIRD-PARTY.txt` 和 `notices/`，完整对应源码材料随发行 ZIP 的 `ThirdPartySources/` 提供，不安装进应用。原创部分的非商用限制不覆盖这些第三方软件的原许可权利。机器人来源与转换范围见 [`assets/robots-v8/NOTICE.md`](assets/robots-v8/NOTICE.md)，其中保存官方仓库提交、原始许可及来源哈希。

Go2 来源为 [Unitree 官方 unitree_ros](https://github.com/unitreerobotics/unitree_ros/tree/15ebe53f4cd77e7d745ae83b9d7ff90e685e8998/robots/go2_description)，UR5 来源为 [Universal Robots 官方描述库](https://github.com/UniversalRobots/Universal_Robots_ROS2_Description/tree/81f7c9fe003c2f0e02eec5a7253f1b262ad38b61)。本包使用列明的 BSD 3-Clause 资源。软件工作区依据 Microsoft、Arduino 和 Espressif 官方文档编写，原始资料入口保留在课程和工作区内。厂商名称用于识别来源，不表示认证或代言。

© 2026 Zeruik / TechABJ。赋形工作室是向阳科创工作室旗下专注动手制作与工程实践的工作室。原创部分按 [`LICENSE-ZH.txt`](LICENSE-ZH.txt) 提供非商用学习许可，允许免费分享完整未修改的发行包和复现原版；商业使用或应用修改须先通过 zeruik@qq.com 取得书面授权，依法不可排除的权利与第三方原许可保留。隐私与凭据处理见 [`PRIVACY-ZH.txt`](PRIVACY-ZH.txt)。

## English overview

ZTH Studio Academy 14.0 is an offline bilingual engineering learning app with **186 lessons and 31 main workbenches**, organized into electrical, mechanical, programming/autonomy and operations tracks. It retains the electronics lessons and adjustable experiments while making computer fundamentals optional support for the four tracks. A virtual Windows/Linux file window shares its tree with a limited teaching terminal: create, open, copy and rename files, then check a robot-project task without accessing real files. Existing 3D teaching workbenches and the suggested long-term route remain available.

The Windows ZIP includes its desktop runtime. The terminal, C stepper, IDE and OTA workspaces are explicit teaching simulations: they do not execute host commands, compile arbitrary C/C++, flash hardware or contact a network. A separate, explicitly confirmed desktop USB action uses the bundled Arduino toolchain to compile and upload firmware to supported ESP32 targets. It does not constitute hardware acceptance testing. ArduinoOTA and ESP-IDF use distinct prerequisite, transfer and recovery models. Go2 and UR5 show attributed official geometry and kinematics, not validated physical control.

Learner data stays local. Creating or editing a profile requires a display name and group; student ID, major, college, school, gender and birthday are optional. Existing profiles remain readable. The study calendar shows recorded reading activity, answers and completion dates without inventing missing history. Notes have a direct entry; accuracy uses the latest answer per question, independently of self-marked course completion.

Export requires a password-protected `.zth` archive; application 14.0 retains the version-9 archive schema. Choose a full personal backup, or progress-only sharing that excludes gender, birthday, notes, code/drafts and task text while retaining supplied group/student/school fields. Progress-only imports create independent learner copies, retain their partial-origin marker and cannot recover omitted information. The commands above reproduce the app from included sources. Developer logs, personal records, screenshots and installed dependencies are excluded from the public source folder and user package.

The offline manager accepts password-protected `.zth` archives explicitly shared by learners. It shows progress, answer history and latest-answer accuracy, with group and school filters, without replacing the active learner profile or contacting a server. Supplied student/school fields are self-reported. Manager records omit birth dates, gender, notes and code drafts, and remove terminal/C submission text; original full archives may contain them. A separate password protects the manager database and portable `.zthm` backups. CSV summaries are plaintext names, IDs, groups, schools and progress statistics. Deleting a managed record does not erase previously exported copies or backups.

## Version 12 learning tracks and companion tools

The app is now **ZTH Studio Academy**, with **156 lessons**, four learning tracks and the original 30 main workbenches. Its additional lesson tools have five mechanical/operations modes and five autonomous-systems modes. These are scoped calculations, editing tools and visual models, not 40 fully simulated physical laboratories.

The electrical track preserves the strengthened electronics sequence. The mechanical track adds 12 lessons from datums and sketches through solids, assemblies, drawings, fasteners, slicing, calibration and a bracket project. Programming/autonomy adds 14 lessons, starting with complete Python scripts and CSV before dataset rules, annotation, detection/segmentation, metrics, YOLO, projection, hand-eye transforms, grasping, maps/navigation, SITL and learned motion. Operations adds six lessons on audience, source material, publishing/layout tools, events and review.

Python examples include file creation, indentation, branching, a validated mean function, CSV input, expected outputs and error diagnosis. They are displayed, not executed by the Academy. Real YOLO training, ROS/Nav2, PX4 and research reproduction require separately configured environments and data. The course references Ultralytics 8.4.203 / YOLO26, ROS 2 Jazzy on Ubuntu 24.04, PX4 1.17, QGroundControl 5.1 and SuperMimic arXiv v1 as reviewed on 2026-11-06. These references do not bundle or validate all those environments.

The annotation bench edits imported images and boxes/simple polygons. **Save its separate JSON project: images and contours are excluded from learner .zth archives.** Metrics are defined calculations, the transform bench is planar, mapping uses known poses and A* on a grid, and motion compares reference phase and lag. None of these is trained vision, full SLAM/Nav2, calibrated physical grasping or reinforcement-learning policy training. Mechanical models are not a full CAD, FEA or manufacturing slicer. Read SCOPE-v14.md before transferring a result to hardware.

Two independently licensed MIT applications accompany this development effort. Screen Studio exports real Arduino sketches and raster resources for pinned Adafruit libraries; generated ST7789/S3, ILI9341/C3 and SSD1306/S3 projects have compiled and linked, without proving hardware behavior. Editing works offline; first-time firmware compilation needs separate dependencies. Studio Forge inspects Windows and prepares reviewable plans; actual WSL/Ubuntu/ROS/Microsoft installation requires an explicit confirmation and may need administrator rights, network or reboot. A cached root filesystem does not make every dependency offline. Cancelling is not rollback, and uninstalling Forge does not remove environments it helped install.

For upgrades, application 14.0 retains archive schema 9 and the existing application/storage identity. Back up personal .zth and manager .zthm archives, close the app, then run Install-ZeroToHand-v14.exe. Do not delete the retained ZeroToHand Academy protection directory or attempt to downgrade by editing version fields. Public source goes in publish/zerotohand-academy-v14; the Windows distribution is ZeroToHand-Academy-Windows-v14.0.0.zip. Developer logs, test images, local archives and tool caches are excluded.



## 14.0.0: 从课程走向可交付工程 / From lessons to deliverables

新增 12 节双语衔接课：像素/毫米/缩放、验收标准、检测框、实例轮廓、数据泄漏、precision/recall、屏幕迁移、刷新状态、首次亮屏、坐标链、交接和备份。每节含例题、操作与可保存的计算模型，已接入四条赛道和 96 周路线。原有 174 节与课程编号保留，总数 186。

Twelve bilingual bridge lessons connect units, acceptance, detection/segmentation, data leakage, metrics, screen migration, update state, first light, coordinate frames, handoff and recovery. Worked examples, operations and saved model inputs join the four tracks and 96-week route. All previous 174 lessons and their IDs remain: 186 in total.

Windows 独立学院包含原有离线 MCU 工具链。Linux/macOS 的完整学习模块、三维机器人、屏幕工程、数据审查与网站工作流由同工作室的 ZTH Studio Desk 5 提供；本仓库独立 MCU 安装器不声称为 Linux/macOS 固件工具链。

The standalone Windows Academy retains its offline MCU toolchain. The full learning module, 3D robotics, screen engineering, data review and site workflow are available on Linux/macOS through ZTH Studio Desk 5. This standalone MCU installer does not claim to be a Linux/macOS firmware toolchain.

[整合工作台 / Integrated Desk](https://github.com/Zeruik/zth-studio-desk/releases) · [环境与数据工具 / Forge](https://github.com/Zeruik/zth-studio-forge/releases) · [屏幕设计 / Screen](https://github.com/Zeruik/zth-screen-studio/releases)

自带 Noto Sans SC，字体和原始 OFL 许可位于 assets/fonts；HTML 预览须保留完整资源文件夹。应用安装包已包含字体。原始工具代码与独立标注课程内容的许可范围不同，第三方许可照常保留。

Noto Sans SC and its unmodified OFL are bundled in assets/fonts. Keep the resource folder with HTML previews; the installed app includes it. Original tool code, labelled teaching content and third-party components retain their respective terms.
