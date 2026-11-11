import type { CardPreviewData, CardActions } from '../../types';
import { Card } from './Card';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class CardPreview extends Card<CardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: CardActions) {
    super(container);

    this.descriptionElement =
      container.querySelector<HTMLElement>('.card__text')!;

    this.imageElement =
      container.querySelector<HTMLImageElement>('.card__image')!;

    this.categoryElement =
      container.querySelector<HTMLElement>('.card__category')!;

    this.cardButton =
      container.querySelector<HTMLButtonElement>('.card__button')!;

    this.cardButton.addEventListener('click', actions.onClick);
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}