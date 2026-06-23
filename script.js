const form = document.querySelector("#rating-form");
const winStreakInput = document.querySelector("#win-streak");
const myPointsInput = document.querySelector("#my-points");
const opponentPointsInput = document.querySelector("#opponent-points");
const errorMessage = document.querySelector("#error-message");
const winResult = document.querySelector("#win-result");
const loseResult = document.querySelector("#lose-result");

function truncateLikePythonInt(value) {
  return value < 0 ? Math.ceil(value) : Math.floor(value);
}

function calculatePoints(winStreak, myPoints, opponentPoints) {
  const winBonusMultiplier = Math.min(1.2, 1 + (winStreak - 1) * 0.05);
  const pointDifference = myPoints - opponentPoints;

  const winBasePoints = Math.max(1, (4000 - pointDifference) / 25);
  const winPoints = truncateLikePythonInt(winBasePoints * winBonusMultiplier);

  const loseBasePoints = -(4000 + pointDifference) / 25;
  const losePoints = truncateLikePythonInt(loseBasePoints);

  return { winPoints, losePoints };
}

function readInteger(input) {
  if (input.value.trim() === "") {
    return Number.NaN;
  }

  return Number(input.value);
}

function updateResults() {
  const winStreak = readInteger(winStreakInput);
  const myPoints = readInteger(myPointsInput);
  const opponentPoints = readInteger(opponentPointsInput);

  const values = [winStreak, myPoints, opponentPoints];
  const hasInvalidValue = values.some((value) => !Number.isFinite(value) || !Number.isInteger(value));

  if (hasInvalidValue || winStreak < 1) {
    errorMessage.hidden = false;
    errorMessage.textContent = "連勝数は1以上の整数、自分と相手のポイントは整数で入力してください。";
    winResult.value = "-";
    loseResult.value = "-";
    return;
  }

  errorMessage.hidden = true;
  errorMessage.textContent = "";

  const { winPoints, losePoints } = calculatePoints(winStreak, myPoints, opponentPoints);
  winResult.value = String(winPoints);
  loseResult.value = String(losePoints);
}

form.addEventListener("input", updateResults);
updateResults();