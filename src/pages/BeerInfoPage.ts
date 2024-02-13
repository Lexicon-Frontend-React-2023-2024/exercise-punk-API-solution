import "../css/BeerInfoPage.css";

import { Figure, Header } from "../components";
import { IBeer, IIngredientsBasic, IRouteDetails } from "../interfaces";
import { createElementWithId } from "../utilities";

export function BeerInfoPage(): HTMLElement {
  const routeState: IRouteDetails = history.state;
  const beer: IBeer = routeState.beer!;
  const beerInfoEl = createElementWithId("beer-info-page", "main");
  const ingredients: IIngredientsBasic = extractIngredients(beer);

  console.log("Route Data:", routeState);

  beerInfoEl.innerHTML = /*html*/ `
    ${Header().outerHTML}
    <section class="base-info" data-beerid="${routeState.beerId}">
      ${Figure(beer.image_url, { height: "200px" }).outerHTML}
      <h3 class="name">${beer.name}</h3>
      <div class="details">
        <div class="detail"><span class="detail-name">Alcohol by volume:</span> ${beer.abv}%</div>
        <div class="detail">
          <span class="detail-name">Volume:</span>
          ${beer.volume.value} ${beer.volume.unit}
        </div>
        <div class="detail">
          <span class="detail-name">Hops:</span>
          ${ingredients.hops.join(", ")}
        </div>
        <div class="detail">
          <span class="detail-name">Malts:</span>
          ${ingredients.malts.join(", ")}
        </div>
        <div class="detail"><span class="detail-name">Yeast:</span> ${ingredients.yeast}</div>
      </div>
    </section>

    <section class="description">${beer.description}</section>

    <section class="food-pairing">
      <div class="list-description">Food pairing tips</div>
      <ul class="food-pairing-tips"></ul>
    </section>

    <section class="brewers-tips">
      <div class="brewers-tips-header">Brewer's tips</div>
      ${beer.brewers_tips}
    </section>
  `;

  renderFoodPairingTips(beer, beerInfoEl);

  return beerInfoEl;
}

// ########## Functions used by BeerInfoPage ##########

function extractIngredients(beer: IBeer): IIngredientsBasic {
  const hops = beer.ingredients.hops.map((hop) => hop.name);
  const malts = beer.ingredients.malt.map((malt) => malt.name);
  const yeast = beer.ingredients.yeast;

  return { hops, malts, yeast };
}

function renderFoodPairingTips(beer: IBeer, beerInfoEl: HTMLElement) {
  const foodPairingsHTML: string = beer.food_pairing
    .map((fp) => /*html*/ `<li>${fp}</li>`)
    .join("");

  const foodPairingList: HTMLUListElement =
    beerInfoEl.querySelector<HTMLUListElement>(".food-pairing-tips")!;
  foodPairingList.innerHTML = foodPairingsHTML;
}
