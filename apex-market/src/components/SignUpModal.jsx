import { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthModals.css';
import { toast } from 'react-toastify';
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : import.meta.env.VITE_API_URL;

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });


      toast.success("User Registered");

      setUsername('');
      setEmail('');
      setPassword('');
      onClose();
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message ||  'Failed to sign up';
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
          <h3>Create Account</h3>
          <p>Sign up to unlock exclusive features and cart functionality.</p>
        </div>

        {error && <div className="apex-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="apex-form">
          <div className="apex-field">
            <label>Username</label>
            <div className="apex-input-box">
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="apex-modal-footer">
          <p>Already have an account? <button type="button" onClick={onSwitchToLogin} className="apex-text-link">Sign In</button></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;