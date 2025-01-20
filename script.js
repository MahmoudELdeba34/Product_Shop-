const checkLists = [];
let products = [];

async function getData() {
  try {
    // Show loading state
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while products are being loaded',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch("https://fakestoreapi.in/api/products");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    products = data.products;

    Swal.close();


    const categories = [...new Set(products.map((product) => product.category))];
    categories.forEach(addCategory);
    displayProducts();

  } catch (error) {

    Swal.close(); 
    Swal.fire({
      title: 'Error!',
      text: `There was an error loading the products: ${error.message}`,
      icon: 'error',
      confirmButtonText: 'Try Again',
    });
  }
}

getData();

function addCategory(category) {
  const formCheck = document.createElement("div");
  formCheck.className = "form-check";
  formCheck.innerHTML = `
    <input class="form-check-input" type="checkbox" value="${category}" id="${category}">
    <label class="form-check-label" for="${category}">
      ${category}
    </label>`;
  formCheck.querySelector(".form-check-input").addEventListener("change", () => onChangeHandler(category));
  document.getElementById("sideBar").append(formCheck);
}

function onChangeHandler(category) {
  const index = checkLists.indexOf(category);
  if (index >= 0) {
    checkLists.splice(index, 1);
  } else {
    checkLists.push(category);
  }
  displayProducts();
}

function displayProducts() {
  const productsToDisplay = checkLists.length
    ? products.filter((product) => checkLists.includes(product.category))
    : products;

  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";
  productsToDisplay.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card shadow";
    card.innerHTML = `
     <div class="card-body">
  <img src="${product.image}" class="card-img-top" alt="${product.title}">
  <h5 class="card-title">${product.price}$</h5>
  <p class="card-text">${product.title}</p>
  <p class="card-text"><small class="text-muted">${product.category}</small></p>
</div>
`;
    productsContainer.append(card);
  });
}

document.getElementById("sort").addEventListener("change", function () {
  const isAscending = this.value === "ascending";
  products.sort((a, b) => (isAscending ? a.price - b.price : b.price - a.price));
  displayProducts();
});
