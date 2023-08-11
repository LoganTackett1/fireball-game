function inputMap(x, y, width, height) {
  return [x, 400 - y, width, -height];
}

function render(ctx, state) {
  ctx.beginPath();
  ctx.rect(...inputMap(0, 0, 800, 100));
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
