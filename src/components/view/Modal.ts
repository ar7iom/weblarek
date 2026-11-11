import type { ModalData } from '../../types';
import { Component } from '../base/Component';

export class Modal extends Component<ModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected modalContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

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
    this.modalContainer =
      container.querySelector<HTMLElement>('.modal__container')!;

    this.modalContainer.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }
}
