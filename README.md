# ZeroToHand电子版 10.0 / ZeroToHand Electronic Edition

可以离线使用的双语工程学习应用，包含 **106 课、29 个主三维教学操作台、3 个课内基础解析台和 2 个软件教学工作区**，另有 4 个虚拟终端任务和 4 个受限 C 语句任务。路线从认识电脑、文件与命令行开始，逐步进入 C、电子电路、测量、制造、电机控制和 ROS 2 机器人基础。

建议按每周 **4–6 小时、96 周**的路线交替学习、复习和独立实践；新增专题可按先修关系穿插学习。96 周是可调整的学习计划，不表示每周都有完整授课视频，也不保证固定时长内掌握所有内容。

## 安装后就能学习

完整解压 `ZeroToHand-Academy-Windows-v10.0.0.zip`，双击 `Install-ZeroToHand-v10.exe`。向导提供中文和英文、使用许可确认、安装位置和存档位置选择；快捷方式默认勾选，可取消。安装与存档目录按页面提示使用英文路径，应用自建目录使用英文名称。桌面运行环境包含在安装包中，学习者不需要另装浏览器、Node.js 或 Python，不需要修改系统 PATH。

也可以用现代浏览器打开 `免安装版/ZeroToHand-Engineering-Academy.html`。课程、界面和模型在单文件中，日常学习不需要联网；主动打开外部参考资料或启用可选天气时才需要网络。源码仓库根目录提供同一个 HTML。

先从首页的电脑入门开始。每课先写预测，再按任务操作，记录结果并解释原因，最后检查完成标准。进度文档记录个人学习过程，不是机构颁发的资格证书。

## 可以练习什么

- **电脑与命令行**：Windows 文件、路径、压缩包与工具基础，Linux 文件和命令基础；虚拟目录中练习定位、引号、复制与相对路径，然后做真实电脑上的只读迁移任务。
- **RTOS 与有线入门**：用单步时间轴观察任务状态、抢占与等待，区分教学调度与真实 FreeRTOS；UNO R3 / Nano ATmega328P 提供有线学习路线，它们不在本版本 ESP32 真实烧录后端的目标范围。
- **C 基础**：变量、整数运算、条件与循环的可编辑语句训练。每题有三组输入用例、变量表和执行轨迹，支持预测、单步、查看终点和比较测试结果。
- **电学与仪器**：回路、元件、万用表、可调电源、RC、信号、示波器、PWM 与闭环控制。万用表的功能、量程、插孔和表笔位置独立选择；分压、电容、电感各有课内解析台。
- **元件与接线**：辨认元件引脚、观察 MOSFET 与三极管的教学状态；UART、SWD、SPI、I²C 接线台可选择端点、检查电平、供电、共地及上拉等条件，通电前先完成连接检查。
- **编程与烧录工作区**：模拟 VS Code 和 Arduino IDE 的文件树、编辑、虚拟保存、终端、构建检查、板卡/端口/库选择、上传与串口监视器。编译器缺失、语法错误、端口不符、TX/RX、供电、BOOT 和波特率问题分别给出原因，修改后可以重新检查。
- **ESP32 OTA 工作区**：先用 USB 安装含 OTA 服务的 Arduino 示例，再检查可达网络、目标和鉴权；随后学习独立的 ESP-IDF 流程，包括分区表、非活动槽、校验、重启、待确认、诊断确认和回滚。选择条件会改变结果，传输动画不代替前置检查。
- **制造与机器人**：面包板、洞洞板、焊接、钢网、回流、PCB 间距、四旋翼装配与无桨台架；平面机械臂、差速车和本地消息流程。Go2 与 UR5 使用官方公开描述及真实视觉网格，展示运动链、关节限位与姿态插值。
- **学习记录**：中英文、暖色/明亮/深色主题、独立学员、笔记、任务证据、练习草稿和路线周次。姓名、性别和生日可自行填写，后两项可不设置，不支持头像。每次提交的答题选择与检查结果保留历史；原生 `.zth` 档案强制口令加密。

