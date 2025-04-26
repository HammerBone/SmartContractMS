import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFileContract, FaShieldAlt, FaFingerprint, FaSearch, FaRegClock, FaGlobe } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

// Base path for the application
const BASE_PATH = '/3000';

const HeroSection = styled.section`
  padding: 5rem 0;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 0 0 50% 50% / 10%;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  
  span {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--dark-gray);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  padding: 0.8rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: #2a75e8;
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }
  
  &.secondary {
    background-color: white;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    
    &:hover {
      background-color: #f8f9fa;
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 3rem;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: var(--dark-gray);
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  padding: 5rem 0;
  background-color: #f8f9fa;
`;

const StepsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Step = styled.div`
  display: flex;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StepNumber = styled.div`
  flex: 0 0 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin-right: 2rem;
  
  @media (max-width: 768px) {
    margin: 0 auto 1.5rem;
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const StepDescription = styled.p`
  color: var(--dark-gray);
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 5rem 0;
  text-align: center;
  background: linear-gradient(135deg, #3a86ff 0%, #8338ec 100%);
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  background-color: white;
  color: var(--primary-color);
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  // Helper function to prepend base path to routes
  const getPath = (path) => `${path}`;
  
  const features = [
    {
      icon: <FaFileContract />,
      title: 'Smart Contract Creation',
      description: 'Create legally binding agreements and certificates using customizable templates with automatic rule enforcement.',
    },
    {
      icon: <FaFingerprint />,
      title: 'Digital Signatures',
      description: 'Securely sign documents using cryptographic keys, ensuring authenticity and non-repudiation.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Blockchain Storage',
      description: 'Store your documents on the blockchain for immutability and tamper-proof record keeping.',
    },
    {
      icon: <FaSearch />,
      title: 'Instant Verification',
      description: 'Verify the authenticity of any document in seconds without intermediaries like notaries.',
    },
    {
      icon: <FaRegClock />,
      title: 'Automated Notifications',
      description: 'Receive timely alerts for contract renewals, expirations, and important milestones.',
    },
    {
      icon: <FaGlobe />,
      title: 'Interoperability',
      description: 'Seamlessly integrate with existing systems and support for multiple blockchain networks.',
    },
  ];
  
  const steps = [
    {
      number: 1,
      title: 'Register & Verify Identity',
      description: 'Create an account and link your digital identity through government-issued ID verification.',
    },
    {
      number: 2,
      title: 'Create Your Document',
      description: 'Choose from predefined templates or create a custom agreement with programmable rules and conditions.',
    },
    {
      number: 3,
      title: 'Invite Signatories',
      description: 'Add all parties involved in the agreement and send signature requests via email.',
    },
    {
      number: 4,
      title: 'Sign Digitally',
      description: 'All parties sign the document using their secure digital signatures.',
    },
    {
      number: 5,
      title: 'Store on Blockchain',
      description: 'Once signed, the document is hashed and permanently stored on the blockchain.',
    },
  ];

  return (
    <>
      <HeroSection>
        <div className="container">
          <HeroContent>
            <HeroTitle
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Secure <span>Smart Contracts</span> for the Digital Age
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create, sign, and verify legally binding agreements and certificates on the blockchain.
              Replace traditional notaries with secure digital authentication.
            </HeroSubtitle>
            <ButtonGroup
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {isAuthenticated ? (
                <>
                  <Button to={getPath('/dashboard')} className="primary">
                    Go to Dashboard
                  </Button>
                  <Button to={getPath('/contracts/create')} className="secondary">
                    Create Contract
                  </Button>
                </>
              ) : (
                <>
                  <Button to={getPath('/register')} className="primary">
                    Get Started
                  </Button>
                  <Button to={getPath('/verify')} className="secondary">
                    Verify Document
                  </Button>
                </>
              )}
            </ButtonGroup>
          </HeroContent>
        </div>
      </HeroSection>

      <FeaturesSection>
        <div className="container">
          <SectionTitle>Key Features</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <HowItWorksSection>
        <div className="container">
          <SectionTitle>How It Works</SectionTitle>
          <StepsContainer>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepNumber>{step.number}</StepNumber>
                <StepContent>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </StepContent>
              </Step>
            ))}
          </StepsContainer>
        </div>
      </HowItWorksSection>

      <CTASection>
        <div className="container">
          <CTATitle>Ready to Revolutionize Your Agreements?</CTATitle>
          <CTADescription>
            Join thousands of users who have already transformed their document management
            with our blockchain-powered smart contract solution.
          </CTADescription>
          <CTAButton to={isAuthenticated ? getPath('/dashboard') : getPath('/register')}>
            {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
          </CTAButton>
        </div>
      </CTASection>
    </>
  );
};

export default HomePage;
