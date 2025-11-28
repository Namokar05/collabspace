import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';

function ProjectForm({ project, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    category: 'other',
    deadline: '',
    startDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        category: project.category || 'other',
        deadline: project.deadline ? project.deadline.split('T')[0] : '',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
      });
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (project) {
        await api.put(`/projects/${project._id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {project ? 'Edit Project' : 'New Project'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Project Name *</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="E-commerce Website"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Description</label>
              <textarea
                className="input-field"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Status</label>
                <select
                  className="input-field"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Priority</label>
                <select
                  className="input-field"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Category</label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="research">Research</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Start Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Deadline</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
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

export default ProjectForm;