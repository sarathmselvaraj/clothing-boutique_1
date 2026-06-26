/* =====================================================
   Rose & Thread Boutique - Main JavaScript
   Dark mode, validation, countdown, small interactions
===================================================== */
'use strict';

const storageKey = 'rose-thread-theme';
const body = document.body;
const savedTheme = localStorage.getItem(storageKey);
if (savedTheme === 'dark') body.classList.add('dark-mode');
if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) body.classList.add('dark-mode');

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem(storageKey, body.classList.contains('dark-mode') ? 'dark' : 'light');
    button.setAttribute('aria-pressed', body.classList.contains('dark-mode').toString());
  });
});

function showError(field, message) {
  const holder = field.parentElement.querySelector('.error-message');
  field.classList.toggle('is-invalid', Boolean(message));
  if (holder) holder.textContent = message || '';
}

function validateEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

document.querySelectorAll('form[data-validate="true"]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    let valid = true;
    form.querySelectorAll('[data-required="true"]').forEach((field) => {
      const value = field.value.trim();
      let message = '';
      if (!value) message = 'This field is required.';
      if (!message && field.type === 'email' && !validateEmail(value)) message = 'Enter a valid email address.';
      showError(field, message);
      if (message) valid = false;
    });
    if (!valid) event.preventDefault();
  });
});

const countdown = document.querySelector('[data-countdown]');
if (countdown) {
  const target = new Date(countdown.getAttribute('data-countdown')).getTime();
  const updateCountdown = () => {
    const diff = Math.max(target - Date.now(), 0);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    countdown.querySelector('[data-days]').textContent = days.toString().padStart(2, '0');
    countdown.querySelector('[data-hours]').textContent = hours.toString().padStart(2, '0');
    countdown.querySelector('[data-minutes]').textContent = minutes.toString().padStart(2, '0');
    countdown.querySelector('[data-seconds]').textContent = seconds.toString().padStart(2, '0');
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);
}
/* ==============================
   Add To Cart
============================== */

const cartButtons = document.querySelectorAll(".add-to-cart");

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

cartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = {
      name: button.getAttribute("data-name"),
      price: Number(button.getAttribute("data-price")),
      image: button.getAttribute("data-image"),
      quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find((item) => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(product.name + " added to cart");
  });
});

updateCartCount();