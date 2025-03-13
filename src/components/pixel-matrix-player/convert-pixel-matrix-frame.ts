import type { PixelMatrixFrame } from "./interface";

// 预定义的3位颜色调色板（RGB格式）
const colors3Bit = [
  [0, 0, 0], // 0: 黑色
  [255, 0, 0], // 1: 红色
  [0, 255, 0], // 2: 绿色
  [0, 0, 255], // 3: 蓝色
  [255, 255, 0], // 4: 黄色
  [255, 0, 255], // 5: 洋红
  [0, 255, 255], // 6: 青色
  [255, 255, 255], // 7: 白色
];

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
export function convertPixelMatrixFrame(
  img: HTMLImageElement | HTMLVideoElement,
  options: { xSize: number; ySize: number },
): PixelMatrixFrame {
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error("Failed to get 2d context");
  }
  // 体素大小
  const voxelSize = 16;
  canvas.width = options.xSize;
  canvas.height = options.ySize;
  /** 先将图片缩小 */
  ctx.drawImage(img, 0, 0, options.xSize, options.ySize);
  ctx.imageSmoothingEnabled = false;

  /** 获取缩小后的图片数据 */
  const imageData = ctx.getImageData(0, 0, options.xSize, options.ySize);
  const data = imageData.data;

  /** 将图片数据量化为3位色彩 */
  const quantized = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let minDist = Number.POSITIVE_INFINITY;
    let closestIndex = 0;
    for (let j = 0; j < colors3Bit.length; j++) {
      const cr = colors3Bit[j][0];
      const cg = colors3Bit[j][1];
      const cb = colors3Bit[j][2];
      const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
      if (dist < minDist) {
        minDist = dist;
        closestIndex = j;
      }
    }
    quantized.push(closestIndex);
    data[i] = colors3Bit[closestIndex][0];
    data[i + 1] = colors3Bit[closestIndex][1];
    data[i + 2] = colors3Bit[closestIndex][2];
  }
  // ctx.putImageData(imageData, 0, 0); // 显示处理后的图像
  // ctx.drawImage(canvas, 0, 0, options.xSize, options.ySize, 0, 0, img.width, img.height);

  return { xSize: options.xSize, ySize: options.ySize, data: quantized };
}
