const OrderBook = require('../orderbook/orderbook'); // Adjust the path as needed
const io = require('socket.io-client');

const orderBook = new OrderBook();

// Simulate client1 submitting orders
const clientId = 'client1';

// Generate and submit buy orders
const buyOrders = [
  { symbol: 'BTC/USD', price: 50000, quantity: 5 },
  { symbol: 'ETH/USD', price: 3500, quantity: 10 },
  // Add more buy orders as needed
];

buyOrders.forEach((order, index) => {
  const orderId = `${clientId}_buy_${index + 1}`;
  orderBook.addOrder(orderId, clientId, order.symbol, 'BUY', order.price, order.quantity);
  console.log(`Client1 placed BUY order: ${orderId}`);
});

// Generate and submit sell orders
const sellOrders = [
  { symbol: 'BTC/USD', price: 50500, quantity: 3 },
  { symbol: 'ETH/USD', price: 3600, quantity: 7 },
  // Add more sell orders as needed
];

sellOrders.forEach((order, index) => {
  const orderId = `${clientId}_sell_${index + 1}`;
  orderBook.addOrder(orderId, clientId, order.symbol, 'SELL', order.price, order.quantity);
  console.log(`Client1 placed SELL order: ${orderId}`);
});

// Display the current state of the order book
console.log('Current Order Book:');
console.log(orderBook.getOrderBook());
