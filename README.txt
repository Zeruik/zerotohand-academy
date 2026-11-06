赋形工作室学院 12.0 / ZTH Studio Academy 12.0
四条赛道，从具体任务走到可交接的工程项目。

一、安装与打开

1. 完整解压 ZeroToHand-Academy-Windows-v12.0.0.zip。
2. 打开其中的 Install-ZeroToHand-v12.exe。
3. 阅读使用许可，选择英文安装路径与存档路径；桌面快捷方式默认勾选，可取消。
4. 安装完成后打开“赋形工作室学院”，按自己的方向选择主赛道。

桌面版适用于 Windows 10/11 64位系统，运行环境已包含。离线学习不需要另外
安装浏览器、Node.js、Python，也不修改系统或用户 PATH。原生安装器未签名；
按设备管理要求核对来源。亦可用现代浏览器打开“免安装版”中的
ZeroToHand-Engineering-Academy.html。第一次真实 USB 烧录可能需要板卡的厂商
串口驱动，未把“应用能离线运行”当作每块板都已具备驱动的保证。

二、怎样开始学

156节课程分为电控与电子、机械设计与制造、编程与自主系统、内容与运营。
先修课程会在课内提示；电脑文件与命令行按需补习，不要求每个人先走同一路线。
保留30个主要实验操作台，另有5类机械/运营和5类自主系统课内工具。
这些是不同范围的教学计算和交互模型，不是40套完整物理仿真器。

建议每周4–6小时，交替学习、复习、独立实践与项目验收。1–2年是可调整的安排，
不是固定掌握保证；原96周参考路线继续提供。每课按“预测→操作→记录→解释→
复验”进行。完成勾选是个人记录，不是机构证书。

机械新增12课：测量基准、草图/参数、拉伸/旋转、组件/装配、工程图/公差、
紧固件、切片、校准与支架项目。运营新增6课：受众、素材、文章、视觉版式、
活动执行与复盘。编程/自主新增14课，从保存并运行Python与CSV开始，再进入
数据/标注、检测/分割、指标、YOLO、相机、手眼、抓取、建图/导航、无人机与
学习型运动。电子课程继续保留完整的电路、测量、接线、选型、焊接与排错主线。

三、操作台与真实工具要分清

三维画面支持适用场景的旋转、缩放和参数操作。动态示教有开始、暂停和停止复位。
教学终端不执行真实系统命令，C工作区是受限语句教学器，IDE/OTA台是流程模拟。
学院不在网页内启动Python、训练YOLO、运行完整SLAM/Nav2或强化学习策略。

相机台讲像素/深度关系；变换台是二维旋转平移，不是真实手眼标定求解器。
栅格台从已知位置更新地图并进行A*规划，没有位姿估计、回环优化或底盘动力学。
动作台展示相位、一阶滞后和误差，没有刚体接触或平衡求解。SuperMimic课程是
按原始资料阅读与复现准备，不内置论文模型或承诺本机训练耗时。

标注台可以编辑实际图片、矩形与简单多边形。图片和轮廓应导出为独立JSON项目，
不在.zth学员存档中；关闭、切换学员前按提示导出，并确认文件实际保存。
机械模型不代替完整CAD/有限元/切片软件，示意图不构成加工或机器人安全验证。

四、自己的学习记录

新建/编辑学员需姓名或昵称、所属组；学号、专业、学院、学校、性别和生日可选。
支持独立学员、笔记、答题历史、草稿、按月学习记录与主题/语言切换，不设置头像。
正确率只按每道题最新一次答案计算，完成勾选不加分；历史时间不会凭空补造。

默认自动保存，也可关闭后手动保存。关闭自动保存时，修改暂留内存，退出前保存
或导出。浏览器清缓存、移动网页、换电脑或卸载前，先为每个需要保留的学员分别
导出.zth。口令加密使用PBKDF2-SHA256与AES-256-GCM，口令不保存，忘记无法恢复。

导出有两种范围：
- 完整个人档案：含已填写资料、笔记、答题与草稿，适合自己备份/迁移。
- 仅进度与成绩：含姓名、组别、已填学籍信息、进度与答题结果；不含生日、性别、
  笔记、代码、草稿或任务正文，适合经同意后交给管理者。

两种都是加密.zth；部分分享不能恢复未分享资料。同编号导入建立独立副本，
不覆盖已有原件。应用版本12.0继续使用schema 9，不要求重建学员。

五、离线学员管理

管理者接收学员主动分享的.zth，输入对方提供的口令、预览并确认后加入独立库。
没有远程监控、后台收集或作者账号；刷新记录需要再次分享。可看组别/学校筛选、
完成课程、逐题历史和需要复习的内容，不能把自填资料当作认证学籍或考试防作弊。

管理副本去掉生日、性别、私人笔记、代码草稿及C/终端作答正文。管理库用自己的
口令加密，保存为存档目录中的manager-store.zthdb；导出.zthm用于备份迁移。
CSV汇总是明文，含姓名/编号/组别/学校与统计，应限制分享；删除管理记录不会
自动删除已导出的副本、备份或学员自己的原件。

六、更新、卸载与环境

更新前分别导出个人.zth和管理.zthm、保管口令，正常退出，再运行新版安装器。
保留应用ID与Windows保护目录，显示名称变更不要求删除旧资料。安装器沿用
有效位置，备份固定数据库到UpgradeBackups，并阻止新版被旧版覆盖。旧安装器
无法补上新保护，不要用旧包覆盖新版；不认识的新版资料会停止写入而非丢弃内容。

