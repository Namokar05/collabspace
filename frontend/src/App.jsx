import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ProjectList from './components/projects/ProjectList';
import TaskList from './components/tasks/TaskList';
import TeamList from './components/teams/TeamList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="teams" element={<TeamList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;