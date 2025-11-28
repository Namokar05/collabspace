import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
        default: 'planning'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'design', 'marketing', 'research', 'other'],
        default: 'other'
    },
    // Project owner
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Team assigned to project
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    // Project members (can be different from team)
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'member', 'viewer'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Timeline
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    deadline: {
        type: Date
    },
    // Progress tracking
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    milestones: [{
        title: String,
        description: String,
        dueDate: Date,
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }],
    // Budget (optional)
    budget: {
        allocated: {
            type: Number,
            default: 0
        },
        spent: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    // Tags for categorization
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
    // Statistics
    stats: {
        totalTasks: {
            type: Number,
            default: 0
        },
        completedTasks: {
            type: Number,
            default: 0
        },
        totalMembers: {
            type: Number,
            default: 0
        }
    },
    // Settings
    settings: {
        isPublic: {
            type: Boolean,
            default: false
        },
        allowComments: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ team: 1 });
projectSchema.index({ status: 1, priority: 1 });

// Virtual for completion percentage
projectSchema.virtual('completionRate').get(function () {
    if (this.stats.totalTasks === 0) return 0;
    return Math.round((this.stats.completedTasks / this.stats.totalTasks) * 100);
});

// Virtual to check if project is overdue
projectSchema.virtual('isOverdue').get(function () {
    if (!this.deadline) return false;
    return new Date() > this.deadline && this.status !== 'completed';
});

// Method to update project stats
projectSchema.methods.updateStats = async function () {
    const Task = mongoose.model('Task');
    const tasks = await Task.find({ project: this._id });

    this.stats.totalTasks = tasks.length;
    this.stats.completedTasks = tasks.filter(t => t.status === 'completed').length;
    this.stats.totalMembers = this.members.length;

    if (this.stats.totalTasks > 0) {
        this.progress = Math.round((this.stats.completedTasks / this.stats.totalTasks) * 100);
    }

    await this.save();
};

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;