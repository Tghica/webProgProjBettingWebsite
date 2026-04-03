"use strict";

const betForm = document.getElementById("betForm");
const eventInput = document.getElementById("event");
const marketInput = document.getElementById("market");
const stakeInput = document.getElementById("stake");
const oddsInput = document.getElementById("odds");

const openBetsBody = document.getElementById("openBetsBody");
const settledBetsBody = document.getElementById("settledBetsBody");

const openStakeTotal = document.getElementById("openStakeTotal");
const profitLossTotal = document.getElementById("profitLossTotal");
const openBetsCount = document.getElementById("openBetsCount");

let openBets = [
  {
    id: 1,
    event: "Real Madrid vs Barcelona",
    market: "Both Teams To Score",
    stake: 20,
    odds: 1.8
  },
  {
    id: 2,
    event: "Lakers vs Celtics",
    market: "Lakers Moneyline",
    stake: 15,
    odds: 2.1
  }
];

let settledBets = [];
let nextId = 3;

function money(value) {
  return `$${value.toFixed(2)}`;
}

function renderOpenBets() {
  openBetsBody.innerHTML = "";

  if (openBets.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="6" class="empty">No open bets.</td>';
    openBetsBody.appendChild(row);
    return;
  }

  openBets.forEach((bet) => {
    const row = document.createElement("tr");
    const potentialReturn = bet.stake * bet.odds;

    row.innerHTML = `
      <td>${bet.event}</td>
      <td>${bet.market}</td>
      <td>${money(bet.stake)}</td>
      <td>${bet.odds.toFixed(2)}</td>
      <td>${money(potentialReturn)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-win" data-id="${bet.id}" data-action="win">Win</button>
          <button class="btn btn-loss" data-id="${bet.id}" data-action="loss">Loss</button>
          <button class="btn btn-delete" data-id="${bet.id}" data-action="delete">Delete</button>
        </div>
      </td>
    `;

    openBetsBody.appendChild(row);
  });
}

function renderSettledBets() {
  settledBetsBody.innerHTML = "";

  if (settledBets.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="4" class="empty">No settled bets.</td>';
    settledBetsBody.appendChild(row);
    return;
  }

  settledBets.forEach((bet) => {
    const row = document.createElement("tr");
    const resultClass = bet.profit >= 0 ? "profit" : "loss";
    const sign = bet.profit >= 0 ? "+" : "";
    row.innerHTML = `
      <td>${bet.event}</td>
      <td>${bet.market}</td>
      <td>${bet.result}</td>
      <td class="${resultClass}">${sign}${money(bet.profit)}</td>
    `;
    settledBetsBody.appendChild(row);
  });
}

function updateSummary() {
  const totalOpenStake = openBets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalProfitLoss = settledBets.reduce((sum, bet) => sum + bet.profit, 0);

  openStakeTotal.textContent = money(totalOpenStake);
  profitLossTotal.textContent = `${totalProfitLoss >= 0 ? "+" : ""}${money(totalProfitLoss)}`;
  profitLossTotal.className = `value ${totalProfitLoss >= 0 ? "profit" : "loss"}`;
  openBetsCount.textContent = String(openBets.length);
}

function renderAll() {
  renderOpenBets();
  renderSettledBets();
  updateSummary();
}

function addBet(event) {
  event.preventDefault();

  const betEvent = eventInput.value.trim();
  const market = marketInput.value.trim();
  const stake = Number(stakeInput.value);
  const odds = Number(oddsInput.value);

  if (!betEvent || !market || stake <= 0 || odds <= 1) {
    alert("Please fill all fields with valid values.");
    return;
  }

  openBets.push({
    id: nextId,
    event: betEvent,
    market,
    stake,
    odds
  });
  nextId += 1;

  betForm.reset();
  renderAll();
}

function settleBet(id, result) {
  const index = openBets.findIndex((bet) => bet.id === id);
  if (index === -1) {
    return;
  }

  const bet = openBets[index];
  openBets.splice(index, 1);

  const profit = result === "Win" ? bet.stake * (bet.odds - 1) : -bet.stake;
  settledBets.unshift({
    id: bet.id,
    event: bet.event,
    market: bet.market,
    result,
    profit
  });

  renderAll();
}

function deleteBet(id) {
  openBets = openBets.filter((bet) => bet.id !== id);
  renderAll();
}

openBetsBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "win") {
    settleBet(id, "Win");
  } else if (action === "loss") {
    settleBet(id, "Loss");
  } else if (action === "delete") {
    deleteBet(id);
  }
});

betForm.addEventListener("submit", addBet);

renderAll();
