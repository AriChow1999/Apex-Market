import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useAuthStore } from '../store/ZustandStore';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  // Pull user, token, and updateUser action from Zustand store
  const { user, token, updateUser } = useAuthStore();

  // Form Edit States initialized from Zustand store data
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback States
  const [loadingUsername, setLoadingUsername] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    setLoadingUsername(true);
    try {
      // API call to update username on the backend
      const response = await axios.patch(
        'http://localhost:5000/api/auth/update-username',
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update global store state safely using the response or new value
      updateUser({ username: response.data.user?.username || newUsername });

      toast.success('Username updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update username';
      toast.error(errorMessage);
    } finally {
      setLoadingUsername(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.info("Both passwords should match");
      return;
    }

    setLoadingPassword(true);
    try {
      // API call to update password on the backend
      await axios.patch(
        'http://localhost:5000/api/auth/update-password',
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update password';
      toast.error(errorMessage);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="apex-profile-page">
      <div className="apex-profile-container">

        {/* Page Title Header */}
        <div className="apex-profile-header">
          <h1>Account Settings</h1>
          <p>Manage your profile details and security settings.</p>
        </div>

        {/* Profile Identity Overview Card */}
        <div className="apex-profile-identity-card">
          <div className="apex-avatar-circle">
            <User size={28} />
          </div>
          <div className="apex-identity-info">
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        {/* Settings Stack Section */}
        <div className="apex-settings-stack">

          {/* Change Username Card */}
          <div className="apex-settings-card">
            <div className="apex-card-header">
              <div className="apex-card-icon-wrapper">
                <User size={18} />
              </div>
              <div>
                <h2>Display Name</h2>
              </div>
            </div>

            <form onSubmit={handleUpdateUsername} className="apex-settings-form">
              <div className="apex-form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="apex-save-btn" disabled={loadingUsername}>
                {loadingUsername ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="apex-settings-card">
            <div className="apex-card-header">
              <div className="apex-card-icon-wrapper">
                <Lock size={18} />
              </div>
              <div>
                <h2>Security & Password</h2>
                <p>Update your password regularly to secure your account.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="apex-settings-form">
              <div className="apex-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="apex-form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="apex-save-btn" disabled={loadingPassword}>
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;