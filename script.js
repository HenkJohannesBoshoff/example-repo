// Product list
const items = [
  { id: 0, name: "Bread", price: 19.99, image: "images/bread.jpg" },
  { id: 1, name: "IceCream", price: 50.0, image: "images/icecream.jpg" },
  {
    id: 2,
    name: "Fish Fingers",
    price: 59.99,
    image: "images/fishfingers.jpg",
  },
  { id: 3, name: "Beans", price: 4.5, image: "images/KooBeans.jpg" },
];

// load saved cart or create new one
//localStorage stores small pieces of data in the browser, even if the tab closes.
//JSON.parse() turns the stored string back into a usable object.

let cart = JSON.parse(localStorage.getItem("cart")) || [];

//shows items on page
function showCatalog() {
  const catalogDiv = document.getElementById("catalog");
  catalogDiv.innerHTML = "";
  items.forEach((item) => {
    const productDiv = document.createElement("div");
    productDiv.className = "items";
    productDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="items-info">
        <strong>${item.name}</strong><br>
        R ${item.price.toFixed(2)}<br>
        <button onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    `;
    //item.price.toFixed(2) ensures the price always shows two decimal places
    catalogDiv.appendChild(productDiv);
  });
}
// loads items into cart when added
function showCart() {
  const cartDiv = document.getElementById("cart");
  cartDiv.innerHTML = "";
  if (cart.length === 0) {
    cartDiv.textContent = "Your cart is empty.";
    updateTotal();
    return;
  }
  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cartItem";

    const itemText = document.createElement("span");
    itemText.textContent = `${item.name} : R ${item.price.toFixed(2)}`;

    const span = document.createElement("span");
    span.className = "close";
    span.textContent = " \u00D7"; //small x for closing(also made it red in style.css)
    span.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      showCart();
    });

    itemDiv.appendChild(itemText);
    itemDiv.appendChild(span);
    cartDiv.appendChild(itemDiv);
  });
  updateTotal();
}
//Only saves the cart if the user agreed to cookies.
//JSON.stringify(cart) converts the array to a string so it can be stored.

function saveCart() {
  const consentGiven = localStorage.getItem("cookieConsent");
  if (consentGiven === "true") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

//get the item by ID and add it to the cart array.
function addToCart(itemID) {
  const product = items.find((item) => item.id === itemID);
  cart.push(product);
  saveCart();
  showCart();
}
//empties the cart
function clearCart() {
  cart = [];
  saveCart();
  showCart();
}

// Improved cookie functions with encoding and path
function setCookie(key, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${key}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}
//Looks for a cookie by its key name.
//Returns the saved value or empty if not found
//Got help with searching on google for this
function getCookie(key) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [k, v] = cookie.split("=");
    if (k === key) return decodeURIComponent(v);
  }
  return "";
}

// Save username in cookie and update welcome message
function saveName() {
  const name = document.getElementById("username").value.trim();
  if (name) {
    setCookie("username", name, 365);
    document.getElementById("welcome").textContent = `Welcome, ${name}!`;
  }
}

// Save currency preference in cookie
function saveCurrency() {
  const currency = document.getElementById("currency").value;
  setCookie("currency", currency, 365);
}

//Adds all prices in the cart and shows the total
function updateTotal() {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("total").textContent = `Total: R ${totalPrice.toFixed(
    2
  )}`;
}

function applyFont(font) {
  document.body.style.fontFamily = font || "";
}

document.addEventListener("DOMContentLoaded", function () {
  // Shows the cookie banner
  const consentGiven = localStorage.getItem("cookieConsent");
  const banner = document.getElementById("cookie-consent-banner");
  if (!consentGiven) banner.style.display = "block";

  document.getElementById("accept-cookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "true");
    banner.style.display = "none";
  });
  document.getElementById("decline-cookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "false");
    banner.style.display = "none";
  });

  // Load user name from cookie and greet
  const savedName = getCookie("username");
  console.log("Saved username from cookie:", savedName);
  if (savedName) {
    document.getElementById(
      "welcome"
    ).textContent = `Welcome back, ${savedName}!`;
    document.getElementById("username").value = savedName;
  }

  // Load currency from cookie
  const savedCurrency = getCookie("currency");
  if (savedCurrency) {
    document.getElementById("currency").value = savedCurrency;
  }

  // Restore font preference from sessionStorage
  const savedFont = sessionStorage.getItem("fontPreference");
  if (savedFont) {
    applyFont(savedFont);
    document.getElementById("fontSelect").value = savedFont;
  }

  // Font selection listener
  document.getElementById("fontSelect").addEventListener("change", function () {
    const selectedFont = this.value;
    sessionStorage.setItem("fontPreference", selectedFont);
    applyFont(selectedFont);
  });

  showCatalog();
  showCart();
});

// Show cache message after short delay
window.addEventListener("load", function () {
  setTimeout(() => {
    const cacheMsg = document.getElementById("cacheMessage");
    if (cacheMsg) {
      cacheMsg.style.display = "block";
    }
  }, 100);
});
