/* eslint-disable no-param-reassign */

// Ground Level is 100px
function gameInit() {
  const gameState = {};
  const players = [];

  function idGen() {
    let result = "";
    for (let i = 0; i < 10; i += 1) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  function newPlayer() {
    const id = idGen();
    players.push(`player${id}`);
    gameState[`player${id}`] = {
      events: [],
      physics: {
        x: 400,
        y: 100,
        a_Vertical: 0,
        v_Vertical: 0,
        v_Horizontal: 0,
      },
      id,
      color: `rgb(${Math.floor(255 * Math.random())},${Math.floor(
        255 * Math.random()
      )},${Math.floor(255 * Math.random())})`,
    };
    return id;
  }

  function newEvent(player, e) {
    gameState[player].events.push(e);
  }

  function processEvent(player, item) {
    if (item === "jump") {
      if (player.physics.y <= 100) {
        player.physics.a_Vertical = -1440;
        player.physics.v_Vertical = 360;
      }
    }
    if (item.charAt(0) === "k") {
      if (item.charAt(1) === "u") {
        player.physics.v_Horizontal = 0;
      } else if (item.charAt(1) === "d") {
        if (item.charAt(2) === "a") {
          player.physics.v_Horizontal = -120;
        } else if (item.charAt(2) === "d") {
          player.physics.v_Horizontal = 120;
        }
      }
    }
  }

  function next(timestep) {
    Object.keys(gameState).forEach((key) => {
      const player = gameState[key];
      const { events } = player;
      for (let i = events.length - 1; i >= 0; i -= 1) {
        processEvent(player, events[i]);
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
      if (player.physics.x < 15) {
        player.physics.x = 15;
      }
      if (player.physics.x > 785) {
        player.physics.x = 785;
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
