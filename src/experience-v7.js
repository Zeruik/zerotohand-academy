/* Reading and workbench composition. Rendering and simulation keep their existing state contracts. */
Object.assign(FIELD4, {
  timebase: ['时基', 'Time base', 's/div'],
  voltsdiv: ['垂直刻度', 'Vertical scale', 'V/div']
});

const _simInterface7 = sim4;
sim4 = function(id) {
  const state = _simInterface7(id);
  if (id === 'wave') {
    state.p.timebase ??= .2;
    state.p.voltsdiv ??= 1;
    state.trigger ??= 'rising';
  }
  if (id === 'pwm' || id === 'pid') state.motorAngle7 ??= 0;
  return state;
};

const _advanceInterface7 = advance4;
advance4 = function(id, state, dt) {
  const before = Number.isFinite(state.y) ? state.y : 0;
  _advanceInterface7(id, state, dt);
  if ((id === 'pwm' || id === 'pid') && Number.isFinite(dt) && dt > 0) {
    const after = Number.isFinite(state.y) ? state.y : 0;
    state.motorAngle7 = (state.motorAngle7 || 0) + dt * (before + after) / 2 / 100 * 6;
  }
};

function parameter7(key, state, initial, min, max, step) {
  if (!Number.isFinite(state.p[key])) state.p[key] = initial;
  return `<label class="parameter4">${E(label4(key))}<output data-value="${key}">${state.p[key]} ${FIELD4[key][2]}</output><input data-param="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state.p[key]}" aria-label="${E(label4(key))}"></label>`;
}

const _fieldsInterface7 = fields4;
fields4 = function(id, state) {
  let html = _fieldsInterface7(id, state);
  if (id === 'meter') html += parameter7('r', state, 330, 10, 5000, 10);
  if (id === 'wave') {
    html += `<div class="console-divider7">${T('显示与触发', 'DISPLAY & TRIGGER')}</div>`;
    html += parameter7('timebase', state, .2, .05, .5, .05);
    html += parameter7('voltsdiv', state, 1, .5, 2, .5);
    html += `<label>${T('触发方式', 'Trigger mode')}<select data-setting="trigger"><option value="rising" ${state.trigger === 'rising' ? 'selected' : ''}>${T('上升沿 · 波形稳定', 'Rising edge · stable trace')}</option><option value="free" ${state.trigger === 'free' ? 'selected' : ''}>${T('自由运行 · 观察相位', 'Free run · observe phase')}</option></select></label><p class="console-hint7">${T('教学正弦慢放。时基改变每格代表的时间，垂直刻度改变每格代表的电压；它们不会改变信号源本身。', 'A slowed teaching sine wave. Time base changes seconds per division; vertical scale changes volts per division. Neither changes the source signal.')}</p>`;
  }
  return html;
};

function pair7(value, fallbackZh = '', fallbackEn = '') {
  return Array.isArray(value) ? T(value[0] || fallbackZh, value[1] || fallbackEn) : T(fallbackZh, fallbackEn);
}
function timeLabel7(lesson) {
  const time = String(lesson.time || '');
  return UI4.lang === 'en'
    ? time.replace('虚拟实验', 'Interactive lab').replace('项目规划', 'Project planning').replace('平台比较', 'Platform comparison').replace('项目工作流', 'Project workflow')
    : time.replace(/\bmin\b/g, '分钟').replace('practice','实践');
}
function levelLabel7(lesson) {
  const index = LEVELS.indexOf(lesson.level);
  return T(LEVEL_NAMES[index] || lesson.level, lesson.level);
}

