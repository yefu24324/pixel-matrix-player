import { Show, createSignal } from "solid-js";
import { MirrorPlayer } from "~/components/pixel-matrix-player/mirror-player";
import { Slider } from "~/components/slider/slider";
import { Layout } from "./components/layout/layout";

export function App() {
  const [fileMedia, setFileMedia] = createSignal<"image" | "video" | "unknown">("unknown");
  const [file, setFile] = createSignal<File>();
  const [filePreview, setFilePreview] = createSignal<string>("");
  const [fileInputRef, setFileInputRef] = createSignal<HTMLInputElement>();
  const [source, setSource] = createSignal<HTMLVideoElement | HTMLImageElement>();
  const [xSize, setXSize] = createSignal(48);
  const [ySize, setYSize] = createSignal(27);
  const [pixelSize, setPixelSize] = createSignal(4); // 2-6
  /** 文件拖拽 */
  function handleDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) {
      return;
    }
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef();
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };
  /** 文件变化 */
  const handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "unknown";
    if (!type) {
      alert("Please upload an image or video file");
      return;
    }
    const preview = URL.createObjectURL(file);
    setFileMedia(type);
    setFile(file);
    setFilePreview(preview);
  };

  return (
    <Layout>
      <div class="w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Media Converter</h1>

        <input ref={setFileInputRef} type="file" accept="image/*,video/*" onChange={handleFileChange} class="hidden" />
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* 文件选区 */}
          <Show when={!file()}>
            <div
              class="cursor-pointer p-10 flex justify-center bg-white border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600"
              onClick={() => fileInputRef()?.click()}
              onKeyUp={() => fileInputRef()?.click()}
            >
              <div class="text-center">
                <span class="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200">
                  <svg
                    class="shrink-0 size-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <title>Upload</title>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </span>

                <div class="mt-4 flex flex-wrap justify-center text-sm/6 text-gray-600">
                  <span class="pe-1 font-medium text-gray-800 dark:text-neutral-200">拖拽文件到此处或</span>
                  <span class="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 dark:bg-neutral-800 dark:text-blue-500 dark:hover:text-blue-600">
                    选择文件
                  </span>
                </div>

                <p class="mt-2 text-xs text-gray-400 dark:text-neutral-400">
                  可以尝试用
                  <a
                    class="text-blue-600 opacity-90 hover:opacity-90 decoration-2 hover:underline focus:outline-hidden focus:underline"
                    href="/bad-apple.mp4"
                    download
                    onClick={(e) => e.stopPropagation()}
                  >
                    Bad Apple.mp4
                  </a>
                  播放体验
                </p>
              </div>
            </div>
          </Show>
          <Show when={file()}>
            <div class="space-y-4">
              {/* File Preview */}
              <div>
                <Show when={fileMedia() === "image"}>
                  <img ref={setSource} src={filePreview()} alt="Preview" class="max-h-48 mx-auto rounded-lg" />
                </Show>
                <Show when={fileMedia() === "video"}>
                  <video ref={setSource} src={filePreview()} controls class="max-h-48 mx-auto rounded-lg" />
                </Show>
                <p class="mt-2 text-sm text-gray-500">
                  {file().name} ({(file().size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>

              {/* 转换配置 */}
              <div class="border-t pt-4">
                <div class="flex items-center gap-2 mb-4">
                  <svg
                    class="w-4 h-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <title>setting</title>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>

                  <h3 class="font-semibold text-gray-700">转换配置</h3>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1" for="xSize">
                    X轴大小: {xSize()}
                  </label>
                  <Slider value={xSize()} onChange={(value) => setXSize(value)} />
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1" for="ySize">
                    Y轴大小: {ySize()}
                  </label>
                  <Slider value={ySize()} onChange={(value) => setYSize(value)} />
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>
      <div class="flex-1 p-8 overflow-hidden">
        <div class="bg-white rounded-xl shadow-lg p-8 h-full flex items-center justify-center overflow-hidden">
          <div class="w-full h-full flex items-center justify-center overflow-auto">
            <MirrorPlayer xSize={xSize()} ySize={ySize()} pixelSize={pixelSize()} source={source()} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
