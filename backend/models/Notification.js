import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: [
            'task_assigned',
            'task_completed',
            'task_comment',
            'project_added',
            'team_invite',
            'mention',
            'deadline_reminder',
            'milestone_completed',
            'badge_earned',
            'level_up'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // Reference to related entities
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    // Action URL
    actionUrl: String,
    // Status
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    // Priority
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, {
    timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
    return await this.create(data);
};

// Method to mark as read
notificationSchema.methods.markAsRead = async function () {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;