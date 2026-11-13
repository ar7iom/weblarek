import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';
import { Products } from './components/Products';
import { Cart } from './components/Cart';
import { Buyer } from './components/Buyer';
import { Api } from './components/base/Api';
import { ApiMethods } from './components/ApiMethods';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import type { IProduct, IBuyer, BuyerErrors, IOrder } from './types';

import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/CardCatalog';
import { Modal } from './components/view/Modal';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

// ----------------------------
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ----------------------------

const events = new EventEmitter();

const productsModel = new Products(events); // Каталог
const cartModel = new Cart(events); // Корзина
const buyerModel = new Buyer(events); // Покупатель

const header = new Header(
  document.querySelector<HTMLElement>('.header')!,
  events,
);
const initialCount = cartModel.getCount();
header.render({
  counter: initialCount,
});
const gallery = new Gallery(document.querySelector<HTMLElement>('.gallery')!);
const modal = new Modal(document.querySelector<HTMLElement>('.modal')!);

const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), events);

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>('#order'),
  events,
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>('#contacts'),
  events,
);

const success = new Success(cloneTemplate<HTMLElement>('#success'), events);

const preview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
  onClick: () => {
    events.emit('product:toggle');
  },
});

// ----------------------------
// ГЛОБАВЛЬНЫЕ ФУНКЦИИ
// ----------------------------

// Получает товары из Cart, создаёт элементы через CardBasket, передаёт их вместе с суммой и состоянием кнопки в Basket.render()
function updateBasket(): void {
  const products = cartModel.getItems();

  const cards = products.map((product, index) => {
    const container = cloneTemplate<HTMLElement>('#card-basket');

    const card = new CardBasket(container, {
      onClick: () => {
        events.emit('product:remove', { id: product.id });
      },
    });

    return card.render({
      ...product,
      index: index + 1,
    });
  });

  basket.render({
    list: cards,
    total: cartModel.getTotal(),
    buttonDisabled: products.length === 0,
  });
}

// Собирает сообщения только для полей текущего шага и возвращает его валидность
function getFormState(
  errors: BuyerErrors,
  fields: (keyof IBuyer)[],
): { valid: boolean; errors: string } {
  let valid = true;
  const messages: string[] = [];

  fields.forEach((field) => {
    const message = errors[field];

    if (message) {
      valid = false;
      messages.push(message);
    }
  });

  return {
    valid: valid,
    errors: messages.join('. '),
  };
}

// Передаёт в первую форму оплату, адрес, ошибки этих полей и состояние кнопки
function updateOrderForm(): void {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  const formState = getFormState(errors, ['payment', 'address']);

  orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    valid: formState.valid,
    errors: formState.errors,
  });
}

// Передаёт контакты и ошибки второго шага
function updateContactsForm(): void {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  const formState = getFormState(errors, ['email', 'phone']);

  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: formState.valid,
    errors: formState.errors,
  });
}

// ----------------------------
// ПОДПИСЧИКИ НА СОБЫТИЯ
// ----------------------------

// КАТАЛОГ И ПРЕВЬЮ

// Уведомляет об обновлении каталога товаров
events.on('products:update', () => {
  const products = productsModel.getItems();

  const cards = products.map((product) => {
    const container = cloneTemplate<HTMLButtonElement>('#card-catalog');
    const card = new CardCatalog(container, {
      onClick: () => {
        events.emit('product:open', product);
      },
    });
    return card.render(product);
  });

  gallery.render({
    catalog: cards,
  });
});

// Выбрать товар
events.on<IProduct>('product:open', (product) => {
  productsModel.setPreview(product); // Запоминаем выбранный товар
});

// Показать подробную карточку
events.on('preview:changed', () => {
  const product = productsModel.getPreview();

  if (!product) {
    return;
  }

  const inBasket = cartModel.hasItem(product.id); // Получаем данные для состояния кнопки
  const unavailable = product.price === null || product.price === 0;

  let buttonText: string; // Выбираем лейбл кнопки

  if (unavailable) {
    buttonText = 'Недоступно';
  } else if (inBasket) {
    buttonText = 'Удалить из корзины';
  } else {
    buttonText = 'Купить';
  }

  const previewElement = preview.render({
    // Заполняем превью
    ...product,
    buttonText,
    buttonDisabled: unavailable,
  });

  modal.render({
    // Устанавливаем содержимое модалки и открываем её
    content: previewElement,
  });

  modal.open();
});

