# 下一轮维护计划 / Next maintenance iteration

目标：14.0.1（候选分支已同步版本字段，尚未发布；旧标签保持不变）。

## 已实现 / Implemented

教师管理库支持按学号查找（忽略大小写和首尾空白）；CSV 将学号与内部学员编号分别导出，已有加密档案格式不变。重新构建离线 HTML。显式配置目录隔离学习存档；机器人课堂只高亮自己的入口并提供 aria-current，项目页保留可见页脚；页脚版本同步 14.0.1。

## 当前云实例验证 / Current cloud validation

build.cjs; robotics core (7 groups); integration-v14 (5 groups); manager-v11 (8 groups); archive compatibility (4 groups); workflow-v14; manager storage (6 groups), 19 storage-upgrade cases, profile isolation and installer identity checks passed. Navigation/shell regression now covers all eleven routes, robotics deep links, both languages and reduced motion (7 groups) with the actual software vector renderer; no uncaught DOM errors.

The maintenance-branch portable regression passed on GitHub and locally on Node 22.23.5. The previous candidate passed the complete Windows build, production protected save/reopen, native protection, installer fixture and source/privacy/package gates; the updated candidate must pass again. Windows packaging requires the explicitly prepared, corresponding-source-compliant offline flashing bundle; it cannot be substituted with a developer personal Arduino environment.

## 建议优化 / Recommended follow-up

后续优先：按筛选结果导出汇总、学员复习入口、无障碍键盘操作。原生保护密钥/存档升级/安装生命周期必须另行验收。

## 发布条件 / Publication gates

必须由同一提交的 portable 和 Windows candidate CI 全部成功。新标签触发仓库内发布工作流，核验仓库身份、版本推进、不可变标签、两个安装包摘要及对应源码；附件上传后再次核对大小和 SHA-256，再公开 Release。历史 Release、标签和附件不可覆盖。当前本机 API 限制不影响已验证的 GitHub 原生发布流程。

本文件记录源码改进和实际执行范围，不表示新版本已经发布，也不将软件/模拟测试称为实板或手机验收。
