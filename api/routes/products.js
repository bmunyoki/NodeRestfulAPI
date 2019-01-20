const express = require('express');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname );
    }
});

const fileFilter = function(req, file, cb) {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || 
        file.mimetype === 'application/pdf' || file.mimetype === 'application/msword'){
        cb(null, true);
    }else{
        cb(new Error("File format not supported"));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        //1.5 MB maximum file size
        fileSize: 1024 * 1024 * 1.5
    },
    fileFilter: fileFilter
});

const router = express.Router();
const ProductController = require('../controllers/products');

// Ger all products
router.get('/', ProductController.products_get_all);

// Create a new product
router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product);

// Get a single product
router.get('/:productId', ProductController.products_get_one_product);

// Update a product
router.patch('/:productId', ProductController.products_update_product);

// Delete product
router.delete('/:productId', ProductController.products_delete_product);

module.exports = router;