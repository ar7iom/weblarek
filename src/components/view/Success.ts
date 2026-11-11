import type { SuccessData } from '../../types';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export class Success extends Component<SuccessData> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.descriptionElement =
      container.querySelector<HTMLElement>('.order-success__description')!;
    
    this.closeButton =
      container.querySelector<HTMLButtonElement>('.order-success__close')!;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}