import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Products } from './components/Products';
import { Cart } from './components/Cart';
import { Buyer } from './components/Buyer';
import { Api } from './components/base/Api';
import { ApiMethods } from './components/ApiMethods';
import { API_URL } from './utils/constants';

const productsModel = new Products(); // Каталог
const cartModel = new Cart(); // Корзина
const buyerModel = new Buyer(); // Покупатель

// Проверка вывода каталога
console.log('-- Локальное тестирование --');
console.log('--- Каталог ---');
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems()); 

// Берем первый товар с указанной ценой
const testProduct = apiProducts.items.find(
  (product) => product.price !== null
);

if (testProduct) {
  console.log(
    'Тестовый товар:',
    productsModel.getProduct(testProduct.id)
  );

  // Иммитируем выбор товара
  productsModel.setPreview(testProduct);
  
  // Выводим выбранный товар в консоль
  console.log(
    'Выбранный товар:',
    productsModel.getPreview()
  );

  // Сбрасываем выбор
  productsModel.setPreview(null);

  console.log(
    'Каталог после сброса (ожидаем null):',
    productsModel.getPreview()
  );
}

// Проверяем случай, когда товара с таким id нет
console.log(
  'Поиск отсутствующего товара, ожидаем undefined:',
  productsModel.getProduct('unknown-id')
);

// Проверяем корзину
console.log('--- Корзина ---');
cartModel.clear(); // Очищаем корзину

console.log(
  'Пустая корзина, ожидаем 0:',
  cartModel.getCount()
);

console.log(
  'Сумма пустой корзины, ожидаем 0:',
  cartModel.getTotal()
);

if (testProduct) {

  cartModel.addItem(testProduct); // Кладём тестовый товар в корзину

  console.log(
    'Товары после добавления в корзину:',
    [...cartModel.getItems()] // [...] создаёт копию массива для вывода в консоль
  );

  console.log(
    'Количество товаров после добавления в корзину, ожидаем 1:',
    cartModel.getCount()
  );

  console.log(
    'Итого, сумма должна равняться цене товара:',
    cartModel.getTotal(),
    'Цена товара:',
    testProduct.price
  );

  console.log(
    'Товар есть в корзине, ожидаем true:',
    cartModel.hasItem(testProduct.id)
  );

  cartModel.addItem(testProduct); // Пробуем добавить тот же товар повторно

  console.log(
    'Результат после повторного добавления, ожидаем 1:',
    cartModel.getCount()
  );

  cartModel.removeItem(testProduct);   // Удаляем товар

  console.log(
    'После удаления, ожидаем false:',
    cartModel.hasItem(testProduct.id)
  );

  console.log(
    'Количество после удаления, ожидаем 0:',
    cartModel.getCount()
  );

  // Добавляем снова, чтобы проверить очистку непустой корзины
  cartModel.addItem(testProduct);
  cartModel.clear();

  console.log(
    'Корзина после очистки, ожидаем []:',
    [...cartModel.getItems()]
  );

  console.log(
    'Сумма после очистки корзины, ожидаем 0:',
    cartModel.getTotal()
  );
}

// Пробуем добавить товар без цены, стоит запрет
const pricelessProduct = apiProducts.items.find(
  (product) => product.price === null // Находим такой товар
);

if (pricelessProduct) {
  cartModel.addItem(pricelessProduct);

  console.log(
    'Товар без цены не добавлен, ожидаем false:',
    cartModel.hasItem(pricelessProduct.id)
  );
}

// Проверяем покупателя
console.log('--- Покупатель ---');
buyerModel.clear(); // Сбрасываем данные в начале

console.log(
  'Начальные данные покупателя, ожидаем пустые строки:',
  buyerModel.getData()
);

console.log(
  'Ошибки пустой формы, ожидаем 4 ошибки:',
  buyerModel.validate()
);

// Имитируем первый этап заполнения формыЖ выбрал оплату и ввел адрес

buyerModel.setData({
  payment: 'card',
  address: 'Spb Vosstania 1'
});

console.log(
  'Итог после первого этапа:',
  buyerModel.getData()
);

console.log(
  'Проверка после первого этапа, ожидаем ошибки email и телефона:',
  buyerModel.validate()
);

// Имитируем второй этап: вводим остальные данные

buyerModel.setData({
  email: 'test@test.ru',
  phone: '+7 123 456 78 90'
});

console.log(
  'Все данные заполнены, ранее введенные сохранились:',
  buyerModel.getData()
);

console.log(
  'Ошибок нет, ожидаем {}:',
  buyerModel.validate()
);

// пробуем сохранить пустую строку (удалить данные)
buyerModel.setData({
  email: ''
});

console.log(
  'Проверка после очистки email, ожидаем ошибку email:',
  buyerModel.validate()
);

// Проверяем строку из пробелов
buyerModel.setData({
  email: '   '
});

console.log(
  'Пробелы вместо email, ожидаем ошибку email:',
  buyerModel.validate()
);

// Сбрасываем все данные
buyerModel.clear();

console.log(
  'После очистки ожидаем пустые строки:',
  buyerModel.getData()
);

console.log(
  'После очистки снова ожидаем 4 ошибки:',
  buyerModel.validate()
);

// Работы по 8му спринту
console.log('-- Проверки API для 8го спринта --');
const api = new Api(API_URL); 
const apiMethods = new ApiMethods(api);

apiMethods.getProducts() // Запрашиваем товары с сервера
  .then((response) => {
      productsModel.setItems(response.items);
      //Проверки
      console.log(
        'Каталог с сервера, сохранённый в модели:',
        [...productsModel.getItems()]
      );
      console.log(
        'Количество товаров в ответе сервера:',
        response.total
      );

      console.log(
        'Количество товаров в модели:',
        productsModel.getItems().length
      );
      }
  ).catch((error: unknown) => {
    console.error('Не удалось загрузить каталог:', error); // Ошибка сервера или сети
  });