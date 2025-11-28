import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // What is being commented on
    commentType: {
        type: String,
        enum: ['task', 'project'],
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    // Threading support
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    // Mentions
    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Attachments
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number
    }],
    // Edit tracking
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: Date,
    // Soft delete
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

// Indexes
commentSchema.index({ task: 1, createdAt: -1 });
commentSchema.index({ project: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Pre-save middleware to update task/project comment count
commentSchema.post('save', async function () {
    if (this.task) {
        const Task = mongoose.model('Task');
        const count = await Comment.countDocuments({ task: this.task, isDeleted: false });
        await Task.findByIdAndUpdate(this.task, { commentsCount: count });
    }
});

// Post-delete middleware
commentSchema.post('findOneAndUpdate', async function (doc) {
    if (doc && doc.isDeleted) {
        if (doc.task) {
            const Task = mongoose.model('Task');
            const count = await Comment.countDocuments({ task: doc.task, isDeleted: false });
            await Task.findByIdAndUpdate(doc.task, { commentsCount: count });
        }
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;