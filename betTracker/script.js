"use strict";

const createBetForm = document.getElementById("createBetForm");
const placeBetForm = document.getElementById("placeBetForm");
const betNameInput = document.getElementById("betName");
const stakeInput = document.getElementById("stake");
const outcomeInput = document.getElementById("outcome");

const userMenuButton = document.getElementById("userMenuButton");
const userList = document.getElementById("userList");

const openPoolTotal = document.getElementById("openPoolTotal");
const outcome1Pool = document.getElementById("outcome1Pool");
const outcome2Pool = document.getElementById("outcome2Pool");
const currentBetTitle = document.getElementById("currentBetTitle");

const resolveOutcome1 = document.getElementById("resolveOutcome1");
const resolveOutcome2 = document.getElementById("resolveOutcome2");

const openBetsBody = document.getElementById("openBetsBody");
const settledBetsBody = document.getElementById("settledBetsBody");
const creditsBody = document.getElementById("creditsBody");

const userNames = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"];
const userCredits = {
  "Player 1": 100,
  "Player 2": 100,
  "Player 3": 100,
  "Player 4": 100,
  "Player 5": 100
};

let activeUser = "Player 1";
let currentBet = "";
let openBets = [];
let settledBets = [];
let nextId = 1;

function money(value) {
  return `$${value.toFixed(2)}`;
}

function getCurrentBetBets() {
  const result = [];
  for (let k = 0; k < openBets.length; k++) {
    if (openBets[k].bet === currentBet) {
      result.push(openBets[k]);
    }
  }
  return result;
}

function poolForOutcome(outcomeName) {
  const bets = getCurrentBetBets();
  let total = 0;
  for (let k = 0; k < bets.length; k++) {
    if (bets[k].outcome === outcomeName) {
      total += bets[k].stake;
    }
  }
  return total;
}

function totalPool() {
  const bets = getCurrentBetBets();
  let total = 0;
  for (let k = 0; k < bets.length; k++) {
    total += bets[k].stake;
  }
  return total;
}

function renderSummary() {
  if (!currentBet) {
    currentBetTitle.textContent = "No active bet";
    openPoolTotal.textContent = "$0.00";
    outcome1Pool.textContent = "$0.00";
    outcome2Pool.textContent = "$0.00";
    return;
  }

  currentBetTitle.textContent = `Active bet: ${currentBet}`;
  openPoolTotal.textContent = money(totalPool());
  outcome1Pool.textContent = money(poolForOutcome("Outcome 1"));
  outcome2Pool.textContent = money(poolForOutcome("Outcome 2"));
}

function renderOpenBets() {
  openBetsBody.innerHTML = "";

  const bets = getCurrentBetBets();
  if (bets.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="4" class="empty">No bets placed.</td>';
    openBetsBody.appendChild(row);
    return;
  }

  for (let k = 0; k < bets.length; k++) {
    const bet = bets[k];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${bet.user}</td>
      <td>${bet.bet}</td>
      <td>${bet.outcome}</td>
      <td>${money(bet.stake)}</td>
    `;
    openBetsBody.appendChild(row);
  }
}

function renderSettledBets() {
  settledBetsBody.innerHTML = "";

  if (settledBets.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="6" class="empty">No settled bets.</td>';
    settledBetsBody.appendChild(row);
    return;
  }

  for (let k = 0; k < settledBets.length; k++) {
    const bet = settledBets[k];
    const row = document.createElement("tr");
    const sign = bet.profit >= 0 ? "+" : "";
    const cssClass = bet.profit >= 0 ? "profit" : "loss";
    row.innerHTML = `
      <td>${bet.user}</td>
      <td>${bet.bet}</td>
      <td>${bet.outcome}</td>
      <td>${bet.result}</td>
      <td>${money(bet.payout)}</td>
      <td class="${cssClass}">${sign}${money(bet.profit)}</td>
    `;
    settledBetsBody.appendChild(row);
  }
}

function renderCredits() {
  creditsBody.innerHTML = "";

  for (let k = 0; k < userNames.length; k++) {
    const userName = userNames[k];
    const row = document.createElement("tr");
    if (userName === activeUser) {
      row.classList.add("active-user-row");
    }
    row.innerHTML = `
      <td>${userName}</td>
      <td>${money(userCredits[userName])}</td>
    `;
    creditsBody.appendChild(row);
  }
}

function renderAll() {
  renderSummary();
  renderOpenBets();
  renderSettledBets();
  renderCredits();
}

function createBet(event) {
  event.preventDefault();
  const betName = betNameInput.value.trim();

  if (!betName) {
    alert("Please enter a bet name.");
    return;
  }

  currentBet = betName;
  betNameInput.value = "";
  renderAll();
}

function placeBet(event) {
  event.preventDefault();

  if (!currentBet) {
    alert("Create a bet first.");
    return;
  }

  const stake = Number(stakeInput.value);
  const outcome = outcomeInput.value;

  if (stake <= 0) {
    alert("Please enter a valid stake.");
    return;
  }

  if (userCredits[activeUser] < stake) {
    alert("Not enough credits for this user.");
    return;
  }

  userCredits[activeUser] -= stake;

  openBets.push({
    id: nextId,
    user: activeUser,
    bet: currentBet,
    outcome,
    stake
  });
  nextId += 1;

  placeBetForm.reset();
  renderAll();
}

function resolveBet(winningOutcome) {
  if (!currentBet) {
    alert("No active bet to resolve.");
    return;
  }

  const bets = getCurrentBetBets();
  if (bets.length === 0) {
    alert("No bets placed for the active bet.");
    return;
  }

  let pool = 0;
  let winnerPool = 0;

  for (let k = 0; k < bets.length; k++) {
    pool += bets[k].stake;
    if (bets[k].outcome === winningOutcome) {
      winnerPool += bets[k].stake;
    }
  }

  for (let k = 0; k < bets.length; k++) {
    const bet = bets[k];
    let payout = 0;
    let result = "Loss";

    if (winnerPool > 0 && bet.outcome === winningOutcome) {
      payout = pool * (bet.stake / winnerPool);
      userCredits[bet.user] += payout;
      result = "Win";
    }

    settledBets.unshift({
      id: bet.id,
      user: bet.user,
      bet: bet.bet,
      outcome: bet.outcome,
      result,
      payout,
      profit: payout - bet.stake
    });
  }

  const remaining = [];
  for (let k = 0; k < openBets.length; k++) {
    if (openBets[k].bet !== currentBet) {
      remaining.push(openBets[k]);
    }
  }
  openBets = remaining;

  currentBet = "";
  renderAll();
}

function onUserMenuClick() {
  userList.classList.toggle("hidden");
}

function onUserListClick(event) {
  const chosen = event.target.getAttribute("data-user");
  if (!chosen) {
    return;
  }
  activeUser = chosen;
  userMenuButton.textContent = `User: ${activeUser}`;
  userList.classList.add("hidden");
  renderCredits();
}

function onResolveOutcome1() {
  resolveBet("Outcome 1");
}

function onResolveOutcome2() {
  resolveBet("Outcome 2");
}

createBetForm.addEventListener("submit", createBet);
placeBetForm.addEventListener("submit", placeBet);
resolveOutcome1.addEventListener("click", onResolveOutcome1);
resolveOutcome2.addEventListener("click", onResolveOutcome2);

userMenuButton.addEventListener("click", onUserMenuClick);
userList.addEventListener("click", onUserListClick);

renderAll();
