import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";


export const getAllTasks = async (req, res) => {
    try {
        const { project, status, priority, assignedTo } = req.query;
        const filter = {};

        if (project) filter.project = project;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignedTo) filter.assignedTo = assignedTo;

        const tasks = await Task.find(filter)
            .populate('project', 'name status')
            .populate('assignedTo', 'username avatar')
            .populate('createdBy', 'username avatar')
            .sort('-createdAt');

        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name status members')
            .populate('assignedTo', 'username email avatar points')
            .populate('createdBy', 'username avatar')
            .populate('dependencies', 'title status')
            .populate('blockedBy', 'title status');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch task', error: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const taskData = {
            ...req.body,
            createdBy: req.user.id,
            assignedTo: req.body.assignedTo || req.user.id
        };

        const task = await Task.create(taskData);
        await task.populate('project', 'name');
        await task.populate('assignedTo', 'username avatar');
        await task.populate('createdBy', 'username avatar');

        // Update project stats
        const project = await Project.findById(task.project);
        if (project) {
            await project.updateStats();
        }

        // Create notification if task is assigned
        if (task.assignedTo) {
            await Notification.createNotification({
                recipient: task.assignedTo,
                sender: req.user.id,
                type: 'task_assigned',
                title: 'New Task Assigned',
                message: `You have been assigned to task: ${task.title}`,
                task: task._id,
                project: task.project,
                actionUrl: `/tasks/${task._id}`
            });
        }

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const oldStatus = task.status;
        Object.assign(task, req.body);
        task.lastActivityAt = new Date();
        task.lastActivityBy = req.user.id;

        await task.save();
        await task.populate('assignedTo', 'username avatar');
        await task.populate('createdBy', 'username avatar');

        // Update project stats
        const project = await Project.findById(task.project);
        if (project) {
            await project.updateStats();
        }

        // Create notification if status changed to completed
        if (oldStatus !== 'completed' && task.status === 'completed') {
            await Notification.createNotification({
                recipient: task.createdBy,
                sender: req.user.id,
                type: 'task_completed',
                title: 'Task Completed',
                message: `Task "${task.title}" has been completed`,
                task: task._id,
                project: task.project,
                actionUrl: `/tasks/${task._id}`
            });
        }

        res.json({
            success: true,
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);

        // Update project stats
        const project = await Project.findById(task.project);
        if (project) {
            await project.updateStats();
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
};