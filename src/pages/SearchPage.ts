import "../css/SearchPage.css";

import { Header } from "../components";
import { createElementWithId, navigate } from "../utilities";

import {
  IBeer,
  IBeerResultPage,
  IBeerResults,
  IBeerSearchParameters,
  IRouteDetails,
} from "../interfaces";

let beerResults: IBeerResults;
let allBeers: IBeer[];
let currentPage: number = 1;

export function SearchPage(): HTMLElement {
  const searchPageEl = createElementWithId("search-page", "main");
  // <label class="label" for="name-search">Name of Beer</label>

  searchPageEl.innerHTML = /*html*/ `
    ${Header().outerHTML}
    <section class="search">
      <h2 class="search-intro">Search for your beer!</h2>
      <form class="search-form">
        <div class="input-wrapper name-search">
          <input class="input" id="name-search" placeholder="Beer name" required type="text">
        </div>
        <button class="btn" type="submit">Search</button>
      </form>
    </section>
    <section class="search-results-wrapper">
      <div class="loader hide"></div>
      <div class="search-results"></div>
      <div class="pagination hide">
        <span class="material-symbols-outlined pagination-ctrl left">play_arrow</span>
        <span class="pages"></span>
        <span class="material-symbols-outlined pagination-ctrl right">play_arrow</span>
      </div>
    </section>
  `;

  const formEl = searchPageEl.querySelector<HTMLDivElement>(".search-form")!;
  const searchResultsEl = searchPageEl.querySelector<HTMLElement>(".search-results")!;
  const paginationEL = searchPageEl.querySelector<HTMLDivElement>(".pagination")!;

  formEl.addEventListener("submit", (event) => handleOnSubmit(event));
  searchResultsEl.addEventListener("click", (event) => handleOnBeerClick(event));
  paginationEL.addEventListener("click", (event) => handleOnPaginationClick(event));

  return searchPageEl;
}

// ########## Functions used by Search Page ##########

function addBeerResultsToDom(currentPageNumber = 1): void {
  const searchResultsEl = document.querySelector<HTMLElement>(".search-results")!;
  const paginationPages = document.querySelector<HTMLSpanElement>(".pagination .pages")!;
  const pages = beerResults.beerPages.at(-1)?.page;

  const beerResultPage = beerResults.beerPages.find(
    (beerPage) => beerPage.page === currentPageNumber
  )!;

  paginationPages.innerHTML = `${currentPageNumber}/${pages}`;

  const beersHtml = beerResultPage.beers.map((beer) => createBeerHtml(beer)).join("");
  searchResultsEl.innerHTML = beersHtml;

  showOrUpdatePagination();
  hideLoadingShowResults();
}

function constructBeerUrl(parameters?: IBeerSearchParameters): string {
  let url = "https://api.punkapi.com/v2/beers";
  if (!parameters) return url;

  const { beer_name } = parameters;

  url += "?per_page=80";
  if (beer_name) url += `&beer_name=${beer_name}`;

  return url;
}

function createBeerHtml(beer: IBeer): string {
  return /*html*/ `
    <div class="beer" id="${beer.id}">${beer.name}</div>
  `;
}

async function fetchBeers(url: string): Promise<IBeer[]> {
  hideShowResultShowLoading();

  const response = await fetch(url);
  const beers: IBeer[] = await response.json();
  return beers;
}

function handleOnBeerClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (!target.classList.contains("beer")) return;

  const beerId = parseInt(target.id);
  const beer = allBeers.find((beer) => beer.id === beerId)!;
  navigate<IRouteDetails>("/beer-info-page", { beerId: beer.id, beer });
}

function handleOnPaginationClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (!target.classList.contains("pagination-ctrl")) return;
  if (target.classList.contains("disabled")) return;
  if (target.classList.contains("left")) addBeerResultsToDom(--currentPage);
  if (target.classList.contains("right")) addBeerResultsToDom(++currentPage);
}

async function handleOnSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const beerName = document.querySelector<HTMLInputElement>("#name-search")?.value;
  const beerParameters = {} as IBeerSearchParameters;
  currentPage = 1;

  beerParameters.beer_name = beerName ? (beerParameters.beer_name = beerName) : undefined;

  const url = constructBeerUrl(beerParameters);
  const beers = await fetchBeers(url);
  const beersCopy = [...beers];
  allBeers = beers;

  if (beersCopy.length > 10) {
    beerResults = splitResultsUpForPagination(beersCopy);
  } else {
    beerResults = {
      beerPages: [
        {
          page: 1,
          beers: beersCopy,
        },
      ],
    };
  }

  console.log("beerResults:", beerResults);
  addBeerResultsToDom();
}

function hideLoadingShowResults(): void {
  const loaderEl = document.querySelector(".search-results-wrapper .loader");
  const searchResultsEl = document.querySelector(".search-results");

  loaderEl?.classList.add("hide");
  searchResultsEl?.classList.remove("hide");
}

function hidePagination() {
  const paginationEl = document.querySelector(".pagination");
  paginationEl?.classList.add("hide");
}

function hideShowResultShowLoading(): void {
  const loaderEl = document.querySelector(".search-results-wrapper .loader");
  const searchResultsEl = document.querySelector(".search-results");

  loaderEl?.classList.remove("hide");
  searchResultsEl?.classList.add("hide");
}

function showOrUpdatePagination() {
  const paginationEl = document.querySelector(".pagination")!;
  const leftPaginationCtrlEl = paginationEl.querySelector(".left")!;
  const rightPaginationCtrlEl = paginationEl.querySelector(".right")!;
  const lastPage = beerResults.beerPages.at(-1)?.page;

  if (currentPage === 1) {
    leftPaginationCtrlEl.classList.add("disabled");
  } else {
    leftPaginationCtrlEl.classList.remove("disabled");
  }

  if (currentPage === lastPage) {
    rightPaginationCtrlEl.classList.add("disabled");
  } else {
    rightPaginationCtrlEl.classList.remove("disabled");
  }

  paginationEl?.classList.remove("hide");
}

function splitResultsUpForPagination(beers: IBeer[]): IBeerResults {
  const beerResults: IBeerResults = {
    beerPages: [],
  };

  let page = 1;

  while (beers.length > 10) {
    // .splice() is a destructive method which mutates the original array, but it returns the "deleted" elements.
    const tenBeers = beers.splice(0, 10);

    const beerResultPage: IBeerResultPage = {
      page,
      beers: tenBeers,
    };

    beerResults.beerPages.push(beerResultPage);
    page++;
  }

  // Check if the last couple of beers are more than zero, then add that as the last beerResultPage.
  if (beers.length > 0) {
    const beerResultPage: IBeerResultPage = {
      page,
      beers: beers,
    };

    beerResults.beerPages.push(beerResultPage);
  }

  return beerResults;
}
