import type { HeaderData } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<HeaderData> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.basketButton =
      this.container.querySelector<HTMLButtonElement>('.header__basket')!;
      
    this.counterElement =
      this.container.querySelector<HTMLElement>('.header__basket-counter')!;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }
  
  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}