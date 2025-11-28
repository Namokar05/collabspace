import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=User&background=random'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user'
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    skills: [{
        type: String,
        trim: true
    }],
    // Gamification
    points: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    badges: [{
        name: String,
        icon: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Teams user belongs to
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    // Projects user is part of
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    // Preferences
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        }
    },
    // Activity tracking
    lastActive: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.username;
});

// Method to add points and check for level up
userSchema.methods.addPoints = function (points) {
    this.points += points;
    const newLevel = Math.floor(this.points / 100) + 1;
    if (newLevel > this.level) {
        this.level = newLevel;
        return { leveledUp: true, newLevel };
    }
    return { leveledUp: false };
};

// Ensure virtuals are included when converting to JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;