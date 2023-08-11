import gameInit from "./game";
import render from "./render";
// eslint-disable-next-line no-unused-vars, import/no-unresolved
import css from "./index.css";

const display = document.createElement("canvas");
document.body.appendChild(display);
display.width = 800;
display.height = 400;

const client = gameInit();
client.me = client.gameState[client.newPlayer()];
client.keyDown = {
  W: false,
  A: false,
  D: false,
  Space: false,
};

window.addEventListener("keydown", (e) => {
  if (e.key === "A" || e.key === "a") {
    client.keyDown.A = true;
  } else if (e.key === "D" || e.key === "d") {
    client.keyDown.D = true;
  } else if (e.key === "W" || e.key === "w") {
    client.keyDown.W = true;
  } else if (e.key === " ") {
    client.keyDown.Space = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "A" || e.key === "a") {
    client.keyDown.A = false;
  } else if (e.key === "D" || e.key === "d") {
    client.keyDown.D = false;
  } else if (e.key === "W" || e.key === "w") {
    client.keyDown.W = false;
  } else if (e.key === " ") {
    client.keyDown.Space = false;
  }
});

function keysToEvent() {
  const result = [];
  if (client.keyDown.W === true || client.keyDown.Space === true) {
    result.push("jump");
  }
  if (client.keyDown.A === true && client.keyDown.D === false) {
    result.push("kda");
  }
  if (client.keyDown.A === false && client.keyDown.D === true) {
    result.push("kdd");
  }
  if (client.keyDown.A === false && client.keyDown.D === false) {
    result.push("ku");
  }
  if (client.keyDown.A === true && client.keyDown.D === true) {
    result.push("ku");
  }
  result.forEach((item) => {
    client.me.events.push(item);
  });
}

const ctx = display.getContext("2d");

async function tick() {
  keysToEvent();
  client.next(33 / 1000);
  ctx.clearRect(0, 0, display.width, display.height);
  render(ctx, client.gameState);
}

setInterval(tick, 33);
