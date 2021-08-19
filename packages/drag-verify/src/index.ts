/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-19 19:52:36
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-19 21:04:45
 * @FilePath: \gear\packages\drag-verify\src\index.ts
 */
import { createCanvas, loadImage } from 'canvas';

const DEFAULT_CONFIG = {
  backgroundWidth: 350,
  backgroundHeight: 200,
  blockWidth: 42,
  circleRadius: 9,
}

const { PI } = Math;

const BLOCK_POSITION_FIX = [0, 15, 12];

function drawLine(ctx: any, x: number, y: number, operation: string, shape: number, l: number, r: number) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  if (shape === 0) {
    ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.lineTo(x, y + l);
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(x, y);
  } else if (shape === 1) {
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l + 2);
    ctx.arc(x + l / 2, y + l + 8, r, -0.21 * PI, 1.21 * PI);
    ctx.lineTo(x, y + l + 2);
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  } else if (shape === 2) {
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + 5, y + l / 2, r, 1.31 * PI, 2.71 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.arc(x + l / 2, y + l - 5, r, 0.21 * PI, 0.81 * PI, true);
    ctx.lineTo(x, y + l);
    ctx.lineTo(x, y);
  }
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = 'overlay';
}

async function getPuzzleImg(img: string, config = DEFAULT_CONFIG) {
  try {
    const { backgroundHeight, backgroundWidth, blockWidth, circleRadius } = config;
    const L = blockWidth + circleRadius * 2 + 3;
    const imageCanvas = createCanvas(backgroundWidth, backgroundHeight);
    const blockCanvas = createCanvas(backgroundWidth, backgroundHeight);
    const imageCanvasCtx = imageCanvas.getContext('2d');
    const blockCanvasCtx = blockCanvas.getContext('2d');

    const x = (Math.random() * 200 + 90) >> 0;
    const y = (Math.random() * 100 + 40) >> 0;

    const blockShapeTmp = (Math.random() * 100) % 3 >> 0;
    drawLine(imageCanvasCtx, x, y, 'fill', blockShapeTmp, blockWidth, circleRadius);
    drawLine(blockCanvasCtx, x, y, 'clip', blockShapeTmp, blockWidth, circleRadius);
    const image = await loadImage(img);
    blockCanvasCtx?.drawImage(image, 0, 0, backgroundWidth, backgroundHeight);
    imageCanvasCtx?.drawImage(image, 0, 0, backgroundWidth, backgroundHeight);
    const newY = y - circleRadius * 2 - 1 + BLOCK_POSITION_FIX[blockShapeTmp];
    const imageData = blockCanvasCtx?.getImageData(x - 3, newY, L, L);
    if (imageData) {
      blockCanvas.width = L;
      blockCanvasCtx?.putImageData(imageData, 0, newY);
    }
    return {
      background: imageCanvas.toDataURL(),
      block: blockCanvas.toDataURL(),
    };
  } catch (e) {
    return {};
  }
}

export { getPuzzleImg }
