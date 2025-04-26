import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import ContractContext from '../context/ContractContext';
import TemplateContext from '../context/TemplateContext';
import Loader from '../components/common/Loader';

// Base path for the application
const BASE_PATH = '/proxy/3000';

const CreateContractContainer = styled.div`
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

const FormContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
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

const Input = styled(Field)`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
  }
`;

const Select = styled(Field)`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
  }
`;

const Textarea = styled(Field)`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  min-height: 150px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
  }
`;

const ErrorText = styled.div`
  color: var(--danger-color);
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const PartiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PartyItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2a75e8;
  }
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #c50322;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 1.1rem;
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

const TemplateSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TemplateCard = styled.div`
  padding: 1.5rem;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--light-gray)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const TemplateTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const TemplateDescription = styled.p`
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const CreateContractSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  templateId: Yup.string().required('Please select a template'),
  parties: Yup.array().of(
    Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Email is required'),
      role: Yup.string().required('Role is required'),
    })
  ).min(1, 'At least one party is required'),
  expiryDate: Yup.date().nullable(),
  isPublic: Yup.boolean(),
});

const CreateContractPage = () => {
  const navigate = useNavigate();
  const { createContract, loading: contractLoading } = useContext(ContractContext);
  const { templates, loading: templatesLoading, error: templatesError, fetchTemplates } = useContext(TemplateContext);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Helper function to prepend base path to routes
  const getPath = (path) => `${BASE_PATH}${path}`;

  useEffect(() => {
    if (!templates.length) {
      fetchTemplates();
    }
  }, [fetchTemplates, templates.length]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Map the form values to match the contract model schema
      const contractData = {
        title: values.title,
        content: values.description, // Map description to content
        templateId: values.templateId,
        // Don't send parties for now, we'll handle this separately
        expiryDate: values.expiryDate || null,
        isPublic: values.isPublic,
      };

      console.log('Sending contract data:', contractData); // Add logging

      const contract = await createContract(contractData);
      if (contract) {
        navigate(getPath(`/contracts/${contract._id}`));
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      // Add more detailed error logging
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (templatesLoading) {
    return <Loader />;
  }

  if (templatesError) {
    return (
      <CreateContractContainer>
        <BackLink to= '/contracts'>
          <FaArrowLeft /> Back to Contracts
        </BackLink>
        <PageTitle>Create New Contract</PageTitle>
        <FormContainer>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>
              {templatesError}
            </p>
            <button
              onClick={() => fetchTemplates()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer'
              }}
            >
              Retry Loading Templates
            </button>
          </div>
        </FormContainer>
      </CreateContractContainer>
    );
  }

  return (
    <CreateContractContainer>
      <BackLink to={getPath('/contracts')}>
        <FaArrowLeft /> Back to Contracts
      </BackLink>
      
      <PageTitle>Create New Contract</PageTitle>
      
      <Formik
        initialValues={{
          title: '',
          description: '',
          templateId: '',
          content: {},
          parties: [{ email: '', role: '' }],
          expiryDate: '',
          isPublic: false,
        }}
        validationSchema={CreateContractSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue, handleChange, handleBlur }) => (
          <Form>
            <FormContainer>
              <FormSection>
                <SectionTitle>Contract Details</SectionTitle>
                
                <FormGroup>
                  <Label htmlFor="title">Contract Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter contract title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                  />
                  <ErrorMessage name="title" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    as="textarea"
                    id="description"
                    name="description"
                    placeholder="Enter contract description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                  />
                  <ErrorMessage name="description" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                  />
                  <ErrorMessage name="expiryDate" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    <Field type="checkbox" name="isPublic" />
                    {' '}Make this contract publicly verifiable
                  </Label>
                </FormGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Select Template</SectionTitle>
                
                <TemplateSelector>
                  {templates.map((template) => (
                    <TemplateCard
                      key={template._id}
                      selected={values.templateId === template._id}
                      onClick={() => {
                        handleTemplateSelect(template);
                        setFieldValue('templateId', template._id);
                        setFieldValue('content', {
                          templateData: template.content,
                          formData: {},
                        });
                      }}
                    >
                      <TemplateTitle>{template.name}</TemplateTitle>
                      <TemplateDescription>{template.description}</TemplateDescription>
                    </TemplateCard>
                  ))}
                </TemplateSelector>
                
                <ErrorMessage name="templateId" component={ErrorText} />
              </FormSection>
              
              <FormSection>
                <SectionTitle>Contract Parties</SectionTitle>
                
                <FieldArray name="parties">
                  {({ remove, push }) => (
                    <>
                      <PartiesList>
                        {values.parties.map((party, index) => (
                          <PartyItem key={index}>
                            <FormGroup>
                              <Label htmlFor={`parties.${index}.email`}>Email</Label>
                              <Input
                                type="email"
                                id={`parties.${index}.email`}
                                name={`parties.${index}.email`}
                                placeholder="Enter email address"
                              />
                              <ErrorMessage name={`parties.${index}.email`} component={ErrorText} />
                            </FormGroup>
                            
                            <FormGroup>
                              <Label htmlFor={`parties.${index}.role`}>Role</Label>
                              <Input
                                type="text"
                                id={`parties.${index}.role`}
                                name={`parties.${index}.role`}
                                placeholder="Enter role (e.g., Buyer, Seller)"
                              />
                              <ErrorMessage name={`parties.${index}.role`} component={ErrorText} />
                            </FormGroup>
                            
                            {index > 0 && (
                              <RemoveButton type="button" onClick={() => remove(index)}>
                                <FaTrash />
                              </RemoveButton>
                            )}
                          </PartyItem>
                        ))}
                      </PartiesList>
                      
                      <AddButton
                        type="button"
                        onClick={() => push({ email: '', role: '' })}
                      >
                        <FaPlus /> Add Party
                      </AddButton>
                    </>
                  )}
                </FieldArray>
              </FormSection>
              
              <SubmitButton type="submit" disabled={isSubmitting || contractLoading}>
                {isSubmitting || contractLoading ? 'Creating...' : 'Create Contract'}
              </SubmitButton>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </CreateContractContainer>
  );
};

export default CreateContractPage;
