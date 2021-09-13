// load products
const loadProducts = () => {
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => showProducts(data));
};
loadProducts();

// show all product in UI 
const showProducts = (products) => {
  console.log(products[0]);
  const allProducts = products.map((pd) => pd);
  for (const product of allProducts) {
    const image = product.image;
    const ratingAverage = product.rating.rate;
    const ratingCount = product.rating.count;
    console.log(ratingAverage);
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <div class="single-product h-100 d-flex flex-column">
        <div class="product-body">
          <img class="product-image" src=${image}></img>
          <h4>${product.title}</h4>
          <p class="my-2">Category: ${product.category}</p>
          <h6 class="my-2">
            <small>Rating: ${ratingAverage} (${ratingCount})</small>
          </h6>
          <h3>Price: $ ${product.price}</h3>
        </div>
        <div class="product-footer">
          <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
          <button id="details-btn" class="btn btn-danger">Details</button>
        </div>
      </div>
      `;
    document.getElementById("all-products").appendChild(div);
  }
};

// update cart
let count = 0;
const addToCart = (id, price) => {
  // update number of added products
  count = count + 1;
  document.getElementById("total-Products").innerText = count;

  // update price
  updatePrice("price", price);

  // update total tax
  updateTaxAndCharge();

  // update grand total
  updateTotal();
};

const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = value.toFixed(2);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if (priceConverted > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", priceConverted * 0.2);
  }
  if (priceConverted > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", priceConverted * 0.3);
  }
  if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", priceConverted * 0.4);
  }
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal = getInputValue("price") + getInputValue("delivery-charge") + getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal.toFixed(2);
};

// cart button toggle
document.getElementById('cart_toggle_btn').addEventListener('click', () => {
  document.getElementById('my-cart').classList.toggle('active');
});
