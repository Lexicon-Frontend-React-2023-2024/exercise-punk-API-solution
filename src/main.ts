import "./css/style.css";

import { ROUTE_CHANGE } from "./constants";
import { APP } from "./elements";
import { router } from "./router";

// ########## Register window events ##########

// Listens for when I manually change the route with navigate()
addEventListener(ROUTE_CHANGE, () => reRenderApp());

// Listent for built-in popstate event, triggers when I move back and forth in the browser's history
addEventListener("popstate", () => reRenderApp());

// ########## Application code ##########

/**
 * Location object is built-in and its property "href" is passed to my router function that returns
 * a HTML element. This is initially appended to the my div with the if "app".
 */

APP.appendChild(router(location.pathname));

// ########## Functions used by main ##########

function reRenderApp(): void {
  const currentAppContent = APP.firstElementChild!;
  APP.replaceChild(router(location.pathname), currentAppContent);
}
