# 下一轮维护计划 / Next maintenance iteration

目标：14.0.1（候选规划，尚未发布；版本字段和旧标签保持当前值）。

## 已实现 / Implemented

教师管理库支持按学号查找（忽略大小写和首尾空白）；CSV 将学号与内部学员编号分别导出，已有加密档案格式不变。重新构建离线 HTML。

## 当前云实例验证 / Current cloud validation

build.cjs; robotics core (7 groups); integration-v14 (5 groups); manager-v11 (8 groups); archive compatibility (4 groups); workflow-v14; manager storage (6 groups) passed.

New portable-regression CI workflows, where present, have not yet been observed running on GitHub. They use synthetic data and do not replace native acceptance.

## 建议优化 / Recommended follow-up

后续优先：按筛选结果导出汇总、学员复习入口、无障碍键盘操作。原生保护密钥/存档升级/安装生命周期必须另行验收。

## 发布条件 / Publication gates

先完成对应平台构建与升级/数据保留验收，再同步版本字段、刷新源码清单、为新版本生成附件与 SHA-256 校验。历史 Release、标签和附件不可覆盖。当前 api.github.com 在代理 CONNECT 阶段返回 403，已将该域名加入环境配置草案；草案保存不等于运行时已应用。恢复 API 后还需核验当前用户、仓库权限、既有 Release 和候选标签是否冲突。

本文件记录源码改进和实际执行范围，不表示新版本已经发布，也不将软件/模拟测试称为实板或手机验收。
