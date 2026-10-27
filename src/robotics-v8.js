import { ROBOT_ASSETS8 } from './robot-assets-v8.js';

// Native URDF coordinates remain x-forward/y-left/z-up, in metres and radians.
// Only the outer display group converts to Three.js y-up and classroom scale.
const TAU = Math.PI * 2;
const configs = {};
const copy = value => JSON.parse(JSON.stringify(value));
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const legPose = (thigh, calf, hip = 0) => Object.fromEntries(['FL', 'FR', 'RL', 'RR'].flatMap(leg => [
  [leg + '_hip_joint', (leg.endsWith('L') ? 1 : -1) * hip],
  [leg + '_thigh_joint', thigh], [leg + '_calf_joint', calf],
]));
const armPose = values => Object.fromEntries(['shoulder_pan_joint', 'shoulder_lift_joint', 'elbow_joint', 'wrist_1_joint', 'wrist_2_joint', 'wrist_3_joint'].map((name, i) => [name, values[i]]));
const descriptions = {
  go2: {name: ['宇树 Go2 四足机器人', 'Unitree Go2 quadruped'], manufacturer: 'Unitree Robotics', scale: 5,
    source: 'https://github.com/unitreerobotics/unitree_ros/tree/15ebe53f4cd77e7d745ae83b9d7ff90e685e8998/robots/go2_description',
    commit: '15ebe53f4cd77e7d745ae83b9d7ff90e685e8998', endpoints: ['FL_foot', 'FR_foot', 'RL_foot', 'RR_foot'],
    scope: ['官方 URDF 与视觉网格；12 个转动关节。展示关节运动学与姿态插值，未求解受力、平衡、碰撞或真实步态。地面对齐只是显示处理。', 'Official URDF and visual meshes; 12 revolute joints. Joint kinematics and pose interpolation only: no forces, balance, collisions or validated gait. Floor alignment is a display adjustment.'],
    presets: [
      {id: 'stand', name: ['站姿', 'Standing'], joints: legPose(.8, -1.6, .02)},
      {id: 'crouch', name: ['屈腿观察', 'Crouched'], joints: legPose(1.2, -2.3, .08)},
      {id: 'diagonal', name: ['对角抬腿示教', 'Diagonal pose'], joints: {...legPose(.8, -1.6, .02), FL_thigh_joint: .65, FL_calf_joint: -1.9, RR_thigh_joint: .65, RR_calf_joint: -1.9}},
      {id: 'extended', name: ['伸腿观察', 'Extended'], joints: legPose(.45, -.95, .10)},
    ]},
  ur5: {name: ['UR5 六轴机械臂', 'UR5 six-axis arm'], manufacturer: 'Universal Robots', scale: 3.2,
    source: 'https://github.com/UniversalRobots/Universal_Robots_ROS2_Description/tree/81f7c9fe003c2f0e02eec5a7253f1b262ad38b61',
    commit: '81f7c9fe003c2f0e02eec5a7253f1b262ad38b61', endpoints: ['tool0'],
    scope: ['官方 UR5 名义参数、URDF 与视觉网格；6 个转动关节。不是某台实物的标定模型，不模拟驱动力、碰撞、轨迹安全或控制器。', 'Official nominal UR5 parameters, URDF and visual meshes; six revolute joints. Not calibrated to a particular physical arm; no dynamics, collision checks, safe trajectory planning or controller simulation.'],
    presets: [
      {id: 'home', name: ['观察起始姿态', 'Home view'], joints: armPose([0, -Math.PI / 2, Math.PI / 2, -Math.PI / 2, -Math.PI / 2, 0])},
      {id: 'reach', name: ['向前展开', 'Reach'], joints: armPose([-.4, -1.0, 1.0, -Math.PI / 2, -1.1, .4])},
      {id: 'fold', name: ['收拢姿态', 'Folded'], joints: armPose([.6, -2.0, 2.2, -1.8, -Math.PI / 2, 0])},
      {id: 'side', name: ['转向侧方', 'Side pose'], joints: armPose([1.2, -1.4, 1.6, -1.7, -.8, 1.0])},
    ]},
};
for (const [id, model] of Object.entries(ROBOT_ASSETS8.models)) {
  const detail = descriptions[id];
  const joints = model.joints.filter(j => j.type !== 'fixed').map(j => ({...j, min: j.lower ?? -TAU, max: j.upper ?? TAU, unit: 'rad'}));
  configs[id] = {...detail, id, license: 'BSD-3-Clause', licenseText: model.licenseText, root: model.root, joints, jointTree: model.joints,
    linkNames: model.links.map(link => link.name), defaultPreset: detail.presets[0].id, defaultPose: copy(detail.presets[0].joints), meshMode: 'official-visual', units: {length: 'm', angle: 'rad'}};
}
export const ROBOT_CONFIG8 = configs;
globalThis.ROBOT_CONFIG8 = ROBOT_CONFIG8;

