import Comment from '../models/Comment.js';

export const getComments = async (req, res) => {
    try {
        const { task, project } = req.query;
        const filter = { isDeleted: false };

        if (task) filter.task = task;
        if (project) filter.project = project;

        const comments = await Comment.find(filter)
            .populate('author', 'username avatar')
            .populate('mentions', 'username')
            .sort('createdAt');

        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
};

export const createComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            ...req.body,
            author: req.user.id
        });

        await comment.populate('author', 'username avatar');

        // Create notifications for mentions
        if (comment.mentions && comment.mentions.length > 0) {
            for (const mentionedUserId of comment.mentions) {
                await Notification.createNotification({
                    recipient: mentionedUserId,
                    sender: req.user.id,
                    type: 'mention',
                    title: 'You were mentioned',
                    message: `${req.user.username} mentioned you in a comment`,
                    comment: comment._id,
                    task: comment.task,
                    project: comment.project
                });
            }
        }

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            comment
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create comment', error: error.message });
    }
};