import type { CardBasketData, CardActions } from '../../types';
import { Card } from './Card';

export class CardBasket extends Card<CardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: CardActions) {
    super(container);
    
    this.indexElement = 
      container.querySelector<HTMLElement>('.basket__item-index')!;

    this.deleteButton = 
      container.querySelector<HTMLButtonElement>('.basket__item-delete')!;

    this.deleteButton.addEventListener('click', actions.onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = `${value}`;
  }
}