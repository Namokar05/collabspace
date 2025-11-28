import { Calendar, Users, TrendingUp, Edit, Trash2 } from 'lucide-react';

function ProjectCard({ project, onEdit, onDelete }) {
  const statusColors = {
    planning: 'badge-primary',
    active: 'badge-success',
    'on-hold': 'badge-warning',
    completed: 'badge-success',
    cancelled: 'badge-danger'
  };

  const priorityColors = {
    low: 'text-blue-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    urgent: 'text-red-600'
  };

  return (
    <div className="card group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition">
            {project.name}
          </h3>
          <span className={`badge ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>
        <div className={`text-2xl font-bold ${priorityColors[project.priority]}`}>
          !
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {project.description || 'No description'}
      </p>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Calendar size={16} className="mr-2" />
          <span>Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
        </div>
        <div className="flex items-center">
          <Users size={16} className="mr-2" />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center">
          <TrendingUp size={16} className="mr-2" />
          <span>{project.progress || 0}% complete</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all"
          style={{ width: `${project.progress || 0}%` }}
        ></div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(project)}
          className="flex-1 btn-secondary flex items-center justify-center space-x-1"
        >
          <Edit size={16} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="flex-1 btn-danger flex items-center justify-center space-x-1"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;