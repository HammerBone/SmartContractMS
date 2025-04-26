import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Loader from '../components/common/Loader';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const LoginCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const LoginSubtitle = styled.p`
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

const RegisterLink = styled.div`
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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useContext(AuthContext);
  const [loginError, setLoginError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError('');
    const success = await login(values.email, values.password);
    if (!success) {
      setLoginError('Invalid email or password');
    }
    setSubmitting(false);
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginHeader>
          <LoginTitle>Welcome Back</LoginTitle>
          <LoginSubtitle>Sign in to your account</LoginSubtitle>
        </LoginHeader>

        {loading ? (
          <Loader text="Logging in..." />
        ) : (
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {loginError && (
                  <div className="alert alert-danger">{loginError}</div>
                )}

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
                      placeholder="Enter your password"
                      className={errors.password && touched.password ? 'is-invalid' : ''}
                    />
                  </InputGroup>
                  <ErrorMessage name="password" component={ErrorText} />
                </FormGroup>

                <SubmitButton type="submit" disabled={isSubmitting}>
                  <FaSignInAlt />
                  Sign In
                </SubmitButton>

                <RegisterLink>
                  Don't have an account? <Link to="/register">Register</Link>
                </RegisterLink>
              </Form>
            )}
          </Formik>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
