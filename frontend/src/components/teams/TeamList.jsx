import { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import api from '../../services/api';
import Loading from '../common/Loading';
import TeamForm from './TeamForm';

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data.teams || []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchTeams();
    setShowForm(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Teams</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Team</span>
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 card">
          <Users size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No teams yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4"
          >
            Create Your First Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team._id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                  <p className="text-sm text-gray-600">{team.category}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{team.description || 'No description'}</p>

              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <div>
                  <p className="font-medium">Members</p>
                  <p className="text-2xl font-bold text-primary-600">{team.members?.length || 0}</p>
                </div>
                <div>
                  <p className="font-medium">Projects</p>
                  <p className="text-2xl font-bold text-green-600">{team.projects?.length || 0}</p>
                </div>
                <div>
                  <p className="font-medium">Points</p>
                  <p className="text-2xl font-bold text-purple-600">{team.stats?.totalPoints || 0}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Lead: {team.lead?.username || 'Unknown'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TeamForm
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default TeamList;