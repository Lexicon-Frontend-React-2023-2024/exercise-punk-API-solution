import "../css/Header.css";
import { IRoute, IRouteDetails } from "../interfaces";
import { routes } from "../router";
import { createElementWithId, navigate } from "../utilities";

export function Header(): HTMLElement {
  const headerEl = createElementWithId("header", "header");

  headerEl.innerHTML = /*html*/ ` 
    <h1>Welcome to Punk API</h1>
    <nav class="navbar"></nav>
  `;

  renderNavLinks(headerEl, routes);

  // It takes sometime for the headerEl to actually be added to the DOM, this setTimeout just make sure this method invocation is done after all the synchronous code first.
  setTimeout(() => {
    addClickEventToNavbar();
  }, 0);

  return headerEl;
}

// ########## Functions used by Header ##########

function addClickEventToNavbar() {
  const navbarEl = document.querySelector<HTMLElement>(".navbar")!;

  navbarEl.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const pathToNavigateTo = target.dataset.path!;

    if (pathToNavigateTo === location.pathname) return;

    navigate<IRouteDetails>(pathToNavigateTo);
  });
}

function renderNavLinks(headerEl: HTMLElement, routes: IRoute[]) {
  const navLinksAsString = routes
    .filter((route) => !route.nonNavigable)
    .map((route) => {
      const isActive = location.pathname === route.path;

      return /*html*/ `
          <span 
            class="nav-link ${isActive ? "active" : ""}" 
            data-path="${route.path}" 
            id="${route.id}"
          >
          ${route.name}
          </span>
        `;
    })
    .join("");

  headerEl.querySelector(".navbar")!.innerHTML = navLinksAsString;
}
