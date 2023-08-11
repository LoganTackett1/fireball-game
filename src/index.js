import gameInit from "./game";
import render from "./render";
// eslint-disable-next-line no-unused-vars, import/no-unresolved
import css from "./index.css";

const display = document.createElement("canvas");
document.body.appendChild(display);
display.width = 800;
display.height = 400;

const client = gameInit();
client.newPlayer();

const ctx = display.getContext("2d");

async function tick() {
  client.next(33 / 1000);
  ctx.clearRect(0, 0, display.width, display.height);
  render(ctx, client.gameState);
}

setInterval(tick, 33);
