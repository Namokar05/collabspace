import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';

function TeamForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'development',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/teams', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">New Team</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Team Name *</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Frontend Development Team"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Description</label>
              <textarea
                className="input-field"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Team description..."
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="support">Support</option>
                <option value="management">Management</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Team'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeamForm;