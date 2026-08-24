import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthModals.css';
import { toast } from 'react-toastify';
import { useAuthStore } from "../store/ZustandStore.js";

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : import.meta.env.VITE_API_URL;

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      login(token, user);
      toast.success(`Welcome ${user.username}`);

      setEmail('');
      setPassword('');

      // Close modal and navigate smoothly to home
      onClose();
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to sign in';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apex-modal-backdrop" onClick={onClose}>
      <div className="apex-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="apex-modal-exit" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="apex-modal-top">
          <h3>Welcome Back</h3>
          <p>Log in to manage your account and view orders.</p>
        </div>

        {error && <div className="apex-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="apex-form">
          <div className="apex-field">
            <label>Email Address</label>
            <div className="apex-input-box">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="apex-field">
            <label>Password</label>
            <div className="apex-input-box">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="apex-submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="apex-modal-footer">
          <p>Don't have an account? <button type="button" onClick={onSwitchToSignup} className="apex-text-link">Sign Up</button></p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;