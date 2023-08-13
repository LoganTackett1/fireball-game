import gameInit from "./game";
import render from "./render";
// eslint-disable-next-line no-unused-vars, import/no-unresolved
import css from "./index.css";

const display = document.createElement("canvas");
document.body.appendChild(display);
display.width = 800;
display.height = 400;

const serverURL = "http://cube-game-server.onrender.com:8000/";

const client = gameInit();

client.keyDown = {
  W: false,
  A: false,
  D: false,
  Space: false,
};

client.oldKeys = { ...client.keyDown };

function postEvent(url) {
  const { id } = client.me;
  const events = [...client.me.events];
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, events, type: "events" }),
  });
}

function eventPostCheck() {
  let count = 0;
  Object.keys(client.keyDown).forEach((key) => {
    if (client.keyDown[key] !== client.oldKeys[key]) {
      count += 1;
    }
    if (count > 0) {
      postEvent(serverURL);
    }
  });
}

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
  client.me.events = result;
  eventPostCheck();
  client.oldKeys = { ...client.keyDown };
}

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

const ctx = display.getContext("2d");

async function mergeState(state) {
  Object.keys(state).forEach((key) => {
    if (state[key].id !== client.me.id) {
      if (key in client.gameState) {
        client.gameState[key].events = state[key].events;
      } else {
        client.gameState[key] = state[key];
      }
    }
  });
}

function firstMerge(state) {
  Object.keys(state).forEach((key) => {
    client.gameState[key] = state[key];
  });
}

async function syncGame(ping, url) {
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ping, type: "sync", playerData: client.me }),
  })
    .then((response) => response.json())
    .then((response) => mergeState(response));
}

async function tick() {
  keysToEvent();
  client.next(16 / 1000);
  ctx.clearRect(0, 0, display.width, display.height);
  render(ctx, client.gameState);
  syncGame(33, serverURL);
}

await fetch(serverURL, {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ type: "first" }),
})
  .then((response) => response.json())
  .then((response) => {
    const result = response;
    firstMerge(result.state);
    client.me = client.gameState[`player${result.id}`];
  });

setInterval(tick, 16);
