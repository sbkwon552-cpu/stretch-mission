// ── 상태 ──────────────────────────────────────────────────────────────────────
const state = {
  sitTime: 0, moveCount: 0, streak: 0, exp: 0,
  totalMissions: 0, lastActiveTime: Date.now(), gauge: 100,
  settings: { alertInterval: 10, sensitivity: 'normal' },
  unlockedAchievements: []
};

// ── 레벨 테이블 ───────────────────────────────────────────────────────────────
const LEVEL_TABLE = [
  { level: 1,  minExp: 0,    name: '새싹'       },
  { level: 5,  minExp: 100,  name: '순환 입문자' },
  { level: 10, minExp: 300,  name: '움직임 마스터'},
  { level: 20, minExp: 1000, name: '대사 엔진'   }
];

// ── 미션 풀 (별점 기반) ───────────────────────────────────────────────────────
const MISSION_POOL = [
  { id: 1,  title: '물 마시기',         rating: 5, desc: '자리에서 일어나 시원한 물을 한 컵 마시고 대사를 깨우세요.',                     level: 'EASY',   time: 0  },
  { id: 2,  title: '자리에서 일어나기', rating: 5, desc: '의자에서 일어나서 15초간 올바른 자세로 서 있어 보세요.',                         level: 'EASY',   time: 15 },
  { id: 3,  title: '종아리 들기',       rating: 5, desc: '의자나 벽을 잡고 뒤꿈치를 올렸다 내렸다 20회 반복합니다. (제2의 심장 자극)',     level: 'EASY',   time: 20 },
  { id: 4,  title: '100걸음 걷기',      rating: 5, desc: '주변 공간을 활용해 가볍게 100걸음 걸어보세요.',                                 level: 'NORMAL', time: 60 },
  { id: 5,  title: '기지개',            rating: 5, desc: '양팔을 하늘 위로 뻗어 척추 마디마디를 늘려주듯 쭉 펴세요.',                     level: 'EASY',   time: 10 },
  { id: 6,  title: '허리 펴기',         rating: 4, desc: '굽어 있던 등과 허리를 곧게 펴고 등 근육을 가볍게 조여줍니다.',                   level: 'EASY',   time: 10 },
  { id: 7,  title: '목 스트레칭',       rating: 4, desc: '고개를 좌, 우, 앞, 뒤로 천천히 늘려주며 목덜미 굳은 근육을 풀어주세요.',         level: 'EASY',   time: 15 },
  { id: 8,  title: '햇빛 보기',         rating: 4, desc: '창문 근처나 야외로 나가 맑은 햇빛을 바라보며 세로토닌을 충전하세요.',             level: 'EASY',   time: 20 },
  { id: 9,  title: '심호흡',            rating: 4, desc: '코로 깊게 숨을 들이마시고 입으로 천천히 내쉬기를 3회 반복합니다.',               level: 'EASY',   time: 15 },
  { id: 10, title: '발목 돌리기',       rating: 4, desc: '양쪽 발목을 부드럽게 시계 방향, 반시계 방향으로 돌려주세요.',                     level: 'EASY',   time: 10 },
  { id: 11, title: '어깨 돌리기',       rating: 4, desc: '손 끝을 어깨에 대고 앞뒤로 커다란 원을 그리며 회전시킵니다.',                     level: 'EASY',   time: 10 },
  { id: 12, title: '눈 쉬기',           rating: 4, desc: '전자기기 화면을 끄고 눈을 감은 상태로 따뜻한 손바닥을 대어 휴식을 줍니다.',       level: 'EASY',   time: 20 },
  { id: 13, title: '제자리 걷기',       rating: 4, desc: '허벅지를 평소보다 조금 더 높게 들어 올리며 제자리에서 30초간 걷습니다.',           level: 'NORMAL', time: 30 },
  { id: 14, title: '스쿼트 5회',        rating: 3, desc: '무릎이 발끝 앞으로 나가지 않도록 주의하며 가볍게 5회 앉았다 일어납니다.',         level: 'NORMAL', time: 25 },
  { id: 15, title: '계단 오르기',       rating: 3, desc: '가까운 계단으로 가서 1개 층 혹은 2개 층을 사뿐히 올라가 보세요.',                 level: 'HARD',   time: 45 },
  { id: 16, title: '서서 통화하기',     rating: 3, desc: '통화할 일이 있다면 의자에서 일어나 서서 혹은 걸어 다니며 통화하세요.',             level: 'EASY',   time: 60 },
  { id: 17, title: '창밖 보기',         rating: 3, desc: '모니터 대신 멀리 있는 산, 건물, 혹은 하늘을 10초 이상 응시하세요.',               level: 'EASY',   time: 10 },
  { id: 18, title: '다리 떨기',         rating: 3, desc: '앉은 상태에서 발꿈치를 살짝 들고 가볍게 다리를 떨어 하체 혈류를 촉진합니다.',     level: 'EASY',   time: 15 },
  { id: 19, title: '박수치기',          rating: 2, desc: '양손을 마주 대고 힘차게 20회 박수를 쳐 손바닥 말초 신경을 자극하세요.',           level: 'EASY',   time: 10 },
  { id: 20, title: '춤추기',            rating: 2, desc: '좋아하는 신나는 음악에 맞춰 몸을 자유롭게 뚝딱거리며 30초간 흔들어보세요.',       level: 'HARD',   time: 30 }
];

