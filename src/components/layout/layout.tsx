import type { JSX } from "solid-js";

export function Layout(props: { children: JSX.Element }) {
  return <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">{props.children}</div>;
}
