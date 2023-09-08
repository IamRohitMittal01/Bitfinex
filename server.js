const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const OrderBook = require('./src/orderbook/orderbook');
const server = http.createServer(app);
const io = socketIo(server);
const app = express();

const healthRoute = require('./src/routes/health');

app.use(express.json());

app.use('/health', healthRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('submitOrder', (order) => {
    // Handle incoming order submission
    orderBook.addOrder(order);

    // Implement order matching logic here
    const matchingResult = matchOrders(order);

    if (matchingResult.matches.length > 0) {
      io.emit('orderMatched', matchingResult.matches);
    }

    matchingResult.remainingOrders.forEach((remainingOrder) => {
      orderBook.addOrder(remainingOrder);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Exchange server is running on port 3000');
});