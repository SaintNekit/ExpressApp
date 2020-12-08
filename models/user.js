const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatarUrl: String,
  token: String,
  tokenExp: Date,
  cart: {
    data: [
      {
        dataId: {
          type: Schema.Types.ObjectId,
          ref: 'Data',
          required: true
        },
        count: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  }
});

userSchema.methods.addData = function (data) {
  const copiedData = [...this.cart.data];
  const item = copiedData.findIndex(c => c.dataId.toString() === data._id.toString());

  item >= 0 ? copiedData[item].count += 1
    : copiedData.push({
      dataId: data._id,
      title: data.title,
      count: 1,
      price: data.price
    })

  this.cart = { data: copiedData };
  return this.save();
};

userSchema.methods.deleteItem = function (id) {
  let data = [...this.cart.data];
  const index = data.findIndex(el => el.dataId.toString() === id);

  data[index].count === 1 ? data = data.filter(el => el.dataId.toString() !== id) : data[index].count--;
  this.cart = { data };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.data = [];
  return this.save();
};

module.exports = model('User', userSchema);
