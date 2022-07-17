import { Canvg } from "canvg";

function downloadCanvasAsPNG(canvas) {
  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("download", "CanvasAsImage.png");
  let dataURL = canvas.toDataURL("image/png");
  let url = dataURL.replace(
    /^data:image\/png/,
    "data:application/octet-stream"
  );
  downloadLink.setAttribute("href", url);
  downloadLink.click();
}

function createCanvas(width = 1000, height = 10000) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}

function addWhiteBackground(canvas) {
  const ctx = canvas.getContext("2d");

  ctx.globalCompositeOperation = "destination-over"; // puts the white rectangle behind the existing SVG
  const fillStyleBefore = ctx.fillStyle;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fillStyleBefore;
}

async function renderSVGToCanvas(ctx, svgCode) {
  const v = await Canvg.from(ctx, svgCode);
  v.start();
  v.stop();
}

export default async function downloadSvgAsPng(svg) {
  const { canvas, ctx } = createCanvas(4000, 4000);
  await renderSVGToCanvas(ctx, svg);
  addWhiteBackground(canvas);
  downloadCanvasAsPNG(canvas);
}
