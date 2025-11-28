import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';

export const getAllProjects = async (req, res) => {
    try {
        const { status, priority, category } = req.query;

        const filter = {
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id }
            ]
        };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        const projects = await Project.find(filter)
            .populate('owner', 'username email avatar')
            .populate('team', 'name avatar')
            .populate('members.user', 'username avatar')
            .sort('-createdAt');

        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'username email avatar points level')
            .populate('team', 'name avatar members')
            .populate('members.user', 'username avatar role points');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const hasAccess =
            project.owner._id.toString() === req.user.id ||
            project.members.some(m => m.user._id.toString() === req.user.id);

        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch project',
            error: error.message
        });
    }
};

export const createProject = async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            owner: req.user.id,
            members: [{ user: req.user.id, role: 'owner' }]
        };

        const project = await Project.create(projectData);
        await project.populate('owner', 'username email avatar');

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create project',
            error: error.message
        });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const member = project.members.find(
            m => m.user.toString() === req.user.id
        );

        if (!member || !['owner', 'admin'].includes(member.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        Object.assign(project, req.body);
        await project.save();

        await project.populate('owner', 'username email avatar');
        await project.populate('members.user', 'username avatar');

        res.json({
            success: true,
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update project',
            error: error.message
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only project owner can delete' });
        }

        await Task.deleteMany({ project: project._id });
        await Project.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete project',
            error: error.message
        });
    }
};
