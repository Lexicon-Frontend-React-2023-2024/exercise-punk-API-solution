0import { ROUTE_CHANGE } from "./constants";
import { router } from "./router";

import "./css/style.css";

const APP = document.querySelector<HTMLDivElement>("#app")!;

// ########## Register window events ##########

// Listens for when I manually change the route with navigate()
addEventListener(ROUTE_CHANGE, () => reRenderApp());

// Listent for built-in popstate event, triggers when I move back and forth in the browser's history
addEventListener("popstate", () => reRenderApp());

// ########## Application code ##########

/**
 * Location object is built-in and its property "pathname" is passed to my router function that returns
 * a HTML element. This is initially appended to the my div with the id "app".
 */

APP.appendChild(router(location.pathname));

// ########## Functions used by main ##########

function reRenderApp(): void {
  const currentAppContent = APP.firstElementChild!;
  APP.replaceChild(router(location.pathname), currentAppContent);
}
