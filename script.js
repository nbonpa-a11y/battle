const form = document.querySelector("#rating-form");
const winStreakInput = document.querySelector("#win-streak");
const myPointsInput = document.querySelector("#my-points");
const opponentPointsInput = document.querySelector("#opponent-points");
const errorMessage = document.querySelector("#error-message");
const winResult = document.querySelector("#win-result");
const loseResult = document.querySelector("#lose-result");
const winAfterResult = document.querySelector("#win-after-result");
const loseAfterResult = document.querySelector("#lose-after-result");

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

function sanitizePointInput(input) {
  const sanitizedValue = input.value.replace(/\D/g, "").slice(0, 5);

  if (input.value !== sanitizedValue) {
    input.value = sanitizedValue;
  }
}

function readInteger(input) {
  if (input.value.trim() === "") {
    return Number.NaN;
  }

  return Number(input.value);
}

function setInvalidResults() {
  winResult.value = "-";
  loseResult.value = "-";
  winAfterResult.value = "-";
  loseAfterResult.value = "-";
}

function updateResults() {
  sanitizePointInput(myPointsInput);
  sanitizePointInput(opponentPointsInput);

  const winStreak = readInteger(winStreakInput);
  const myPoints = readInteger(myPointsInput);
  const opponentPoints = readInteger(opponentPointsInput);

  const values = [winStreak, myPoints, opponentPoints];
  const hasInvalidValue = values.some((value) => !Number.isFinite(value) || !Number.isInteger(value));
  const hasInvalidPoints = [myPoints, opponentPoints].some((value) => value < 0 || value > 99999);

  if (hasInvalidValue || winStreak < 1 || hasInvalidPoints) {
    errorMessage.hidden = false;
    errorMessage.textContent = "自分と相手のポイントは0以上の整数で入力してください。";
    setInvalidResults();
    return;
  }

  errorMessage.hidden = true;
  errorMessage.textContent = "";

  const { winPoints, losePoints } = calculatePoints(winStreak, myPoints, opponentPoints);
  winResult.value = `${winPoints} pt`;
  loseResult.value = `${losePoints} pt`;
  winAfterResult.value = `${myPoints + winPoints} pt`;
  loseAfterResult.value = `${myPoints + losePoints} pt`;
}

form.addEventListener("input", updateResults);
form.addEventListener("change", updateResults);
updateResults();
