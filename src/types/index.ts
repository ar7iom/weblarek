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

// Типы данных представления

// Данные шапки
export interface HeaderData {
  counter: number;
}

// Данные галереи
export interface GalleryData {
  catalog: HTMLElement[];
}

// Данные базовой карточки
export type CardData = Pick<IProduct, 'title' | 'price'>;

// Данные карточки каталога
export type CardCatalogData =
  CardData & Pick<IProduct, 'image' | 'category'>;

// Данные подробной карточки
export type CardPreviewData =
  CardData & Pick<IProduct, 'image' | 'category' | 'description'> & {
    buttonText: string;
    buttonDisabled: boolean;
  };

// Данные карточки корзины   
export type CardBasketData = CardData & {
  index: number;
};

// Данные корзины
export interface BasketData {
  list: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

// Данные модального окна
export interface ModalData {
  content: HTMLElement;
}

// Общие данные форм
export interface FormData {
  valid: boolean;
  errors: string;
}

// Данные формы оплаты и доставки
export type OrderFormData =
  FormData & Pick<IBuyer, 'payment' | 'address'>;

// Данные формы контактов   
export type ContactsFormData =
  FormData & Pick<IBuyer, 'email' | 'phone'>;

// Данные подтверждения заказа
export type SuccessData = Pick<IOrderResult, 'total'>;

// Передача событий
export interface CardActions {
  onClick: () => void;
}