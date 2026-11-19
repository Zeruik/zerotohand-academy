# 14.0.1 维护记录与后续计划

14.0.1 已发布：[Release](https://github.com/Zeruik/zerotohand-academy/releases/tag/v14.0.1)。发布标签提交：`fc85d58608ead65e8555f829f5e2ee7112955be8`。本文件是发布后的文档更新；精确构建输入请使用发布标签。

## 本次改进

教师管理库支持按学号查找，忽略大小写和首尾空白；CSV 区分学号与内部编号。显式配置目录现在隔离学习存档，避免读取普通安装的根指针或导入其数据。机器人课堂只高亮自己的入口并设置 aria-current；课堂保留页脚，项目页的页脚位于独立滚动正文中，显示版本同步 14.0.1。

## 已完成验证

同一标签提交的 portable 与完整 Windows candidate 全部通过：双语课程/目录集成、管理、存档兼容、工作流、19 项存档升级、配置隔离、安装器版本字段及发布门槛；导航 7 组覆盖全部十一入口、机器人深链接、双语和 reduced motion，无未捕获 DOM 错误。Windows 实际生产程序渲染、受保护加密保存/关闭/重开、三进程原生保护、隔离安装器生命周期及 source/privacy/package gates 通过。

Windows 构建从 SHA-256 固定的历史 14.0.0 完整发布包中复用未改动离线工具链和对应源码，并重新构建当前程序。完整 ZIP 包含 Setup、可选独立 HTML 以及对应源码材料；优先下载完整 ZIP。

发布工作流核对上传大小和 SHA-256 后公开完整 ZIP、Setup、SHA256SUMS 三个附件。公开资产摘要、下载的清单和远端 Git 标签已独立复核。发布 CI：https://github.com/Zeruik/zerotohand-academy/actions/runs/44455907326

Windows Setup 未签名；软件验收不表示实体 USB 烧录、机器人或开发板验收。没有使用真实学习档案。升级前导出 .zth/.zthm 备份并保留保护材料。历史 Release、标签和附件保留。

## 后续优先项

按筛选结果导出汇总、学员复习入口、键盘操作和真实课堂反馈。
