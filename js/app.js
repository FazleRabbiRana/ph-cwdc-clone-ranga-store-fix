// loading spinner
const loadingSpinner = (displayStatus) => {
  document.getElementById('loading_spinner').style.display = displayStatus;
}

// load products
const loadProducts = () => {
  loadingSpinner('flex');
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => showProducts(data));
};
loadProducts();

// show all product in UI 
const showProducts = (products) => {
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
          <div class="rating">
            <div class="rating-stars">
              <div class="empty-rating">
                <span class="star">★★★★★</span>
              </div>
              <div class="fill-rating" style="width: ${(ratingAverage * 20) + '%'}">
                <span class="star">★★★★★</span>
              </div>
            </div>
            <div class="rating-texts">
              <span class="rating-average">${ratingAverage}</span> 
              <span class="rating-count">(${ratingCount})</span>
            </div>
          </div>
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
  document.getElementById('notice').textContent = '';
  loadingSpinner('none');
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
  document.getElementById('my-cart').classList.remove('active');
  const url = `https://fakestoreapi.com/products/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => showDetail(data));
}

// show product detail in the UI
const showDetail = product => {
  const detailContainer = document.getElementById('product_detail');
  detailContainer.classList.toggle('active');
  const ratingAverage = product.rating.rate;
  const ratingCount = product.rating.count;
  const productDetail = document.createElement('div');
  productDetail.classList.add('single-product-detail');
  productDetail.innerHTML = `
    <div class="detail-inner">
      <div class="detail-content">
        <div class="detail-header d-flex flex-nowrap align-items-start justify-content-between">
          <h4 class="px-3 pt-2">${product.title}</h4>
          <button onclick="closeDetail()" id="detail_close_btn" class="flex-shrink-0">x</button>
        </div>
        <div class="detail-body p-3">
          <img class="product-image" src=${product.image}></img>
          <div class="rating">
            <div class="rating-stars">
              <div class="empty-rating">
                <span class="star">★★★★★</span>
              </div>
              <div class="fill-rating" style="width: ${(ratingAverage * 20) + '%'}">
                <span class="star">★★★★★</span>
              </div>
            </div>
            <div class="rating-texts">
              <span class="rating-average">${ratingAverage}</span> 
              <span class="rating-count">(${ratingCount})</span>
            </div>
          </div>
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

// cart button toggle
document.getElementById('cart_toggle_btn').addEventListener('click', () => {
  document.getElementById('my-cart').classList.toggle('active');
});

/**
* Search product
*/
const searchProduct = () => {
  loadingSpinner('flex');
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => displaySearchedProducts(data));
}

// display searched product
const displaySearchedProducts = products => {
  const notice = document.getElementById('notice');
  const allProductsContainer = document.getElementById("all-products");
  const searchField = document.getElementById('input-field');
  const searchText = searchField.value.toLowerCase();
  // clear input field
  searchField.value = '';
  // clear all products from ui
  allProductsContainer.textContent = '';
  // notice for blank search
  if(searchText === '') {
    notice.innerHTML = `
      <h4 class="text-danger">⚠️ Type something before search.</h4>
      <button onclick="loadProducts()" class="btn btn-primary">Click here to show all products</button>
    `;
    loadingSpinner('none');
    return;
  }
  // show searched product
  const searchedProducts = products.filter(product => product.title.toLowerCase().includes(searchText));
  if(searchedProducts.length !== 0) {
    showProducts(searchedProducts);
    notice.innerHTML = `<h4 class="text-success">${searchedProducts.length} products found.</h4>`;
  } else {
    notice.innerHTML = `
      <h4 class="text-secondary">No products found.</h4>
      <button onclick="loadProducts()" class="btn btn-primary">Click here to show all products</button>
    `;
  }
  // hide loading spinner
  loadingSpinner('none');
}