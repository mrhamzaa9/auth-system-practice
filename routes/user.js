const express= require('express')
const router = express.Router();
const UserController = require("../controller/user");
const authMiddle = require('../middleware/user-auth')
router.get('/', UserController.getUser)
router.delete('/delete/:id', UserController.del)
router.put('/:id',UserController.updateUser)
router.post('/sign',UserController.addUser )
router.post('/login',UserController.login )
module.exports = router
