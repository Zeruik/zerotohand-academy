# 12.0.0 — 赋形工作室学院 / ZTH Studio Academy

面向用户的版本说明；不包含开发日志、个人学习资料或本机路径。
Public release notes, without developer logs or personal/machine data.

## 学习内容与入口 / Learning content and entry

- 学院更名为“赋形工作室学院 / ZTH Studio Academy”，用电控、机械、编程、运营四条赛道组织课程与项目。保留电子优先和按需补习的基础内容。
- 课程从124节增加到156节：12节机械、6节运营、14节编程/自主系统。先修关系、任务、例子、双语自检与交付标准随课提供。
- Python补齐保存文件、if/缩进、完整平均值/CSV脚本及错误诊断；视觉/机器人内容增加具体数据、标签、计算、命令和失败情况。
- 机械与运营增加5类课内操作台：几何、旋转体、关节、切片估算、版式。自主系统增加5类：标注、指标、平面变换、栅格地图/规划、动作相位。原30个主要实验台继续保留。

The renamed Academy organizes 156 lessons into four tracks. It adds 12 mechanical,
6 operations and 14 programming/autonomy lessons, with prerequisite links,
examples, tasks, bilingual checks and acceptance criteria. Python now starts with
complete runnable examples rather than isolated syntax. Five mechanical/operations
and five autonomous-system lesson modes complement the original 30 main workbenches.

## 数据与兼容 / Data and compatibility

- 应用版本升到12.0.0，学员档案schema 9、应用ID及Windows本机保护上下文保持兼容。
- 继续区分个人完整备份、主动进度分享和独立管理库；不会自动采集别人的进度。
- 标注图片/形状单独导出JSON项目，不假装被.zth保存；切换/关闭按实际状态提示未保存风险。
- 延续升级备份、降级阻止、显式存档迁移、默认保留存档的卸载流程；学院不修改系统PATH。

App 12.0.0 retains archive schema 9, application identity and Windows protection
context. Full personal backups, progress sharing and management data remain
separate. Annotation images/contours require their own JSON project. Existing
upgrade backups, downgrade protection and conservative uninstall behavior remain.

## 独立工具 / Independent companion projects

- **ZTH Screen Studio 1.0**：真正的离线显示屏编辑器，支持组件、页面、链接、预览、撤销重做和项目文件，导出Arduino工程与实际字形/图片资源。S3/ST7789、C3/ILI9341、S3/SSD1306导出已实际编译；不声称完成实体板卡测试。
- **ZTH Studio Forge 1.0**：只读环境检测与计划预览，用户确认后才执行受控WSL/Ubuntu/ROS/微软安装任务。第三方大组件需网络或明确缓存，取消不等于系统回滚。
- 两个项目代码为MIT，与学院原有非商用课程许可独立；第三方库、机器人资产、工具链和研究资料各自保留原许可。

Screen Studio exports actual firmware projects and resources, with compilation
checks for three display/ESP32 combinations. Forge previews environment plans and
requires confirmation for system changes. Their MIT code licenses do not change
the Academy content license or third-party terms.

## 验收范围 / Acceptance boundary

课程结构、公式、数据读写、输入限制、页面交互和适用的生成代码编译可自动检查。
真实浏览器、安装/升级和不同电脑还需对应检查；真实仪器、板卡、触摸、机器人和
飞行器必须独立验收。视觉台不训练模型，栅格台不是SLAM/Nav2，动作台不是强化
学习训练，机械台不是完整CAD/有限元/切片软件。详见SCOPE-v12.md。

Automated checks cover course structure, calculations, persistence, validation,
interaction and generated-code compilation where applicable. They do not prove
physical hardware, calibrated robot control or successful research reproduction.
See SCOPE-v12.md for the exact division of responsibilities.
