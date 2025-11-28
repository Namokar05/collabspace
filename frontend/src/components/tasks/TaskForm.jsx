import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';

function TaskForm({ task, projects, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    status: 'todo',
    priority: 'medium',
    category: 'other',
    dueDate: '',
    storyPoints: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        project: task.project?._id || '',
        assignedTo: task.assignedTo?._id || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        category: task.category || 'other',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        storyPoints: task.storyPoints || 1,
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const payload = {
      ...formData,
      assignedTo: formData.assignedTo ? formData.assignedTo : null,
      project: formData.project ? formData.project : null,
      dueDate: formData.dueDate || null,
      storyPoints: Number(formData.storyPoints),
    };

    await api.post("/tasks", payload);
    onSuccess();
  } catch (err) {
    setError(err.response?.data?.error || "Failed to create task");
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
              {task ? 'Edit Task' : 'New Task'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Task Title *</label>
              <input
                type="text"
                className="input-field"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Implement login feature"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Description</label>
              <textarea
                className="input-field"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Project *</label>
                <select
                  className="input-field"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Status</label>
                <select
                  className="input-field"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="completed">Completed</option>
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
                  <option value="bug">Bug</option>
                  <option value="feature">Feature</option>
                  <option value="improvement">Improvement</option>
                  <option value="documentation">Documentation</option>
                  <option value="testing">Testing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Due Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Story Points</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.storyPoints}
                  onChange={(e) => setFormData({ ...formData, storyPoints: parseInt(e.target.value) })}
                  min="1"
                  max="13"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
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

export default TaskForm;