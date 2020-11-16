const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class Data {
  constructor(title, price, img) {
    this.title = title;
    this.price = price;
    this.img = img;
    this.id = uuidv4();
  }

  toJSON() {
    return {
      title: this.title,
      price: this.price,
      img: this.img,
      id: this.id
    }
  }

  async save() {
    const data = await Data.getData();
    data.push(this.toJSON());

    return new Promise((res, rej) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'data.json'), JSON.stringify(data), (err) => {
        err ? rej(err) : res();
      })
    })
  }

  static getData() {
    return new Promise((res, rej) => {
      fs.readFile(path.join(__dirname, '..', 'data', 'data.json'), 'utf-8', (err, data) => {
        err ? rej(err) : res(JSON.parse(data));
      })
    })
  }

  static async getById(id) {
    const data = await Data.getData();
    return data.find(c => c.id === id);
  }

  static async update(info) {
    const data = await Data.getData();
    const index = data.findIndex(c => c.id === info.id);
    data[index] = info;

    return new Promise((res, rej) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'data.json'), JSON.stringify(data), (err) => {
        err ? rej(err) : res();
      })
    })
  }
}

module.exports = Data;
