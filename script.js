let level = 1;
const levelText = document.getElementById("level");
let score = 0;
let timeLeft = 10;
let gameOver = false;
let timerId = null;
let combo = 0;
let lastTapTime = 0;

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const timeText = document.getElementById("time");
const clickButton = document.getElementById("clickButton");
const restartButton = document.getElementById("restartButton");
const resetButton = document.getElementById("resetButton");


const MAX_HP = 500;
let hp = localStorage.getItem("hp");

if (hp === null) {
  hp = MAX_HP;
} else {
  hp = Number(hp);
}


const hpBar = document.getElementById("hpBar");
const hpText = document.getElementById("hpText");

function updateHPDisplay() {
  const percentage = (hp / MAX_HP) * 100;
  hpBar.style.width = percentage + "%";
  hpText.textContent = `HP: ${hp} / ${MAX_HP}`;
}


// ---エフェクト表示---
const comboText = document.getElementById("comboText");

function showComboEffect() {
  if (combo <= 1) {
    comboText.textContent = "";
    return;
  }

  comboText.textContent = combo + " COMBO!";
  comboText.classList.remove("combo");
  void comboText.offsetWidth;
  comboText.classList.add("combo");

  // ✅ 10コンボごとにフラッシュ
  if (combo % 10 === 0) {
    document.body.classList.remove("flash");
    void document.body.offsetWidth;
    document.body.classList.add("flash");
  }


}



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



// --- タップエフェクト ---
function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.offsetX - radius}px`;
  circle.style.top = `${event.offsetY - radius}px`;
  circle.classList.add("ripple");

  // 既存のエフェクトを削除
  const existingRipple = button.querySelector(".ripple");
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(circle);
}

// ---コンボ---
function updateCombo() {
  const now = Date.now();
  const diff = now - lastTapTime;

  if (diff < 600) {
    combo++;
  } else {
    combo = 1;
  }

  lastTapTime = now;
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
clickButton.addEventListener("click", (event) => {
  createRipple(event);

  if (gameOver) return;
 if (hp <= 0) {
  alert("敵を倒した！");
  hp = MAX_HP;
  localStorage.setItem("hp", hp);
  updateHPDisplay();
  return;
}
  updateCombo();

  // スコア加算
  score ++;
  scoreText.textContent = score;



 // ✅ HPを減らす
  hp -= 1;
  if (hp < 0) hp = 0;

  localStorage.setItem("hp", hp);
  updateHPDisplay();




  clickSound.currentTime = 0;
  clickSound.play();

  showComboEffect();
});

// --- データリセット処理 ---
resetButton.addEventListener("click", (event) => {
createRipple(event);
  const result = confirm(
    "ハイスコア・レベル・累計スコアをすべてリセットします。\n本当によろしいですか？"
  );

  if (!result) return;

  // localStorage を削除
  localStorage.removeItem("highScore");
  localStorage.removeItem("totalScore");
  localStorage.removeItem("level");
  localStorage.removeItem("hp");

  // 変数を初期化
  highScore = 0;
  totalScore = 0;
  level = 1;
  hp = MAX_HP;  

  // 表示を更新
  highScoreText.textContent = highScore;
  totalScoreText.textContent = totalScore;
  levelText.textContent = level;
updateHPDisplay();               // ★ HP表示更新

  alert("データをリセットしました！");
});


updateHPDisplay();


// --- リスタート処理 ---
restartButton.addEventListener("click", (event) => {
createRipple(event);
  startGame();
});

// 最初にゲーム開始
startGame();