## 教学模型的边界

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
- 换电脑、浏览器、移动网页文件、清理数据或卸载前先导出 `.zth`。档案使用 PBKDF2-SHA256 与 AES-256-GCM；口令不会保存，忘记后无法恢复。可导入旧 `.zthprogress` 档案；应用 10.0 继续使用第 9 版档案结构，不因应用升版更改存储格式。
- 档案含当前学员已填写的姓名、性别、生日、答题历史、笔记、任务证据、语言主题和练习草稿，请只分享给合适的人。本机自动保存与动效设置独立，不随导入改变。同编号导入会创建新编号副本，保留本地原档案。
- 进度文档只汇总学习与练习记录，不包含预测、解释或代码草稿正文，也不作为资格证书。

## 离线更新、卸载与环境

应用不在后台检查或下载更新。更新前，为每个需要保留的本地学员分别导出加密 `.zth` 并保管口令，然后正常关闭应用，完整解压可信来源的新发行包并运行安装器。新版安装器优先沿用已有安装和存档位置；运行中的应用需要正常退出，安装器不会强制终止它。

安装前，已有固定数据库文件会备份到原存档目录的 `UpgradeBackups/before-版本-时间戳/`。仅复制存在的 `learning-store.zthdb`、`.previous`、`.pending` 三种固定文件，不递归复制其他个人资料。改变存档目录须明确选择复制现有存档；目标已有数据库时停止，原目录仍保留。本机保护的数据库备份用于本机恢复，不能代替跨电脑使用的 `.zth`。

新版安装器会检查已注册版本和目标程序版本，阻止降级覆盖；过去的旧安装器无法被追溯加上此保护，因此不要运行旧包覆盖新版。当前程序识别到来自更新版本的数据库、学员记录或不认识的课程内容时停止写入，保留文件。请用相同或更高版本打开，不能靠删除备份、修改版本字段强行降级。`.previous` 只是最近一次写入的副本，不是长期版本回滚备份。

从 Windows 设置卸载会移除应用程序及相应快捷方式，**默认保留学习存档、升级备份、`storage-location.json` 和旧 AppData 中的数据**，以便重装或恢复。若要彻底清除，先分别导出所需学员、确认备份，再由你删除已核实的存档和缓存位置；旧 AppData 可能含迁移前原件，不提供一键递归抹除。导出的 `.zth`、下载代码、分享副本、剪贴板历史、外部备份和异常终止留下的临时文件也可能需要分别处理。不要递归删除混有其他个人文件的目录。

