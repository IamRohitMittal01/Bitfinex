const { PeerRPCClient, PeerRPCServer } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const io = require('socket.io-client');

// Create a Grape link for both client and server
const link = new Link({
  grape: 'http://127.0.0.1:30001',
});
link.start();

const peerClient = new PeerRPCClient(link, {});
const peerServer = new PeerRPCServer(link, {});

// Initialize Socket.io client for communication with the exchange server
const socket = io('http://localhost:3000');

// Simulate a client with an order book
const clientId = 'client1';
const orderBook = {
  orders: [],
  addOrder(order) {
    this.orders.push(order);
    this.matchOrders();
  },
  matchOrders() {
    const newOrder = this.orders[this.orders.length - 1];
    const oppositeType = newOrder.type === 'BUY' ? 'SELL' : 'BUY';
    const oppositeOrders = this.orders.filter((order) => order.type === oppositeType);

    for (const oppositeOrder of oppositeOrders) {
      if (
        oppositeOrder.symbol === newOrder.symbol &&
        oppositeOrder.price <= newOrder.price &&
        oppositeOrder.quantity > 0 &&
        newOrder.quantity > 0
      ) {
        const matchedQuantity = Math.min(oppositeOrder.quantity, newOrder.quantity);
        const trade = {
          buyOrderId: newOrder.id,
          sellOrderId: oppositeOrder.id,
          symbol: newOrder.symbol,
          price: oppositeOrder.price,
          quantity: matchedQuantity,
        };
        newOrder.quantity -= matchedQuantity;
        oppositeOrder.quantity -= matchedQuantity;
        this.broadcastTrade(trade);
      }
    }
  },
  broadcastTrade(trade) {
    socket.emit('broadcastTrade', trade);
    peerClient.request('exchange', { action: 'broadcastTrade', trade, clientId }, (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log('Trade broadcasted:', data);
      this.updateLocalOrderBook(data.updatedOrders);
    });
  },
  updateLocalOrderBook(updatedOrders) {
    this.orders = updatedOrders;
  },
};

function submitOrder(order) {
  orderBook.addOrder(order);
  socket.emit('submitOrder', order);
}

const buyOrder = {
  id: 'order1',
  symbol: 'BTC/USD',
  type: 'BUY',
  price: 50000,
  quantity: 5,
};

submitOrder({ ...buyOrder });

const sellOrder = {
  id: 'order2',
  symbol: 'BTC/USD',
  type: 'SELL',
  price: 50500,
  quantity: 3,
};

submitOrder({ ...sellOrder });

