const currency = (price) => {
  return new Intl.NumberFormat('en-EN', {
    currency: 'usd',
    style: 'currency'
  }).format(price)
}

document.querySelectorAll('.price').forEach(el => {
  el.textContent = currency(el.textContent);
})

const cart = document.querySelector('#cart');
cart.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('js-remove')) {
    id = e.target.dataset.id;

    fetch('/cart/delete/' + id, { method: 'delete' }).then(res => res.json()).then(data => {
      if (data.items.length) {
        const html = data.items.map(el => {
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
        cart.querySelector('.price').textContent = currency(data.totalPrice);
      } else {
        cart.innerHTML = '<p>Cart is empty</p>'
      }
    });
  }
})
