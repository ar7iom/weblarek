import type { IProduct } from '../types'; // подключаем интерфейс товара из src/types/index.ts

export class Products {
  protected items: IProduct[] = []; // items — массив товаров, изначально пустой
  protected preview: IProduct | null = null; // preview — выбранный товар, изначально отсутствует

  setItems(items: IProduct[]): void { // Сохранение списка
    this.items = items;
  }

  getItems(): IProduct[] { // Получение списка
    return this.items;
  }

  getProduct(id: string): IProduct | undefined { // Поиск товара
    return this.items.find((item) => item.id === id);
  }

  setPreview(product: IProduct | null): void { // Запоминаем переданный товар. Если передать null, выбор будет сброшен
    this.preview = product;
  }

  getPreview(): IProduct | null { // Возвращаем запомненный товар либо null
    return this.preview;
  }
}