export function normalizedJoints8(id, input = {}) {
  const config = configs[id];
  if (!config) throw new Error('Unknown robot model: ' + id);
  return Object.fromEntries(config.joints.map(j => {
    const value = Number(input[j.name] ?? config.defaultPose[j.name] ?? 0);
    return [j.name, clamp(Number.isFinite(value) ? value : config.defaultPose[j.name] ?? 0, j.min, j.max)];
  }));
}
export function createRobotState8(id) {
  const c = configs[id];
  if (!c) throw new Error('Unknown robot model: ' + id);
  return {kind: id, p: {}, joints: normalizedJoints8(id, c.defaultPose), preset: c.defaultPreset,
    selectedJoint: c.joints[0].name, showAxes: true, showSkeleton: false, t: 0, run: false, on: true, history: []};
}
export function setRobotJoint8(id, state, name, radians) {
  const joint = configs[id]?.joints.find(j => j.name === name);
  if (!joint || !Number.isFinite(Number(radians))) throw new Error('Unknown joint or non-finite angle');
  state.joints = normalizedJoints8(id, state.joints);
  state.joints[name] = clamp(Number(radians), joint.min, joint.max);
  state.selectedJoint = name; state.preset = 'custom'; state.run = false;
  return state.joints[name];
}
export function applyRobotPreset8(id, state, preset = configs[id].defaultPreset) {
  const item = configs[id].presets.find(p => p.id === preset);
  if (!item) throw new Error('Unknown robot preset');
  state.joints = normalizedJoints8(id, item.joints); state.preset = item.id; state.t = 0; state.run = false;
  return state;
}
export function sampleRobotPose8(id, phase) {
  const presets = configs[id].presets, t = ((phase % presets.length) + presets.length) % presets.length;
  const index = Math.floor(t), alpha = .5 - .5 * Math.cos((t - index) * Math.PI), a = presets[index].joints, b = presets[(index + 1) % presets.length].joints;
  return normalizedJoints8(id, Object.fromEntries(configs[id].joints.map(j => [j.name, a[j.name] + (b[j.name] - a[j.name]) * alpha])));
}

