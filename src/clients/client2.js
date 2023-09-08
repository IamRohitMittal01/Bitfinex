const OrderBook = require('../orderbook/orderbook'); // Adjust the path as needed
const io = require('socket.io-client');

const socket = io('http://localhost:3000');
const orderBook = new OrderBook();

const clientId = 'client1';

const buyOrders = [
  { symbol: 'BTC/USD', price: 50000, quantity: 5 },
  { symbol: 'ETH/USD', price: 3500, quantity: 10 },
];

buyOrders.forEach((order, index) => {
  const orderId = `${clientId}_buy_${index + 1}`;
  orderBook.addOrder(orderId, clientId, order.symbol, 'BUY', order.price, order.quantity);
  socket.emit('submitOrder', order);
  console.log(`Client1 placed BUY order: ${orderId}`);
});

const sellOrders = [
  { symbol: 'BTC/USD', price: 50500, quantity: 3 },
  { symbol: 'ETH/USD', price: 3600, quantity: 7 },
];

sellOrders.forEach((order, index) => {
  const orderId = `${clientId}_sell_${index + 1}`;
  orderBook.addOrder(orderId, clientId, order.symbol, 'SELL', order.price, order.quantity);
  socket.emit('submitOrder', order);
  console.log(`Client1 placed SELL order: ${orderId}`);
});

console.log('Current Order Book:', orderBook.getOrderBook());