import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, FolderKanban, CheckSquare, Users, LogOut, User } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/teams', label: 'Teams', icon: Users },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              CollabSpace
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  isActive(path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">Level {user?.level || 1} • {user?.points || 0} pts</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex space-x-2 pb-4 overflow-x-auto">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                isActive(path)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;