// Independent row-major rigid transforms for measurements and numerical acceptance.
const I4 = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
function multiply(a, b) {const out = Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) out[r * 4 + c] += a[r * 4 + k] * b[k * 4 + c]; return out;}
function originMatrix(j) {
  const [r, p, y] = j.rpy, [sr, cr, sp, cp, sy, cy] = [Math.sin(r), Math.cos(r), Math.sin(p), Math.cos(p), Math.sin(y), Math.cos(y)];
  return [cy * cp, cy * sp * sr - sy * cr, cy * sp * cr + sy * sr, j.xyz[0], sy * cp, sy * sp * sr + cy * cr, sy * sp * cr - cy * sr, j.xyz[1], -sp, cp * sr, cp * cr, j.xyz[2], 0, 0, 0, 1];
}
function axisMatrix(axis, angle) {
  const length = Math.hypot(...axis), [x, y, z] = axis.map(v => v / length), c = Math.cos(angle), s = Math.sin(angle), t = 1 - c;
  return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, 0, t * x * y + s * z, t * y * y + c, t * y * z - s * x, 0, t * x * z - s * y, t * y * z + s * x, t * z * z + c, 0, 0, 0, 0, 1];
}
export function forwardKinematics8(id, angles = {}) {
  const model = ROBOT_ASSETS8.models[id], q = normalizedJoints8(id, angles), matrices = {[model.root]: I4()};
  let pending = model.joints.slice();
  while (pending.length) {
    const next = [];
    for (const joint of pending) {
      if (!matrices[joint.parent]) {next.push(joint); continue;}
      let local = originMatrix(joint);
      if (joint.type === 'revolute' || joint.type === 'continuous') local = multiply(local, axisMatrix(joint.axis, q[joint.name]));
      else if (joint.type !== 'fixed') throw new Error('Unsupported URDF joint type: ' + joint.type);
      matrices[joint.child] = multiply(matrices[joint.parent], local);
    }
    if (next.length === pending.length) throw new Error('Disconnected or cyclic URDF');
    pending = next;
  }
  return Object.fromEntries(Object.entries(matrices).map(([name, matrix]) => [name, {position: [matrix[3], matrix[7], matrix[11]], matrix}]));
}
globalThis.RobotKinematics8 = {createState: createRobotState8, setJoint: setRobotJoint8, applyPreset: applyRobotPreset8,
  reset: (id, state) => applyRobotPreset8(id, state), normalize: normalizedJoints8, forward: forwardKinematics8, sample: sampleRobotPose8};

