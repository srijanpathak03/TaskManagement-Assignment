const express = require('express');
const {getUsers } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getUsers);

module.exports = router;