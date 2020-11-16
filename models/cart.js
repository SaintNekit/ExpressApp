const path = require('path');
const fs = require('fs');

const pathToData = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

class Cart {

  static async add(item) {
    const cart = await Cart.get();
    const index = cart.items.findIndex(c => c.id === item.id);
    if (cart.items[index]) {
      cart.items[index].count++;
      cart.items[index] = cart.items[index];
    } else {
      item.count = 1;
      cart.items.push(item);
    }
    cart.totalPrice += +item.price;

    return new Promise((res, rej) => {
      fs.writeFile(pathToData, JSON.stringify(cart), err => {
        err ? rej(err) : res();
      })
    })
  }

  static async delete(id) {
    const cart = await Cart.get();
    const index = cart.items.findIndex(c => c.id === id);
    const item = cart.items[index];

    item.count === 1 ? cart.items = cart.items.filter(el => el.id !== id) : cart.items[index].count--;

    cart.totalPrice -= item.price;

    return new Promise((res, rej) => {
      fs.writeFile(pathToData, JSON.stringify(cart), err => {
        err ? rej(err) : res(cart);
      })
    })
  }

  static async get() {
    return new Promise((res, rej) => {
      fs.readFile(pathToData, 'utf-8', (err, data) => {
        err ? rej(err) : res(JSON.parse(data));
      })
    })
  }
}

module.exports = Cart;
