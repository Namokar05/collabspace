import { Calendar, User, Edit, Trash2, CheckCircle } from 'lucide-react';

function TaskCard({ task, onEdit, onDelete }) {
  const statusColors = {
    backlog: 'badge bg-gray-100 text-gray-800',
    todo: 'badge bg-blue-100 text-blue-800',
    'in-progress': 'badge bg-yellow-100 text-yellow-800',
    'in-review': 'badge bg-purple-100 text-purple-800',
    completed: 'badge bg-green-100 text-green-800',
    cancelled: 'badge bg-red-100 text-red-800'
  };

  const priorityColors = {
    low: 'border-l-4 border-blue-500',
    medium: 'border-l-4 border-yellow-500',
    high: 'border-l-4 border-orange-500',
    urgent: 'border-l-4 border-red-500'
  };

  return (
    <div className={`card ${priorityColors[task.priority]}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex-1">
          {task.title}
        </h3>
        {task.status === 'completed' && (
          <CheckCircle className="text-green-500" size={20} />
        )}
      </div>

      <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
        {task.description || 'No description'}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={statusColors[task.status]}>
          {task.status}
        </span>
        <span className="badge badge-primary">
          {task.priority}
        </span>
        {task.storyPoints && (
          <span className="badge bg-purple-100 text-purple-800">
            {task.storyPoints} pts
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        {task.project?.name && (
          <div className="flex items-center">
            <span className="font-medium">Project:</span>
            <span className="ml-2">{task.project.name}</span>
          </div>
        )}
        {task.assignedTo && (
          <div className="flex items-center">
            <User size={14} className="mr-2" />
            <span>{task.assignedTo.username || 'Unassigned'}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {task.progress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 btn-secondary flex items-center justify-center space-x-1 text-sm"
        >
          <Edit size={14} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 btn-danger flex items-center justify-center space-x-1 text-sm"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default TaskCard;