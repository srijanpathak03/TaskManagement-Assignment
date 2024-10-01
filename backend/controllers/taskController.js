const { Parser } = require('json2csv');

const Task = require('../models/Task');
const User = require('../models/User');
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required(),
  status: Joi.string().valid('To Do', 'In Progress', 'Completed'),
  assignedTo: Joi.string(),
  priority: Joi.string().valid('Low', 'Medium', 'High'),
});

exports.createTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = new Task({
      ...req.body,
      createdBy: req.user._id,
    });

    if (req.body.assignedTo) {
      const assignedUser = await User.findOne({ username: req.body.assignedTo });
      if (!assignedUser) return res.status(400).json({ error: 'Assigned user not found' });
      task.assignedTo = assignedUser._id;
    }

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getTaskSummaryJson = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (!req.user.isAdmin) {
      filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    }

    const summary = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            status: '$status',
            assignedTo: '$assignedTo',
          },
          count: { $sum: 1 },
          tasks: { $push: '$$ROOT' },
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (assignedTo) {
      const assignedUser = await User.findOne({ username: assignedTo });
      if (assignedUser) filter.assignedTo = assignedUser._id;
    }

    if (!req.user.isAdmin) {
      filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (!req.user.isAdmin && 
        task.createdBy._id.toString() !== req.user._id.toString() && 
        task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (!req.user.isAdmin && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.body.assignedTo) {
      const assignedUser = await User.findOne({ username: req.body.assignedTo });
      if (!assignedUser) return res.status(400).json({ error: 'Assigned user not found' });
      req.body.assignedTo = assignedUser._id;
    }

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (!req.user.isAdmin && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await task.remove();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTaskSummary = async (req, res) => {
  try {
    const { status, startDate, endDate, format } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (!req.user.isAdmin) {
      filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    }

    const summary = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            status: '$status',
            assignedTo: '$assignedTo',
          },
          count: { $sum: 1 },
          tasks: { $push: '$$ROOT' }, 
        },
      },
    ]);

    
    if (format === 'csv') {
      const csvParser = new Parser();
      const csv = csvParser.parse(summary);
      res.header('Content-Type', 'text/csv');
      res.attachment('task_summary_report.csv');
      return res.send(csv);
    }

    
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const users = await User.find({}, 'username email'); 
    res.status(200).json(users);
  } catch (error) {
    console.log("getUser");
    res.status(400).json({ error: error.message });
  }
};
