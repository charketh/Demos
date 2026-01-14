const checkInBtn = document.getElementById('check-in-btn');
const todayCountEl = document.getElementById('today-count');
const recordsList = document.getElementById('records-list');

const STORAGE_KEY = 'water-tracker-records';

function loadRecords() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function isToday(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}

function updateTodayCount() {
  const records = loadRecords();
  const todayRecords = records.filter(record => isToday(record.timestamp));
  todayCountEl.textContent = todayRecords.length;
}

function renderRecords() {
  const records = loadRecords();

  if (records.length === 0) {
    recordsList.innerHTML = '<p class="empty-message">暂无打卡记录</p>';
    return;
  }

  recordsList.innerHTML = records
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(record => `
      <div class="record-item">
        <span class="record-time">${formatTime(record.timestamp)}</span>
        <span class="record-icon">💧</span>
      </div>
    `)
    .join('');
}

function addRecord() {
  const records = loadRecords();
  const newRecord = {
    id: Date.now(),
    timestamp: Date.now()
  };
  records.push(newRecord);
  saveRecords(records);

  updateTodayCount();
  renderRecords();

  checkInBtn.classList.add('check-in-animation');
  setTimeout(() => {
    checkInBtn.classList.remove('check-in-animation');
  }, 300);
}

checkInBtn.addEventListener('click', addRecord);

updateTodayCount();
renderRecords();
