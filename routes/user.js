const express= require('express')
const router = express.Router();
const UserController = require("../controller/user");
router.get('/', UserController.getUser)
router.post('/sign',UserController.addUser )
router.post('/login',UserController.login )
module.exports = router
