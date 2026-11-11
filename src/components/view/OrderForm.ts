import type { OrderFormData, TPayment } from '../../types';
import { Form } from './Form';
import type { IEvents } from '../base/Events';

export class OrderForm extends Form<OrderFormData> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);

      this.paymentButtons = Array.from(
        container.querySelectorAll<HTMLButtonElement>(
          '.order__buttons button'
        )
      );

      this.addressInput =
        container.querySelector<HTMLInputElement>('input[name="address"]')!;
      
      this.paymentButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this.onInputChange('payment', button.name);
        });
      });

      this.addressInput.addEventListener('input', () => {
        this.onInputChange('address', this.addressInput.value);
      });
    }

  set payment(value: TPayment) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle(
        'button_alt-active',
        button.name === value
      );
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  protected onSubmit(): void {
    this.events.emit('order:submit');
  }
}