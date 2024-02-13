import { ROUTE_CHANGE } from "./constants";
import { IChangeRouteEvent } from "./interfaces";

export function createElementWithId(id: string, element: string): HTMLElement {
  const htmlElement = document.createElement(element);
  htmlElement.id = id;
  return htmlElement;
}

export function navigate<T>(path: string, data?: T): void {
  console.log("Route Data:", data);
  history.pushState(data, "", path);
  const routeChangeEvent: IChangeRouteEvent = new CustomEvent(ROUTE_CHANGE);
  window.dispatchEvent(routeChangeEvent);
}


