import type { ContactsFormData } from '../../types';
import { Form } from './Form';
import type { IEvents } from '../base/Events';

export class ContactsForm extends Form<ContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput =
      container.querySelector<HTMLInputElement>('input[name="email"]')!;
    
    this.phoneInput =
      container.querySelector<HTMLInputElement>('input[name="phone"]')!;

    this.emailInput.addEventListener('input', () => {
      this.onInputChange('email', this.emailInput.value);
    });
    
    this.phoneInput.addEventListener('input', () => {
      this.onInputChange('phone', this.phoneInput.value);
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  protected onSubmit(): void {
    this.events.emit('contacts:submit');
  }
}