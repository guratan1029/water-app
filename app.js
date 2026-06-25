

// ====== Drink Types ======
const drinkTypes = {
  water: { name: "水", color: "#4FC3F7", caffeine: 0, hydrationRate: 1.0 },
  coffee: { name: "コーヒー", color: "#6F4E37", caffeine: 80, hydrationRate: 0.8 },
  tea: { name: "お茶", color: "#8BC34A", caffeine: 30, hydrationRate: 0.9 },
  sports: { name: "スポーツドリンク", color: "#FF9800", caffeine: 0, hydrationRate: 1.1 },
  juice: { name: "ジュース", color: "#FF5722", caffeine: 0, hydrationRate: 0.9 },
  energy: { name: "エナジードリンク", color: "#bdff22", caffeine: 120, hydrationRate: 0.5 }
};

// ====== 日付リセット ======
function getDateString(date = new Date()) {
  return date.toISOString().split("T")[0];
}

const today = getDateString();
const savedDate = localStorage.getItem("date");


if (savedDate !== today) {
  localStorage.setItem("date", today);

  // 今日の合計だけリセット（必要なら）
  localStorage.setItem("total", 0);

  // drinkLog は消さない！！
  // localStorage.setItem("drinkLog", JSON.stringify([])); ← 削除
}

function getDateString(date = new Date()) {
  return date.toISOString().split("T")[0]; // "2026-06-25"
}


let drinkLog = JSON.parse(localStorage.getItem("drinkLog")) || [];

// ====== 目標量 ======
let goal = Number(localStorage.getItem("goal")) || 1500;

// ====== 記録 ======
function recordDrink(amount, type) {
  const now = Date.now();

  drinkLog.push({ time: now, amount, type });
  localStorage.setItem("drinkLog", JSON.stringify(drinkLog));

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "updateLastDrink",
      time: now
    });
  }
}

// ====== 今日の合計 ======
function getTodayTotal() {
  const today = getDateString();

  return drinkLog
    .filter(e => getDateString(new Date(e.time)) === today)
  
}

// ====== 今日のカフェイン ======
function getTodayCaffeine() {
  const today = getDateString();

  return drinkLog
    .filter(e => getDateString(new Date(e.time)) === today)
  
}

// ====== 実質水分量 ======
function getTodayEffectiveHydration() {
  const today = getDateString();

  return drinkLog
    .filter(e => getDateString(new Date(e.time)) === today)
  
}

// ====== 飲みすぎチェック（30分以内） ======
function checkOverdrink(amount) {
  const now = Date.now();
  const THIRTY_MIN = 30 * 60 * 1000;

  const recent = drinkLog.filter(e => now - e.time < THIRTY_MIN);
  const recentTotal = recent.reduce((sum, e) => sum + e.amount, 0) + amount;

  if (recentTotal >= 800) {
    alert("短時間での飲みすぎに注意してください！");
  }
}

// ====== リマインダー ======
const REMIND_INTERVAL_MS = 2 * 60 * 60 * 1000;
let nextNotifyTime = Number(localStorage.getItem("nextNotifyTime")) || 0;

setInterval(() => {
  if (drinkLog.length === 0) return;

  const last = drinkLog[drinkLog.length - 1].time;
  const now = Date.now();

  if (now >= nextNotifyTime && now - last >= REMIND_INTERVAL_MS) {
    new Notification("そろそろ水を飲みましょう！");
    nextNotifyTime = now + REMIND_INTERVAL_MS;
    localStorage.setItem("nextNotifyTime", nextNotifyTime);
  }
}, 60000);

// ====== UI ======
function updateUI() {
  const total = getTodayTotal();
  const caffeine = getTodayCaffeine();
  const effective = getTodayEffectiveHydration();

  document.getElementById("total").textContent = `今日の摂取量：${total} ml`;
  document.getElementById("caffeineDisplay").textContent = `今日のカフェイン：${caffeine} mg`;
  document.getElementById("effectiveDisplay").textContent = `実質水分量：${Math.floor(effective)} ml`;
  document.getElementById("goalDisplay").textContent = `目標：${goal} ml`;

  const percent = Math.min(100, (total / goal) * 100);
  const bar = document.getElementById("progressBar");
  bar.style.width = percent + "%";
  bar.textContent = `${Math.floor(percent)}%`;

  updatePresetButtons();
}

