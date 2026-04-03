const bets = [
  { event: "Real Madrid vs Barca", stake: 20, odds: 1.75 },
  { event: "Lakers vs Celtics", stake: 15, odds: 2.1 }
];

const eventInput = document.getElementById("event");
const stakeInput = document.getElementById("stake");
const oddsInput = document.getElementById("odds");
const saveButton = document.querySelector("button");
const openBetsList = document.getElementById("openBets");

function renderBets() {
  openBetsList.innerHTML = "";

  bets.forEach((bet) => {
    const item = document.createElement("li");
    item.textContent = `${bet.event} - Stake: $${bet.stake} - Odds: ${bet.odds}`;
    openBetsList.appendChild(item);
  });
}

function addBet() {
  const event = eventInput.value.trim();
  const stake = Number(stakeInput.value);
  const odds = Number(oddsInput.value);

  if (!event || stake <= 0 || odds <= 0) {
    alert("Please enter valid event, stake, and odds.");
    return;
  }

  bets.push({ event, stake, odds });
  renderBets();

  eventInput.value = "";
  stakeInput.value = "";
  oddsInput.value = "";
}

saveButton.addEventListener("click", addBet);

renderBets();
