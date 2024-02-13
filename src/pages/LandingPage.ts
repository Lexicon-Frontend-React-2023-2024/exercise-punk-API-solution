import "../css/LandingPage.css";

import { Figure, Header } from "../components";
import { IBeer, IRouteDetails } from "../interfaces";
import { createElementWithId, navigate } from "../utilities";

let currentRandomBeer: IBeer;

export function LandingPage(): HTMLElement {
  const landingPageEl = createElementWithId("landing-page", "main");

  landingPageEl.innerHTML = /*html*/ ` 
      ${Header().outerHTML}
      <section>
        <h2>Your random beer of the day!</h2>
        <article class="random-beer loading">
          <div class="loader"></div>
        </article>
      </section>
      <footer>
      <button class="generate-random-beer">Generate new random beer</button>
      </footer>
  `;

  fetchRandomBeer().then((randomBeer: IBeer) => {
    renderRandomBeer(randomBeer, landingPageEl);
  });

  const randomBeerBtn = landingPageEl.querySelector<HTMLButtonElement>(".generate-random-beer")!;
  randomBeerBtn.addEventListener("click", () => handleOnRandomBeerClick(landingPageEl));

  return landingPageEl;
}

// ########## Functions used be LandingPage ##########

async function fetchRandomBeer(): Promise<IBeer> {
  const response = await fetch("https://api.punkapi.com/v2/beers/random");
  const randomBeer: IBeer[] = await response.json();
  return randomBeer[0];
}

function handleOnRandomBeerClick(landingPageEl: HTMLElement) {
  const seeMore = landingPageEl.querySelector<HTMLElement>(".see-more")!;
  seeMore.removeEventListener("click", handleOnSeeMoreClick);
  renderLoadingRandomBeer(landingPageEl);
  fetchRandomBeer().then((randomBeer) => renderRandomBeer(randomBeer, landingPageEl));
}

function handleOnSeeMoreClick() {
  navigate<IRouteDetails>("/beer-info-page", {
    beer: currentRandomBeer,
    beerId: currentRandomBeer.id,
  });
}

function renderLoadingRandomBeer(landingPageEl: HTMLElement) {
  const randomBeerEl = landingPageEl.querySelector<HTMLElement>(".random-beer")!;
  randomBeerEl.classList.add("loading", "white-bg");
  randomBeerEl.innerHTML = /*html*/ `<div class="loader"></div>`;
}

function renderRandomBeer(randomBeer: IBeer, landingPageEl: HTMLElement): void {
  const randomBeerEl = landingPageEl.querySelector<HTMLElement>(".random-beer")!;
  currentRandomBeer = randomBeer;

  const html = /*html*/ `
  ${Figure(randomBeer.image_url, { height: "200px" }).outerHTML}
  <div class="random-beer-content">
    <h4 class="beer-name">${randomBeer.name}</h4>
    <div class="see-more">
      <span>See more</span>
      <span class="material-symbols-outlined">
        keyboard_arrow_right
      </span>
    </div>
  </div>
  `;

  randomBeerEl.innerHTML = html;
  randomBeerEl.classList.remove("loading", "white-bg");

  const seeMore = landingPageEl.querySelector<HTMLElement>(".see-more")!;
  seeMore.addEventListener("click", handleOnSeeMoreClick);
}
