import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import NotificationContext from '../../context/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import styled from 'styled-components';

// Base path for the application
const BASE_PATH = '/proxy/3000';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  
  span {
    color: var(--secondary-color);
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  z-index: 200;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const NavLink = styled(Link)`
  margin: 0 1rem;
  color: var(--text-color);
  font-weight: 500;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const MobileNavLink = styled(Link)`
  color: var(--text-color);
  font-weight: 500;
  font-size: 1.2rem;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  
  .count {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--accent-color);
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UserIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
`;

const Header = ({ basePath = BASE_PATH }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  // Helper function to prepend base path to routes
  const getPath = (path) => `${path}`;

  return (
    <HeaderContainer>
      <div className="container">
        <NavContainer>
          <Logo to={getPath('/')}>
            Smart<span>Contract</span>MS
          </Logo>

          <NavLinks>
            {isAuthenticated ? (
              <>
                <NavLink to={getPath('/dashboard')}>Dashboard</NavLink>
                <NavLink to={getPath('/contracts')}>Contracts</NavLink>
                <NavLink to={getPath('/templates')}>Templates</NavLink>
              </>
            ) : (
              <>
                <NavLink to={getPath('/login')}>Login</NavLink>
                <NavLink to={getPath('/register')}>Register</NavLink>
              </>
            )}
          </NavLinks>

          <UserMenu>
            {isAuthenticated && (
              <>
                <NotificationIcon onClick={toggleNotifications}>
                  <FaBell size={20} />
                  {unreadCount > 0 && <div className="count">{unreadCount}</div>}
                </NotificationIcon>
                
                <UserIcon onClick={() => navigate(getPath('/profile'))}>
                  <FaUserCircle size={20} />
                  <span>{user?.name}</span>
                </UserIcon>
                
                {showNotifications && (
                  <NotificationDropdown onClose={() => setShowNotifications(false)} />
                )}
              </>
            )}
            
            <MenuButton onClick={toggleMobileMenu}>
              <FaBars />
            </MenuButton>
          </UserMenu>
        </NavContainer>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            
            <MobileMenu
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
            >
              <CloseButton onClick={toggleMobileMenu}>
                <FaTimes />
              </CloseButton>
              
              <MobileNavLinks>
                {isAuthenticated ? (
                  <>
                    <MobileNavLink to={getPath('/dashboard')} onClick={toggleMobileMenu}>
                      Dashboard
                    </MobileNavLink>
                    <MobileNavLink to={getPath('/contracts')} onClick={toggleMobileMenu}>
                      Contracts
                    </MobileNavLink>
                    <MobileNavLink to={getPath('/templates')} onClick={toggleMobileMenu}>
                      Templates
                    </MobileNavLink>
                    <MobileNavLink to={getPath('/profile')} onClick={toggleMobileMenu}>
                      Profile
                    </MobileNavLink>
                    <MobileNavLink to={getPath('/')} onClick={handleLogout}>
                      Logout
                    </MobileNavLink>
                  </>
                ) : (
                  <>
                    <MobileNavLink to={getPath('/login')} onClick={toggleMobileMenu}>
                      Login
                    </MobileNavLink>
                    <MobileNavLink to={getPath('/register')} onClick={toggleMobileMenu}>
                      Register
                    </MobileNavLink>
                  </>
                )}
              </MobileNavLinks>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;
