"use strict";

const createBetForm = document.getElementById("createBetForm");
const placeBetForm = document.getElementById("placeBetForm");
const betNameInput = document.getElementById("betName");
const stakeInput = document.getElementById("stake");
const outcomeInput = document.getElementById("outcome");

const userPicker = document.getElementById("userPicker");

const openPoolTotal = document.getElementById("openPoolTotal");
const outcome1Pool = document.getElementById("outcome1Pool");
const outcome2Pool = document.getElementById("outcome2Pool");
const currentBetTitle = document.getElementById("currentBetTitle");
const activeBetSelect = document.getElementById("activeBetSelect");

const resolveOutcome1 = document.getElementById("resolveOutcome1");
const resolveOutcome2 = document.getElementById("resolveOutcome2");

const openBetsBody = document.getElementById("openBetsBody");
const settledBetsBody = document.getElementById("settledBetsBody");
const creditsBody = document.getElementById("creditsBody");

const userNames = [];
const userCredits = {};

let activeUser = "";
let activeBets = [];
let selectedBet = "";
let openBets = [];
let settledBets = [];
let nextId = 1;
let nextPlayerNumber = 1;

function money(value) {
  return `$${value.toFixed(2)}`;
}

function getCurrentBetBets() {
  const result = [];
  if (!selectedBet) {
    return result;
  }
  for (let k = 0; k < openBets.length; k++) {
    if (openBets[k].bet === selectedBet) {
      result.push(openBets[k]);
    }
  }
  return result;
}

function renderActiveBetOptions() {
  activeBetSelect.innerHTML = '<option value="">Select a bet</option>';

  for (let k = 0; k < activeBets.length; k++) {
    const name = activeBets[k];
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (name === selectedBet) {
      option.selected = true;
    }
    activeBetSelect.appendChild(option);
  }
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
  if (!selectedBet) {
    currentBetTitle.textContent = "No active bet selected";
    openPoolTotal.textContent = "$0.00";
    outcome1Pool.textContent = "$0.00";
    outcome2Pool.textContent = "$0.00";
    return;
  }

  currentBetTitle.textContent = `Active bet: ${selectedBet}`;
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

  if (userNames.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="2" class="empty">No players yet. Press + to add one.</td>';
    creditsBody.appendChild(row);
    return;
  }

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

function renderUserPicker() {
  userPicker.innerHTML = "";

  if (userNames.length === 0) {
    const hint = document.createElement("p");
    hint.className = "user-picker-hint";
    hint.textContent = "No players. Press + to add one.";
    userPicker.appendChild(hint);
  }

  for (let k = 0; k < userNames.length; k++) {
    const userName = userNames[k];
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = userName;
    button.setAttribute("data-user", userName);
    button.className = "user-chip";

    if (userName === activeUser) {
      button.classList.add("active");
    }

    userPicker.appendChild(button);
  }

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = "+";
  addButton.setAttribute("data-action", "add-user");
  addButton.setAttribute("aria-label", "Add player");
  addButton.className = "user-chip user-chip-add";
  userPicker.appendChild(addButton);
}

function renderAll() {
  renderActiveBetOptions();
  renderUserPicker();
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

  for (let k = 0; k < activeBets.length; k++) {
    if (activeBets[k].toLowerCase() === betName.toLowerCase()) {
      selectedBet = activeBets[k];
      betNameInput.value = "";
      renderAll();
      alert("This bet already exists. It has been selected as active.");
      return;
    }
  }

  activeBets.push(betName);
  selectedBet = betName;
  betNameInput.value = "";
  renderAll();
}

function placeBet(event) {
  event.preventDefault();

  if (!selectedBet) {
    alert("Create and select a bet first.");
    return;
  }

  if (!activeUser) {
    alert("Add and select a player first.");
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
    bet: selectedBet,
    outcome,
    stake
  });
  nextId += 1;

  placeBetForm.reset();
  renderAll();
}

function resolveBet(winningOutcome) {
  if (!selectedBet) {
    alert("No selected bet to resolve.");
    return;
  }

  const bets = getCurrentBetBets();
  if (bets.length === 0) {
    alert("No bets placed for the selected bet.");
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
    if (openBets[k].bet !== selectedBet) {
      remaining.push(openBets[k]);
    }
  }
  openBets = remaining;

  const keepActive = [];
  for (let k = 0; k < activeBets.length; k++) {
    if (activeBets[k] !== selectedBet) {
      keepActive.push(activeBets[k]);
    }
  }
  activeBets = keepActive;

  if (activeBets.length > 0) {
    selectedBet = activeBets[0];
  } else {
    selectedBet = "";
  }

  renderAll();
}

function onActiveBetChange(event) {
  selectedBet = event.target.value;
  renderSummary();
  renderOpenBets();
}

function onUserPickerClick(event) {
  const action = event.target.getAttribute("data-action");
  if (action === "add-user") {
    const newUser = `Player ${nextPlayerNumber}`;
    nextPlayerNumber += 1;

    userNames.push(newUser);
    userCredits[newUser] = 100;
    activeUser = newUser;

    renderUserPicker();
    renderCredits();
    return;
  }

  const chosen = event.target.getAttribute("data-user");
  if (!chosen) {
    return;
  }

  activeUser = chosen;

  renderUserPicker();
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
activeBetSelect.addEventListener("change", onActiveBetChange);
userPicker.addEventListener("click", onUserPickerClick);

renderAll();
