import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Products } from './components/Products';
import { Cart } from './components/Cart';
import { Buyer } from './components/Buyer';

const productsModel = new Products(); // Каталог
const cartModel = new Cart(); // Корзина
const buyerModel = new Buyer(); // Покупатель

productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems()); 