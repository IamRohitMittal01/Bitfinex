class Order {
    constructor(id, clientId, symbol, price, quantity) {
      this.id = id;
      this.clientId = clientId;
      this.symbol = symbol;
      this.price = price;
      this.quantity = quantity;
    }
  }
  
  module.exports = Order;
  