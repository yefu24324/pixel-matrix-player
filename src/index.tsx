import { render } from "solid-js/web";
import { App } from "./app";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  render(() => <App />, root);
}
