var express = require('express');
var router = express.Router();
//const { router } = require('../config/app');
let Products = require('../models/InventoryRT');
let ProductsController = require('../controllers/InventoryRT')

function RequireAuth(req,res,next)
{
 if(!req.isAuthenticated())
 {
  return res.redirect('/login');
 }
 next();
}
/* Get route for the InventoryRT */
// Read Operation
router.get('/', ProductsController.DisplayInventoryRT);
/* Get route for Add Products page --> Create */
router.get('/add', RequireAuth,ProductsController.AddProducts);
/* Post route for Add Products page --> Create */
router.post('/add', RequireAuth,ProductsController.CreateProducts);
/* Get route for displaying the Edit Products page --> Update */
router.get('/edit/:id', RequireAuth,ProductsController.EditProducts);
/* Post route for processing the Edit Products page --> Update */
router.post('/edit/:id', RequireAuth,ProductsController.ProcessEditProducts);
/* Get to perform Delete Operation --> Delete Operation */
router.get('/delete/:id', RequireAuth,ProductsController.DeleteProducts);
/* Get login page */
router.get('/login', ProductsController.DisplayLoginPage);
/* Post login page */
router.post('/login', ProductsController.ProccessLoginPage);
/* Get registration page */
router.get('/registration', ProductsController.DisplayRegistrationPage);
/* Post registration page */
router.post('/registration', ProductsController.ProcessRegistrationPage);
/* Get logout page */
router.get('/logout', ProductsController.PerformLogout);
 module.exports = router;