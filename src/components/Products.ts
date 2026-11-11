import type { IProduct } from '../types'; // подключаем интерфейс товара из src/types/index.ts
import type { IEvents } from './base/Events'; // подключаем брокер событий из src/components/base/Events.ts

export class Products {
  protected items: IProduct[] = []; // items — массив товаров, изначально пустой
  protected preview: IProduct | null = null; // preview — выбранный товар, изначально отсутствует
  protected events: IEvents; // events — события

  constructor(events: IEvents) {
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    // Сохранение списка
    this.items = items;
    this.events.emit('products:update');
  }

  getItems(): IProduct[] {
    // Получение списка
    return this.items;
  }

  getProduct(id: string): IProduct | undefined {
    // Поиск товара
    return this.items.find((item) => item.id === id);
  }

  setPreview(product: IProduct | null): void {
    // Запоминаем переданный товар. Если передать null, выбор будет сброшен
    this.preview = product;
  }

  getPreview(): IProduct | null {
    // Возвращаем запомненный товар либо null
    return this.preview;
  }
}
