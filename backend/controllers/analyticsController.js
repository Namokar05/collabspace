import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Normalize userId first (must come first!)
        const userId = req.user.id.toString();

        // 2. Fetch projects owned or joined by the user
        const projects = await Project.find({
            $or: [
                { owner: userId },
                { "members.user": userId }
            ]
        });

        const projectIds = projects.map(p => p._id);

        // 3. Fetch tasks from these projects
        const tasks = await Task.find({ project: { $in: projectIds } });

        // 4. Assigned tasks
        const assignedTasks = tasks.filter(t =>
            t.assignedTo && t.assignedTo.toString() === userId
        );

        // 5. Stats
        const stats = {
            totalProjects: projects.length,
            activeProjects: projects.filter(p => p.status === "active").length,
            completedProjects: projects.filter(p => p.status === "completed").length,

            totalTasks: tasks.length,
            myTasks: assignedTasks.length,

            completedTasks: assignedTasks.filter(t => t.status === "completed").length,
            pendingTasks: assignedTasks.filter(t => t.status !== "completed").length,
            overdueTasks: assignedTasks.filter(t => t.isOverdue).length,

            recentActivity: tasks
                .sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt))
                .slice(0, 10)
        };

        return res.json({ success: true, stats });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
            error: error.message
        });
    }
};