// ====== よく使う量 ======
function updatePresetButtons() {
  const area = document.getElementById("presetButtons");
  area.innerHTML = "";

  if (drinkLog.length === 0) return;

  const count = {};
  drinkLog.forEach(e => {
    count[e.amount] = (count[e.amount] || 0) + 1;
  });

  Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([value]) => {
      const btn = document.createElement("button");
      btn.textContent = `${value}ml`;
      btn.onclick = () => addWater(Number(value));
      area.appendChild(btn);
    });
}

// ====== 追加 ======
function addWater(amountFromPreset = null) {
  const drinkType = document.getElementById("drinkTypeSelect").value;
  let amount = amountFromPreset ?? Number(document.getElementById("drinkInput").value);

  if (amount <= 0) {
    alert("正しい量を入力してください");
    return;
  }

  checkOverdrink(amount);
  recordDrink(amount, drinkType);

  updateUI();

  if (amountFromPreset === null) {
    document.getElementById("drinkInput").value = "";
  }
}

function resetwater() {
  const ok = confirm("本当にリセットしますか？\n今日の摂取量が 0 になります。");
  if (!ok) return;

  // 今日のログだけ削除
  const today = getDateString();

  drinkLog = drinkLog.filter(entry => {
    return getDateString(new Date(entry.time)) !== today;
  });
  

  localStorage.setItem("drinkLog", JSON.stringify(drinkLog));

  updateUI();
}


function setGoal() {
  const input = document.getElementById("goalInput").value;
  if (!input) return;

  goal = Number(input);
  localStorage.setItem("goal", goal);

  updateUI();
}



function openCalcModal() {
  document.getElementById("calcModal").style.display = "flex";
}

function closeCalcModal() {
  document.getElementById("calcModal").style.display = "none";
}

function calculateGoal() {
  const weight = Number(document.getElementById("weightInput").value);
  const age = Number(document.getElementById("ageInput").value);

  if (!weight || !age) {
    alert("年齢と体重を入力してください");
    return;
  }

  let mlPerKg = age <= 64 ? 35 : 25;
  const goalAmount = weight * mlPerKg;

  goal = goalAmount;
  localStorage.setItem("goal", goal);

  updateUI();
  alert(`あなたの1日の目標水分量は ${goal} ml です！`);

  closeCalcModal();
}

function openLogModal() {
  showDrinkLog();
  document.getElementById("logModal").style.display = "flex";
}

function closeLogModal() {
  document.getElementById("logModal").style.display = "none";
}



function showDrinkLog() {
  const area = document.getElementById("drinkLogArea");
  area.innerHTML = "";

  if (drinkLog.length === 0) {
    area.textContent = "まだ記録がありません";
    return;
  }

  drinkLog
    .slice()
    .sort((a, b) => a.time - b.time)
    .forEach(entry => {
      const date = new Date(entry.time);
      const typeName = drinkTypes[entry.type]?.name || "不明";

      const p = document.createElement("p");
      p.textContent = `${date.toLocaleTimeString()} に ${typeName} を ${entry.amount}ml`;
      area.appendChild(p);
    });
}

// ====== 週間データ取得 ======
function getWeeklyData() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);

    days.push({
      date: d.toISOString().slice(0, 10),
      total: 0
    });
  }

  drinkLog.forEach(entry => {
    const entryDate = new Date(entry.time);
    entryDate.setHours(0, 0, 0, 0);
    const key = entryDate.toISOString().slice(0, 10);

    const day = days.find(d => d.date === key);
    if (day) {
      day.total += entry.amount;
    }
  });

  return days;
}

let weekChartInstance = null;

function renderWeeklyChart() {
  const data = getWeeklyData();
  const labels = data.map(d => d.date);
  const totals = data.map(d => d.total);

  if (weekChartInstance) {
    weekChartInstance.destroy();
  }

  const ctx = document.getElementById("weekChart");
  weekChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "1日の摂取量 (ml)",
        data: totals,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}


// ====== 初期表示 ======
updateUI();
