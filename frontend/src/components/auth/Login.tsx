import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../common/ErrorMessage";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-purple-600 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CollabSpace</h1>
          <p className="text-gray-600">Project & Team Management</p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 text-lg"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign up here
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          Demo: john@example.com / password123
        </div>
      </div>
    </div>
  );
}

export default Login;
