import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';
import { Products } from './components/Products';
import { Cart } from './components/Cart';
import { Buyer } from './components/Buyer';
import { Api } from './components/base/Api';
import { ApiMethods } from './components/ApiMethods';
import { API_URL } from './utils/constants';
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

// Глобальные переменные
const events = new EventEmitter();

const productsModel = new Products(events); // Каталог
const cartModel = new Cart(events); // Корзина
const buyerModel = new Buyer(events); // Покупатель

const header = new Header(
  document.querySelector<HTMLElement>('.header')!,
  events
);
const initialCount = cartModel.getCount();
header.render({
  counter: initialCount,
});
const gallery = new Gallery(
  document.querySelector<HTMLElement>('.gallery')!
);
const modal = new Modal(
  document.querySelector<HTMLElement>('.modal')!, 
  events
);

const basket = new Basket(
  cloneTemplate<HTMLElement>('#basket'),
  events
);

const orderForm = new OrderForm (
  cloneTemplate<HTMLFormElement>('#order'),
  events
);

const contactsForm = new ContactsForm (
  cloneTemplate<HTMLFormElement>('#contacts'),
  events
);

const success = new Success(
  cloneTemplate<HTMLFormElement>('#success'),
  events
);

const preview = new CardPreview (
  cloneTemplate<HTMLElement>('#card-preview'),
  {
    onClick: () => {
      const product = productsModel.getPreview();

      if (!product) {
        return;
      }

      events.emit('product:toggle', { id: product.id });
    },
  }
);

// Глобавльные функции

// Подготавливает строки корзины и обновляет её содержимое
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

// Функция, которая принимает результат валидации модели и список полей нужного шага
function getFormState(
  errors: BuyerErrors,
  fields: (keyof IBuyer)[]
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

// Обновление формы заказа
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

// Обновление контактной формы

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

// Подписчики

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

// Отобразить корзину

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
  events.emit('cart:update')
});


// Выбрать товар и показать подробную карточку
events.on<IProduct>('product:open', (product) => {
  
  productsModel.setPreview(product); // Запоминаем выбранный товар

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

  const previewElement = preview.render({ // Заполняем превью
    ...product,
    buttonText,
    buttonDisabled: unavailable,
  });

  
  modal.render({ // Устанавливаем содержимое модалки и открываем её
    content: previewElement,
  });

  modal.open();
});

// Добавить или удалить товар и обновить кнопку
events.on<{ id: IProduct['id'] }>('product:toggle', ({ id }) => {
  const product = productsModel.getPreview(); // Получаем товар, открытый в превью
  
  if (!product) {
    return;
  }

  if (product.id !== id) { // Проверяем, что событие относится к открытому товару
    return;
  }

  const unavailable = product.price === null || product.price === 0;

  if (unavailable) {
    return;
  }

  const inBasket = cartModel.hasItem(id);

  let buttonText: string; // Выбираем лейбл кнопки

  if (inBasket) { // Меняем содержимое корзины
    cartModel.removeItem(product);
    buttonText = 'Купить';
  } else {
    cartModel.addItem(product);
    buttonText = 'Удалить из корзины';
  }

  preview.render({ // Обновляем только текст кнопки уже открытого превью
    buttonText: buttonText,
  });
});

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
events.on<{ field: keyof IBuyer; value: string }>('buyer:change', ({ field, value }) => {
    if (field === 'payment') {
      if (value === 'card' || value === 'cash' || value === '') {
        buyerModel.setData({
          payment: value,
        });
      }

      return;
    }

    buyerModel.setData({
      [field]: value,
    });
  }
);

// Уведомляет об обновлении данных покупателя
events.on('buyer:update', () => {
  updateOrderForm();
  updateContactsForm();
});

// Проверить данные и отправить заказ
events.on('contacts:submit', async () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  if (errors.payment || errors.address) { // Проверяем первый шаг оформления
    updateOrderForm();

    modal.render({
      content: orderForm.render(),
    });

    return;
  }

  if (errors.email || errors.phone) { // Проверяем контактные данные
    updateContactsForm();
    return;
  }

  if (buyer.payment === '') {   // Дополнительная проверка сужает тип оплаты для TypeScript
    return;
  }

  const products = cartModel.getItems();   // Пустой заказ отправлять нельзя

  if (products.length === 0) {
    contactsForm.render({
      errors: 'Корзина пуста',
      valid: false,
    });

    return;
  }

  const items = products.map((product) => { // Нужно отправлять только идентификаторы
    return product.id;
  });

  const order: IOrder = {
    payment: buyer.payment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    items: items,
    total: cartModel.getTotal(),
  };

  contactsForm.render({ // На время запроса блокируем кнопку оплаты
    valid: false,
    errors: '',
  });

  try {
    const result = await apiMethods.createOrder(order);

    // Очищаем модели только после успешного ответа
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

    updateContactsForm(); // Восстанавливаем состояние формы после неудачного запроса

    contactsForm.render({
      errors: 'Не удалось оформить заказ. Попробуйте ещё раз.',
    });
  }
});

// Закрытие модального окна после успешного заказа
events.on('success:close', () => {
  modal.close();
});

// Вызов API
const api = new Api(API_URL); 
const apiMethods = new ApiMethods(api);

apiMethods.getProducts() // Запрашиваем товары с сервера
  .then((response) => {
      productsModel.setItems(response.items);
      }
  ).catch((error: unknown) => {
    console.error('Не удалось загрузить каталог:', error); // Ошибка сервера или сети
  });
