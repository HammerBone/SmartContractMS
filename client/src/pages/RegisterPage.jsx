import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Loader from '../components/common/Loader';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const RegisterCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterTitle = styled.h1`
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const RegisterSubtitle = styled.p`
  color: var(--dark-gray);
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
  width: 100%;
  padding: 0.8rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2a75e8;
  }
  
  &:disabled {
    background-color: var(--medium-gray);
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  
  a {
    color: var(--primary-color);
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsText = styled.p`
  font-size: 0.8rem;
  color: var(--dark-gray);
  text-align: center;
  margin-top: 1.5rem;
  
  a {
    color: var(--primary-color);
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterPage = () => {
  const { register, isAuthenticated, loading } = useContext(AuthContext);
  const [registerError, setRegisterError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setRegisterError('');
    const { name, email, password } = values;
    const success = await register({ name, email, password });
    if (!success) {
      setRegisterError('Registration failed. Email may already be in use.');
    }
    setSubmitting(false);
  };

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RegisterHeader>
          <RegisterTitle>Create Account</RegisterTitle>
          <RegisterSubtitle>Join our secure contract management platform</RegisterSubtitle>
        </RegisterHeader>

        {loading ? (
          <Loader text="Creating your account..." />
        ) : (
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {registerError && (
                  <div className="alert alert-danger">{registerError}</div>
                )}

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
                      className={errors.name && touched.name ? 'is-invalid' : ''}
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
                      className={errors.email && touched.email ? 'is-invalid' : ''}
                    />
                  </InputGroup>
                  <ErrorMessage name="email" component={ErrorText} />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputGroup>
                    <InputIcon>
                      <FaLock />
                    </InputIcon>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Create a password"
                      className={errors.password && touched.password ? 'is-invalid' : ''}
                    />
                  </InputGroup>
                  <ErrorMessage name="password" component={ErrorText} />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <InputGroup>
                    <InputIcon>
                      <FaLock />
                    </InputIcon>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      className={
                        errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''
                      }
                    />
                  </InputGroup>
                  <ErrorMessage name="confirmPassword" component={ErrorText} />
                </FormGroup>

                <SubmitButton type="submit" disabled={isSubmitting}>
                  <FaUserPlus />
                  Create Account
                </SubmitButton>

                <LoginLink>
                  Already have an account? <Link to="/login">Sign In</Link>
                </LoginLink>

                <TermsText>
                  By registering, you agree to our{' '}
                  <Link to="#">Terms of Service</Link> and{' '}
                  <Link to="#">Privacy Policy</Link>
                </TermsText>
              </Form>
            )}
          </Formik>
        )}
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;
