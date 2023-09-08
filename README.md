# Bitfinex
Assignment for Bitfinex

# The BFX challenge

Hi and congratulations to your progress with Bitfinex!

Your task is to create a simplified distributed exchange

* Each client will have its own instance of the orderbook.
* Clients submit orders to their own instance of orderbook. The order is distributed to other instances, too.
* If a client's order matches with another order, any remainer is added to the orderbook, too.

Requirement:
* Code in Javascript
* Use Grenache for communication between nodes
* Simple order matching engine
* You don't need to create a UI or HTTP API

You should not spend more time than 6-8 hours on the task. We know that its probably not possible to complete the task 100% in the given time.


If you don't get to the end, just write up what is missing for a complete implementation of the task. Also, if your implementation has limitation and issues, that's no big deal. Just write everything down and indicate how you could solve them, given there was more time.

Good luck!

## Tips

 - you don't need to store state in a DB or filesystem
 - it is possible to solve the task with the node std lib, async and grenache libraries
 - beware of race conditions!
 - no need for express or any other http api layers

### Setting up the DHT

```
npm i -g grenache-grape
```

```
# boot two grape servers

grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

### Setting up Grenache in your project

```
npm install --save grenache-nodejs-http
npm install --save grenache-nodejs-link
```


### Example RPC server / client with "Hello World"

```js
// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'

'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')


const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)

setInterval(function () {
  link.announce('rpc_test', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  console.log(payload) //  { msg: 'hello' }
  handler.reply(null, { msg: 'world' })
})

```

```js
// This client will as the DHT for a service called `rpc_test`
// and then establishes a P2P connection it.
// It will then send { msg: 'hello' } to the RPC server

'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

peer.request('rpc_test', { msg: 'hello' }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(data) // { msg: 'world' }
})
```

### More Help

 - http://blog.bitfinex.com/tutorial/bitfinex-loves-microservices-grenache/
 - https://github.com/bitfinexcom/grenache-nodejs-example-fib-client
 - https://github.com/bitfinexcom/grenache-nodejs-example-fib-server


 # Approach
Bitfinex
|
| src/
|
 ├── clients/
│   ├── client1.js
│   ├── client2.js
│   └── ...
│
├── orderbook/
│   ├── orderbook.js
│   └── order.js
│
├── server.js
└── package.json


clients folder simulates multiple clients
Once you 


# Set Up Grape Servers:

First, you'll need to set up two Grape servers as instructed to create a distributed network for communication between nodes.

# Node Implementation:

Create a Node.js application that represents each client node. Each client will have its own instance of the order book and communicate with other clients through the Grape network.

# Order Book:

Implement an order book for each client. The order book should handle the storage and management of buy and sell orders. You don't need to persist this data in a database or filesystem, as it's in-memory.

# Order Submission:

Clients can submit buy and sell orders to their local order book. When an order is submitted, it should also be broadcasted to other clients through the Grape network.

# Order Matching Engine:

Implement a simple order matching engine that runs on each client node. The engine should continuously check if there are any matching orders between the local order book and orders received from other clients through Grape.

# Matching Logic:

Define the logic for matching orders. Typically, orders are matched based on price and time priority. If a buy order's price is equal to or higher than a sell order's price, and the quantities match, they are considered matched. You should also handle partial matches.
Broadcast Matched Orders:

When a client's order matches with another order, broadcast the matched orders to all clients in the network. This ensures that all clients have the same view of the order book.
Update Local Order Book:

After broadcasting matched orders, update the local order book of each client to reflect the remaining orders and any new orders that have been added.
Handle Race Conditions:

Be aware of race conditions that may occur when multiple clients submit orders simultaneously. Implement mechanisms to handle such situations gracefully, such as locking or queueing orders.
Testing and Error Handling:

Thoroughly test the exchange under various scenarios, including order submissions, matches, and edge cases. Implement error handling and logging to make debugging easier.
Documentation:

Document your implementation, including how to set up and run the exchange, any limitations or known issues, and how to extend the system in the future.
Security Considerations:

Ensure that your implementation is secure and prevents unauthorized access or manipulation of orders and order books.