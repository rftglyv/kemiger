const productCardsWrapper = document.getElementById('products'),
    categoryAll = document.getElementById('categoryAll'),
    categoryKemiger = document.getElementById('categoryKemiger'),
    categoryCureO9 = document.getElementById('categoryCureO9'),
    categoryGunesol = document.getElementById('categoryGunesol'),
    spinner = document.getElementById('spinner'),
    categoryText = document.getElementById('category'),
    apiDomain = 'http://localhost:3010'


const products = async () => {
    const response = await fetch(`${apiDomain}/api/products`)
    const data = await response.json()
    return data
}
products()

let categories = [categoryAll, categoryCureO9, categoryKemiger, categoryGunesol]
categories.forEach(category => {
    category.addEventListener('change', async (category) => {
        categoryText.innerText = category.target.value.charAt(0).toUpperCase() + category.target.value.slice(1)
        productCardsWrapper.innerHTML = ''
        await setProductCards(await products())
    })
})


async function setProductCards(data) {
    spinner.classList.contains('d-none') ? null : spinner.classList.add('d-none');
    await data.forEach(product => {
        productHTML = `
        <div class="card mb-3 mx-3 col-5 col-lg-2" bis_skin_checked="1">
            <a href="/product/${product.id}" class="text-decoration-none">
                <img src="${product.image}" class="card-img" alt="card-img-overlay">
                <div class="card-img-overlay d-flex flex-column align-items-start justify-content-end"
                    bis_skin_checked="1">
                    <h5 class="card-title text-white">${product.name}</h5>
                </div>
            </a>
        </div>
        `
        if (categoryKemiger.checked) {
            if (product.category.toLowerCase() == categoryKemiger.value.toLocaleLowerCase()) { productCardsWrapper.innerHTML += productHTML; }
        } else if (categoryCureO9.checked) {
            if (product.category.toLowerCase() == categoryCureO9.value.toLocaleLowerCase()) { productCardsWrapper.innerHTML += productHTML; }
        } else if (categoryGunesol.checked) {
            if (product.category.toLowerCase() == categoryGunesol.value.toLocaleLowerCase()) { productCardsWrapper.innerHTML += productHTML; }
        } else { productCardsWrapper.innerHTML += productHTML; }
    });
    productCardsWrapper.innerHTML == '' ? productCardsWrapper.innerHTML = `<h1 class="text-center text-danger m-auto my-5">Ürün bulunamadı!</h1>` : null
    spinner.classList.remove('d-none')
}

const init = async () => { await setProductCards(await products()) }
init()