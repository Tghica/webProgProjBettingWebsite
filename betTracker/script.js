"use strict";

const element = document.querySelector(".myElement");
element.textContent = "Hello World";

for (let k = 0; k < 20; k++) {
  element.textContent += " Hello World";
}

const redBox = document.getElementById("redBox");
const yellowBox = document.getElementById("yellowBox");
const eventLog = document.getElementById("eventLog");

function addLogLine(text) {
  const line = document.createElement("p");
  line.textContent = text;
  eventLog.appendChild(line);
}

redBox.addEventListener("click", function actionClickRedBox() {
  addLogLine("Red !");
});

yellowBox.addEventListener("click", function actionClickYellowBox() {
  addLogLine("Yellow !");
});

const shape = document.getElementById("shape");
const clickCircle = document.getElementById("clickCircle");
const clickSquare = document.getElementById("clickSquare");
const clickRed = document.getElementById("clickRed");
const clickYellow = document.getElementById("clickYellow");

clickCircle.addEventListener("click", function applyCircle() {
  shape.classList.add("circle");
});

clickSquare.addEventListener("click", function applySquare() {
  shape.classList.remove("circle");
});

clickRed.addEventListener("click", function applyRed() {
  shape.classList.add("red");
  shape.classList.remove("yellow");
});

clickYellow.addEventListener("click", function applyYellow() {
  shape.classList.add("yellow");
  shape.classList.remove("red");
});
