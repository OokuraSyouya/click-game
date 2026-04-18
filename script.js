let level = 1;
const levelText = document.getElementById("level");
let score = 0;
let timeLeft = 10;
let gameOver = false;
let timerId = null;

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const timeText = document.getElementById("time");
const clickButton = document.getElementById("clickButton");
const restartButton = document.getElementById("restartButton");
const resetButton = document.getElementById("resetButton");

const clickSound = new Audio("click.mp3");
const levelUpSound = new Audio("levelup.mp3");

// 累計スコアを読み込む
let totalScore = localStorage.getItem("totalScore");
if (totalScore === null) {
  totalScore = 0;
}
totalScore = Number(totalScore);

const totalScoreText = document.getElementById("totalScore");
totalScoreText.textContent = totalScore;

// レベルを読み込む
let savedLevel = localStorage.getItem("level");
if (savedLevel !== null) {
  level = Number(savedLevel);
}
levelText.textContent = level;

// --- ハイスコア読み込み ---
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
  highScore = 0;
}
highScoreText.textContent = highScore;

function updateLevel() {
  const previousLevel = level; // ★ 前のレベルを保存

  // レベル計算（50ポイントごと）
  level = Math.floor(totalScore / 50) + 1;

  // ★ レベルアップしていたら音を鳴らす
  if (level > previousLevel) {
    levelUpSound.currentTime = 0;
    levelUpSound.play();
  }

  levelText.textContent = level;
  localStorage.setItem("level", level);
}

// --- ゲーム開始処理 ---
function startGame() {
  score = 0;
  timeLeft = 10;
  gameOver = false;

  scoreText.textContent = score;
  timeText.textContent = timeLeft;

  clickButton.disabled = false;
  restartButton.style.display = "none";

  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timeText.textContent = timeLeft;
    } else {
      endGame();
    }
  }, 1000);
}

// --- ゲーム終了処理 ---
function endGame() {
  gameOver = true;
  clickButton.disabled = true;
  clearInterval(timerId);

  // 累計スコアに加算
  totalScore += score;
  localStorage.setItem("totalScore", totalScore);
  totalScoreText.textContent = totalScore;

  // ★ レベル更新
  updateLevel();

  // ハイスコア更新
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreText.textContent = highScore;
  }

  alert(
    "ゲーム終了！\n" +
    "今回のスコア：" + score + "\n" +
    "累計スコア：" + totalScore + "\n" +
    "レベル：" + level
  );

  restartButton.style.display = "inline";
}


// --- クリック処理 ---
clickButton.addEventListener("click", () => {
  if (gameOver) return;

  score++;
  scoreText.textContent = score;

  clickSound.currentTime = 0;
  clickSound.play();
});

// --- データリセット処理 ---
resetButton.addEventListener("click", () => {
  const result = confirm(
    "ハイスコア・レベル・累計スコアをすべてリセットします。\n本当によろしいですか？"
  );

  if (!result) return;

  // localStorage を削除
  localStorage.removeItem("highScore");
  localStorage.removeItem("totalScore");
  localStorage.removeItem("level");

  // 変数を初期化
  highScore = 0;
  totalScore = 0;
  level = 1;

  // 表示を更新
  highScoreText.textContent = highScore;
  totalScoreText.textContent = totalScore;
  levelText.textContent = level;

  alert("データをリセットしました！");
});

// --- リスタート処理 ---
restartButton.addEventListener("click", () => {
  startGame();
});

// 最初にゲーム開始
startGame();