Windows AppData 下固定的 `ZeroToHand Academy` 目录还保存本机加密所需的 `Local State`，**它不是可随手删除的普通缓存**。在继续使用或恢复本机数据库时保留该目录；仅备份 Archives 中的数据库，不保证在保护密钥丢失后仍能恢复。清理、重装系统或换电脑前，以已验证可导入的 `.zth` 作为可移植备份。

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
npm ci --prefix qa/dom-runtime --ignore-scripts
npm ci --prefix qa/desktop-runtime
node build-brand-v8.cjs
node build.cjs
node qa/curriculum-v8.cjs
node qa/practice-v8.cjs
node qa/profiles-v9.cjs
node qa/store-v9.cjs
node qa/storage-path-v10.cjs
node qa/storage-upgrade-v10.cjs
node qa/protection-native-v10.cjs
node qa/archive-compatibility-v10.cjs
.\qa\desktop-runtime\node_modules\.bin\electron.cmd qa/storage-native-v9.cjs
node qa/foundations-v9.cjs
node qa/motion-v9.cjs
node qa/components-v10.cjs
node qa/wiring-v10.cjs
node qa/tooling-v10.cjs
node qa/companion-v10.cjs
node qa/flashing-v10.cjs
node qa/rtos-v10.cjs
node qa/content-v10.cjs
node qa/integration-v10.cjs
node qa/navigation-shell-v10.cjs
node qa/robotics-v8.cjs
node qa/making-v8.cjs
node qa/quality-v8.cjs
node qa/interface-v8.cjs
node qa/gallery-v8.cjs
node qa/meter-v7.cjs
node qa/installer-lifecycle-v10.cjs
```

第二条命令下载 Electron；原生存储测试通过 Electron 在 Windows 上检查本机保护接口。品牌脚本从附带原始图稿生成图标和安装器图片；`build-exe-brand-v10.cjs` 为 Windows 程序嵌入图标与产品版本，打包时从原始 Electron 重放资源编辑并比较结果；网页构建使用附带的机器人几何 JavaScript，不需要 ROS、Python/xacro 或重新下载网格。`assets/robots-v8/` 保存来源与许可，不是可直接运行的完整 ROS 软件包。

`qa/installer-lifecycle-v10.cjs` 需要本机 Inno Setup 7，在隔离目录和随机安装器 ID 下用很小的测试程序检查安装、更新、迁移、防降级和卸载；它不安装正式产品，也不能代替完整发行包的安装验收。工具链实际上传测试需要匹配的开发板，代码检查和编译测试不表示已经完成实物刷写。

测试会自行创建 `dev-notes/` 保存结果，不需要复制发布者的开发记录。`qa/integration-v10.cjs` 与 `qa/content-v10.cjs` 检查全部 106 课的双语集成、数值自检及新增内容；其他检查覆盖元件、接线、工具流程与页面集成。旧版 `qa/v5.cjs --final` 与 `qa/content-v6.cjs --final` 仍按旧课程规模检查，不作为 v10 验收命令。测试文件名保留模块版本，并不表示应用版本倒退。JSDOM、数值和几何检查不等于真实浏览器、原生安装或第二台电脑验收，实际画面和安装流程仍需单独检查。

如果要复现带真实烧录功能的离线桌面包，还需要 Arduino CLI 1.5.1 和 `esp32:esp32@3.3.10` 的安装目录及其下载归档。使用 Espressif 官方稳定索引安装该固定核心；随后运行 `node build-flashing.cjs`，或通过 `--cli`、`--arduino-data` 指定这些工具的位置。编译器与板卡库体积较大，最终用户无需自行安装；开发复现需要保留相同版本。工具链和对应源码/许可必须完成配对核验，不能把未完成的负载直接分发。

构建完整发行包前，把同版本发行 ZIP 中的整个 `ThirdPartySources/` 目录复制为源码根目录的 `dist/flashing-sources-v10/`，保留 `distribution-manifest.json` 及全部子目录，再运行工具链构建。它包含固定版本的对应源码、构建资料与许可；打包器会核对逐项哈希及与工具链的配对关系。不要把该目录改名后留在开发记录目录中，也不要用其他版本的源码清单代替。

质量检查后生成桌面负载和安装器：

```powershell
powershell -ExecutionPolicy Bypass -File build-desktop.ps1
ISCC.exe ZeroToHand-Desktop.iss
node package-release-v10.cjs --check
node package-release-v10.cjs
Compress-Archive -Path 'release/ZeroToHand-Academy-Windows-v10.0.0' -DestinationPath 'release/ZeroToHand-Academy-Windows-v10.0.0.zip' -Force
```

`ISCC.exe` 来自已安装的 Inno Setup 7；也可在 Inno 编辑器打开 `.iss` 编译。输出安装器为 `dist/Install-ZeroToHand-v10.exe`。缺少 Electron 时桌面构建会停止，先解决依赖安装问题。

打包器采用逐文件白名单，核对桌面负载、文件哈希、应用版本、安装器身份与时效，并扫描机器路径、账号及常见凭据样式。`--plan` 只列计划；`--check` 校验输入但不生成公开目录。正式更新仍由用户手动下载安装包，不自动发布或拉取远端代码。正常执行生成：

- `publish/zerotohand-academy-v10/`：手动上传 GitHub 的源码、资源、测试和锁文件。
- `release/ZeroToHand-Academy-Windows-v10.0.0/`：安装器、快速开始、使用许可、隐私说明、第三方许可、可选免安装网页，以及`ThirdPartySources/` 中单独的第三方工具链对应源码材料（不安装进应用）。

ZIP 保留一个版本文件夹作为根目录。输出目录出现清单外内容会停止，不自动删除。开发日志、QA 结果、截图、提示词、个人档案、缓存、依赖目录和 Git 元数据不进入公开目录。验证记录只留在本地 `dev-notes/`，不要上传整个开发工作区。

## 许可与来源

第三方许可与材料位置见 `THIRD-PARTY-LICENSES.txt`，Electron/Chromium 许可随桌面环境安装。Arduino、Espressif、GCC 等工具的许可保留在安装位置的 `resources/flashing-v10/NOTICE-THIRD-PARTY.txt` 和 `notices/`，完整对应源码材料随发行 ZIP 的 `ThirdPartySources/` 提供，不安装进应用。原创部分的非商用限制不覆盖这些第三方软件的原许可权利。机器人来源与转换范围见 [`assets/robots-v8/NOTICE.md`](assets/robots-v8/NOTICE.md)，其中保存官方仓库提交、原始许可及来源哈希。

Go2 来源为 [Unitree 官方 unitree_ros](https://github.com/unitreerobotics/unitree_ros/tree/15ebe53f4cd77e7d745ae83b9d7ff90e685e8998/robots/go2_description)，UR5 来源为 [Universal Robots 官方描述库](https://github.com/UniversalRobots/Universal_Robots_ROS2_Description/tree/81f7c9fe003c2f0e02eec5a7253f1b262ad38b61)。本包使用列明的 BSD 3-Clause 资源。软件工作区依据 Microsoft、Arduino 和 Espressif 官方文档编写，原始资料入口保留在课程和工作区内。厂商名称用于识别来源，不表示认证或代言。

© 2026 Zeruik / TechABJ。赋形造物是向阳科创工作室旗下专注动手制作与工程实践的工作室。原创部分按 [`LICENSE-ZH.txt`](LICENSE-ZH.txt) 提供非商用学习许可，允许免费分享完整未修改的发行包和复现原版；商业使用或应用修改须先通过 zeruik@qq.com 取得书面授权，依法不可排除的权利与第三方原许可保留。隐私与凭据处理见 [`PRIVACY-ZH.txt`](PRIVACY-ZH.txt)。

## English overview

ZeroToHand 10.0 is an offline bilingual engineering learning app with 106 lessons, 29 main 3D teaching workbenches, 3 dedicated foundation benches, 2 software workspaces, four virtual-terminal scenarios and four restricted C exercises. The suggested 96-week route combines lessons, review and independent practice at 4–6 hours per week; additional topics can be studied with their prerequisites.

The Windows ZIP includes its desktop runtime. The terminal, C stepper, IDE and OTA workspaces are explicit teaching simulations: they do not execute host commands, compile arbitrary C/C++, flash hardware or contact a network. A separate, explicitly confirmed desktop USB action uses the bundled Arduino toolchain to compile and upload firmware to supported ESP32 targets. It does not constitute hardware acceptance testing. ArduinoOTA and ESP-IDF use distinct prerequisite, transfer and recovery models. Go2 and UR5 show attributed official geometry and kinematics, not validated physical control.

Learner data stays local. Export requires a password-protected `.zth` archive; application 10.0 retains the version-9 archive schema. The commands above reproduce the app from included sources. Developer logs, personal records, screenshots and installed dependencies are excluded from the public source folder and user package.
