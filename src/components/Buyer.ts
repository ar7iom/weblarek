import type {
  IBuyer,
  TPayment,
  BuyerErrors
} from '../types';

export class Buyer { // Изначально данные пустые
  protected payment: TPayment = '';
  protected address: string = '';
  protected email: string = '';
  protected phone: string = '';

  setData(data: Partial<IBuyer>): void { // Сохраняем только переданные данные

    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
  }

  getData(): IBuyer { // Создаём новый объект и кладём туда данные покупателя
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }


  clear(): void { // Сбрасываем данные
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  validate(): BuyerErrors { // Валидация данных

    const errors: BuyerErrors = {};

    if (this.payment === '') {
      errors.payment = 'Выберите способ оплаты';
    }

    // Убираем пробелы через trim чтобы строка из одних пробелов считалась незаполненной 

    if (this.address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    if (this.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    if (this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}