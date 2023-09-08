class OrderBook {
  constructor() {
    this.orders = {
      BUY: [],
      SELL: [],
    };
  }

  addOrder(order) {
    const { type } = order;
    this.orders[type].push(order);
    this.sortOrdersByPrice(type);
  }

  getOrderBook(type) {
    return this.orders[type];
  }

  sortOrdersByPrice(type) {
    this.orders[type].sort((a, b) => a.price - b.price);
  }

}

const orderBook = new OrderBook();

const buyOrder1 = { type: 'BUY', price: 500, quantity: 5 };
const buyOrder2 = { type: 'BUY', price: 490, quantity: 3 };
const sellOrder1 = { type: 'SELL', price: 510, quantity: 4 };
const sellOrder2 = { type: 'SELL', price: 520, quantity: 2 };

orderBook.addOrder(buyOrder1);
orderBook.addOrder(buyOrder2);
orderBook.addOrder(sellOrder1);
orderBook.addOrder(sellOrder2);

const buyOrders = orderBook.getOrderBook('BUY');
const sellOrders = orderBook.getOrderBook('SELL');

console.log('BUY Orders:');
console.log(buyOrders);

console.log('SELL Orders:');
console.log(sellOrders);
