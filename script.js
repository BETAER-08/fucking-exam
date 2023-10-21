let timerInterval;
let stopwatchInterval;
let timerRunning = false;
let stopwatchRunning = false;
let timerMinutes = 0;
let timerSeconds = 0;
let stopwatchStartTime = 0;
let savedTimes = [];

// 현재 한국 시간을 업데이트하는 함수
function updateKoreaTime() {
    const koreaTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
    document.getElementById('current-korea-time').textContent = koreaTime;
}

setInterval(updateKoreaTime, 1000); // 1초마다 한국 시간 업데이트

function startTimer() {
    const minutesInput = parseInt(document.getElementById('minutes-input').value);
    const secondsInput = parseInt(document.getElementById('seconds-input').value);
    if (isNaN(minutesInput) || isNaN(secondsInput)|| minutesInput < 0 || secondsInput < 0) {
        alert('올바른 시간을 입력하세요.');
        return;
    }

    timerMinutes = minutesInput;
    timerSeconds = secondsInput;
    timerRunning = true;
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    timerMinutes = 0;
    timerSeconds = 0;
    updateTimerDisplay();
}

function updateTimer() {
    if (timerMinutes === 0 && timerSeconds === 0) {
        stopTimer();
        alert('타이머 종료');
    } else {
        if (timerSeconds === 0) {
            timerMinutes--;
            timerSeconds = 59;
        } else {
            timerSeconds--;
        }
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = `${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`;
}

function startStopwatch() {
    stopwatchRunning = true;
    stopwatchInterval = setInterval(updateStopwatch, 10);
    stopwatchStartTime = Date.now() - stopwatchStartTime;
}

function stopStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchStartTime = 0;
    document.getElementById('stopwatch').textContent = '00:00:000';
}

function updateStopwatch() {
    const elapsedTime = Date.now() - stopwatchStartTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = elapsedTime % 1000;
    document.getElementById('stopwatch').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
}

function saveTime() {
    const currentTime = document.getElementById('stopwatch').textContent;
    savedTimes.push(currentTime);

    const savedTimesList = document.getElementById('saved-times');
    const listItem = document.createElement('li');
    listItem.textContent = currentTime;
    savedTimesList.appendChild(listItem);
}
function clearTimes() {
    savedTimes = [];
    const savedTimesList = document.getElementById('saved-times');
    savedTimesList.innerHTML = ''; // 기록 삭제 버튼 클릭 시 목록 비우기
}

var selectedMemoIndex = null;

function saveMemo() {
    var memoTitle = document.getElementById("memoTitle").value;
    var memoContent = document.getElementById("editor").value;

    if (!memoTitle || !memoContent) {
        alert("제목과 내용을 모두 입력하세요.");
        return;
    }

    // 저장된 메모 목록을 불러옵니다.
    var savedMemos = JSON.parse(localStorage.getItem("memos")) || [];

    if (selectedMemoIndex !== null && selectedMemoIndex >= 0 && selectedMemoIndex < savedMemos.length) {
        // 선택한 메모를 업데이트합니다.
        savedMemos[selectedMemoIndex].title = memoTitle;
        savedMemos[selectedMemoIndex].content = memoContent;
    } else {
        // 새 메모 객체를 생성하고 목록에 추가합니다.
        var newMemo = { title: memoTitle, content: memoContent };
        savedMemos.push(newMemo);
    }

    // 메모 목록을 로컬 스토리지에 저장합니다.
    localStorage.setItem("memos", JSON.stringify(savedMemos));

    // 입력 필드 초기화
    document.getElementById("memoTitle").value = "";
    document.getElementById("editor").value = "";

    // 선택된 메모 인덱스 초기화
    selectedMemoIndex = null;

    // 메모 목록을 업데이트합니다.
    updateMemoList();
}

function exportMemo() {
    var memoContent = document.getElementById("editor").value;

    if (!memoContent) {
        alert("내보낼 메모가 없습니다.");
        return;
    }

    // Blob 객체를 생성하여 메모를 저장할 수 있는 파일로 변환합니다.
    var blob = new Blob([memoContent], { type: 'text/plain' });

    // 다운로드 링크를 생성하고 클릭합니다.
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'memo.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function updateMemoList() {
    var memoList = document.getElementById("memoList");
    memoList.innerHTML = ""; // 목록 초기화

    // 저장된 메모 목록을 불러옵니다.
    var savedMemos = JSON.parse(localStorage.getItem("memos")) || [];

    // 각 메모를 목록에 추가합니다.
    savedMemos.forEach(function(memo, index) {
        var listItem = document.createElement("li");
        listItem.innerHTML = `<a href="#" onclick="editMemo(${index})">${memo.title}</a> <button onclick="deleteMemo(${index})">삭제</button>`;
        memoList.appendChild(listItem);
    });
}

function deleteMemo(index) {
    // 저장된 메모 목록을 불러옵니다.
    var savedMemos = JSON.parse(localStorage.getItem("memos")) || [];

    // 선택한 메모를 목록에서 삭제합니다.
    savedMemos.splice(index, 1);

    // 메모 목록을 로컬 스토리지에 저장합니다.
    localStorage.setItem("memos", JSON.stringify(savedMemos));

    // 메모 목록을 업데이트합니다.
    updateMemoList();
}

function editMemo(index) {
    selectedMemoIndex = index;

    // 저장된 메모 목록을 불러옵니다.
    var savedMemos = JSON.parse(localStorage.getItem("memos")) || [];

    // 선택한 메모를 편집하기 위해 해당 메모의 내용을 편집 폼에 채웁니다.
    var selectedMemo = savedMemos[index];
    if (selectedMemo) {
        document.getElementById("memoTitle").value = selectedMemo.title;
        document.getElementById("editor").value = selectedMemo.content;
    }
}

// 글자 수 표시 업데이트
function updateCharCount() {
    var memoContent = document.getElementById("editor").value;
    var charCountElement = document.getElementById("charCount");
    charCountElement.textContent = "글자 수: " + memoContent.length;
}

// 페이지 로드 시 메모 목록을 업데이트합니다.
window.onload = function() {
    updateMemoList();
    updateCharCount(); // 초기 글자 수 업데이트
}
function redirectToHTML(htmlFileName) {
    window.location.href = htmlFileName;
}
function redirectToLink(link) {
    window.location.href = link;
}