import type { CardCatalogData, CardActions } from '../../types';
import { Card } from './Card';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class CardCatalog extends Card<CardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLButtonElement, actions: CardActions) {
    super(container);

    this.imageElement =
      container.querySelector<HTMLImageElement>('.card__image')!;

    this.categoryElement =
      container.querySelector<HTMLElement>('.card__category')!;

    container.addEventListener('click', actions.onClick);
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value);
  }
  set category(value: string) {
    this.categoryElement.textContent = value;

    // Удаляем прежний модификатор, в том числе заданный в шаблоне.
    this.categoryElement.classList.remove(...Object.values(categoryMap));

    // Проверяем, что для переданной категории есть соответствие.
    if (Object.prototype.hasOwnProperty.call(categoryMap, value)) {
      const categoryClass = categoryMap[value as keyof typeof categoryMap];

      this.categoryElement.classList.add(categoryClass);
    }
  }
}