卸载默认保留学习存档、管理库、升级备份和保护上下文，便于恢复。特别是
Windows AppData中的“ZeroToHand Academy/Local State”与本机加密相关，不是
普通可随手删缓存。需要彻底清理时先核验可移植备份，再逐项确认路径；不要递归
删除混有其他资料的目录。导出的文件与外部备份需另行管理。

学院不在后台自动下载更新、不改全局PATH，卸载无需恢复环境变量。另行安装的
Arduino IDE、串口驱动、ROS或其他工具不由学院卸载。真实USB助手只在明确选择
目标和确认后写入；编译成功不等于板卡已实际验证。可选天气默认关闭，启用后按
隐私说明请求网络；学院主课程与离线管理不受影响。

七、两个独立MIT工具

ZTH Screen Studio：组件/页面编辑、链接与模拟数据、项目JSON、撤销重做、接线
检查，导出完整Arduino代码/字形图片资源/API/AI提示词。ST7789、ILI9341、SSD1306
三类导出已实际编译链接，未替代实物显示/触摸/接线测试。编辑器可离线运行，
导出固件首次编译还需对应Arduino工具与固定显示库；软件不会自动烧录。

ZTH Studio Forge：只读检测与可审阅的环境计划；真实系统安装需要明确确认，
可能需要管理员和手动重启。WSL/Ubuntu/ROS/微软组件未全部预打包，本地rootfs
缓存只减少镜像下载，ROS apt等仍需网络。取消不是回滚；卸载Forge不删除创建的
Linux环境或微软工具。两者安装包/许可独立，不扩大学院课程的修改或商用授权。

八、复现与公开分享

开发者参考README.md的固定依赖、构建与QA命令。公开源码目录是
publish/zerotohand-academy-v12；给朋友的是release下对应版本的完整Windows ZIP。
不要上传整个开发目录：学员存档、管理库、截图、日志、测试输出、临时固件、
工具缓存与Git元数据都不应放入公开文件夹。详见SCOPE-v12.md与PRIVACY-ZH.txt。

©2026 Zeruik / TechABJ。联系：zeruik@qq.com。
学院原创课程仍按LICENSE-ZH.txt的非商用学习许可；另两个项目代码为MIT。
第三方软件/模型/数据保持自己的许可，不能用本项目许可代替。

================================================================
ENGLISH QUICK START
================================================================

Extract ZeroToHand-Academy-Windows-v12.0.0.zip completely, then run
Install-ZeroToHand-v12.exe. Accept the license, choose English installation and
archive paths, and keep or deselect the default desktop shortcut. Windows 10/11
x64 desktop runtime is included; learning does not require separate Python,
Node or a browser, and the Academy does not modify global PATH.

ZTH Studio Academy has 156 lessons in electrical, mechanical, programming/
autonomy and operations tracks. It retains 30 main workbenches and adds five
mechanical/operations and five autonomous-system lesson modes. These are scoped
teaching models, not full physical laboratories. Plan around 4–6 hours per week,
with prerequisites, reviews, projects and acceptance evidence; no fixed-duration
mastery is guaranteed.

New material includes 12 mechanical, 6 operations and 14 programming/autonomy
lessons. Python begins with file creation, indentation, runnable mean and CSV
scripts, expected output and error diagnosis. Vision progresses through data,
annotation, metrics and a versioned YOLO workflow before calibration/grasping.
ROS/navigation, SITL and learned motion require their own real environments.

The Academy terminal, C stepper and IDE/OTA workspaces are teaching tools. They
do not execute host commands or arbitrary Python/C. Planar transforms are not
3D calibration; known-pose grid scans are not SLAM; phase/lag plots are not
reinforcement learning or contact dynamics. Actual annotation images/contours
must be exported as a separate JSON project; they are NOT in learner .zth files.

Learner data stays local. Display name and group are required on create/edit;
school/student fields, gender and birthday are optional. Export password-encrypted
.zth files before changing computer, clearing storage or uninstalling. Choose a
full personal backup or progress-only sharing without private notes, code,
drafts or demographics. Partial shares cannot recover omitted information.
Matching IDs import as new copies. App 12.0 retains schema 9 and existing IDs.

Offline management imports only explicitly shared archives. Its separate encrypted
manager-store.zthdb and .zthm backup use an independent password. Managed copies
omit private notes, demographics and terminal/C code bodies. CSV summaries are
plaintext identity/progress statistics. There is no remote monitoring, automatic
collection, identity certification or exam anti-cheat claim.

Back up .zth and .zthm before upgrades. Close the app and run the new installer;
it retains valid paths, creates fixed-database upgrade backups and rejects
downgrades. Uninstall retains learner data and protection context by default.
Do not casually delete the retained ZeroToHand Academy Local State file: local
database protection depends on it. Portable .zth backups are needed before OS
reinstallation or migration. No automatic background updates occur.

Screen Studio is a separate MIT visual editor that exports real Arduino code,
bitmap resources and integration documents. Three display/ESP32 combinations
have compiled and linked; real display wiring, touch and behavior remain separate
hardware tests. It does not flash devices and does not bundle every firmware
dependency. Studio Forge is a separate MIT environment planner; system changes
require explicit confirmation and may need administrator rights, network and a
reboot. A rootfs cache does not make ROS/package installation fully offline.
Cancellation is not rollback; removing Forge does not remove managed environments.

Developer reproduction instructions are in README.md. Public source is prepared
under publish/zerotohand-academy-v12. Share the complete Windows ZIP with learners;
do not publish archives, private notes, screenshots, test logs or local caches.
The Academy's original license remains LICENSE-ZH.txt; third-party rights remain
unchanged. Copyright 2026 Zeruik / TechABJ. Contact: zeruik@qq.com.