const ACHIEVEMENTS = [
  { id: 'first_move', icon: '🌱', title: '첫 걸음마',    desc: '첫 번째 미션 완료'  },
  { id: 'streak_3',   icon: '🔥', title: '순환 회복 중', desc: '3일 연속 순환 성공' },
  { id: 'level_5',    icon: '🎖️', title: '순환 입문자',  desc: '레벨 5 달성'        }
];

// ── 유틸 ──────────────────────────────────────────────────────────────────────
function $ (id) { return document.getElementById(id); }

function showToast(msg, type = 'success') {
  const container = $('toast-container');
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'info' ? ' info' : '');
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function makeStars(rating) {
  return [1,2,3,4,5].map(s => `<span class="${s <= rating ? 'star-on' : 'star-off'}">★</span>`).join('');
}

function saveData() {
  localStorage.setItem('soonhwan_data', JSON.stringify(state));
}

function getLevelInfo(exp) {
  let info = LEVEL_TABLE[0];
  for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_TABLE[i].minExp) { info = LEVEL_TABLE[i]; break; }
  }
  return info;
}

function pickWeightedRandom() {
  const pool = [];
  MISSION_POOL.forEach(m => { for (let i = 0; i < m.rating; i++) pool.push(m); });
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── 초기화 ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initEvents();
  renderMissionList();
  renderAchievements();
  startTracking();
  setupActivityDetection();
});

function loadData() {
  const saved = localStorage.getItem('soonhwan_data');
  if (saved) {
    try { Object.assign(state, JSON.parse(saved)); } catch(e) {}
  }
  if (localStorage.getItem('soonhwan_onboarded') === 'true') {
    $('onboarding-screen').classList.add('hidden');
    $('main-interface').classList.remove('hidden');
  }
  updateUI();
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────
function initEvents() {
  // 온보딩
  $('btn-perm-noti').onclick = async () => {
    if ('Notification' in window) await Notification.requestPermission();
  };
  $('btn-perm-sensor').onclick = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(console.error);
    }
  };
  $('btn-start').onclick = () => {
    localStorage.setItem('soonhwan_onboarded', 'true');
    $('onboarding-screen').classList.add('hidden');
    $('main-interface').classList.remove('hidden');
  };

  // 네비게이션
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });

  // 홈 CTA
  $('btn-cta-mission').onclick = () => openMissionModal(pickWeightedRandom());

  // 모달 버튼
  $('btn-mission-complete').onclick = completeMission;
  $('btn-mission-close').onclick    = () => $('mission-modal').classList.add('hidden');

  // 설정
  $('setting-time').onchange = e => {
    state.settings.alertInterval = parseInt(e.target.value);
    saveData();
  };
  $('setting-sensitivity').onchange = e => {
    state.settings.sensitivity = e.target.value;
    saveData();
  };
  $('btn-reset-data').onclick = () => {
    if (confirm('모든 활동 통계와 레벨이 초기화됩니다. 계속할까요?')) {
      localStorage.clear();
      location.reload();
    }
  };
}

