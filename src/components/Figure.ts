import "../css/Figure.css";
import notFoundImage from "../assets/not_found_image.webp";
import { createElementWithId } from "../utilities";

interface IFigureProps {
  height: string;
}

export function Figure(image_url: string, props: IFigureProps) {
  const figureEl = createElementWithId("figure", "figure");
  const image = image_url === null ? notFoundImage : image_url;

  figureEl.innerHTML = /*html*/ `
    <img src="${image}" style="height: ${props.height}">
  `;

  return figureEl;
}
