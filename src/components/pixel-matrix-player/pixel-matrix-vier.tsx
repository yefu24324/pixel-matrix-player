import { cva } from "class-variance-authority";
import { For, type JSX, createEffect } from "solid-js";
import type { PixelMatrixFrame } from "./interface";

export const image8cGridVariants = cva("rounded-sm", {
  variants: {
    theme: {
      green: "",
      violet: "",
    },
    size: {
      2: "size-2",
      3: "size-3",
      4: "size-4",
      5: "size-5",
      6: "size-6",
    } as { [key: number]: string },
    bit: {
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
    } as { [key: number]: string },
  },
  compoundVariants: [
    { theme: "green", bit: 0, class: "bg-green-50" },
    { theme: "green", bit: 1, class: "bg-green-100" },
    { theme: "green", bit: 2, class: "bg-green-200" },
    { theme: "green", bit: 3, class: "bg-green-300" },
    { theme: "green", bit: 4, class: "bg-green-400" },
    { theme: "green", bit: 5, class: "bg-green-500" },
    { theme: "green", bit: 6, class: "bg-green-600" },
    { theme: "green", bit: 7, class: "bg-green-700" },
    { theme: "violet", bit: 0, class: "bg-violet-50" },
    { theme: "violet", bit: 1, class: "bg-violet-100" },
    { theme: "violet", bit: 2, class: "bg-violet-200" },
    { theme: "violet", bit: 3, class: "bg-violet-300" },
    { theme: "violet", bit: 4, class: "bg-violet-400" },
    { theme: "violet", bit: 5, class: "bg-violet-500" },
    { theme: "violet", bit: 6, class: "bg-violet-600" },
    { theme: "violet", bit: 7, class: "bg-violet-700" },
  ],
  defaultVariants: {
    size: 6,
  },
});

export interface PixelMatrixPlayerProps extends JSX.CustomAttributes<HTMLDivElement> {
  theme: "green" | "violet"; // 主题
  pixelSize?: number; // 像素大小
  frame: PixelMatrixFrame;
}

export function PixelMatrixPlayer(props: PixelMatrixPlayerProps) {
  function pixelSize() {
    return props.pixelSize || 6;
  }
  function pixelWidth() {
    return pixelSize() * 4;
  }
  function getWidth() {
    return props.frame.xSize * pixelWidth() + (props.frame.xSize - 1) * 6 + 32;
  }

  return (
    <div
      ref={props.ref}
      style={{ "min-width": `${getWidth()}px`, "max-width": `${getWidth()}px` }}
      class="flex flex-wrap gap-1.5 bg-black p-4 rounded-xl"
    >
      {/* 用来调试用来, 看看宽度计算正确不正确 TODO: 待删 */}
      <For each={new Array(props.frame.xSize)}>
        {() => {
          return (
            <div
              class={image8cGridVariants({ theme: "violet", size: props.pixelSize, bit: 6 })}
              style={{ height: "0" }}
            />
          );
        }}
      </For>
      <For each={props.frame.data}>
        {(r) => {
          return <div class={image8cGridVariants({ theme: props.theme, size: props.pixelSize, bit: r })} />;
        }}
      </For>
    </div>
  );
}
