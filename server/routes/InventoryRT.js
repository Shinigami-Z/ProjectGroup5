var express = require('express');
var router = express.Router();
//const { router } = require('../config/app');
let Products = require('../models/InventoryRT');
let ProductsController = require('../controllers/InventoryRT')
/* Get route for the InventoryRT */
// Read Operation
router.get('/', ProductsController.DislayInventoryRT);
/* Get route for Add Products page --> Create */
router.get('/add', ProductsController.AddProducts);
/* Post route for Add Products page --> Create */
router.post('/add', ProductsController.CreateProducts);
/* Get route for displaying the Edit Products page --> Update */
router.get('/edit/:id', ProductsController.EditProducts);
/* Post route for processing the Edit Products page --> Update */
router.post('/edit/:id', ProductsController.ProcessEditProducts);
/* Get to perform Delete Operation --> Delete Operation */
router.get('/delete/:id', ProductsController.DeleteProducts);
 module.exports = router;