const apiDomain = 'http://localhost:3010'

// Cookie 
function isCookieExists(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return true;
        }
    }
    return false;
}

function getCookieValue(cookieName) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === cookieName) {
            return cookie[1];
        }
    }
    return null;
}

const cookieExists = isCookieExists('accessToken');
cookieExists ? console.log("Cookie OK!") : function cookieError() { alert("Cookie not found!"); window.location.href = "/logout"; cookieError() }

function deBounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function addAlert(error, errorDesc, type) {
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`, 'fade-out', 'show', 'mt-3');
    alert.innerHTML = `<strong>${error}</strong> ${errorDesc}`;
    document.querySelector('#alerts').appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function addLoading(done, form) {
    headerSelf = document.getElementById(form.getAttribute('data-header'))
    target = headerSelf.querySelector('.loader')

    if (done == 'loading' && headerSelf !== null) {
        target.innerHTML = `<i class="fa-solid fa-spinner fa-spin fs-5 ms-2 align-middle text-info"></i>`
    } else if (done == 'loaded' && headerSelf !== null) {
        target.innerHTML = `<i class="fa-solid fa-check fs-5 ms-2 align-middle fade-out text-success"></i>`
        setTimeout(() => {
            target.innerHTML = ''
        }, 1000);
    } else {
        target.innerHTML = `<i class="fa-solid fa-xmark fs-5 ms-2 align-middle fade-out text-danger"></i>`
        setTimeout(() => {
            target.innerHTML = ''
        }, 1000);
    }
    return
}

function fillCategories(categoriesField, categories) {
    categories.forEach(category => {
        const categoryBadge = `<span class="badge bg-primary rounded-pill me-2 mb-2">${category}</span>`
        categoriesField.insertAdjacentHTML('beforeend', categoryBadge);
    })
}

function fillCategoriesInput(categoriesFieldInput, categories) {
    categoriesJoinedString = categories.join(", ")
    categoriesFieldInput.value = categoriesJoinedString
}

// Side Menu

const sideMenuBtns = document.querySelectorAll('.side-menu-btns a.btn');

sideMenuBtns.forEach(btn => {
    btn.onclick = () => {
        controls = btn.getAttribute('aria-controls')
        sideMenuBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.toggle('active');
        document.querySelectorAll('.main-menu').forEach(menu => menu.classList.add('d-none'));
        document.getElementById(controls).classList.toggle('d-none');
    };
})

function getFormFields(form) {
    let productIdInput = form.querySelector('.productIdInput'),
        productId = form.querySelector('#productId'),
        productImg = form.querySelector('#productImg'),
        productImgInput = form.querySelector('#productImgInput'),
        productName = form.querySelector('#productName'),
        productDesc = form.querySelector('#productDesc'),
        productAdditionalDesc = form.querySelector('#productAdditionalDesc'),
        productBenefitsInput = form.querySelector('#productBenefitsInput'),
        productCategoriesInput = form.querySelector('#productCategoriesInput'),
        productBenefits = form.querySelector('#productBenefits'),
        productCategories = form.querySelector('#productCategories'),
        productTimestamp = form.querySelector('#productTimeStamp')

    return { productIdInput, productId, productImg, productImgInput, productName, productDesc, productAdditionalDesc, productBenefits, productBenefitsInput, productCategories, productCategoriesInput, productTimestamp }
}

function resetForm(form) {
    let formFields = getFormFields(form)
    try {
        formFields.productId.innerText = ''
        formFields.productImg.src = "https://placehold.co/1000x1000?text=Click+me\\nto+upload\\nimage"
        formFields.productImgInput.value = ''
        formFields.productName.innerText = 'Click me to edit'
        formFields.productDesc.innerText = 'Click me to edit'
        formFields.productAdditionalDesc.innerText = 'Click me to edit'
        formFields.productCategories.innerHTML = ''
        formFields.productCategoriesInput.value = ''
        formFields.productBenefits.innerHTML = ''
        formFields.productBenefitsInput.value = ''
        formFields.productTimestamp.innerText = 'Time Stamp'
    } catch (error) {
        console.log(error)
    }
}

function setFormFields(form, data) {
    let formFields = getFormFields(form),
        timeStamp = new Date(data.timestamp)
    formFields.productId.innerText = data.id
    formFields.productImg.src = data.image
    formFields.productName.innerText = data.name
    formFields.productDesc.innerText = data.desc
    formFields.productAdditionalDesc.innerText = data.addDesc
    fillCategories(formFields.productCategories, data.categories)
    fillCategories(formFields.productBenefits, data.benefits)
    fillCategoriesInput(formFields.productCategoriesInput, data.categories)
    fillCategoriesInput(formFields.productBenefitsInput, data.benefits)
    formFields.productTimestamp.innerText = timeStamp.toLocaleTimeString('tr-tr', { timeZone: 'UTC' }) + ' | ' + timeStamp.toLocaleDateString('tr-tr', { timeZone: 'UTC' })
}


function formInputEvents(img, imgInput, imgUploadBtn) {

    if (imgUploadBtn !== null) {
        imgUploadBtn.addEventListener('click', () => {
            addLoading('loading', addSwiperForm)
            if (img.src == 'https://placehold.co/600x400/CDD3FF/000?text=Added+Swiper+Image') {

                img.addEventListener('click', chooseFile);
                imgInput.addEventListener('change', previewFile)
                setSwipersForm(addSwiperForm)
                addLoading('loaded', addSwiperForm)
            }
            else {
                addAlert('Already added swiper image!', 'Upload it before adding new one', 'warning')
                addLoading('error', addSwiperForm)
            }
        })
    }

    img.addEventListener('click', chooseFile);
    imgInput.addEventListener('change', previewFile)

    function chooseFile() {
        addSwiperForm.setAttribute('is-updating', 'true')
        imgInput.click();
    }

    function previewFile() {
        const file = imgInput.files[0];
        const reader = new FileReader();

        reader.addEventListener(
            "load",
            () => {
                img.src = reader.result;
            },
            false,
        );

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

function formEditableInputEvents(form) {
    let formEditableInputs = [getFormFields(form).productName, getFormFields(form).productDesc]

    formEditableInputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            e.preventDefault();
            if (input.innerText == '') {
                input.innerText = 'Click me to edit'
            }
        })
    })
}

function splitWithComma(str) {
    var str_arr = str.split(',')
    for (var i = 0; i < str_arr.length; i++) {
        str_arr[i] = str_arr[i].replace(/^\s*/, "").replace(/\s*$/, "");
    }
    return str_arr
}

// Products 

const addProductForm = document.querySelector('#addProductForm'),
    updateProductForm = document.querySelector('#updateProductForm'),
    delProductForm = document.querySelector('#delProductForm'),
    getProductForm = document.querySelector('#getProductForm'),
    addSwiperForm = document.querySelector('#addSwiperForm');

inputEventForms = [addProductForm, updateProductForm]
inputEventForms.forEach(form => { formEditableInputEvents(form) })

formInputEvents(document.querySelector('.addProductImg'), document.querySelector('.addProductImgInput'), null)
formInputEvents(document.querySelector('.updateProductImg'), document.querySelector('.updateProductImgInput'), null)
formInputEvents(document.querySelector('#swiperImg'), document.querySelector('#swiperImgInput'), document.querySelector('#swiperUploadImg'))

addProductForm.querySelector('#submitBtn').onclick = async () => {
    await addPrdForm(addProductForm);
};
updateProductForm.querySelector('#submitBtn').onclick = async () => {
    await updatePrdForm(updateProductForm);
};
delProductForm.querySelector('#submitBtn').onclick = async () => {
    await delPrdForm(delProductForm);
};
addSwiperForm.querySelector('#submitBtn').onclick = async () => {
    await addSwpForm(addSwiperForm);
};


async function readFormData(form) {
    let lastId = await fetch(`${apiDomain}/api/products/ids`, {
        method: 'GET',
        redirect: 'follow'
    })
    lastId = await lastId.json()
    productId = lastId + 1
    let formFields = getFormFields(form)
    if (formFields.productName.innerText !== 'Click me to edit') {
        if (formFields.productDesc.innerText !== 'Click me to edit') {
            if (formFields.productImgInput.files.length == 0) {
                addAlert('Image not found!', 'Provide product image.', 'danger')
            } else {
                // Product image
                const formData = new FormData();
                formData.append("productId", productId);
                for (let i = 0; i < formFields.productImgInput.files.length; i++) {
                    formData.append("files", formFields.productImgInput.files[i]);
                }

                // Product data
                var dataJSON = JSON.stringify({
                    "id": productId,
                    "name": formFields.productName.innerText,
                    "desc": formFields.productDesc.innerText,
                    "addDesc": formFields.productAdditionalDesc.innerText.replace(/\n/g, ''),
                    "benefits": splitWithComma(formFields.productBenefitsInput.value),
                    "categories": splitWithComma(formFields.productCategoriesInput.value),
                    "image": `assets/products/${productId}.${formFields.productImgInput.files[0].type.slice(6)}`,
                    "timestamp": Date.now(),
                });
                return [dataJSON, formData, true]
            }
        } else {
            addAlert('Description not found!', 'Provide product description.', 'danger')
        }
    } else {
        addAlert('Name not found!', 'Provide product name.', 'danger')
    }
}

async function addPrdForm(form) {
    const authToken = `${getCookieValue('tokenType')} ${getCookieValue('accessToken')}`
    data = await readFormData(form)
    if (data !== undefined) {
        dataJSON = data[0]
        formData = data[1]
        try {
            if (data[2]) {
                addLoading('loading', form)
                addAlert("Sending data...", '', 'info')
                response = await fetch(`${apiDomain}/api/products`, {
                    method: 'POST',
                    body: dataJSON,
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(addAlert("Product data is sent!", '', 'success')).catch((err) => (addAlert("Error occurred!", err, 'danger')));
                addAlert("Sending files...", '', 'info')
                await fetch(`${apiDomain}/api/products/uploads`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': authToken
                    }
                }).then(addAlert("Files are uploaded!", '', 'success'), resetForm(form), addLoading('loaded', form)).catch((err) => (addAlert("Error occurred!", err, 'danger')));
                addLoading('loaded', form)
            }
        } catch (error) {
            console.log(error)
            addAlert('Error occurred!', 'Check console for furthermore...', 'danger')
        }
    }
}

async function updatePrdForm(form) {
    let formCard = form.querySelector('.card'),
        submitBtn = form.querySelector('#submitBtn'),
        productIdParam = getFormFields(form).productId.innerText
    const authToken = `${getCookieValue('tokenType')} ${getCookieValue('accessToken')}`
    data = await readFormData(form)
    if (data !== undefined) {
        dataJSON = data[0]
        dataJSONParsed = JSON.parse(dataJSON)
        dataJSONParsed.id = parseInt(productIdParam)
        dataJSONParsed.image = `assets/products/${productIdParam}.${document.querySelector('.updateProductImgInput').files[0].type.slice(6)}`
        dataJSON = JSON.stringify(dataJSONParsed)
        formData = data[1]
        formData.set('productId', productIdParam)
        try {
            if (data[2]) {
                addLoading('loading', form)
                addAlert("Sending data...", '', 'info')
                response = await fetch(`${apiDomain}/api/products/${productIdParam}`, {
                    method: 'PUT',
                    body: dataJSON,
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(addAlert("Product data is sent!", '', 'success')).catch((err) => (addAlert("Error occurred!", err, 'danger')));
                addAlert("Sending files...", '', 'info')
                await fetch(`${apiDomain}/api/products/uploads`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': authToken
                    }
                }).then(addAlert("Files are uploaded!", '', 'success'), resetForm(form)).catch((err) => (addAlert("Error occurred!", err, 'danger')));
                if (response.status === 404) {
                    addLoading('error', form)
                    addAlert('Product not found!', '', 'danger')
                    formCard.classList.add('d-none')
                    submitBtn.classList.add('d-none')
                    resetForm(form)
                    return
                } else if (response.status === 200) {
                    addLoading('loaded', form)
                    submitBtn.classList.add('d-none')
                    formCard.classList.add('d-none')
                    getFormFields(form).productIdInput.value = ''
                }

            }
        } catch (error) {
            console.log(error)
            addAlert('Error occurred!', 'Check console for furthermore...', 'danger')
        }
    }
}

async function delPrdForm(form) {
    let formCard = form.querySelector('.card'),
        submitBtn = form.querySelector('#submitBtn'),
        productIdParam = getFormFields(form).productId.innerText
    const authToken = `${getCookieValue('tokenType')} ${getCookieValue('accessToken')}`
    try {
        if (productIdParam) {
            addLoading('loading', form)
            addAlert("Deleting files...", '', 'warning')
            await fetch(`${apiDomain}/api/products/uploads/${productIdParam}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': authToken,
                    Accept: "application/json"
                }
            }).then(addAlert("Files are deleted!", '', 'success'), resetForm(form)).catch((err) => (addAlert("Error occurred!", err, 'danger')));
            addAlert("Deleting data...", '', 'warning')
            response = await fetch(`${apiDomain}/api/products/${productIdParam}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': authToken,
                    Accept: "application/json"
                }
            }).then(addAlert("Product data is deleted!", '', 'success')).catch((err) => (addAlert("Error occurred!", err, 'danger')));
            if (response.status === 404) {
                addLoading('error', form)
                addAlert('Product not found!', '', 'danger')
                formCard.classList.add('d-none')
                submitBtn.classList.add('d-none')
                resetForm(form)
                return
            } else if (response.status === 200) {
                addLoading('loaded', form)
                submitBtn.classList.add('d-none')
                formCard.classList.add('d-none')
                getFormFields(form).productIdInput.value = ''
            }

        }
    } catch (error) {
        console.log(error)
        addAlert('Error occurred!', 'Check console for furthermore...', 'danger')
    }
}

async function getFromApi(form, idOrName) {
    let formCard = form.querySelector('.card'),
        submitBtn = form.querySelector('#submitBtn');
    idOrName = idOrName.trim()
    addLoading('loading', form)
    resetForm(form)
    formCard.classList.remove('fade-card-in')
    if (idOrName !== '') {
        try {
            apiResponse = await fetch(`${apiDomain}/api/products/${idOrName}`, {
                headers: {
                    Accept: "application/json"
                },
                method: 'GET',
                redirect: 'follow'
            })
            if (apiResponse.status === 404) {
                addLoading('error', form)
                addAlert('Product not found!', '', 'danger')
                formCard.classList.add('d-none')
                submitBtn.classList.add('d-none')
                formCard.classList.remove('fade-card-in')
                resetForm(form)
                return
            } else if (apiResponse.status === 200) {
                apiResponse = await apiResponse.json()
                setFormFields(form, apiResponse)
                addLoading('loaded', form)
                submitBtn.classList.remove('d-none')
                formCard.classList.remove('d-none')
                formCard.classList.add('fade-card-in')
            }

        } catch (error) {
            console.log(error)
            addAlert('Error occurred!', '', 'danger')
            formCard.classList.add('d-none')
            submitBtn.classList.add('d-none')
            resetForm(form)
        }
    } else {
        resetForm(form)
        formCard.classList.add('d-none')
        submitBtn.classList.add('d-none')
        addAlert('Provide name or id!', '', 'danger')
        addLoading('error', form)
        return
    }
}

let getProductFormInput = getProductForm.querySelector('.productIdInput'),
    updateProductFormInput = updateProductForm.querySelector('.productIdInput'),
    delProductFormInput = delProductForm.querySelector('.productIdInput'),
    pattern = /[\w\d]+/
getProductFormInput.addEventListener('input', deBounce(async function (e) {
    if (pattern.test(getProductFormInput.value)) {
        getFromApi(getProductForm, getProductFormInput.value)
    } else {
        getProductForm.querySelector('.card').classList.add('d-none')
        getProductForm.querySelector('#submitBtn').classList.add('d-none')
        addLoading('error', getProductForm)
        addAlert('Provide valid name or id!', '', 'danger')
    }
}, 1000))
updateProductFormInput.addEventListener('input', deBounce(async function (e) {
    if (pattern.test(updateProductFormInput.value)) {
        getFromApi(updateProductForm, updateProductFormInput.value)
    } else {
        updateProductForm.querySelector('.card').classList.add('d-none')
        updateProductForm.querySelector('#submitBtn').classList.add('d-none')
        addLoading('error', updateProductForm)
        addAlert('Provide valid name or id!', '', 'danger')
    }
}, 1000))
delProductFormInput.addEventListener('input', deBounce(async function (e) {
    if (pattern.test(delProductFormInput.value)) {
        getFromApi(delProductForm, delProductFormInput.value)
    } else {
        delProductForm.querySelector('.card').classList.add('d-none')
        delProductForm.querySelector('#submitBtn').classList.add('d-none')
        addLoading('error', delProductForm)
        addAlert('Provide valid name or id!', '', 'danger')
    }
}, 1000))

// Swiper Menu

async function setSwipersForm(form) {
    let glideSlides = form.querySelector('.glide__slides')
    let swiperSlidesAPI = await fetch(`${apiDomain}/api/uploads/swiper`, {
        method: 'GET',
        redirect: 'follow'
    })
    glideSlides.innerHTML = `<li class="glide__slide position-relative p-0">
    <h5 class="ms-3 mt-3 position-absolute top-0 start-0 swiper-id">Added Swiper Image</h5>
    <img id="swiperImg" src="https://placehold.co/600x400/CDD3FF/000?text=Added+Swiper+Image"
        class="card-img" alt="card-img-overlay">
    </li>`
    swiperSlidesAPI = await swiperSlidesAPI.json()

    await swiperSlidesAPI.forEach(swiper => {
        glideSlides.insertAdjacentHTML('beforeend', `<li class="glide__slide position-relative p-0">
        <h5 class="ms-3 mt-3 position-absolute top-0 start-0 swiper-id">Id: ${swiper.id}</h5>
        <img src="${swiper.image}"
            class="card-img" alt="card-img-overlay">
        </li>`)
    })

    form.setAttribute('is-updating', 'false')

    if (swiperSlidesAPI.length !== 0) {
        return swiperSlidesAPI[(swiperSlidesAPI.length - 1)].id
    } else {
        return null
    }
}

function resetSwiperForm(form) {
    const swiperDesc = form.querySelector('#swiperDescInput');
    const img = form.querySelector('#swiperImg');
    const imgInput = form.querySelector('#swiperImgInput');

    swiperDesc.value = '';
    imgInput.value = '';
    img.src = 'https://placehold.co/600x400/CDD3FF/000?text=Added+Swiper+Image';
    setSwipersForm(addSwiperForm);
}

async function addSwpForm(form) {
    const authToken = `${getCookieValue('tokenType')} ${getCookieValue('accessToken')}`;
    const lastId = await setSwipersForm(form);
    const swiperDesc = form.querySelector('#swiperDescInput');
    const imgInput = form.querySelector('#swiperImgInput');

    if (imgInput.files.length == 0) {
        addLoading('error', form);
        addAlert('Image not found!', 'Provide swiper image.', 'danger');
    } else {
        // Swiper image
        const swiperId = parseInt(lastId) + 1;
        const formData = new FormData();
        formData.append("id", swiperId);
        formData.append("swiperDesc", swiperDesc.value);
        formData.append("image", `assets/swipers/${swiperId}.${imgInput.files[0].type.slice(6)}`);
        for (let i = 0; i < imgInput.files.length; i++) {
            formData.append("files", imgInput.files[i]);
        }

        if (formData !== undefined) {
            if (swiperDesc.value !== '') {
                try {
                    addLoading('loading', form);
                    addAlert("Sending files...", '', 'info');
                    await fetch(`${apiDomain}/api/uploads/swiper`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': authToken
                        }
                    }).then(addAlert("Files are uploaded!", '', 'success'), () => resetSwiperForm(form), addLoading('loaded', form)).catch((err) => (addAlert("Error occurred!", err, 'danger')));
                } catch (error) {
                    console.log(error);
                    addAlert('Error occurred!', 'Check console for furthermore...', 'danger');
                }
            } else {
                addLoading('error', form);
                addAlert('Provide swiper description!', '', 'danger');
            }
        }
    }
}