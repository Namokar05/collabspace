import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../../services/api';
import Loading from '../common/Loading';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const [tasksRes, projectsRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/projects')
    ]);

    setTasks(tasksRes.data.tasks || []);

    // FIX: backend returns { success, projects: [...] }
    setProjects(projectsRes.data.projects || []);

  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => t._id !== id));
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSuccess = () => {
    fetchData();
    handleFormClose();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: tasks.length,
    backlog: tasks.filter(t => t.status === 'backlog').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <p className="text-gray-600 text-sm mb-1">Total</p>
          <p className="text-3xl font-bold text-primary-600">{taskStats.total}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm mb-1">Backlog</p>
          <p className="text-3xl font-bold text-gray-600">{taskStats.backlog}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm mb-1">Todo</p>
          <p className="text-3xl font-bold text-blue-600">{taskStats.todo}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm mb-1">In Progress</p>
          <p className="text-3xl font-bold text-yellow-600">{taskStats.inProgress}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{taskStats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="backlog">Backlog</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="in-review">In Review</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="input-field"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4"
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          projects={projects}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default TaskList;