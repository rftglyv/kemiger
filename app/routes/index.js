var express = require('express');
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const axios = require('axios');
const apiDomain = 'http://localhost:3010'

router.get('/dashboard', requiresAuth(), async function (req, res) {

    let accessToken = req.oidc.accessToken;
    if (accessToken.isExpired()) {
        accessToken = await accessToken.refresh();
    }

    res.cookie('accessToken', accessToken.access_token, {
        // Use these setting on production
        // httpOnly: true,   // Prevents client-side access
        // secure: true,     // Only sent over HTTPS
        // sameSite: 'Strict', // Protects against CSRF// Expiry time (1 hour)
        maxAge: accessToken.expires_in * 1000 // Expiry time (1 day) Convert to milliseconds
    });

    res.cookie('tokenType', accessToken.token_type, {
        // Use these setting on production
        // httpOnly: true,   // Prevents client-side access
        // secure: true,     // Only sent over HTTPS
        // sameSite: 'Strict', // Protects against CSRF
        maxAge: accessToken.expires_in * 1000 // Expiry time (1 day) Convert to milliseconds
    });

    res.render('dashboard', {
        user: req.oidc.user
    });
});

router.get('/product/:id', async function (req, res) {
    productId = req.params.id
    apiResponse = await axios.get(`${apiDomain}/api/products/${productId}`)
    data = apiResponse.data;
    res.render('product', {product: data});
});

router.get('/category/:id', async function (req, res) {
    productId = req.params.id
    apiResponse = await axios.get(`${apiDomain}/api/products/${productId}`)
    res.render('category', {product: apiResponse});
});

router.get('/products', function (req, res) {
    res.render('products');
})

router.get('/aboutus', function (req, res) {
    res.render('about-us');
})

router.get('/contact', function (req, res) {
    res.render('contact');
})

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/*', function (req, res) {
    res.render('404');
});

module.exports = router