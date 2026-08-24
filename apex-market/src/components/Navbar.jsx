import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    Sparkles,
    User,
    LogIn,
    LogOut,
    LayoutDashboard,
    Menu,
    X,
    ShoppingCart,
    Package
} from 'lucide-react';
import { useAuthStore } from '../store/ZustandStore.js';
import { toast } from 'react-toastify';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import './Navbar.css';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);

    const navigate = useNavigate();

    // Pull token, user data, and logout action from Zustand store
    const { token, user, logout } = useAuthStore();
    const isLoggedIn = !!token;

    // Check if the logged-in user has admin rights
    const isAdmin = isLoggedIn && user?.isAdmin === true;

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully.');
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'SportsWear', path: '/sportswear' },
        { name: 'Electronics', path: '/electronics' },
        { name: 'Appliances', path: '/appliances' },
        { name: 'Mobiles', path: '/mobiles' },
    ];

    const switchToSignup = () => {
        setLoginOpen(false);
        setSignupOpen(true);
    };

    const switchToLogin = () => {
        setSignupOpen(false);
        setLoginOpen(true);
    };

    return (
        <>
            <header className="apex-nav-header">
                <div className="apex-nav-container">

                    {/* Brand Logo */}
                    <Link to="/" className="apex-logo">
                        APEX<span className="apex-logo-highlight">MARKET</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="apex-nav-menu">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                end={link.path === '/'}
                                className={({ isActive }) => `apex-link ${isActive ? 'active' : ''}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        {/* Independent Cart Link for Logged In Users */}
                        {isLoggedIn && (
                            <NavLink
                                to="/cart"
                                className={({ isActive }) => `apex-link ${isActive ? 'active' : ''}`}
                            >
                                <ShoppingCart size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                                Cart
                            </NavLink>
                        )}

                        {/* Render Dashboard ONLY if user is an admin */}
                        {isAdmin && (
                            <NavLink
                                to="/admin/dashboard"
                                className={({ isActive }) => `apex-link apex-admin-badge ${isActive ? 'active' : ''}`}
                            >
                                <LayoutDashboard size={14} />
                                Dashboard
                            </NavLink>
                        )}
                    </nav>

                    {/* Right Action Buttons */}
                    <div className="apex-nav-actions">
                        {isLoggedIn ? (
                            <>
                                <Link to="/orders" className="apex-btn apex-btn-secondary">
                                    <Package size={15} />
                                    <span>Orders</span>
                                </Link>
                                <Link to="/profile" className="apex-btn apex-btn-secondary">
                                    <User size={15} />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="apex-btn apex-btn-secondary"
                                    style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                >
                                    <LogOut size={15} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setLoginOpen(true)} className="apex-btn apex-btn-secondary">
                                    <LogIn size={15} />
                                    <span>Login</span>
                                </button>
                                <button onClick={() => setSignupOpen(true)} className="apex-btn apex-btn-primary">
                                    <Sparkles size={15} />
                                    <span>Sign Up</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="apex-mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                </div>

                {/* Mobile Dropdown Overlay */}
                {mobileMenuOpen && (
                    <div className="apex-mobile-dropdown">
                        <div className="apex-mobile-links">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    end={link.path === '/'}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => `apex-mobile-item ${isActive ? 'active' : ''}`}
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            {isLoggedIn && (
                                <NavLink
                                    to="/cart"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => `apex-mobile-item ${isActive ? 'active' : ''}`}
                                >
                                    <ShoppingCart size={15} />
                                    <span>Cart</span>
                                </NavLink>
                            )}

                            {/* Mobile Dashboard Link */}
                            {isAdmin && (
                                <NavLink
                                    to="/admin/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => `apex-mobile-item ${isActive ? 'active' : ''}`}
                                >
                                    <LayoutDashboard size={15} />
                                    Dashboard
                                </NavLink>
                            )}
                        </div>

                        <div className="apex-mobile-buttons">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="apex-btn apex-btn-secondary apex-full">
                                        <Package size={15} /> Orders
                                    </Link>
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="apex-btn apex-btn-secondary apex-full">
                                        <User size={15} /> Profile
                                    </Link>
                                    <button
                                        onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                                        className="apex-btn apex-btn-secondary apex-full"
                                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                    >
                                        <LogOut size={15} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { setMobileMenuOpen(false); setLoginOpen(true); }} className="apex-btn apex-btn-secondary apex-full">
                                        <LogIn size={15} /> Login
                                    </button>
                                    <button onClick={() => { setMobileMenuOpen(false); setSignupOpen(true); }} className="apex-btn apex-btn-primary apex-full">
                                        <Sparkles size={15} /> Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSwitchToSignup={switchToSignup}
            />

            <SignUpModal
                isOpen={signupOpen}
                onClose={() => setSignupOpen(false)}
                onSwitchToLogin={switchToLogin}
            />
        </>
    );
};

export default Navbar;