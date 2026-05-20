// 스트레칭 미션 목록 (12개)
const missions = [
    "양손을 깍지 끼고 앞으로 쭉 뻗기 (10초)",
    "어깨를 으쓱하고 3초간 멈췄다 툭 떨어뜨리기 (3회)",
    "손목을 천천히 바깥쪽으로 원 그리며 5번 돌리기",
    "손목을 천천히 안쪽으로 원 그리며 5번 돌리기",
    "오른팔을 왼쪽으로 뻗고 왼팔로 당겨주기 (10초)",
    "왼팔을 오른쪽으로 뻗고 오른팔로 당겨주기 (10초)",
    "두 팔을 위로 기지개 켜듯 시원하게 쭉 뻗기 (10초)",
    "목을 천천히 왼쪽, 오른쪽으로 번갈아가며 늘려주기",
    "양손을 등 뒤로 깍지 끼고 가슴을 활짝 펴기 (10초)",
    "손바닥이 앞을 향하게 하고 손가락을 몸 쪽으로 당겨주기 (10초)",
    "손등이 앞을 향하게 하고 손가락을 몸 쪽으로 당겨주기 (10초)",
    "양어깨를 천천히 뒤로 크게 원을 그리며 돌리기 (5회)"
];

// 미션마다 다른 이모지
const emojis = ["🙌", "🤷", "🔄", "🔄", "💪", "💪", "🙆", "🧘", "🤸", "🖐️", "🤚", "💫"];

// HTML 요소 가져오기
const missionArea  = document.getElementById("mission-area");
const drawBtn      = document.getElementById("draw-btn");
const completeBtn  = document.getElementById("complete-btn");
const countDisplay = document.getElementById("count-display");

// 완료 횟수 저장 변수
let completeCount = 0;

// ── 미션 뽑기 버튼 ──────────────────────────────────────
drawBtn.addEventListener("click", function () {
    // 0 ~ 11 사이의 랜덤 숫자
    const randomIndex = Math.floor(Math.random() * missions.length);

    // 미션 카드 내용 교체
    missionArea.innerHTML =
        '<p id="mission-text">' +
        emojis[randomIndex] + " " +
        missions[randomIndex] +
        '</p>';

    // 완료 버튼 활성화
    completeBtn.disabled = false;
});

// ── 미션 완료 버튼 ──────────────────────────────────────
completeBtn.addEventListener("click", function () {
    // 완료 횟수 증가 및 화면 업데이트
    completeCount++;
    countDisplay.textContent = completeCount;

    // 완료 메시지 추가
    const missionText = document.getElementById("mission-text");
    if (missionText) {
        const msg = document.createElement("span");
        msg.className = "complete-msg";
        msg.textContent = "✅ 완료했어요!";
        missionText.appendChild(msg);
    }

    // 완료 버튼 다시 비활성화 (다음 미션 뽑을 때까지)
    completeBtn.disabled = true;
});
