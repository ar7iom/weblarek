import type { IProduct } from '../types';
import type { IEvents } from './base/Events'; // подключаем брокер событий из src/components/base/Events.ts

export class Cart {
  protected items: IProduct[] = []; // Товары, добавленные в корзину
  protected events: IEvents; // events — события

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    // Возвращаем массив товаров корзины
    return this.items;
  }

  addItem(product: IProduct): void {
    // Добавляем товар в корзину

    if (product.price === null) {
      // Не добавляем товар без цены, но допускается при этом цена "0"
      return;
    }

    if (this.hasItem(product.id)) {
      // Проверяем на повтор ID, не добавляем дубликаты
      return;
    }

    this.items.push(product); // Добавляем товар в конец массива
    this.events.emit('cart:update'); // Сообщаем об изменении корзины
  }

  removeItem(product: IProduct): void {
    // Удаляем товар из корзины
    if (!this.hasItem(product.id)) {
      // Добавляем проверку, чтобы не уведомлять об удалении отсутствующего товара
      return;
    }

    this.items = this.items.filter(
      // Создаём новый массив фильтруя все товары козины, которые не совпадают с идентификатором удаляемого
      (item) => item.id !== product.id,
    );

    this.events.emit('cart:update'); // Сообщаем об изменении корзины
  }

  clear(): void {
    // Очищаем корзину, заменяя массив пустым
    if (this.items.length === 0) {
      // Добавляем проверку, чтобы не уведомлять об очистке пустой корзины
      return;
    }

    this.items = [];
    this.events.emit('cart:update'); // Сообщаем об изменении корзины
  }

  getTotal(): number {
    // Возвращаем сумму товаров в корзине
    return this.items.reduce(
      (total, item) => total + (item.price ?? 0), // Дополнительная проверка на случай изменения addItem, который не пропустит null: если item.price равно null(вдруг...) или undefined, то прибавляем 0
      0,
    );
  }

  getCount(): number {
    // Возвращаем количество товаров в корзине
    return this.items.length;
  }

  hasItem(id: string): boolean {
    // Проверяем, есть ли в корзине товар с переданным id: true, если хотя бы один товар удовлетворяет условию иначе - false
    return this.items.some((item) => item.id === id);
  }
}