function decodeArray(text, Type) {
  const binary = globalThis.atob(text), bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Type(bytes.buffer);
}
export function createRobotBuilders8(h) {
  const {THREE, bench, label} = h;
  function build(stage, id) {
    const config = configs[id], model = ROBOT_ASSETS8.models[id], refs = stage.refs, scene = stage.scene;
    bench(scene, 0, id === 'go2' ? -.7 : 0, id === 'go2' ? 7.3 : 6.6, id === 'go2' ? 6.3 : 4.6);
    const display = new THREE.Group(); display.rotation.x = -Math.PI / 2; display.scale.setScalar(config.scale); scene.add(display);
    refs.robot8 = display; refs.config8 = config; refs.links8 = {}; refs.joints8 = {}; refs.axes8 = {}; refs.markers8 = {};
    if(id==='go2'){const points=[];for(let i=0;i<=96;i++){const a=i/96*Math.PI*2;points.push(new THREE.Vector3(.27*Math.sin(a)*config.scale,.355,-.27*(1-Math.cos(a))*config.scale));}const path=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#c99d63',transparent:true,opacity:.65}));scene.add(path);refs.walkTrack9=path;}
    const geometryCache = new Map();
    function createVisual(asset) {
      if (!geometryCache.has(asset)) geometryCache.set(asset, model.meshes[asset].parts.map(part => {
        const raw = decodeArray(part.p, Uint16Array), positions = new Float32Array(raw.length);
        for (let i = 0; i < raw.length; i++) positions[i] = part.min[i % 3] + raw[i] * part.scale[i % 3];
        const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(decodeArray(part.n, Int8Array), 3, true));
        geometry.setIndex(new THREE.BufferAttribute(decodeArray(part.i, part.indexType === 'u16' ? Uint16Array : Uint32Array), 1));
        for (const group of part.groups) geometry.addGroup(group.start, group.count, group.materialIndex);
        geometry.computeBoundingBox(); geometry.computeBoundingSphere();
        const materials = part.materials.map(m => new THREE.MeshStandardMaterial({color: new THREE.Color().fromArray(m.color), metalness: clamp(m.metalness, .08, .35), roughness: clamp(m.roughness, .3, .72), opacity: m.opacity, transparent: m.opacity < 1}));
        return {geometry, materials};
      }));
      const group = new THREE.Group();
      for (const part of geometryCache.get(asset)) {const mesh = new THREE.Mesh(part.geometry, part.materials); mesh.userData.robotAsset8 = asset; mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh);}
      return group;
    }
    for (const link of model.links) {
      const frame = new THREE.Group(); frame.name = link.name; refs.links8[link.name] = frame;
      for (const visual of link.visuals) {const shape = createVisual(visual.mesh); shape.position.fromArray(visual.xyz); shape.quaternion.setFromEuler(new THREE.Euler(...visual.rpy, 'ZYX')); shape.scale.fromArray(visual.scale); frame.add(shape);}
    }
    display.add(refs.links8[model.root]);
    for (const joint of model.joints) {
      const origin = new THREE.Group(); origin.position.fromArray(joint.xyz); origin.quaternion.setFromEuler(new THREE.Euler(...joint.rpy, 'ZYX')); refs.links8[joint.parent].add(origin);
      const motion = new THREE.Group(); motion.name = joint.name; origin.add(motion); motion.add(refs.links8[joint.child]);
      if (joint.type !== 'fixed') {
        refs.joints8[joint.name] = motion; const axes = new THREE.AxesHelper(id === 'go2' ? .075 : .11); motion.add(axes); refs.axes8[joint.name] = axes;
        const marker = new THREE.Mesh(new THREE.SphereGeometry(id === 'go2' ? .008 : .012, 12, 8), new THREE.MeshBasicMaterial({color: '#f0ad57', transparent: true, opacity: .85, depthTest: false}));
        marker.renderOrder = 10; marker.userData.robotJoint8 = joint.name; origin.add(marker); refs.markers8[joint.name] = marker;
      }
    }
    const status = label(id === 'go2' ? 'GO2 · 12 DOF · URDF' : 'UR5 · 6 DOF · URDF', 2.4, .20, scene, 0, .45, 1.9, {bg: '#244652', color: '#dceadf', font: 90}); refs.status8 = status;
    refs.update = state => {
      const q = normalizedJoints8(id, state.joints), fk = forwardKinematics8(id, q); refs.actualJoints8 = q; refs.kinematics8 = fk;
      const selected = state.selectedJoint || config.joints[0].name;
      for (const joint of config.joints) {
        refs.joints8[joint.name].quaternion.setFromAxisAngle(new THREE.Vector3(...joint.axis).normalize(), q[joint.name]);
        refs.axes8[joint.name].visible = state.showAxes !== false && joint.name === selected;
        refs.markers8[joint.name].visible = state.showSkeleton === true || joint.name === selected;
      }
      // A quadruped pose is aligned to its lowest foot for viewing, without contact solving.
      const walking=id==='go2'&&state.motionMode9==='walk'&&state.walk9;
      const floorOffset = id === 'go2' ? walking?state.walk9.height+.022:-Math.min(...config.endpoints.map(name => fk[name].position[2])) + .022 : 0;
      display.position.y = .37 + floorOffset * config.scale; refs.displayFloorOffset8 = floorOffset;
      display.position.x=walking?state.walk9.x*config.scale:0;display.position.z=walking?-state.walk9.y*config.scale:0;display.rotation.set(-Math.PI/2,0,walking?state.walk9.heading:0);if(refs.walkTrack9)refs.walkTrack9.visible=!!walking;
      if(id==='go2')status.update(walking?'GO2 · KINEMATIC WALK':'GO2 · 12 DOF · URDF');
      refs.endpoints8 = Object.fromEntries(config.endpoints.map(name => [name, fk[name].position.slice()]));
      display.updateMatrixWorld(true);
    };
    refs.update(createRobotState8(id));
    stage.target.set(0, id === 'go2' ? 1.1 : 1.6, id==='go2'?-.7:0); stage.camera.position.set(id === 'go2' ? 5.3 : 5, id === 'go2' ? 4.6 : 4.0, id === 'go2' ? 7.8 : 6.5); stage.camera.lookAt(stage.target);
    stage.focusViews8 = id === 'go2'
      ? {panel: {position: [2.6, 3.0, 3.6], target: [0, 1.8, 0]}, wiring: {position: [2.3, 1.6, -2.3], target: [.7, .9, -.6]}}
      : {panel: {position: [2.7, 3.2, 3.3], target: [.1, 1.5, .3]}, wiring: {position: [1.8, 2.3, 2.6], target: [.1, 1.2, .35]}};
  }
  return {go2: stage => build(stage, 'go2'), ur5: stage => build(stage, 'ur5')};
}