let heroState7 = null;
function rcPreviewState7() {
  if (!heroState7) {
    heroState7 = storyInitial('rc');
    heroState7.run = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return heroState7;
}

home4 = function() {
  const state = rcPreviewState7();
  const next = LESSON_ROUTE.find((id) => !UI4.done.includes(id)) || LESSON_ROUTE[0];
  const returning = UI4.done.some((id) => LESSON_ROUTE.includes(id));
  const stages = [
    { number: '01', title: ['看懂一条回路', 'Understand a circuit'], note: ['认识量、元件与连接', 'Quantities, parts and connections'], ids: LESSON_ROUTE.slice(0, 4), color: 'orange' },
    { number: '02', title: ['学会观察与测量', 'Observe and measure'], note: ['用仪表验证你的判断', 'Check your ideas with instruments'], ids: LESSON_ROUTE.slice(4, 8), color: 'teal' },
    { number: '03', title: ['让设备听懂指令', 'Make a system respond'], note: ['从信号走向控制与机器人', 'Signals, control and robotics'], ids: LESSON_ROUTE.slice(8, 12), color: 'blue' }
  ];
  return `<div class="home7"><section class="hero7" aria-labelledby="hero-title7"><div class="hero-copy7"><span class="eyebrow7"><i></i>${T('工程，从亲手理解开始', 'ENGINEERING, MADE UNDERSTANDABLE')}</span><h1 id="hero-title7">${T('从一条回路，<br><em>走进工程世界。</em>', 'Start with a circuit.<br><em>Build understanding.</em>')}</h1><p class="hero-lead7">${T('不用先懂电路。认识一个元件，改变一个条件，再用眼前的现象和读数找到答案。', 'No electronics background required. Meet one component, change one condition, and make sense of what you see and measure.')}</p><div class="hero-actions7"><button class="primary4" data-lesson="${next}">${returning ? T('继续我的学习', 'Continue learning') : T('开始第 1 课', 'Start lesson 1')}<span aria-hidden="true">→</span></button><button class="quiet-button7" data-go="lab">${T('探索实验室', 'Explore the lab')}<span aria-hidden="true">↗</span></button></div><div class="hero-facts7"><span>${T('12 课循序入门', '12 guided foundation lessons')}</span><i aria-hidden="true"></i><span>${T('离线也能学习', 'Ready to learn offline')}</span></div></div><div class="hero-card7"><div class="hero-card-top7"><div><span class="eyebrow7">${T('先试一次', 'TRY IT NOW')} / RC</span><h2>${T('给电容一点时间。', 'Give a capacitor a moment.')}</h2></div><button class="round-button7" data-lab="rc" aria-label="${T('打开电容充放电操作台', 'Open the RC workbench')}">↗</button></div><div class="hero-model7" aria-label="${T('可交互的电容充放电三维模型', 'Interactive three-dimensional RC model')}"></div><div class="hero-readings7"><div><span>${T('电容电压', 'Capacitor voltage')}</span><strong><output data-hero-value7="voltage">${state.y.toFixed(2)}</output><small> V</small></strong></div><div><span>${T('时间常数', 'Time constant')}</span><strong>τ <output data-hero-value7="tau">${(state.p.r * state.p.c / 1000).toFixed(2)}</output><small> s</small></strong></div><span class="hero-mode7" data-hero-status7>${state.on ? T('充电', 'Charging') : T('放电', 'Discharging')}</span></div><div class="hero-progress7"><progress max="5" value="${state.y}" aria-label="${T('电容电压，最大5伏', 'Capacitor voltage, maximum 5 volts')}"></progress><span>0 V</span><span>5 V</span></div><div class="hero-controls7" role="group" aria-label="${T('控制电容实验', 'Control the RC experiment')}"><button data-hero-act7="charge" aria-pressed="${state.on}">${T('充电', 'Charge')}</button><button data-hero-act7="discharge" aria-pressed="${!state.on}">${T('放电', 'Discharge')}</button><button data-hero-act7="play">${state.run ? T('暂停', 'Pause') : T('播放', 'Play')}</button><button data-hero-act7="reset">${T('重置', 'Reset')}</button></div><p class="hero-caption7">${T('点一下“放电”：电压会逐渐降低，电容不会瞬间失去储能。', 'Try Discharge: the voltage falls gradually as stored energy is released.')}</p></div></section><section class="learning-route7" aria-labelledby="route-title7"><div class="section-heading7"><div><span class="eyebrow7">${T('你的学习路线', 'YOUR LEARNING PATH')}</span><h2 id="route-title7">${T('一步一步，把原理连起来。', 'Connect one idea to the next.')}</h2></div><button class="text-button7" data-go="courses">${T('查看全部课程', 'Browse every lesson')} <span aria-hidden="true">→</span></button></div><div class="route-stages7">${stages.map((stage) => `<section class="route-stage7 tone-${stage.color}7"><header><span class="stage-number7">${stage.number}</span><div><h3>${T(...stage.title)}</h3><p>${T(...stage.note)}</p></div></header><ol>${stage.ids.map((id) => { const lesson = LESSONS.find((item) => item.id === id); if (!lesson) return ''; const index = LESSON_ROUTE.indexOf(id); return `<li><button data-lesson="${id}" class="${UI4.done.includes(id) ? 'is-complete7' : ''}"><span class="route-index7">${String(index + 1).padStart(2, '0')}</span><span>${E(title4(lesson))}</span><span class="route-arrow7" aria-label="${UI4.done.includes(id) ? T('已完成', 'Completed') : T('打开课程', 'Open lesson')}">${UI4.done.includes(id) ? '✓' : '↗'}</span></button></li>`; }).join('')}</ol></section>`).join('')}</div></section><section class="device-shortcuts7" aria-labelledby="devices-title7"><div class="section-heading7"><div><span class="eyebrow7">${T('带着问题去实验', 'TAKE A QUESTION INTO THE LAB')}</span><h2 id="devices-title7">${T('先挑一台，亲手试试。', 'Choose something to explore.')}</h2></div><button class="text-button7" data-go="lab">${T('全部操作台', 'All workbenches')} <span aria-hidden="true">→</span></button></div><div class="device-links7">${[
    ['meter', ['两根表笔，分别接哪里？', 'Where do the two probes go?'], ['分清档位、插孔与接法', 'Separate function, jack and connection']],
    ['wave', ['把一个信号看清楚。', 'Make a signal readable.'], ['动手调整时基与垂直刻度', 'Adjust time base and vertical scale']],
    ['robot', ['机械臂能走到这里吗？', 'Can the arm reach this point?'], ['移动目标，观察关节与末端', 'Move a target and watch the joints']]
  ].map(([id, title, note]) => `<button class="device-link7" data-lab="${id}"><div class="device-thumb7" data-model-preview7="${id}" aria-hidden="true">${sceneSVG5(id, sim4(id))}</div><div><span>${E(T(DEVICE5[id][0], DEVICE5[id][1]))}</span><h3>${T(...title)}</h3><p>${T(...note)}</p></div><b aria-hidden="true">↗</b></button>`).join('')}</div></section></div>`;
};

function labHint7(id) {
  const hints = {
    meter: ['先关闭模拟电源，再独立确认功能、量程、插孔和两个测试点。表盘与控件表示同一台教学仪表。', 'Turn simulated power off, then separately check function, range, jack and both test points. The physical dial and controls represent the same teaching meter.'],
    rc: ['理想一阶 RC 模型，电源为5 V；R以kΩ、C以μF输入。充放电由同一条状态方程计算。', 'An ideal first-order RC model with a 5 V source. Enter R in kilohms and C in microfarads. One state equation governs charge and discharge.'],
    wave: ['使用慢放正弦帮助理解波形，不模拟真实仪器的采样、带宽或触发电路。改变显示刻度不会改变信号源。', 'A slowed sine wave explains the display. Real sampling, bandwidth and trigger circuitry are not simulated. Display scales do not alter the source.'],
    robot: ['两连杆平面运动学，各110 mm。目标超出可达范围时会提示；未包含碰撞、质量和驱动动力学。', 'Planar kinematics with two 110 mm links. Unreachable targets are reported. Collision, mass and actuator dynamics are omitted.'],
    rover: ['左右轮速度决定位置和朝向。房间边界限制平移；本模型未包含轮胎打滑或驱动动力学。', 'Wheel speeds determine position and heading. Room boundaries limit translation. Tire slip and drive dynamics are omitted.'],
    ros: ['本地演示发布、订阅与指令超时，不连接真实 ROS 系统。断开控制话题后观察小车何时停下。', 'A local demonstration of publishing, subscribing and command timeout. It does not connect to ROS. Disconnect the command topic and observe when the rover stops.'],
    thermal: ['一阶热惯性模型用于区分热源与工件温度，不能用来确定真实焊接温度或工艺窗口。', 'A first-order thermal model separates source and workpiece temperature. It cannot establish real soldering settings or process windows.'],
    bits: ['协议按8N1、最低位在先显示，播放速度是教学慢放，不代表实际通信波特率。', 'The frame is 8N1, least-significant bit first. Playback speed is slowed for teaching and is not the actual communication baud rate.']
  };
  return hints[id] ? T(...hints[id]) : T('这是帮助理解输入与输出关系的教学模型。先暂停，改变一个条件，再用单步和读数解释变化。', 'This teaching model helps explain input-output relationships. Pause, change one condition, and use stepping and readings to explain the change.');
}

workbench4 = function(id, embedded = false) {
  if (!id) return gallery5();
  if (!LAB4[id]) id = 'circuit';
  const state = sim4(id), kind = LAB4[id][2];
  const toggle = ['circuit', 'rc', 'thermal', 'pid'].includes(kind) && id !== 'meter';
  const toggleLabel = id === 'pid' ? T('施加 / 移除扰动', 'Apply / remove disturbance') : kind === 'rc' ? T('切换充电 / 放电', 'Switch charge / discharge') : kind === 'thermal' ? T('移开 / 接触热源', 'Remove / apply heat') : T('断开 / 闭合回路', 'Open / close circuit');
  return `<section class="bench4 bench7 ${embedded ? 'is-embedded7' : ''}" data-bench="${id}"><header class="bench-header7"><div><span class="eyebrow7">${T('操作 · 观察 · 理解', 'OPERATE · OBSERVE · UNDERSTAND')}</span><h2>${T(LAB4[id][0], LAB4[id][1])}</h2></div>${embedded ? `<button data-lab="${id}" class="text-button7">${T('展开操作台', 'Open full workbench')} ↗</button>` : `<select aria-label="${T('切换操作台', 'Select workbench')}" id="bench-select4">${Object.entries(LAB4).map(([key, value]) => `<option value="${key}" ${id === key ? 'selected' : ''}>${T(value[0], value[1])}</option>`).join('')}</select>`}</header><div class="lab-layout7"><div class="lab-stage7"><div class="bench-canvas4"><canvas width="900" height="420" aria-label="${T('实时实验模型，等价读数在下方显示', 'Live experiment; equivalent readings appear below')}"></canvas><div class="clock4" id="clock4">0.00 s</div></div><div class="measure4" id="measure4" aria-live="off"></div><div class="transport4"><button data-sim="play">${state.run ? T('暂停', 'Pause') : T('播放', 'Play')}</button><button data-sim="step">${T('单步', 'Step')}</button><button data-sim="reset">${T('复位实验', 'Reset experiment')}</button>${toggle ? `<button data-sim="toggle">${toggleLabel}</button>` : ''}${id === 'rl' ? `<button data-sim="train">${T('训练策略', 'Train policy')}</button>` : ''}</div><div class="explain4" id="explain4"></div></div><aside class="lab-console7" aria-label="${T('实验控制面板', 'Experiment control panel')}"><header><span class="eyebrow7">${T('控制面板', 'CONTROL PANEL')}</span><p>${T('每次改变一个条件，观察一个结果。', 'Change one condition. Observe what follows.')}</p></header><div class="parameters4">${fields4(id, state)}${id === 'meter' ? `<label>${T('测量档位', 'Measurement mode')}<select data-setting="mode">${[['voltage', '直流电压', 'DC voltage'], ['current', '直流电流', 'DC current'], ['resistance', '电阻', 'Resistance'], ['continuity', '通断', 'Continuity']].map(([value, zh, en]) => `<option value="${value}" ${state.mode === value ? 'selected' : ''}>${T(zh, en)}</option>`).join('')}</select></label><label>${T('红笔插孔', 'Red lead jack')}<select data-setting="jack"><option value="voltage" ${state.jack === 'voltage' ? 'selected' : ''}>VΩ</option><option value="current" ${state.jack === 'current' ? 'selected' : ''}>mA</option><option value="10a" ${state.jack === '10a' ? 'selected' : ''}>10 A</option></select></label><label class="legacy-connection7">${T('表笔连接位置', 'Meter connection')}<select data-setting="place"><option value="source" ${state.place === 'source' ? 'selected' : ''}>${T('并接电源', 'Across source')}</option><option value="series" ${state.place === 'series' ? 'selected' : ''}>${T('串入支路', 'In series')}</option><option value="led" ${state.place === 'led' ? 'selected' : ''}>${T('并接LED', 'Across LED')}</option></select></label>` : ''}${id === 'fault' ? `<label>${T('注入故障', 'Inject a fault')}<select data-setting="place">${[['source', '正常', 'Healthy'], ['open', '断路', 'Open circuit'], ['reverse', '反接LED', 'Reversed LED']].map(([value, zh, en]) => `<option value="${value}" ${state.place === value ? 'selected' : ''}>${T(zh, en)}</option>`).join('')}</select></label>` : ''}</div><details class="model4"><summary>${T('模型范围与操作提示', 'Model scope and operating hints')}</summary><p>${labHint7(id)}</p><p>${T('切换语言和主题会保留实验状态。复位只恢复当前操作台的默认条件。', 'Language and theme changes preserve the experiment. Reset restores the current workbench to its default conditions.')}</p></details></aside></div></section>`;
};

function conceptWorkbench7(id) {
  return `<section class="concept-workbench7"><span class="concept-mark7" aria-hidden="true">↗</span><h3>${T('把概念带回基础模型。', 'Connect the concept to a basic model.')}</h3><p>${T('本课主要通过案例、推导和自检理解系统。关联操作台只用于观察其中一个基础关系，模拟范围以上方说明为准。', 'This topic is explored through cases, reasoning and self-checks. The related workbench illustrates one basic relationship; its scope is described above.')}</p><button data-lab="${id}">${T('打开关联基础模型', 'Open the related basic model')} ↗</button></section>`;
}

lesson4 = function() {
  const lesson = LESSONS.find((item) => item.id === UI4.id) || LESSONS[0];
  const en = EN_LESSONS[lesson.id] || {};
  const deep = DEEP_LESSONS[lesson.id] || [];
  const guide = typeof LESSON_GUIDE7 !== 'undefined' ? LESSON_GUIDE7[lesson.id] || {} : {};
  const quiz = CHECK4[lesson.id];
  let lab = LESSON_DEVICE5[lesson.id] || LM4[lesson.lab] || lesson.lab;
  if (!LAB4[lab]) lab = 'circuit';
  const order = typeof CURRICULUM8 !== 'undefined' ? CURRICULUM8.lessonOrder : LESSON_ROUTE.includes(lesson.id) ? LESSON_ROUTE : LESSONS.map((item) => item.id);
  const at = order.indexOf(lesson.id), previous = LESSONS.find((item) => item.id === order[at - 1]), next = LESSONS.find((item) => item.id === order[at + 1]);
  const prefix = `lesson7-${lesson.id}`;
  const sections = UI4.lang === 'en' ? [['Build the mental model', en.idea || ''], ['Work through the example', en.example || ''], ['Check assumptions and common errors', en.error || '']] : lesson.sections || [];
  const goal = pair7(guide.goal, lesson.goals?.[0] || '用本课的概念解释一个可观察的结果。', 'Explain one observable result using this lesson’s ideas.');
  const practice = pair7(guide.practice, lesson.task || '记录输入、预测和结果。', 'Record the input, your prediction and the result.');
  const question = pair7(guide.question, '这个结论成立，需要满足什么条件？', 'What conditions must hold for this conclusion?');
  const answer = pair7(guide.answer, '回到本课模型的假设、输入范围和误差来源，说明结论的边界。', 'Check the model assumptions, input range and error sources, and explain the conclusion’s limits.');
  const labNote = pair7(guide.labNote, '用本课关联的操作台观察一个变量的作用，并将模型范围与真实系统区分开。', 'Use the related workbench to observe one variable and keep the model’s scope in mind.');
  return `<div class="lesson-page7"><button class="back4" data-go="courses">← ${T('全部课程', 'All lessons')}</button><header class="lesson-title4 lesson-title7"><div class="lesson-meta7"><span>${E(levelLabel7(lesson))}</span><i></i><span>${E(timeLabel7(lesson))}</span>${LESSON_ROUTE.includes(lesson.id) ? `<i></i><span>${T('入门路线', 'Foundation path')} ${LESSON_ROUTE.indexOf(lesson.id) + 1} / 12</span>` : ''}</div><h1>${E(title4(lesson))}</h1><p>${E(UI4.lang === 'en' ? en.idea || '' : lesson.desc)}</p><div class="lesson-quicklinks7"><a href="#${prefix}-practice" data-jump7="${prefix}-practice">${T('查看本课任务', 'See the lesson task')} ↓</a><button data-lab="${lab}">${T('打开关联操作台', 'Open related workbench')} ↗</button></div></header><div class="lesson-grid4 lesson-grid7"><article class="reading4"><section class="goal4 goal7"><span class="eyebrow7">${T('学完这一课，你应该能', 'BY THE END, YOU SHOULD BE ABLE TO')}</span><h2>${E(goal)}</h2><div class="prerequisites7"><span>${T('先修知识', 'Before you begin')}</span><div>${(lesson.prereq || []).map((id) => { const item = LESSONS.find((entry) => entry.id === id); return item ? `<button data-lesson="${id}">${E(title4(item))}</button>` : ''; }).join('') || `<small>${T('从这里开始，不需要先修知识。', 'Start here. No prior knowledge is needed.')}</small>`}</div></div></section><nav class="lesson-toc7" aria-label="${T('本课目录', 'On this page')}"><details open><summary>${T('本课目录', 'On this page')}<span>${deep.length} ${T('段讲解', 'explanations')}</span></summary><ol>${deep.map((section, index) => `<li><a href="#${prefix}-${index}" data-jump7="${prefix}-${index}"><span>${String(index + 1).padStart(2, '0')}</span>${E(T(section[0], section[1]))}</a></li>`).join('')}<li><a href="#${prefix}-example" data-jump7="${prefix}-example"><span>→</span>${T('例题与计算', 'Worked example')}</a></li><li><a href="#${prefix}-practice" data-jump7="${prefix}-practice"><span>→</span>${T('任务与自检', 'Practice and self-check')}</a></li></ol></details></nav>${deep.map((section, index) => `<section class="reading-section reading-section7" id="${prefix}-${index}" tabindex="-1"><div class="reading-kicker7"><span class="step4">${String(index + 1).padStart(2, '0')}</span><span class="reading-rule7"></span></div><h2>${E(T(section[0], section[1]))}</h2><p>${E(T(section[2], section[3]))}</p></section>`).join('')}<section class="example4 example7" id="${prefix}-example" tabindex="-1"><span class="eyebrow7">${T('把思路落在具体例子上', 'PUT THE IDEA INTO A WORKED EXAMPLE')}</span><h2>${T('一步一步代入。', 'Work it through, one step at a time.')}</h2><p>${E(UI4.lang === 'en' ? en.example || '' : lesson.example)}</p></section><section class="practice4 practice7" id="${prefix}-practice" tabindex="-1"><span class="eyebrow7">${T('现在，轮到你了', 'NOW IT IS YOUR TURN')}</span><h2>${T('带着一个任务去验证。', 'Test an idea with a clear task.')}</h2><div class="practice-task7"><span>${T('本课任务', 'YOUR TASK')}</span><p>${E(practice)}</p></div>${quiz ? `<div class="number-check7"><label for="answer4">${E(T(quiz[1], quiz[2]))}</label><div class="answer-row7"><input type="number" inputmode="decimal" step="any" id="answer4" placeholder="${T('按题目单位填写数值', 'Enter a value in the stated unit')}"><button class="primary4" data-check="${lesson.id}">${T('检查推导', 'Check reasoning')}</button></div><div id="answer-feedback4" class="answer-feedback7" role="status" aria-live="polite"></div></div>` : ''}<details class="concept-check7"><summary><span>${T('概念自检', 'CONCEPT CHECK')}</span>${E(question)}</summary><div><span class="eyebrow7">${T('参考解释', 'REFERENCE EXPLANATION')}</span><p>${E(answer)}</p></div></details></section><details class="supplement7"><summary>${T('展开补充讲解与常见误区', 'More explanation and common misconceptions')}</summary>${sections.map(([title, body]) => `<section class="reading-section"><h2>${E(title)}</h2><p>${E(body)}</p></section>`).join('')}</details><section class="note4 note7" id="${prefix}-notes"><span class="eyebrow7">${T('把理解留在自己的笔记里', 'KEEP YOUR REASONING IN YOUR OWN WORDS')}</span><h2>${T('你观察到了什么？', 'What did you observe?')}</h2><label for="note4">${T('记录条件、预测、结果，以及你仍想弄明白的问题。', 'Record the conditions, prediction, result and the question you still want to answer.')}</label><textarea id="note4" rows="5" placeholder="${T('我的预测是……实际看到……我认为原因是……', 'I predicted… I observed… I think this happened because…')}">${E(UI4.notes[lesson.id] || '')}</textarea><div class="note-actions7"><button data-done="${lesson.id}">${UI4.done.includes(lesson.id) ? T('✓ 已记录完成，仍可继续复习', '✓ Marked complete — revisit anytime') : T('记录：我已完成本课', 'Mark this lesson complete')}</button><small>${T('这是个人学习记录。', 'This is your personal learning record.')}</small></div></section><nav class="lesson-pagination7" aria-label="${T('前后课程', 'Previous and next lessons')}">${previous ? `<button data-lesson="${previous.id}"><span>← ${T('上一课', 'Previous lesson')}</span><strong>${E(title4(previous))}</strong></button>` : '<span></span>'}${next ? `<button data-lesson="${next.id}"><span>${T('下一课', 'Next lesson')} →</span><strong>${E(title4(next))}</strong></button>` : `<button data-go="courses"><span>${T('继续探索', 'Keep exploring')} →</span><strong>${T('选择下一个专题', 'Choose your next topic')}</strong></button>`}</nav></article><aside class="lesson-work4 lesson-work7" id="${prefix}-lab"><div class="lesson-lab-note7"><span class="eyebrow7">${T('本课与操作台', 'THIS LESSON & THE WORKBENCH')}</span><p>${E(labNote)}</p></div>${guide.labMode === 'concept' ? conceptWorkbench7(lab) : workbench4(lab, true)}</aside></div></div>`;
};

function refreshHero7(shell) {
  if (!shell?.isConnected) return;
  const state = rcPreviewState7();
  const card = shell.closest('.hero-card7');
  card.querySelector('[data-hero-value7="voltage"]').textContent = state.y.toFixed(2);
  card.querySelector('[data-hero-value7="tau"]').textContent = (state.p.r * state.p.c / 1000).toFixed(2);
  card.querySelector('[data-hero-status7]').textContent = state.run ? (state.on ? T('充电', 'Charging') : T('放电', 'Discharging')) : T('已暂停', 'Paused');
  card.querySelector('progress').value = Math.max(0, Math.min(5, state.y));
  card.querySelector('[data-hero-act7="play"]').textContent = state.run ? T('暂停', 'Pause') : T('播放', 'Play');
  card.querySelector('[data-hero-act7="charge"]').setAttribute('aria-pressed', String(state.on));
  card.querySelector('[data-hero-act7="discharge"]').setAttribute('aria-pressed', String(!state.on));
  const scene = window.SCENE3D6?.active;
  if (scene?.shell === shell) { scene.state = state; scene.update?.(state); }
}

const _mountInterface7 = mount4;
mount4 = function() {
  _mountInterface7();
  const shell = document.querySelector('.hero-model7');
  if (UI4.view !== 'home' || !shell) return;
  const state = rcPreviewState7();
  active4 = null;
  if (window.SCENE3D6?.mount) window.SCENE3D6.mount(shell, 'rc', state);
  else shell.innerHTML = `<p class="hero-unavailable7">${T('三维视图暂未加载，可打开RC操作台继续学习。', 'The 3D view is unavailable. Open the RC workbench to continue.')}</p>`;
  last4 = 0;
  let lastText = 0;
  refreshHero7(shell);
  const tick = (now) => {
    if (!shell.isConnected || UI4.view !== 'home') return;
    const dt = last4 ? Math.min(.05, Math.max(0, (now - last4) / 1000)) : 0;
    last4 = now;
    if (state.run && !document.hidden) advance4('rc', state, dt);
    if (now - lastText >= 70) { refreshHero7(shell); lastText = now; }
    loop4 = requestAnimationFrame(tick);
  };
  loop4 = requestAnimationFrame(tick);
};

document.addEventListener('click', (event) => {
  const hero = event.target.closest('[data-hero-act7]');
  if (hero) {
    event.preventDefault();
    const state = rcPreviewState7(), action = hero.dataset.heroAct7;
    if (action === 'charge' || action === 'discharge') { state.on = action === 'charge'; state.run = true; }
    if (action === 'play') state.run = !state.run;
    if (action === 'reset') {
      const fresh = storyInitial('rc');
      fresh.run = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      Object.assign(state, fresh);
      last4 = 0;
    }
    refreshHero7(document.querySelector('.hero-model7'));
    return;
  }
  const jump = event.target.closest('[data-jump7]');
  if (jump) {
    event.preventDefault();
    const target = document.getElementById(jump.dataset.jump7);
    if (target) { target.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); target.focus({ preventScroll: true }); }
    return;
  }
  const check = event.target.closest('[data-check]');
  if (!check) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const input = document.getElementById('answer4'), feedback = document.getElementById('answer-feedback4'), quiz = CHECK4[check.dataset.check];
  if (!input || !feedback || !quiz) return;
  const entered = input.value.trim(), number = Number(entered);
  if (!entered || !Number.isFinite(number)) {
    feedback.dataset.state = 'empty';
    feedback.textContent = T('先按题目要求的单位填写数值，再检查推导。', 'Enter a numerical value in the requested unit, then check your reasoning.');
    input.focus();
    return;
  }
  const correct = Math.abs(number - quiz[0]) <= .03;
  const explanations = typeof CHECK_EXPLANATIONS7 !== 'undefined' ? CHECK_EXPLANATIONS7 : {};
  const explanation = pair7(explanations[check.dataset.check], '把题目中的量换成一致单位，再按本课公式逐步代入；将计算结果与例题中的条件核对。', 'Convert the quantities to consistent units, substitute them into this lesson’s equation, and compare the conditions with the worked example.');
  feedback.dataset.state = correct ? 'correct' : 'incorrect';
  feedback.innerHTML = `<strong>${correct ? T('✓ 结果正确，再看一遍推导。', '✓ Correct result. Review the reasoning.') : T('还需核对单位或代入过程。', 'Check the units and substitution.')}</strong><p>${E(explanation)}</p>${correct ? '' : `<span>${T('本题参考值：', 'Reference value: ')}<b>${quiz[0]}</b></span>`}`;
}, true);
