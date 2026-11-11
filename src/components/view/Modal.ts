import type { ModalData } from '../../types';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export class Modal extends Component<ModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.closeButton =
      container.querySelector<HTMLButtonElement>('.modal__close')!;

    this.contentElement =
      container.querySelector<HTMLElement>('.modal__content')!;

    // Клик по кнопке закрытия  
    this.closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.close();
    });

   // Клик по фону закрывает модальное окно
    this.container.addEventListener('click', () => {
      this.close();
    });

    // Клики внутри окна не всплывают до внешнего контейнера
    const modalContainer =
      container.querySelector<HTMLElement>('.modal__container')!;

    modalContainer.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }
}