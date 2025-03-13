import { createEffect, createSignal } from "solid-js";
import { convertPixelMatrixFrame } from "~/components/pixel-matrix-player/convert-pixel-matrix-frame";
import type { PixelMatrixFrame } from "./interface";
import { PixelMatrixPlayer } from "./pixel-matrix-vier";

export interface MirrorPlayerProps {
  xSize?: number; // x坐标栅格数
  ySize?: number; // y坐标栅格数
  pixelSize?: number; // 像素大小
  source?: HTMLImageElement | HTMLVideoElement; // 源
}
export function MirrorPlayer(props: MirrorPlayerProps) {
  const [frame, setFrame] = createSignal<PixelMatrixFrame>({ xSize: 0, ySize: 0, data: [] });

  function getPixelSize() {
    return {
      xSize: props.xSize || 16,
      ySize: props.ySize || 16,
    };
  }

  createEffect(() => {
    const source = props.source;
    if (!source) return;

    if (source instanceof HTMLImageElement) {
      source.addEventListener("load", () => {
        setFrame(convertPixelMatrixFrame(source, getPixelSize()));
      });
      return;
    }
    if (source instanceof HTMLVideoElement) {
      source.addEventListener("play", (event) => {
        const video = event.target as HTMLVideoElement;
        function drawFrame() {
          if (video.paused || video.ended) return; // 暂停或结束时停止
          try {
            setFrame(convertPixelMatrixFrame(video, getPixelSize()));
          } catch (err) {
            console.log(err);
          }
          requestAnimationFrame(drawFrame); // 继续下一帧
        }
        drawFrame();
      });
      return;
    }
  });

  createEffect(() => {
    if (props.source) {
      setFrame(convertPixelMatrixFrame(props.source, getPixelSize()));
    }
  });

  return <PixelMatrixPlayer pixelSize={props.pixelSize} theme="green" frame={frame()} />;
}
