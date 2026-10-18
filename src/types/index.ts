export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'card' | 'cash' | ''; // Тип для способов оплаты
export type BuyerErrors = Partial<Record<keyof IBuyer, string>>; // Валидация данных

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Данные товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Данные покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера при получении каталога.
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Данные для отправки заказа
export interface IOrder extends Omit<IBuyer, 'payment'> {
  payment: Exclude<TPayment, ''>; // Исключаем пустые методы оплаты, метод должен быть выбран
  total: number;
  items: IProduct['id'][]; // Идентификаторы товаров
}

// Ответ сервера после успешного оформления заказа
export interface IOrderResult {
  id: string;
  total: number;
}