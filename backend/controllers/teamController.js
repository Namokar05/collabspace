import Team from '../models/Team.js';
import User from '../models/User.js';

export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            $or: [
                { lead: req.user.id },
                { 'members.user': req.user.id }
            ]
        })
            .populate('lead', 'username avatar')
            .populate('members.user', 'username avatar points level')
            .populate('projects', 'name status')
            .sort('-createdAt');

        res.json({ success: true, teams });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch teams', error: error.message });
    }
};

export const createTeam = async (req, res) => {
    try {
        const teamData = {
            ...req.body,
            lead: req.user.id,
            members: [{ user: req.user.id, role: 'lead' }]
        };

        const team = await Team.create(teamData);
        await team.populate('lead', 'username avatar');

        // Update user's teams
        await User.findByIdAndUpdate(req.user.id, {
            $push: { teams: team._id }
        });

        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            team
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create team', error: error.message });
    }
};

export const updateTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const member = team.members.find(m => m.user.toString() === req.user.id);
        if (!member || !['lead', 'admin'].includes(member.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        Object.assign(team, req.body);
        await team.save();

        res.json({
            success: true,
            message: 'Team updated successfully',
            team
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update team', error: error.message });
    }
};
