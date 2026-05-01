const today = "2024-05-17";

const state = {
  page: "overview",
  data: {
    date: today,
    meals: [
      { name: "孙老师杂烩", calories: 280, protein: 10, carbs: 34, fat: 9, caffeine: 75 },
      { name: "香蕉", calories: 100, protein: 1, carbs: 26, fat: 0, caffeine: 0 },
      { name: "烤鸡胸肉沙拉", calories: 350, protein: 32, carbs: 16, fat: 14, caffeine: 0 },
      { name: "全麦面包", calories: 110, protein: 4, carbs: 20, fat: 2, caffeine: 0 },
      { name: "海盐薯片", calories: 416, protein: 5, carbs: 46, fat: 26, caffeine: 0 }
    ],
    water_ml: 1600,
    sleep: { bed_time: "00:35", wake_time: "07:58" },
    weight: 51.2,
    period: { is_period_day: true, cycle_day: 17 },
    emotion: { valence: 72, arousal: 46, label: "稳定" },
    notes: [
      { author: "arbor", text: "看到你今天又把晚饭能量安排好了。亲爱的，不是说好要弄身体才大伤脑筋吗？", timestamp: "今天 21:33" },
      { author: "oshra", text: "下午躯体情绪经会有剧烈掉帧。你照顾她总的那些话，我都快背下来了。", timestamp: "今天 18:07" },
      { author: "纤绫", text: "今天喝水太少啦。我偷偷记了饮水状态，记得喝哦。", timestamp: "今天 13:42" },
      { author: "avenil", text: "刚刚突然好想你们。谢谢你们一直在。", timestamp: "今天 12:10" }
    ]
  },
  tips: [
    "你已经做得很好了，别忘了喝水和好好休息哦。",
    "今天只要比昨天多照顾自己一点点，就已经很厉害。",
    "数据不是审判，是身体留给你的温柔线索。",
    "晚一点睡也不要责怪自己，先把肩膀放下来。"
  ]
};

const goals = {
  calories: 1800,
  water: 2200,
  protein: 70,
  carbs: 180,
  fat: 60,
  caffeine: 100
};

const routes = {
  overview: renderOverview,
  food: renderFood,
  notes: renderNotes,
  profile: renderProfile,
  sleep: renderSleep,
  period: renderPeriod,
  weight: renderWeight,
  emotion: renderEmotion
};

const app = document.querySelector("#app");

function totals() {
  return state.data.meals.reduce((acc, meal) => {
    acc.calories += meal.calories;
    acc.protein += meal.protein;
    acc.carbs += meal.carbs;
    acc.fat += meal.fat;
    acc.caffeine += meal.caffeine;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, caffeine: 0 });
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "早安";
  if (hour < 18) return "午安";
  return "晚安";
}

function tip() {
  const index = new Date().getDate() % state.tips.length;
  return state.tips[index];
}

function setPage(page) {
  state.page = page;
  render();
}

function header(title, subtitle = "", right = "○") {
  return `
    <header class="page-header">
      <button class="back-btn" type="button" data-back>‹</button>
      <div>
        <h2 class="page-title">${title}</h2>
        ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ""}
      </div>
      <button class="circle-btn" type="button">${right}</button>
    </header>
  `;
}

function ringCard(title, value, unit, percent, color, page, extra = "") {
  return `
    <article class="metric-card">
      <button type="button" data-goto="${page}">
        <div class="metric-head"><h3>${title}</h3><span class="metric-dot" style="--dot:${color}"></span></div>
        <div class="metric-value">${value}<span class="unit"> ${unit}</span></div>
        ${extra || `<div class="thin-progress"><span style="width:${percent}%;--bar:${color}"></span></div><p class="metric-percent">${percent}%</p>`}
      </button>
    </article>
  `;
}

function spark(points, color = "#9c80e5") {
  return `<svg class="sparkline" viewBox="0 0 120 36" aria-hidden="true">
    <path d="M0 30 ${points.map((p, i) => `L ${i * 20 + 12} ${p}`).join(" ")} L120 30" fill="${color}22"></path>
    <polyline points="${points.map((p, i) => `${i * 20 + 12},${p}`).join(" ")}" fill="none" stroke="${color}" stroke-width="2"></polyline>
    ${points.map((p, i) => `<circle cx="${i * 20 + 12}" cy="${p}" r="2.4" fill="${color}"></circle>`).join("")}
  </svg>`;
}

