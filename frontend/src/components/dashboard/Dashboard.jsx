import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckSquare, Clock, AlertCircle, TrendingUp, Award } from 'lucide-react';
import api from '../../services/api';
import Loading from '../common/Loading';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const statCards = [
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderKanban, color: 'bg-blue-500', link: '/projects' },
    { label: 'Active Projects', value: stats?.activeProjects || 0, icon: TrendingUp, color: 'bg-green-500', link: '/projects' },
    { label: 'My Tasks', value: stats?.myTasks || 0, icon: CheckSquare, color: 'bg-purple-500', link: '/tasks' },
    { label: 'Completed Tasks', value: stats?.completedTasks || 0, icon: Award, color: 'bg-yellow-500', link: '/tasks' },
    { label: 'Pending Tasks', value: stats?.pendingTasks || 0, icon: Clock, color: 'bg-orange-500', link: '/tasks' },
    { label: 'Overdue Tasks', value: stats?.overdueTasks || 0, icon: AlertCircle, color: 'bg-red-500', link: '/tasks' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
        <p className="text-primary-100 text-lg">Here's what's happening with your projects today.</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
            <span className="text-sm">Level {user?.level || 1}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
            <span className="text-sm">{user?.points || 0} Points</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-14 h-14 rounded-lg flex items-center justify-center`}>
                <stat.icon size={28} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/projects" className="btn-primary text-center py-4">
            <FolderKanban className="inline mr-2" size={20} />
            New Project
          </Link>
          <Link to="/tasks" className="btn-primary text-center py-4">
            <CheckSquare className="inline mr-2" size={20} />
            New Task
          </Link>
          <Link to="/teams" className="btn-primary text-center py-4">
            <Award className="inline mr-2" size={20} />
            View Teams
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        {stats?.recentActivity?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.status}</p>
                </div>
                <span className={`badge ${
                  activity.status === 'completed' ? 'badge-success' : 
                  activity.status === 'in-progress' ? 'badge-warning' : 
                  'badge-primary'
                }`}>
                  {activity.priority || 'medium'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;