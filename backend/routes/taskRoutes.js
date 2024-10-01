
const express = require('express');
const { createTask, getTasks, getTask, updateTask, deleteTask, getTaskSummary, getUsers ,getTaskSummaryJson} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/summary', auth, getTaskSummary);
router.get('/tasks/summary-json', getTaskSummaryJson);
router.get('/:id', auth, getTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;