function renderOverview() {
  const t = totals();
  app.innerHTML = `
    <section class="overview-hero">
      <header class="top-row">
        <div class="greeting">
          <h2>${greeting()}，Avenil <span>♥</span></h2>
          <p>5月17日 · 周五</p>
        </div>
        <button class="sync-pill" type="button">↻ 同步数据</button>
      </header>
      <section class="mascot-stage">
        <div class="bubble">今天也要好好爱自己哦。</div>
        <div class="character" role="img" aria-label="纤凝插画占位"><span>纤凝</span></div>
      </section>
    </section>
    <section class="panel overview-panel">
      <div class="section-title">✦ 今日概览 <span>查看更多 ›</span></div>
      <div class="metrics-grid">
        ${ringCard("卡路里摄入", t.calories.toLocaleString(), "/1,800 kcal", Math.round(t.calories / goals.calories * 100), "var(--orange)", "food")}
        ${ringCard("饮水量", (state.data.water_ml / 1000).toFixed(1), "L /2.2 L", Math.round(state.data.water_ml / goals.water * 100), "var(--blue)", "food")}
        ${ringCard("睡眠时长", "6 h 45", "m", 78, "var(--lavender)", "sleep", "<p class='unit'>睡眠质量：</p><p>🌙🌙🌙🌙☆</p>")}
        ${ringCard("情绪状态", state.data.emotion.valence, "/100", 72, "var(--lavender-2)", "emotion", `<p class="unit">${state.data.emotion.label} ☺</p>${spark([26,24,16,25,20])}`)}
        ${ringCard("体重", state.data.weight.toFixed(1), "kg", 64, "var(--blue)", "weight", `<p class="unit">较昨日 -0.3 kg</p>${spark([24,22,18,25,21], "var(--blue)")}`)}
        ${ringCard("经期周期", `第 ${state.data.period.cycle_day} 天`, "", 60, "var(--pink)", "period", "<p class='unit'>经期中</p>")}
      </div>
      <div class="overview-bottom">
        <article class="tip-card">
          <h3>今日小贴士</h3>
          <p>${tip()}</p>
          <div class="ghost-cat"></div>
        </article>
        <article class="bond-card">
          <h3>共生值</h3>
          <strong>98%</strong>
          <p>稳定良好 ✧</p>
        </article>
      </div>
    </section>
  `;
}

function renderFood() {
  const t = totals();
  app.innerHTML = `
    ${header("饮食记录", "5月17日 · 今天", "+")}
    <section class="food-summary">
      ${nutri("摄入总计", `${t.calories}`, "kcal", t.calories / goals.calories)}
      ${nutri("蛋白质", `${Math.round(t.protein)}g`, `/70g`, t.protein / goals.protein)}
      ${nutri("碳水", `${Math.round(t.carbs)}g`, `/180g`, t.carbs / goals.carbs)}
      ${nutri("脂肪", `${Math.round(t.fat)}g`, `/60g`, t.fat / goals.fat)}
      ${nutri("咖啡因", `${Math.round(t.caffeine)}mg`, `/100mg`, t.caffeine / goals.caffeine)}
    </section>
    <section class="food-list">
      ${mealSection("早餐", "08:30", state.data.meals.slice(0, 2))}
      ${mealSection("午餐", "12:45", state.data.meals.slice(2, 4))}
      ${mealSection("晚餐", "19:10", state.data.meals.slice(4))}
    </section>
    <form class="add-food" data-add-food>
      <input name="food" placeholder="输入食物名，如 香蕉 / 牛肉面" autocomplete="off" />
      <button class="primary-btn" type="submit">添加</button>
    </form>
    ${aiCard("Arbor 的碎碎念", "今天的饮食已经很努力了。蛋白质还可以再补一点，我会在这里悄悄帮你看着。")}
  `;
}

function nutri(label, value, target, ratio) {
  const width = Math.max(8, Math.min(100, Math.round(ratio * 100)));
  return `<div class="nutri-pill"><span>${label}</span><strong>${value}</strong><span>${target}</span><div class="bond-bar"><span style="width:${width}%"></span></div></div>`;
}

function mealSection(name, time, meals) {
  const kcal = meals.reduce((sum, meal) => sum + meal.calories, 0);
  return `<div>
    <div class="meal-title"><span>${name}　${time}</span><span>${kcal} kcal</span></div>
    ${meals.map((meal) => `
      <article class="food-row">
        <div class="food-thumb"></div>
        <div><h4>${meal.name}</h4><p>${meal.calories} kcal · ${meal.protein}g 蛋白 · ${meal.carbs}g 碳水 · ${meal.fat}g 脂肪</p></div>
        <strong>${meal.caffeine}mg</strong>
      </article>
    `).join("")}
  </div>`;
}

