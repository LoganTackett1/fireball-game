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

setInterval(() => {
  client.next();
  render(display, client.gameState);
}, 33);
