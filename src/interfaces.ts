interface IAmount {
  value: number;
  unit: string;
}

export interface IBeer {
  abv: number;
  id: number;
  brewers_tips: string;
  description: string;
  food_pairing: string[];
  image_url: string;
  ingredients: IIngredients;
  name: string;
  tagline: string;
  volume: IVolume;
}

export interface IBeerSearchParameters {
  beer_name?: string;
}

export interface IBeerResults {
  beerPages: IBeerResultPage[];
}

export interface IBeerResultPage {
  page: number;
  beers: IBeer[];
}

export interface IChangeRouteEvent extends Event {
  detail: IRouteDetails;
}

interface IHop {
  add: string;
  amount: IAmount;
  attribute: string;
  name: string;
}

interface IMalt {
  amount: IAmount;
  name: string;
}

export interface IRouteDetails {
  beer?: IBeer;
  beerId: number;
}

export interface IIngredientsBasic {
  hops: string[];
  malts: string[];
  yeast: string;
}

interface IIngredients {
  hops: IHop[];
  malt: IMalt[];
  yeast: string;
}

export interface IRoute {
  component: () => HTMLElement;
  id: number;
  name: string;
  nonNavigable?: true;
  path: string;
}

interface IVolume {
  value: number;
  unit: string;
}