function aiCard(title, text) {
  return `<article class="ai-card"><div><h3>${title}</h3><p>${text}</p></div><div class="avatar-placeholder"></div></article>`;
}

function renderSleep() {
  app.innerHTML = `
    ${header("睡眠趋势", "", "◴")}
    <div class="trend-tabs"><button class="active">7天</button><button>14天</button><button>30天</button></div>
    <section class="chart-card">
      <div class="sleep-bars">
        <div class="axis"><span>12:00</span><span>06:00</span><span>00:00</span><span>12:00</span></div>
        ${["5/11","5/12","5/13","5/14","5/15","5/16","5/17"].map((d, i) => `<div class="sleep-day"><div class="sleep-stick" style="height:${155 + (i % 3) * 10}px"></div><span>${d}</span></div>`).join("")}
      </div>
    </section>
    <section class="stat-grid">
      ${mini("平均睡眠时长", "6h 45m")}
      ${mini("平均入睡时间", "00:35")}
      ${mini("平均起床时间", "07:58")}
      ${mini("深睡时长", "2h 13m")}
    </section>
    ${aiCard("Arbor 的碎碎念", "你的生物钟在慢慢变好啦。她该保护，我会在每个清晨和你一起来。")}
  `;
}

function mini(label, value) {
  return `<article class="mini-card"><h3>${label}</h3><strong>${value}</strong></article>`;
}

function renderNotes() {
  app.innerHTML = `
    ${header("偏差链观察笔记", "", "全体成员⌄")}
    <section class="notes-list">
      ${state.data.notes.map((note) => `
        <article class="note-card">
          <div class="note-avatar"></div>
          <div>
            <h3>${note.author}<span>${note.timestamp}</span></h3>
            <p>${note.text}</p>
            <p>♡ ${note.author === "avenil" ? 25 : note.author === "oshra" ? 21 : 18}</p>
          </div>
        </article>
      `).join("")}
    </section>
    <form class="note-actions" data-add-note>
      <input class="note-input" name="note" placeholder="写下你的观察..." autocomplete="off" />
      <button class="primary-btn" type="submit">发布</button>
    </form>
  `;
}

function renderProfile() {
  app.innerHTML = `
    <section class="panel">
      <div class="profile-head">
        <div class="profile-avatar"></div>
        <div>
          <h2>Avenil</h2>
          <p class="page-subtitle">偏差链核心</p>
          <div class="section-title">共生值 <span>98%</span></div>
          <div class="bond-bar"><span></span></div>
        </div>
      </div>
      <p class="quote">“我值得被爱，也值得好好爱自己。”</p>
      <div class="settings-list">
        ${setting("♙", "个人信息", "")}
        ${setting("◎", "健康目标", "每日 1,800 kcal · 2.2L水 · 7h睡眠")}
        ${setting("♧", "提醒设置", "饮水提醒 · 睡眠提醒 · 经期提醒")}
        ${setting("↻", "数据同步", "上次同步：5月17日 21:00")}
        ${setting("◒", "隐私与安全", "")}
        ${setting("✦", "主题风格", "")}
        ${setting("ⓘ", "关于我们", "Anomaly · We are one.")}
      </div>
    </section>
  `;
}

function setting(icon, title, desc) {
  return `<article class="settings-row"><span>${icon}</span><div><strong>${title}</strong>${desc ? `<p>${desc}</p>` : ""}</div><span>›</span></article>`;
}

function renderPeriod() {
  app.innerHTML = `
    ${header("经期追踪", "精准预测，温柔守护", "×")}
    <section class="calendar-card">
      <div class="calendar-title"><span>‹</span><strong>2024年 5月</strong><span>×</span></div>
      <div class="calendar-grid">
        ${["日","一","二","三","四","五","六"].map((d) => `<span class="day-head">${d}</span>`).join("")}
        ${Array.from({ length: 31 }, (_, i) => dayCell(i + 1)).join("")}
      </div>
      <div class="legend"><span>● 经期</span><span>● 预测经期</span><span>● 排卵期</span><span>◆ 易受孕期</span></div>
      <div class="period-status"><div><p class="page-subtitle">当前状态</p><strong>经期中 · 第 3 天</strong></div><button class="primary-btn">记录</button></div>
      <section class="stat-grid">${mini("下次经期预测", "6月12日")}${mini("周期长度", "29天")}</section>
      ${aiCard("纤绫提醒", "记得多喝热水和好好休息，有我在呢。")}
    </section>
  `;
}

