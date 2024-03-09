const express = require('express');
const api = express();
const { auth } = require('express-oauth2-jwt-bearer');
const cors = require('cors');
const helmet = require("helmet");
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const multer = require("multer");

const products = readFileSync('./products.json');
const productsParsed = JSON.parse(products);
const swipers = readFileSync('./swipers.json');
const swipersParsed = JSON.parse(swipers);
const categories = readFileSync('./categories.json');

// AUTH
if (!process.env.ISSUER || !process.env.AUDIENCE) {
    throw 'Make sure you have ISSUER_BASE_URL, and AUDIENCE in your .env file';
}

const corsOptions = {
    origin: process.env.APP,
    credentials: true
};

const jwtCheck = auth({
    issuerBaseURL: process.env.ISSUER,
    audience: process.env.AUDIENCE,
    tokenSigningAlg: 'RS256'
});

api.use(cors(corsOptions));
api.use(helmet());
api.use(express.json())
api.use(express.urlencoded({ extended: true }))

productImagesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../app/public/assets/products")
    },
    filename: function (req, file, cb) {
        cb(null, req.body.productId + "." + file.mimetype.slice(6))
    }
})

swiperImagesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../app/public/assets/swipers")
    },
    filename: function (req, file, cb) {
        cb(null, req.body.id + "." + file.mimetype.slice(6))
    }
})

const swiperImagesUpload = multer({ storage: swiperImagesStorage });
const productImagesUpload = multer({ storage: productImagesStorage })

function saveData(path, data) {
    writeFileSync(path, JSON.stringify(data, null, 2), (error) => {
        if (error) {
            console.log('An error has occurred ', error);
            return false; // Return false to indicate that the file was not written successfully
        }
        console.log('Data written successfully to disk');
        return true; // Return true to indicate that the file was written successfully
    });
}

function searchFile(dir, fileName) {
    const files = fs.readdirSync(dir);
    for (const file of files) {

        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            searchFile(filePath, fileName);
        } else if (path.parse(file).name == fileName) {
            return filePath;
        } else {
            return null;
        }
    }
}

// Route to handle Swiper Images HTTP POST and DELETE requests

api.get('/api/uploads/swiper', (req, res) => {
    res.status(200).json(swipersParsed);
});

api.post('/api/uploads/swiper', jwtCheck, swiperImagesUpload.array("files"), (req, res) => {
    const { id, swiperDesc, image } = req.body

    const swiperIdIndex = swipersParsed.findIndex(swiper => swiper.id == id)

    try {
        if (swiperIdIndex == -1) {
            swipersParsed.push({ id, swiperDesc, image });
            if (!(saveData('./swipers.json', swipersParsed))) {
                res.status(200).json({ success: 'Swiper saved successfully!' });
                return
            }
        } else {
            res.status(400).json({ error: 'Swiper already exist!' });
        }
    } catch (error) {
        console.log(error);
    }
});

api.delete('/api/uploads/swiper/:id', jwtCheck, (req, res) => {
    const swiperId = req.params.id;
    try {
        filePath = searchFile('../public/assets/swiper', swiperId)
        if (filePath !== null) {
            unlinkSync(filePath)
            res.status(200).json({ success: 'File deleted successfully!' });
        } else {
            res.status(404).json({ error: 'File not found!' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
        console.log(error);
    }
})

// Route to handle Product Images HTTP POST and DELETE requests

api.post('/api/products/uploads', jwtCheck, productImagesUpload.array("files"), (req, res) => {
    res.status(200).json({ success: 'Files uploaded successfully!' });
});

api.delete('/api/products/uploads/:id', jwtCheck, (req, res) => {
    const productId = req.params.id;
    let productIndex = productsParsed.findIndex(product => product.id == productId)
    if (productIndex !== -1) {
        imagePath = productsParsed[productIndex].image
        try {
            unlinkSync("../public/" + imagePath)
        } catch (error) {
            console.log(error);
        }
        res.status(200).json({ success: 'File deleted successfully!' });
    } else {
        res.status(404).json({ error: 'File not found!' });
    }
});

//  Route to handle Products HTTP GET and POST and PUT and DELETE requests

//      Route to handle Products HTTP GET requests

api.get('/api/products/ids', (req, res) => {
    res.status(200).json(productsParsed.length);
})

api.get('/api/products/categories', (req, res) => {
    res.status(200).json(JSON.parse(categories));
});

api.get('/api/products', (req, res) => {
    res.status(200).json(productsParsed);
});

api.get('/api/products/:idOrName', (req, res) => {
    const productIdOrName = req.params.idOrName
    let productIndex = productsParsed.findIndex(product => product.id == productIdOrName)
    if (productIndex !== -1) {
        res.status(200).json(productsParsed[productIndex]);
    } else {
        let productIndex = productsParsed.findIndex(product => (product.name.toLowerCase()).includes(productIdOrName.toLowerCase()))
        if (productIndex !== -1) {
            res.status(200).json(productsParsed[productIndex]);
        } else {
            res.status(404).json({ error: 'Product not found!' });
        }
    }
});

//      Route to handle HTTP POST requests

api.post('/api/products', jwtCheck, (req, res) => {
    const { id, name, desc, addDesc, benefits, category, image, timestamp } = req.body

    const productIdIndex = productsParsed.findIndex(product => product.id == id),
        productNameIndex = productsParsed.findIndex(product => product.name == name);

    try {
        if (productIdIndex == -1 && productNameIndex == -1) {
            productsParsed.push({ id, name, desc, addDesc, benefits, category, image, timestamp });
            if (!(saveData('./products.json', productsParsed))) {
                res.status(200).json({ success: 'Product saved successfully!' });
                return
            }
        } else {
            res.status(400).json({ error: 'Product already exist!' });
        }
    } catch (error) {
        console.log(error);
    }
});

//      Route to handle HTTP PUT requests

api.put('/api/products/:id', jwtCheck, (req, res) => {
    const productId = req.params.id;

    const updatedProduct = req.body; // Use the whole body as the updated product
    const productIdIndex = productsParsed.findIndex(product => product.id == productId); // Find the index of the product to update
    try {
        if (productIdIndex !== -1) {
            productsParsed[productIdIndex] = updatedProduct;
            if (!(saveData('./products.json', productsParsed))) {
                res.status(200).json({ success: 'Product saved successfully!' });
                return
            }
        } else {
            res.status(404).json({ error: 'Product not found!' });
        }
    } catch (error) {
        console.log(error);
    }
});

//      Route to handle HTTP DELETE requests

api.delete('/api/products/:id', jwtCheck, (req, res) => {
    const productId = req.params.id;
    const productIdIndex = productsParsed.findIndex(product => product.id == productId); // Find the index of the product to delete
    try {
        if (productIdIndex !== -1) {
            productsParsed.splice(productIdIndex, 1); // Remove 1 product at the found index
            if (!(saveData('./products.json', productsParsed))) {
                res.status(200).json({ success: 'Product deleted successfully!' });
                return
            }
        } else {
            res.status(404).json({ error: 'Product not found!' });
        }
    } catch (error) {
        console.log(error);
    }
});

api.get('/*', function (req, res) {
    res.redirect(301, 'http://localhost:3000');
})

api.listen(3010, () => {
    console.log('Server is running on port 3010');
})