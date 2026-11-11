import type { BasketData } from '../../types';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export class Basket extends Component<BasketData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.listElement = container.querySelector<HTMLElement>('.basket__list')!;

    this.totalElement = container.querySelector<HTMLElement>('.basket__price')!;

    this.orderButton =
      container.querySelector<HTMLButtonElement>('.basket__button')!;

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set list(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
