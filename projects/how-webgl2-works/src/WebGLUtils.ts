export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const clientWidth = canvas.clientWidth;
  const clientHeight = canvas.clientHeight;

  const devicePixelRatio = window.devicePixelRatio;

  canvas.width = clientWidth * devicePixelRatio;
  canvas.height = clientHeight * devicePixelRatio;
}