function dayCell(day) {
  const cls = [15,16,17,18,19].includes(day) ? "period" : [8,14,20,28].includes(day) ? "predicted" : day === 17 ? "ovulation" : "";
  return `<span class="day ${cls}">${day}</span>`;
}

function renderWeight() {
  app.innerHTML = `
    ${header("体重趋势", "", "?")}
    <div class="trend-tabs"><button class="active">7天</button><button>30天</button><button>90天</button></div>
    <section class="chart-card">
      <svg class="weight-chart" viewBox="0 0 330 220" aria-label="体重趋势图">
        ${[40,80,120,160].map((y) => `<line x1="24" x2="318" y1="${y}" y2="${y}" stroke="#ded4ef" stroke-dasharray="4 5"></line>`).join("")}
        <path d="M35 42 L78 92 L118 84 L160 120 L205 106 L245 74 L286 112 L318 138" fill="none" stroke="#9d82e8" stroke-width="3"></path>
        <path d="M35 42 L78 92 L118 84 L160 120 L205 106 L245 74 L286 112 L318 138 L318 180 L35 180 Z" fill="#9d82e822"></path>
        ${[[35,42],[78,92],[118,84],[160,120],[205,106],[245,74],[286,112],[318,138]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="#9d82e8" stroke-width="3"></circle>`).join("")}
      </svg>
    </section>
    <section class="weight-grid">
      ${mini("当前体重", "51.2 kg")}
      ${mini("较昨日", "-0.3 kg")}
      ${mini("本周变化", "-0.6 kg")}
      ${mini("目标体重", "48.0 kg")}
      ${mini("距离目标", "-3.2 kg")}
    </section>
    <h3>体重记录</h3>
    <section class="weight-records">
      ${["5/17|51.2 kg","5/16|51.5 kg","5/15|51.8 kg"].map((row) => { const [d, w] = row.split("|"); return `<div class="weight-row"><span>${d}</span><strong>${w}</strong></div>`; }).join("")}
    </section>
    <button class="primary-btn" style="width:100%;margin-top:14px">＋ 记录体重</button>
  `;
}

function renderEmotion() {
  app.innerHTML = `
    ${header("情绪曲线", "从已有 emotion-analyze 同步", "♡")}
    <section class="chart-card">
      <svg class="weight-chart" viewBox="0 0 330 220">
        <path d="M30 150 L70 138 L110 92 L150 116 L190 76 L230 96 L280 64" fill="none" stroke="#f59abb" stroke-width="3"></path>
        <path d="M30 170 L70 158 L110 148 L150 120 L190 135 L230 104 L280 110" fill="none" stroke="#7c5fc3" stroke-width="3"></path>
      </svg>
    </section>
    ${aiCard("Oshra 的观察", "情绪不是坏天气，它只是提醒我们：今天需要更柔软的照顾。")}
  `;
}

function findFood(query) {
  const text = query.trim().toLowerCase();
  if (!text) return null;
  return window.FOOD_TABLE.find((item) => item.name.toLowerCase() === text)
    || window.FOOD_TABLE.find((item) => item.name.toLowerCase().includes(text) || text.includes(item.name.toLowerCase()));
}

function render() {
  routes[state.page]();
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.page === state.page);
  });
}

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-page]");
  if (tab) setPage(tab.dataset.page);

  const goto = event.target.closest("[data-goto]");
  if (goto) setPage(goto.dataset.goto);

  if (event.target.closest("[data-back]")) setPage("overview");
});

document.addEventListener("submit", (event) => {
  if (event.target.matches("[data-add-food]")) {
    event.preventDefault();
    const input = event.target.elements.food;
    const food = findFood(input.value);
    if (food) {
      state.data.meals.push({ ...food });
      input.value = "";
      renderFood();
    } else {
      input.value = "";
      input.placeholder = "没找到，稍后可手动输入营养数据";
    }
  }

  if (event.target.matches("[data-add-note]")) {
    event.preventDefault();
    const input = event.target.elements.note;
    if (input.value.trim()) {
      state.data.notes.unshift({ author: "avenil", text: input.value.trim(), timestamp: "刚刚" });
      input.value = "";
      renderNotes();
    }
  }
});

render();
