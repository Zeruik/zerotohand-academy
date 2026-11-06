# 使用范围与验收边界 / Scope and acceptance — 12.0

本文描述产品能做什么、资料保存在哪里，以及哪些结论需要另行验证。它是用户说明，不是内部测试日志。
This is product scope documentation, not an internal QA log.

## 产品之间的区别 / Product boundaries

| 产品 / Product | 在产品内完成 / Implemented | 仍需外部完成 / Separate work |
|---|---|---|
| 赋形工作室学院 / ZTH Studio Academy | 156课、四赛道、30个保留主操作台，5类机械/运营与5类自主课内模式；学习与离线管理 | 真实开发环境、器件/机器人验收、数据采集、训练和制造 |
| ZTH Screen Studio | 实际画布编辑、页面交互、项目保存与可编译代码/资源导出 | 安装固件依赖、选定真实模块、接线、烧录、触摸驱动和实物性能测试 |
| ZTH Studio Forge | 检测、计划与确认后的固定系统安装动作；工程配方 | 可能的管理员权限/重启/网络、真实环境独立验证、项目业务实现 |

学院原创课程保持LICENSE-ZH.txt。Screen Studio与Forge代码是独立MIT项目；品牌与第三方内容另有权利，不互相覆盖。
The Academy retains its original license. Screen Studio and Forge are separate MIT code projects; third-party and brand rights remain separate.

## 学院模型的边界 / Academy model boundaries

| 模块 / Module | 可检验内容 / What it demonstrates | 不声称 / What it does not claim |
|---|---|---|
| 电路、元件与仪器 / Circuits and instruments | 题目指定模型下的数值、连接条件、功能/量程/插孔与排错 | SPICE等价、实物额定值、所有寄生/热/故障因素或安全认证 |
| 三维机器人与无人机 / 3D robots and drones | 公开模型几何、运动学、姿态/路线回放 | 接触/碰撞/力矩/平衡/气动/真实飞控求解 |
| 终端、C、IDE、OTA教学 / Software teaching benches | 虚拟文件、受限语句、流程状态、前提与失败分支 | 任意真实Shell/C/Python运行、后台联网、自动操作真实IDE或板卡 |
| 机械与运营课内台 / Mechanical and operations | 几何/孔位、旋转体、关节、层数/参数估算与版式 | 通用CAD、有限元、可直接送机的切片/加工文件、实际平台自动发布 |
| 图片标注 / Annotation | 用户导入的图片、框与简单多边形、独立JSON与标签文件 | 自动分割/检测、训练、复杂多环/孔洞语义的通用标注器 |
| 指标 / Metrics | 给定框IoU、给定计数的precision/recall | 完整数据集mAP评测或模型质量认证 |
| 相机与变换 / Camera and transforms | 针孔关系、单位、平面旋转/平移与方向检查 | 从单张像素直接恢复距离、真实三维手眼解算或安全抓取 |
| 地图/导航 / Mapping and navigation | 已知位姿的扫描更新、未知/空闲/占据、四邻域A*与膨胀 | 位姿估计、回环优化、SLAM/ROS运行时、Nav2控制器或底盘动力学 |
| 动作/研究阅读 / Motion and research | 相位、滞后、误差、奖励概念、原论文与复现差距 | 策略训练、论文权重内置、原算法复现、论文算力耗时保证 |

总课数不等于每课都有独立仿真器。矩形框与多边形同属标注模式，不应分别作为两个完整平台统计。
Lesson count is not simulator count. Box and polygon tools belong to one annotation mode.

## 真实编译与真实硬件 / Compilation versus hardware

学院桌面版保留一个明确区分的真实USB助手：使用包内工具链，先编译，再选择实际端口并确认烧录。
它与教学IDE/OTA台不同；串口驱动、具体Flash/PSRAM、USB实现、启动脚和实物连接仍需按板卡核对。

Screen Studio实际导出含中文位图、图片和页面接口的Arduino代码，固定使用Adafruit GFX 1.12.1、BusIO 1.17.2、ST7735/ST7789 1.11.0、ILI9341 1.6.2、SSD1306 2.5.15。已以ESP32 core 3.3.10编译链接S3 N16R8/ST7789+SD、C3/ILI9341+SD、S3 Mini/SSD1306样例。没有接触真实屏幕/板卡，不把编译通过写成实物成功。

