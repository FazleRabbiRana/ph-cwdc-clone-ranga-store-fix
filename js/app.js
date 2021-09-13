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
          <h2>Price: $ ${product.price}</h2>
        </div>
        <div class="product-footer">
          <button onclick="addToCart(${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
          <button onclick="loadDetail(${product.id})" id="details-btn" class="btn btn-danger">Details</button>
        </div>
      </div>
      `;
    document.getElementById("all-products").appendChild(div);
  }
};

// addToCart function
let count = 0;
const addToCart = (price) => {
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

// get inputValue function
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

/**
* Load detail
*/
const loadDetail = id => {
  loadingSpinner('flex');
  const url = `https://fakestoreapi.com/products/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => showDetail(data));
}

// show product detail in the UI
const showDetail = product => {
  console.log(product);
  const detailContainer = document.getElementById('product_detail');
  detailContainer.classList.toggle('active');
  const productDetail = document.createElement('div');
  productDetail.classList.add('single-product-detail');
  productDetail.innerHTML = `
    <div class="detail-inner">
      <div class="detail-content">
        <div class="detail-header d-flex flex-nowrap align-items-start justify-content-between">
          <h4 class="mb-2 px-3 pt-2">${product.title}</h4>
          <button onclick="closeDetail()" id="detail_close_btn" class="flex-shrink-0">x</button>
        </div>
        <div class="detail-body p-3">
          <h6 class="mb-2 text-success">
            <span class="d-inline-block me-3">Average rating: ${product.rating.rate}</span>
            <span class="d-inline-block">Total Rating: ${product.rating.count}</span>
          </h6>
          <p class="mb-0">${product.description}</p>
        </div>
      </div>
    </div>
  `;
  detailContainer.appendChild(productDetail);
  loadingSpinner('none');
}

// close detail function
const closeDetail = () => {
  document.getElementById('product_detail').textContent = '';
}

// loading spinner
const loadingSpinner = (displayStatus) => {
  document.getElementById('loading_spinner').style.display = displayStatus;
}

// cart button toggle
document.getElementById('cart_toggle_btn').addEventListener('click', () => {
  document.getElementById('my-cart').classList.toggle('active');
});
