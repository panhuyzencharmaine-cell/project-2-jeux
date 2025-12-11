const memoryGrid = document.getElementById("memoryGrid");
const moveCounter = document.getElementById("moveCounter");
const matchCounter = document.getElementById("matchCounter");
const levelDisplay = document.getElementById("levelDisplay");
const restartBtn = document.getElementById("restartBtn");
const messageBox = document.getElementById("message");
const timerSpan = document.getElementById("timer");
const endScreen = document.getElementById("endScreen");
const endStats = document.getElementById("endStats");
const playAgainBtn = document.getElementById("playAgainBtn");

const symbols = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝", "🍍", "🥥"];

const levelPairs = [2, 4, 6];   
const totalLevels = levelPairs.length;

let currentLevel = 0;
let cards = [];
let firstCard = null;
let secondCard = null;
let boardLocked = false;
let moves = 0;
let matches = 0;
let timerInterval = null;
let elapsedMs = 0;

restartBtn.addEventListener("click", function () {
  startLevel(currentLevel);
});

if (playAgainBtn) {
  playAgainBtn.addEventListener("click", function () {
    endScreen.classList.remove("visible");
    startLevel(0);
  });
}

startLevel(currentLevel);

function startLevel(levelIndex) {
  currentLevel = levelIndex;
  clearTimer();

  firstCard = null;
  secondCard = null;
  boardLocked = false;
  moves = 0;
  matches = 0;
  updateHud();

  memoryGrid.innerHTML = "";

  const pairs = levelPairs[currentLevel];
  const neededSymbols = symbols.slice(0, pairs);
  const cardSymbols = neededSymbols.concat(neededSymbols);

  shuffleArray(cardSymbols);

  cardSymbols.forEach(function (symbol) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = symbol;

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const back = document.createElement("div");
    back.className = "card-face card-back";
    back.textContent = "?";

    const front = document.createElement("div");
    front.className = "card-face card-front";
    front.textContent = symbol;

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);

    card.addEventListener("click", onCardClick);
    memoryGrid.appendChild(card);
  });

  cards = document.querySelectorAll(".card");
  levelDisplay.textContent = (currentLevel + 1) + "/" + totalLevels;
  messageBox.textContent = "Level " + (currentLevel + 1) + ": find all pairs.";

  startTimer();
}

function onCardClick(event) {
  const clickedCard = event.currentTarget;

  if (boardLocked) return;
  if (clickedCard.classList.contains("matched")) return;
  if (clickedCard === firstCard) return;

  flipCard(clickedCard);

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;
  boardLocked = true;
  moves++;
  updateHud();

  checkForMatch();
}

function flipCard(cardElement) {
  cardElement.classList.add("flipped");
}

function unflipCard(cardElement) {
  cardElement.classList.remove("flipped");
}

function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function handleMatch() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  firstCard.removeEventListener("click", onCardClick);
  secondCard.removeEventListener("click", onCardClick);

  matches++;
  updateHud();
  clearSelection();

  const neededPairs = levelPairs[currentLevel];
  if (matches === neededPairs) {
    handleLevelComplete();
  }
}

function handleMismatch() {
  setTimeout(function () {
    unflipCard(firstCard);
    unflipCard(secondCard);
    clearSelection();
  }, 700);
}

function clearSelection() {
  firstCard = null;
  secondCard = null;
  boardLocked = false;
}

function handleLevelComplete() {
  clearTimer();

  const timeSeconds = (elapsedMs / 1000).toFixed(1);
  messageBox.textContent =
    "Level " +
    (currentLevel + 1) +
    " complete! You used " +
    moves +
    " moves in " +
    timeSeconds +
    " seconds.";

  if (currentLevel < totalLevels - 1) {
    setTimeout(function () {
      startLevel(currentLevel + 1);
    }, 1200);
  } else if (endScreen) {
    const formatted = formatTime(elapsedMs);
    endStats.textContent = "Time: " + formatted + "    Moves: " + moves;
    endScreen.classList.add("visible");
  }
}

function startTimer() {
  elapsedMs = 0;
  timerSpan.textContent = "0.0";

  timerInterval = setInterval(function () {
    elapsedMs += 100;
    const seconds = (elapsedMs / 1000).toFixed(1);
    timerSpan.textContent = seconds;
  }, 100);
}

function clearTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateHud() {
  moveCounter.textContent = moves.toString();
  matchCounter.textContent = matches.toString();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes < 10 ? "0" + minutes : String(minutes);
  const ss = seconds < 10 ? "0" + seconds : String(seconds);
  return mm + ":" + ss;
}
