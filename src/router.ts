import { IRoute } from "./interfaces";
import { LandingPage, BeerInfoPage, SearchPage } from "./pages";

export const routes: IRoute[] = [
  {
    component: LandingPage,
    id: 1,
    name: "Random Beer",
    path: "/",
  },
  {
    component: BeerInfoPage,
    name: "Beer Info Page",
    id: 2,
    nonNavigable: true,
    path: "/beer-info-page",
  },
  {
    component: SearchPage,
    name: "Search Page",
    id: 3,
    path: "/search",
  },
];

export function router(pathname: string): HTMLElement {
  const routeToMount: IRoute = routes.find((route) => route.path === pathname)!;
  return routeToMount.component();
}
