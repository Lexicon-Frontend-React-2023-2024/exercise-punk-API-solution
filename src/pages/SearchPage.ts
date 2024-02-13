import "../css/SearchPage.css";

import { Header } from "../components";
import { createElementWithId } from "../utilities";
import { INPUT } from "../constants";
import { IBeer, IBeerSearchParameters } from "../interfaces";

export function SearchPage(): HTMLElement {
  const searchPageEl = createElementWithId("search-page", "main");

  searchPageEl.innerHTML = /*html*/ `
    ${Header().outerHTML}
    <section class="search">
      <h2 class="search-intro">Search for your beer!</h3>
      <form class="search-form">
        <div class="input-wrapper name-search">
          <label class="label" for="name-search">Name of Beer</label>
          <input id="name-search" class="input" required type="text">
          </div>
          <button type="submit">Search</button>
      </form>
    </section>
  `;

  const formEl = searchPageEl.querySelector<HTMLDivElement>(".search-form")!;
  formEl.addEventListener("focusin", (event) => handleOnFormFocusIn(event));
  formEl.addEventListener("submit", (event) => handleOnSubmit(event));

  return searchPageEl;
}

// ########## Functions used by Search Page ##########

function constructBeerUrl(parameters?: IBeerSearchParameters): string {
  let url = "https://api.punkapi.com/v2/beers";

  if (!parameters) return url;

  const { beer_name } = parameters;

  console.log(parameters);

  url += "?";

  if (beer_name) url += `&beer_name=${beer_name}`;

  return url;
}

function handleOnFormFocusIn(event: FocusEvent): void {
  const target = event.target as HTMLElement;

  if (target.tagName !== INPUT) return;

  // Recast the variabel to an input since I know it is one after the if check.
  const input = target as HTMLInputElement;
  const label = input.previousElementSibling!;
  label.classList.add("hide");

  target.addEventListener(
    "blur",
    () => {
      !input.value && label.classList.remove("hide");
    },
    { once: true }
  );
}

function handleOnSubmit(event: SubmitEvent): void {
  event.preventDefault();

  const beerName = document.querySelector<HTMLInputElement>("#name-search")?.value;
  const beerParameters = {} as IBeerSearchParameters;
  
  beerParameters.beer_name = beerName ? (beerParameters.beer_name = beerName) : undefined;
  const url = constructBeerUrl(beerParameters);

  console.log(url);
}

async function fetchBeers(url: string): Promise<IBeer[]> {
  const response = await fetch(url);
  const beers: IBeer[] = await response.json();
  return beers;
}
