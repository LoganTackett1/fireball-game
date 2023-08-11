/* eslint-disable no-param-reassign */

// Ground Level is 100px
function gameInit() {
  const gameState = {};
  const players = [];
  let counter = 0;

  function newPlayer() {
    counter += 1;
    players.push(`player${counter}`);
    gameState[`player${counter}`] = {
      events: [],
      physics: {
        x: 400,
        y: 100,
        a_Vertical: 0,
        v_Vertical: 0,
        v_Horizontal: 0,
      },
    };
    return `player${counter}`;
  }

  function newEvent(player, e) {
    gameState[player].events.push(e);
  }

  function processEvent(player) {
    const event = player.events[player.events.length - 1];

    if (event === "jump") {
      if (player.physics.y <= 100) {
        player.physics.a_Vertical = -370;
        player.physics.v_Vertical = 170;
      }
    }
    if (event.charAt(0) === "k") {
      if (event.charAt(1) === "u") {
        player.physics.v_Horizontal = 0;
      } else if (event.charAt(1) === "d") {
        if (event.charAt(2) === "a") {
          player.physics.v_Horizontal = -60;
        } else if (event.charAt(2) === "d") {
          player.physics.v_Horizontal = 60;
        }
      }
    }
    player.events.pop();
  }

  function next(timestep) {
    Object.keys(gameState).forEach((key) => {
      const player = gameState[key];
      const { events } = player;
      for (let i = events.length - 1; i >= 0; i -= 1) {
        processEvent(player);
      }
    });
    Object.keys(gameState).forEach((key) => {
      const player = gameState[key];
      player.physics.x += player.physics.v_Horizontal * timestep;
      player.physics.y +=
        player.physics.v_Vertical * timestep +
        player.physics.a_Vertical * timestep * timestep * 0.5;
      player.physics.v_Vertical += player.physics.a_Vertical * timestep;
      if (player.physics.y < 100) {
        player.physics.y = 100;
        player.physics.v_Vertical = 0;
        player.physics.a_Vertical = 0;
      }
    });
  }

  return {
    gameState,
    newPlayer,
    players,
    newEvent,
    next,
  };
}

export default gameInit;