// ── 탭 전환 ───────────────────────────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  $('tab-' + tabId).classList.remove('hidden');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  updateUI();
}

// ── 미션 목록 렌더 ────────────────────────────────────────────────────────────
function renderMissionList() {
  const sorted = [...MISSION_POOL].sort((a, b) => b.rating - a.rating);
  const container = $('mission-list-container');
  container.innerHTML = '';
  sorted.forEach(m => {
    const div = document.createElement('div');
    div.className = 'mission-item';
    div.innerHTML = `
      <div class="mission-item-left">
        <div class="mission-item-title">
          ${m.title}
          <span class="mission-badge ${m.level}">${m.level}</span>
        </div>
        <div class="mission-stars">${makeStars(m.rating)}</div>
      </div>
      <div class="mission-item-right">
        <div class="mission-time">${m.time > 0 ? m.time + '초' : '자유'}</div>
        <div class="mission-exp">+${m.rating * 5} EXP</div>
      </div>`;
    div.onclick = () => openMissionModal(m);
    container.appendChild(div);
  });
}

// ── 업적 렌더 ─────────────────────────────────────────────────────────────────
function renderAchievements() {
  const container = $('achievements-list');
  container.innerHTML = '';
  ACHIEVEMENTS.forEach(ach => {
    const unlocked = state.unlockedAchievements.includes(ach.id);
    const div = document.createElement('div');
    div.className = 'achieve-card' + (unlocked ? ' unlocked' : '');
    div.innerHTML = `
      <div class="achieve-icon">${ach.icon}</div>
      <div class="achieve-title">${ach.title}</div>
      <div class="achieve-desc">${ach.desc}</div>
      ${unlocked ? '<span class="achieve-tag">달성!</span>' : ''}`;
    container.appendChild(div);
  });
}

// ── 추적 타이머 ───────────────────────────────────────────────────────────────
function startTracking() {
  setInterval(() => {
    const inactiveSecs = Math.floor((Date.now() - state.lastActiveTime) / 1000);

    // 5초마다 앉은 시간 +1, 게이지 -6
    if (inactiveSecs > 0 && inactiveSecs % 5 === 0) {
      state.sitTime++;
      state.gauge = Math.max(0, state.gauge - 6);
      updateUI();
    }

    // 알림 주기 도달 시 경고
    const ai = state.settings.alertInterval;
    if (inactiveSecs >= ai && inactiveSecs % ai === 0) {
      let msg = '혈액순환 타임! 가볍게 움직여볼까요?';
      if (inactiveSecs >= ai * 3) msg = '몸이 조금 굳었어요. 가벼운 미션으로 순환을 회복하세요!';
      else if (inactiveSecs >= ai * 2) msg = '한 자세가 오래 지속되고 있어요. 종아리가 쉬고 싶대요.';
      $('status-message').textContent = msg;
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('순환중 알림', { body: msg });
      }
    }
  }, 1000);
}

// ── 활동 감지 ─────────────────────────────────────────────────────────────────
function setupActivityDetection() {
  let lastTrigger = Date.now();
  function onActivity() {
    const now = Date.now();
    if (now - lastTrigger < 3000) return;
    lastTrigger = now;
    state.lastActiveTime = now;
    state.moveCount++;
    state.gauge = Math.min(100, state.gauge + 4);
    updateUI();
  }
  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const total = Math.abs(acc.x||0) + Math.abs(acc.y||0) + Math.abs(acc.z||0);
    const thresh = state.settings.sensitivity === 'low' ? 20 : state.settings.sensitivity === 'high' ? 10 : 15;
    if (total > thresh) onActivity();
  });
  ['mousemove','keydown','touchstart','scroll'].forEach(ev => {
    window.addEventListener(ev, onActivity, { passive: true });
  });
}

// ── 미션 모달 ─────────────────────────────────────────────────────────────────
let activeMission = null;
let countdownTimer = null;

