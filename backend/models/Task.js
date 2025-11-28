import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    // Project relationship
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    // Task assignment
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Task properties
    status: {
        type: String,
        enum: ['backlog', 'todo', 'in-progress', 'in-review', 'completed', 'cancelled'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['bug', 'feature', 'improvement', 'documentation', 'testing', 'other'],
        default: 'other'
    },
    // Timeline
    startDate: Date,
    dueDate: Date,
    completedAt: Date,
    // Estimation
    estimatedHours: {
        type: Number,
        min: 0
    },
    actualHours: {
        type: Number,
        min: 0,
        default: 0
    },
    // Task complexity
    storyPoints: {
        type: Number,
        min: 1,
        max: 13,
        default: 1
    },
    // Dependencies
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    blockedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    // Sub-tasks/Checklist
    checklist: [{
        text: String,
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }],
    // Labels/Tags
    tags: [{
        type: String,
        trim: true
    }],
    // File attachments
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Progress
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    // Comments count (for optimization)
    commentsCount: {
        type: Number,
        default: 0
    },
    // Activity tracking
    lastActivityAt: {
        type: Date,
        default: Date.now
    },
    lastActivityBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1, status: 1 });

// Virtual for checklist completion
taskSchema.virtual('checklistCompletion').get(function () {
    if (!this.checklist || this.checklist.length === 0) return 0;
    const completed = this.checklist.filter(item => item.completed).length;
    return Math.round((completed / this.checklist.length) * 100);
});

// Virtual to check if overdue
taskSchema.virtual('isOverdue').get(function () {
    if (!this.dueDate || this.status === 'completed') return false;
    return new Date() > this.dueDate;
});

// Method to mark task as complete
taskSchema.methods.complete = async function (userId) {
    this.status = 'completed';
    this.completedAt = new Date();
    this.progress = 100;
    this.lastActivityAt = new Date();
    this.lastActivityBy = userId;

    // Award points to assigned user
    if (this.assignedTo) {
        const User = mongoose.model('User');
        const user = await User.findById(this.assignedTo);
        if (user) {
            const pointsToAdd = this.storyPoints * 10;
            user.addPoints(pointsToAdd);
            await user.save();
        }
    }

    await this.save();

    // Update project stats
    const Project = mongoose.model('Project');
    const project = await Project.findById(this.project);
    if (project) {
        await project.updateStats();
    }
};

// Pre-save middleware to update progress based on checklist
taskSchema.pre('save', function (next) {
    if (this.checklist && this.checklist.length > 0) {
        const completed = this.checklist.filter(item => item.completed).length;
        this.progress = Math.round((completed / this.checklist.length) * 100);
    }

    if (this.status === 'completed' && !this.completedAt) {
        this.completedAt = new Date();
        this.progress = 100;
    }

    next();
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;