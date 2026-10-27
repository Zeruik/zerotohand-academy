# 机器人模型来源与使用范围 / Robot model provenance

本课程使用两套厂商官方公开的机器人描述与视觉模型。它们是可转动关节的三维运动学模型；课程与厂商没有隶属、认证或代言关系。品牌和产品名称用于识别模型来源。

| 模型 | 官方来源与固定版本 | 原始许可 | 使用内容 |
| --- | --- | --- | --- |
| Unitree Go2 | [unitree_ros / Go2](https://github.com/unitreerobotics/unitree_ros/tree/15ebe53f4cd77e7d745ae83b9d7ff90e685e8998/robots/go2_description), commit `15ebe53f4cd77e7d745ae83b9d7ff90e685e8998` | [BSD 3-Clause](go2/LICENSE-BSD-3-Clause.txt)；仓库根许可和 Go2 package.xml 均已保留 | 官方 URDF、12 个转动关节、7 个 DAE 视觉网格资源 |
| Universal Robots UR5 | [Universal_Robots_ROS2_Description](https://github.com/UniversalRobots/Universal_Robots_ROS2_Description/tree/81f7c9fe003c2f0e02eec5a7253f1b262ad38b61), commit `81f7c9fe003c2f0e02eec5a7253f1b262ad38b61` | [BSD 3-Clause](ur5/LICENSE-BSD-3-Clause.txt)；原始 README 说明了例外型号，UR5 不在例外清单中 | 官方 xacro 与 UR5 名义参数展开的 URDF、6 个转动关节、7 个 DAE 视觉网格资源 |

## 离线处理

- `src/robot-assets-v8.js` 内嵌真实视觉几何，不是以碰撞盒或几何积木替换的外观。共保留 292,530 个源三角面；四足机器人重复使用的腿部网格在显示时复用。没有加载纹理、CDN 或远程模型的运行时请求。
- 每个网格部件的坐标使用包围盒内的 16 位量化，法线使用归一化 8 位量化，相同位置与法线合并索引。三角面数量和材质分组保留；转换会产生有限的量化误差，不是原始 CAD 精度。
- 原始 Collada 节点变换和单位先应用到几何。保留 URDF 的米和弧度，以及原生 x/y/z 坐标；仅最外层显示组将 z 向上转换为网页的 y 向上，并调整显示尺寸。材料使用原始颜色，显示层调整金属度和粗糙度。
- `manifest.json` 记录每个原始网格文件的路径、字节数、SHA-256、三角面数量，以及来源提交和 URDF 摘要。原始 DAE 文件未重复装入发布包；其压缩几何随 JavaScript 和单文件 HTML 一起分发。
- Go2 的 `robot.urdf` 为原始描述。UR5 使用 xacro 2.1.1、`ur_type=ur5`、`name=ur5`、`force_abs_paths=false`、`smart_panel=false` 与官方默认 UR5 参数展开。仅替换了自动生成注释中的本机构建路径。UR5 的原始 xacro 和 YAML 保存在 `ur5/upstream/`。
- 这些 URDF 用于课程溯源。它们仍含原始 ROS package mesh 引用，网页通过内嵌几何表解析；本目录不是可以直接启动的完整 ROS 描述软件包。重建课程网页使用已经生成并附带的 JavaScript，不需要 ROS、Python 或网络下载模型。

## 教学边界

所有角度都受到该版本 URDF 的关节限位约束。页面显示关节树、局部坐标轴、姿态预设和正向运动学的末端坐标。预设之间的动画是关节角插值，不能作为真实控制程序使用。

Go2 不求解地面接触、碰撞、力矩、平衡或稳定步态。最低脚点与桌面对齐是显示处理。UR5 使用名义参数，并非任何一台实物的标定参数；不验证碰撞、载荷、轨迹安全或真实控制器行为。

## Redistribution

The original BSD 3-Clause copyright notices, conditions and disclaimers are retained in each model's license file and embedded in the generated robot asset module. Preserve those notices when redistributing the source, HTML or application. The upstream UR5 README is retained to make its model-specific licensing distinctions inspectable; this package contains the legacy UR5 visuals, not the specially restricted newer models or smart panel.

Both models are used for joint kinematics and pose interpolation only. Original visual triangle topology is retained with quantized vertex data. The course does not implement rigid-body dynamics, balance, collision checking, validated gait, physical-robot calibration or certified motion control. The robot names identify the upstream assets and do not imply endorsement.
