import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 2rem 0;
  margin-top: 3rem;
  border-top: 1px solid #e9ecef;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: var(--dark-gray);
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    color: var(--dark-gray);
    font-size: 1.5rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  color: var(--dark-gray);
  font-size: 0.9rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Helper function to prepend base path to routes
  const getPath = (path) => `/proxy/3000${path}`;
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <FooterTitle>Smart Contract MS</FooterTitle>
            <p>
              A secure platform for creating, signing, and managing digital
              contracts and certificates on the blockchain.
            </p>
            <SocialLinks>
              <a href="#" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLinks>
              <li>
                <Link to={getPath('/')}>Home</Link>
              </li>
              <li>
                <Link to={getPath('/contracts')}>Contracts</Link>
              </li>
              <li>
                <Link to={getPath('/templates')}>Templates</Link>
              </li>
              <li>
                <Link to={getPath('/verify/new')}>Verify Document</Link>
              </li>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <FooterLinks>
              <li>
                <Link to="#">Documentation</Link>
              </li>
              <li>
                <Link to="#">API Reference</Link>
              </li>
              <li>
                <Link to="#">Blockchain Guide</Link>
              </li>
              <li>
                <Link to="#">Smart Contract Tutorial</Link>
              </li>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Legal</FooterTitle>
            <FooterLinks>
              <li>
                <Link to="#">Terms of Service</Link>
              </li>
              <li>
                <Link to="#">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#">Cookie Policy</Link>
              </li>
              <li>
                <Link to="#">GDPR Compliance</Link>
              </li>
            </FooterLinks>
          </FooterSection>
        </FooterContent>
        
        <Copyright>
          &copy; {currentYear} Smart Contract Management System. All rights reserved.
        </Copyright>
      </div>
    </FooterContainer>
  );
};

export default Footer;