Static text is exported as raster resources using fonts available on the export computer. Dynamic numeric text uses the GFX built-in font; its preview glyphs are approximate. RGB332 is palette quantization transmitted as RGB565. Real touch requires an actual controller, calibration and an explicit input hook. Suggested GPIO presets cannot identify every clone board called Mini. Direct TFT redraws may flicker; measure and adjust refresh behavior on hardware.

The Academy's explicitly confirmed USB helper is separate from its simulated IDE/OTA workspaces. Screen Studio itself does not enumerate serial ports or flash devices. Compiling a generated project verifies compiler/library compatibility, not electrical wiring or physical behavior.

## 保存与分享 / Persistence and sharing

| 资料 / Data | 保存方式 / Storage | 分享前 / Before sharing |
|---|---|---|
| 个人学习 / Personal learning | 本机learning-store.zthdb；可移植口令加密.zth；浏览器站点存储 | 区分完整备份与进度分享；保管口令 |
| 管理副本 / Management | 独立口令加密manager-store.zthdb；.zthm备份 | 征得分享同意；CSV是明文；删除不追溯清除外部副本 |
| 学院标注 / Academy annotation | 当前会话的图片/形状，另存独立JSON项目 | .zth不包含图片/形状；确认JSON已保存后再离开 |
| Screen Studio工程 / Screen projects | 独立本地缓存；.zthscreen JSON含内嵌图片；导出ZIP | 缓存和工程文件未加密；检查自己放入的文字、图片及其权利 |
| Forge计划与任务 / Forge plans and jobs | 本机或内存中的检测、路径、计划、日志/缓存 | 可能含个人目录与电脑信息，分享前自行去除 |

应用12.0保留schema 9和Windows保护上下文。升级前导出并验证.zth/.zthm；卸载默认保留档案与保护材料。
不能把Local State当普通缓存清理，也不能以修改版本号的方式迫使旧程序写入新版记录。

App 12.0 retains schema 9 and existing Windows protection identity. Back up portable archives before upgrades or OS changes. Deleting an installed app is not proof that all previously exported copies, logs, backups or third-party environments are gone.

## 网络与系统变更 / Network and system changes

学院日常学习、管理和Screen Studio编辑可离线进行。外部资料、可选天气、首次固件依赖、模型权重与真实开发环境安装是另行触发的联网行为。学院不自动上传学员记录，Screen Studio没有遥测或云保存。

Forge先展示只读检测与计划。深度检查已有WSL可能启动它，因此单独确认；导入新发行版、配置ROS或执行微软安装器属于真实系统动作，必须按计划确认。需要管理员时不会假装无需权限；需要重启时不自动强制重启。取消安装不是回滚，卸载Forge不删除Linux发行版、ROS、VC++或Build Tools。

本地rootfs可以减少Ubuntu镜像下载；ROS apt软件源和微软安装组件不因此自动变成离线。Forge不使用浏览器爬取安装器，不以来源不明镜像替代校验失败的官方下载。不把缓存校验误写成全链路软件可信度证明。

Daily Academy learning/management and Screen Studio editing work offline. Forge system actions require plan review and confirmation; third-party components may still need network, privileges and reboot. A verified rootfs cache is not a fully offline dependency mirror. Cancellation does not undo completed changes, and removing the assistant does not remove environments it helped create.

## 验收如何解释 / How to read validation

自动测试可以覆盖课程引用/先修/答题、公式、项目文件完整性、权限边界、存储升级、页面操作以及实际编译。JSDOM检查不是截图，截图不是安装验证，编译不是烧录，仿真不是实物。

发布时应按当前文件构建并检查安装包/ZIP清单与隐私。开发截图、日志、临时路径、测试浏览器资料、真实存档和下载缓存只留在私有工作区，不随公开源码或应用分发。本说明不列本机路径或测试学员身份。

Tests have distinct scopes: DOM tests do not prove appearance; screenshots do not prove installation; compilation does not prove flashing; simulated feedback does not prove hardware safety. Release checks must inspect the actual current installer/ZIP and exact public inventory. Developer evidence stays private.
