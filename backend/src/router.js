const express = require('express');
const UserControllers = require('./controllers/UserController');
const router = express.Router();

router.get('/signIn', UserControllers.signIn );
router.post('/signUp', UserControllers.signUp );
router.get('/getUserById', UserControllers.getUserById );

module.exports = router;