// Добавить или удалить товар и обновить кнопку
events.on('product:toggle', () => {
  const product = productsModel.getPreview(); // Получаем товар, открытый в превью

  if (!product) {
    return;
  }

  const id = product.id;
  const inBasket = cartModel.hasItem(id);

  if (inBasket) {
    // Меняем содержимое корзины
    cartModel.removeItem(product);
  } else {
    cartModel.addItem(product);
  }

  modal.close();
});

// КОРЗИНА

// Подготавливает и показывает корзину.
events.on('basket:open', () => {
  updateBasket();

  const basketElement = basket.render();

  modal.render({
    content: basketElement,
  });

  modal.open();
});

// Обновляет содержимое корзины и счётчик после изменения модели
events.on('cart:update', () => {
  updateBasket();

  const count = cartModel.getCount();

  header.render({
    counter: count,
  });
});

// Удалить товар из корзины
events.on<{ id: IProduct['id'] }>('product:remove', ({ id }) => {
  const products = cartModel.getItems(); // Получаем товары в корзине
  const product = products.find((item) => {
    return item.id === id;
  });

  if (!product) {
    return;
  }

  cartModel.removeItem(product);
});

// ОФОРМЛЕНИЕ ЗАКАЗА

// Показать первый шаг оформления
events.on('order:open', () => {
  updateOrderForm();

  modal.render({
    content: orderForm.render(),
  });

  modal.open();
});

// Показать второй шаг оформления

events.on('order:submit', () => {
  updateContactsForm();

  modal.render({
    content: contactsForm.render(),
  });

  modal.open();
});

// Изменение данных покупателя
events.on<{ field: keyof IBuyer; value: string }>(
  'buyer:change',
  ({ field, value }) => {
    if (field === 'payment') {
      if (value === 'card' || value === 'cash')  {
        buyerModel.setData({
          payment: value,
        });
      }

      return;
    }

    buyerModel.setData({
      [field]: value,
    });
  },
);

// Уведомляет об обновлении данных покупателя
events.on('buyer:update', () => {
  updateOrderForm();
  updateContactsForm();
});

// Отправить заказ
events.on('contacts:submit', async () => {
  const buyer = buyerModel.getData();
  const products = cartModel.getItems();

  const items = products.map((product) => {
    return product.id;
  });

  const order: IOrder = {
    payment: buyer.payment as IOrder['payment'],
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    items: items,
    total: cartModel.getTotal(),
  };

  contactsForm.render({
    valid: false,
    errors: '',
  });

  try {
    const result = await apiMethods.createOrder(order);

    cartModel.clear();
    buyerModel.clear();

    const successElement = success.render({
      total: result.total,
    });

    modal.render({
      content: successElement,
    });

    modal.open();
  } catch (error: unknown) {
    console.error('Не удалось оформить заказ:', error);

    updateContactsForm(); // Восстанавливаем состояние кнопки по актуальным данным

    contactsForm.render({     // Показываем ошибку после обновления формы, чтобы её не стереть
      errors: 'Не удалось оформить заказ. Попробуйте ещё раз.',
    });
  }
});

// Закрытие модального окна после успешного заказа
events.on('success:close', () => {
  modal.close();
});

// API

const api = new Api(API_URL);
const apiMethods = new ApiMethods(api);

apiMethods
  .getProducts() // Запрашиваем товары с сервера
  .then((response) => {
    response.items.forEach((item) => {
      if (item.image) {
        item.image = `${CDN_URL}${item.image}`;
      }
    });
    productsModel.setItems(response.items);
  })
  .catch((error: unknown) => {
    console.error('Не удалось загрузить каталог:', error); // Ошибка сервера или сети
  });
