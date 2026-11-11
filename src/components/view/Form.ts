import type { IBuyer, FormData } from '../../types';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export abstract class Form<T extends FormData> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected events: IEvents;

  protected constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.submitButton = container.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    )!;

    this.errorsElement = container.querySelector<HTMLElement>('.form__errors')!;

    container.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this.submitButton.disabled) {
        return;
      }

      this.onSubmit();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  protected onInputChange(field: keyof IBuyer, value: string): void {
    this.events.emit('buyer:change', {
      field,
      value,
    });
  }

  protected abstract onSubmit(): void;
}
