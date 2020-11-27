M.Tabs.init(document.querySelectorAll('.tabs'));

const currency = (price) => {
  return new Intl.NumberFormat('en-EN', {
    currency: 'usd',
    style: 'currency'
  }).format(price)
};

const date = val => {
  return new Intl.DateTimeFormat('en-EN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(val))
};

document.querySelectorAll('.date').forEach(el => {
  el.textContent = date(el.textContent)
})

document.querySelectorAll('.price').forEach(el => {
  el.textContent = currency(el.textContent);
});

const cart = document.querySelector('#cart');
cart.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('js-remove')) {
    id = e.target.dataset.id;
    fetch('/cart/delete/' + id, { method: 'delete' }).then(res => res.json()).then(items => {
      if (items.data.length) {
        const html = items.data.map(el => {
          return `
          <tr>
            <td>${el.title}</td>
            <td>${el.count}</td>
            <td>
              <button class="btn btn-small js-remove" data-id="${el.id}">Delete</button>
            </td>
          </tr>
          `
        }).join('')
        cart.querySelector('tbody').innerHTML = html;
        cart.querySelector('.price').textContent = currency(items.totalPrice);
      } else {
        cart.innerHTML = '<p>Cart is empty</p>'
      }
    });
  }
});
