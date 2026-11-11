import type { CardData } from '../../types';
import { Component } from '../base/Component';

export abstract class Card<T extends CardData> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.titleElement =
      this.container.querySelector<HTMLElement>('.card__title')!;

    this.priceElement =
      this.container.querySelector<HTMLElement>('.card__price')!;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;
  }
}