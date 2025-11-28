import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';

function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(formData.username, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-primary-600 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CollabSpace</h1>
          <p className="text-gray-600">Join the Team</p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Username</label>
            <input
              type="text"
              className="input-field"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              minLength="3"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength="6"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;