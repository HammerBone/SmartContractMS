import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaKey, FaArrowLeft } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { blockchainService } from '../services/blockchainService';
import Loader from '../components/common/Loader';

// Base path for the application
const BASE_PATH = '/proxy/3000';

const ProfileContainer = styled.div`
  padding: 2rem 0;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: var(--dark-gray);
  font-weight: 500;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 1.5rem;
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const ProfileEmail = styled.p`
  color: var(--dark-gray);
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ProfileStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  
  &.verified {
    background-color: rgba(56, 176, 0, 0.1);
    color: var(--success-color);
  }
  
  &.unverified {
    background-color: rgba(255, 190, 11, 0.1);
    color: var(--warning-color);
  }
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--dark-gray);
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-gray);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.8rem;
  transform: translateY(-50%);
  color: var(--medium-gray);
`;

const ErrorText = styled.div`
  color: var(--danger-color);
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: #2a75e8;
  }
  
  &:disabled {
    background-color: var(--medium-gray);
    cursor: not-allowed;
  }
`;

const GenerateKeyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background-color: #7028d8;
  }
`;

const KeyDisplay = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
`;

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

const IdentitySchema = Yup.object().shape({
  idType: Yup.string().required('ID type is required'),
  idNumber: Yup.string().required('ID number is required'),
});

const ProfilePage = () => {
  const { user, updateProfile, updateDigitalIdentity, loading } = useContext(AuthContext);
  const [keyPair, setKeyPair] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Helper function to prepend base path to routes
  const getPath = (path) => `${BASE_PATH}${path}`;

  const handleGenerateKeyPair = async () => {
    try {
      const newKeyPair = await blockchainService.generateKeyPair();
      setKeyPair(newKeyPair);
    } catch (error) {
      console.error('Error generating key pair:', error);
    }
  };

  const handleUpdateProfile = async (values, { setSubmitting }) => {
    const profileData = {
      name: values.name,
      email: values.email,
    };

    if (values.password) {
      profileData.password = values.password;
    }

    if (keyPair && keyPair.publicKey) {
      profileData.publicKey = keyPair.publicKey;
    }

    await updateProfile(profileData);
    setSubmitting(false);
  };

  const handleUpdateIdentity = async (values, { setSubmitting }) => {
    await updateDigitalIdentity(values);
    setSubmitting(false);
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <ProfileContainer>
      <BackLink to={getPath('/dashboard')}>
        <FaArrowLeft /> Back to Dashboard
      </BackLink>
      
      <PageTitle>My Profile</PageTitle>
      
      <ProfileGrid>
        <ProfileSidebar>
          <ProfileCard>
            <ProfileAvatar>
              <FaUser />
            </ProfileAvatar>
            <ProfileName>{user.name}</ProfileName>
            <ProfileEmail>{user.email}</ProfileEmail>
            <ProfileStatus className={user.digitalIdentity?.verified ? 'verified' : 'unverified'}>
              {user.digitalIdentity?.verified ? 'Identity Verified' : 'Identity Not Verified'}
            </ProfileStatus>
            
            <ProfileStats>
              <StatItem>
                <StatValue>0</StatValue>
                <StatLabel>Contracts</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>0</StatValue>
                <StatLabel>Signatures</StatLabel>
              </StatItem>
            </ProfileStats>
          </ProfileCard>
          
          <ProfileCard>
            <SectionTitle>Navigation</SectionTitle>
            <div>
              <button
                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'} w-full mb-2`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Settings
              </button>
              <button
                className={`btn ${activeTab === 'identity' ? 'btn-primary' : 'btn-outline'} w-full mb-2`}
                onClick={() => setActiveTab('identity')}
              >
                Digital Identity
              </button>
              <button
                className={`btn ${activeTab === 'keys' ? 'btn-primary' : 'btn-outline'} w-full`}
                onClick={() => setActiveTab('keys')}
              >
                Blockchain Keys
              </button>
            </div>
          </ProfileCard>
        </ProfileSidebar>
        
        <div>
          {activeTab === 'profile' && (
            <ProfileCard>
              <SectionTitle>Profile Settings</SectionTitle>
              <Formik
                initialValues={{
                  name: user.name || '',
                  email: user.email || '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleUpdateProfile}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <FormGroup>
                      <Label htmlFor="name">Full Name</Label>
                      <InputGroup>
                        <InputIcon>
                          <FaUser />
                        </InputIcon>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                        />
                      </InputGroup>
                      <ErrorMessage name="name" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="email">Email Address</Label>
                      <InputGroup>
                        <InputIcon>
                          <FaEnvelope />
                        </InputIcon>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                        />
                      </InputGroup>
                      <ErrorMessage name="email" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                      <InputGroup>
                        <InputIcon>
                          <FaLock />
                        </InputIcon>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Enter new password"
                        />
                      </InputGroup>
                      <ErrorMessage name="password" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <InputGroup>
                        <InputIcon>
                          <FaLock />
                        </InputIcon>
                        <Input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm new password"
                        />
                      </InputGroup>
                      <ErrorMessage name="confirmPassword" component={ErrorText} />
                    </FormGroup>
                    
                    <SubmitButton type="submit" disabled={isSubmitting || loading}>
                      {isSubmitting || loading ? 'Updating...' : 'Update Profile'}
                    </SubmitButton>
                  </Form>
                )}
              </Formik>
            </ProfileCard>
          )}
          
          {activeTab === 'identity' && (
            <ProfileCard>
              <SectionTitle>Digital Identity</SectionTitle>
              <p className="mb-4">
                Verify your identity to enable full access to contract creation and signing features.
                Your identity information is securely stored and never shared with third parties.
              </p>
              
              <Formik
                initialValues={{
                  idType: user.digitalIdentity?.idType || '',
                  idNumber: user.digitalIdentity?.idNumber || '',
                }}
                validationSchema={IdentitySchema}
                onSubmit={handleUpdateIdentity}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <FormGroup>
                      <Label htmlFor="idType">ID Type</Label>
                      <Input
                        as="select"
                        id="idType"
                        name="idType"
                      >
                        <option value="">Select ID Type</option>
                        <option value="government_id">Government ID</option>
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="other">Other</option>
                      </Input>
                      <ErrorMessage name="idType" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="idNumber">ID Number</Label>
                      <InputGroup>
                        <InputIcon>
                          <FaIdCard />
                        </InputIcon>
                        <Input
                          type="text"
                          id="idNumber"
                          name="idNumber"
                          placeholder="Enter your ID number"
                        />
                      </InputGroup>
                      <ErrorMessage name="idNumber" component={ErrorText} />
                    </FormGroup>
                    
                    <SubmitButton type="submit" disabled={isSubmitting || loading}>
                      {isSubmitting || loading ? 'Verifying...' : 'Verify Identity'}
                    </SubmitButton>
                  </Form>
                )}
              </Formik>
            </ProfileCard>
          )}
          
          {activeTab === 'keys' && (
            <ProfileCard>
              <SectionTitle>Blockchain Keys</SectionTitle>
              <p className="mb-4">
                Generate a cryptographic key pair to sign and verify contracts on the blockchain.
                Keep your private key secure and never share it with anyone.
              </p>
              
              {user.publicKey ? (
                <div>
                  <FormGroup>
                    <Label>Your Public Key</Label>
                    <KeyDisplay>{user.publicKey}</KeyDisplay>
                  </FormGroup>
                  
                  <p className="text-warning mb-4">
                    You already have a public key registered. Generating a new key pair will replace your existing key.
                  </p>
                </div>
              ) : (
                <p className="mb-4">
                  You don't have a public key registered yet. Generate a key pair to start signing contracts.
                </p>
              )}
              
              <GenerateKeyButton type="button" onClick={handleGenerateKeyPair}>
                <FaKey /> Generate New Key Pair
              </GenerateKeyButton>
              
              {keyPair && (
                <div className="mt-4">
                  <FormGroup>
                    <Label>Public Key</Label>
                    <KeyDisplay>{keyPair.publicKey}</KeyDisplay>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Private Key (Keep this secure!)</Label>
                    <KeyDisplay>{keyPair.privateKey}</KeyDisplay>
                  </FormGroup>
                  
                  <p className="text-danger mt-2">
                    Important: Save your private key somewhere secure. It will not be stored on our servers
                    and cannot be recovered if lost.
                  </p>
                  
                  <SubmitButton
                    type="button"
                    onClick={() => updateProfile({ publicKey: keyPair.publicKey })}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Public Key'}
                  </SubmitButton>
                </div>
              )}
            </ProfileCard>
          )}
        </div>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default ProfilePage;
