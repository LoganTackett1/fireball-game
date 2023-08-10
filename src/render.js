function inputMap(canvas, x, y, width, height) {
  return [x, canvas.height - y, width, -height];
}

function render(canvas, state) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(...inputMap(0, 0, canvas.width, 100));
  ctx.fillStyle = "Green";
  ctx.fill();
  ctx.closePath();

  Object.keys(state).forEach((key) => {
    const phys = state[key].physics;
    ctx.beginPath();
    ctx.rect(...inputMap(Math.round(phys.x - 15), Math.round(phys.y), 30, 30));
    ctx.fillStyle = "Red";
    ctx.fill();
    ctx.closePath();
  });
}

export default render;
