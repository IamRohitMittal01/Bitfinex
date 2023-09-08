class OrderBook {
  constructor() {
    this.orders = {};
  }

  addOrder(orderId, clientId, symbol, type, price, quantity) {
    if (!this.orders[symbol]) {
      // Create a new order book for the symbol if it doesn't exist
      this.orders[symbol] = { buys: [], sells: [] };
    }

    // Add the order to the appropriate side (BUY or SELL) of the order book
    const order = { orderId, clientId, symbol, type, price, quantity };
    if (type === 'BUY') {
      this.orders[symbol].buys.push(order);
    } else if (type === 'SELL') {
      this.orders[symbol].sells.push(order);
    }
  }

  getOrderBook(symbol) {
    if (!this.orders[symbol]) {
      return { buys: [], sells: [] }; // Return empty order book if symbol not found
    }

    return this.orders[symbol];
  }

  matchOrders() {
    const matchedOrders = [];
    const remainingBuyOrders = [];
    const remainingSellOrders = [];

    for (const buyOrder of this.buyOrders) {
      for (const sellOrder of this.sellOrders) {
        if (
          buyOrder.symbol === sellOrder.symbol &&
          buyOrder.price >= sellOrder.price &&
          buyOrder.quantity > 0 &&
          sellOrder.quantity > 0
        ) {
          const matchedQuantity = Math.min(buyOrder.quantity, sellOrder.quantity);
          matchedOrders.push({
            buyOrderId: buyOrder.id,
            sellOrderId: sellOrder.id,
            symbol: buyOrder.symbol,
            price: sellOrder.price,
            quantity: matchedQuantity,
          });

          buyOrder.quantity -= matchedQuantity;
          sellOrder.quantity -= matchedQuantity;

          if (buyOrder.quantity > 0) {
            remainingBuyOrders.push(buyOrder);
          }

          if (sellOrder.quantity > 0) {
            remainingSellOrders.push(sellOrder);
          }
        }
      }
    }

    this.buyOrders = remainingBuyOrders;
    this.sellOrders = remainingSellOrders;

    return matchedOrders;
  }
}

module.exports = OrderBook;
