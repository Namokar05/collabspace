import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true,
        maxlength: [100, 'Team name cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    // Team lead
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Team members with roles
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['lead', 'admin', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Team projects
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    // Team category
    category: {
        type: String,
        enum: ['development', 'design', 'marketing', 'sales', 'support', 'management', 'other'],
        default: 'other'
    },
    // Team avatar/logo
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=Team&background=random'
    },
    // Team statistics
    stats: {
        totalProjects: {
            type: Number,
            default: 0
        },
        completedProjects: {
            type: Number,
            default: 0
        },
        totalTasks: {
            type: Number,
            default: 0
        },
        completedTasks: {
            type: Number,
            default: 0
        },
        totalPoints: {
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
        allowMemberInvites: {
            type: Boolean,
            default: true
        }
    },
    // Activity
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes
teamSchema.index({ lead: 1 });
teamSchema.index({ 'members.user': 1 });

// Virtual for team size
teamSchema.virtual('size').get(function () {
    return this.members.length;
});

// Virtual for productivity rate
teamSchema.virtual('productivityRate').get(function () {
    if (this.stats.totalTasks === 0) return 0;
    return Math.round((this.stats.completedTasks / this.stats.totalTasks) * 100);
});

// Method to add member
teamSchema.methods.addMember = function (userId, role = 'member') {
    const exists = this.members.some(m => m.user.toString() === userId.toString());
    if (!exists) {
        this.members.push({ user: userId, role });
    }
};

// Method to remove member
teamSchema.methods.removeMember = function (userId) {
    this.members = this.members.filter(m => m.user.toString() !== userId.toString());
};

// Method to update stats
teamSchema.methods.updateStats = async function () {
    const Project = mongoose.model('Project');
    const Task = mongoose.model('Task');
    const User = mongoose.model('User');

    const projects = await Project.find({ team: this._id });
    this.stats.totalProjects = projects.length;
    this.stats.completedProjects = projects.filter(p => p.status === 'completed').length;

    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } });
    this.stats.totalTasks = tasks.length;
    this.stats.completedTasks = tasks.filter(t => t.status === 'completed').length;

    // Calculate total team points
    const memberIds = this.members.map(m => m.user);
    const users = await User.find({ _id: { $in: memberIds } });
    this.stats.totalPoints = users.reduce((sum, user) => sum + user.points, 0);

    await this.save();
};

teamSchema.set('toJSON', { virtuals: true });
teamSchema.set('toObject', { virtuals: true });

const Team = mongoose.model('Team', teamSchema);

export default Team;