function openMissionModal(mission) {
  activeMission = mission;
  clearInterval(countdownTimer);

  const badgeEl = $('modal-mission-badge');
  badgeEl.textContent = mission.level;
  badgeEl.className = 'badge ' + mission.level;

  $('modal-star-rating').innerHTML = makeStars(mission.rating);
  $('modal-mission-title').textContent = mission.title;
  $('modal-mission-desc').textContent  = mission.desc;
  $('modal-exp-preview').textContent   = '완료 시 +' + (mission.rating * 5) + ' EXP 획득';

  const timerEl = $('mission-timer');
  if (mission.time > 0) {
    timerEl.classList.remove('hidden');
    let remain = mission.time;
    timerEl.textContent = fmt(remain);
    timerEl.classList.remove('urgent');
    countdownTimer = setInterval(() => {
      remain--;
      timerEl.textContent = fmt(remain);
      if (remain <= 5) timerEl.classList.add('urgent');
      if (remain <= 0 || $('mission-modal').classList.contains('hidden')) clearInterval(countdownTimer);
    }, 1000);
  } else {
    timerEl.classList.add('hidden');
  }

  $('mission-modal').classList.remove('hidden');
}

function fmt(s) {
  return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
}

function completeMission() {
  if (!activeMission) return;
  clearInterval(countdownTimer);

  const earned = activeMission.rating * 5;
  state.exp          += earned;
  state.totalMissions++;
  state.gauge         = Math.min(100, state.gauge + 35);
  if (state.streak === 0) state.streak = 1;

  // 업적 해제
  const unlock = (id) => {
    if (!state.unlockedAchievements.includes(id)) {
      state.unlockedAchievements.push(id);
      const a = ACHIEVEMENTS.find(a => a.id === id);
      if (a) showToast('업적 달성: ' + a.title + '!');
    }
  };
  if (state.totalMissions === 1) unlock('first_move');
  if (state.streak >= 3)         unlock('streak_3');
  if (getLevelInfo(state.exp).level >= 5) unlock('level_5');

  $('mission-modal').classList.add('hidden');
  showToast('미션 완료! +' + earned + ' EXP 획득');
  saveData();
  renderAchievements();
  updateUI();
}

function unlockAchievement(id) {
  if (!state.unlockedAchievements.includes(id)) {
    state.unlockedAchievements.push(id);
    const a = ACHIEVEMENTS.find(a => a.id === id);
    if (a) showToast('업적 달성: ' + a.title + '!');
  }
}

// ── UI 전체 업데이트 ──────────────────────────────────────────────────────────
function updateUI() {
  const lvl = getLevelInfo(state.exp);
  $('user-level').textContent      = lvl.level;
  $('user-level-name').textContent = lvl.name;

  // 게이지
  const g = Math.max(0, Math.min(100, state.gauge));
  $('circulation-gauge').style.width = g + '%';

  // 상태 메시지 (경고 없을 때)
  const inactiveSecs = Math.floor((Date.now() - state.lastActiveTime) / 1000);
  const ai = state.settings.alertInterval;
  if (inactiveSecs < ai) {
    if (g > 70)      $('status-message').textContent = '순환 상태 좋아요!';
    else if (g > 40) $('status-message').textContent = '슬슬 움직일 때가 됐어요.';
    else             $('status-message').textContent = '순환이가 힘들어해요. 지금 움직여요!';
  }

  // 캐릭터 상태
  const ch = $('character-soonhwan');
  ch.className = 'character ' + (g > 60 ? 'status-good' : g > 30 ? 'status-warning' : 'status-bad');
  const heart = ch.querySelector('.character-heart');
  const hc = g <= 30 ? '#7f8c8d' : '#ff4757';
  heart.style.background = hc;
  heart.querySelectorAll('*').forEach(el => el.style.background = hc);

  // 대시보드
  $('dash-sit-time').textContent  = state.sitTime + '분';
  $('dash-move-count').textContent = state.moveCount + '회';
  $('dash-streak').textContent    = state.streak;

  // 통계
  $('stat-exp').textContent           = state.exp + ' XP';
  $('stat-calories').textContent      = (state.totalMissions * 5) + ' kcal';
  $('stat-total-missions').textContent = state.totalMissions + '개';

  // 설정 select 동기화
  $('setting-time').value        = state.settings.alertInterval;
  $('setting-sensitivity').value = state.settings.sensitivity;
}