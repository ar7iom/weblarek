import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { cloneTemplate } from './utils/utils';
import { Products } from './components/Products';
import { Cart } from './components/Cart';
import { Buyer } from './components/Buyer';
import { Api } from './components/base/Api';
import { ApiMethods } from './components/ApiMethods';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';

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

const events = new EventEmitter();

const productsModel = new Products(events); // Каталог
const cartModel = new Cart(events); // Корзина
const buyerModel = new Buyer(events); // Покупатель

const gallery = new Gallery(
  document.querySelector<HTMLElement>('.gallery')!
);

events.on('products:update', () => {
  const products = productsModel.getItems();

  const cards = products.map((product) => {
    const container = cloneTemplate<HTMLButtonElement>('#card-catalog');
    const card = new CardCatalog(container, {
      onClick: () => {
        productsModel.setPreview(product);
      },
    });
    return card.render(product);
  });

  gallery.render({
    catalog: cards,
  });

});
