import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import TemplateContext from '../context/TemplateContext';
import Loader from '../components/common/Loader';

// Base path for the application
const BASE_PATH = '/proxy/3000';

const CreateTemplateContainer = styled.div`
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

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FieldItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const CreateTemplateSchema = Yup.object().shape({
  name: Yup.string().required('Template name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  content: Yup.object().required('Content is required'),
  fields: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Field name is required'),
      label: Yup.string().required('Field label is required'),
      type: Yup.string().required('Field type is required'),
    })
  ).min(1, 'At least one field is required'),
  isPublic: Yup.boolean(),
});

const CreateTemplatePage = () => {
  const navigate = useNavigate();
  const { createTemplate, loading } = useContext(TemplateContext);

  // Helper function to prepend base path to routes
  const getPath = (path) => `${BASE_PATH}${path}`;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const template = await createTemplate(values);
      if (template) {
        navigate(getPath('/templates'));
      }
    } catch (error) {
      console.error('Error creating template:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CreateTemplateContainer>
      <BackLink to={getPath('/templates')}>
        <FaArrowLeft /> Back to Templates
      </BackLink>
      
      <PageTitle>Create New Template</PageTitle>
      
      <Formik
        initialValues={{
          name: '',
          description: '',
          category: '',
          content: {
            title: '',
            body: '',
          },
          fields: [
            {
              name: 'party1Name',
              label: 'Party 1 Name',
              type: 'text',
              required: true,
            },
            {
              name: 'party2Name',
              label: 'Party 2 Name',
              type: 'text',
              required: true,
            },
          ],
          isPublic: true,
        }}
        validationSchema={CreateTemplateSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormSection>
                <SectionTitle>Template Details</SectionTitle>
                
                <FormGroup>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter template name"
                  />
                  <ErrorMessage name="name" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    as="textarea"
                    id="description"
                    name="description"
                    placeholder="Enter template description"
                  />
                  <ErrorMessage name="description" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    as="select"
                    id="category"
                    name="category"
                  >
                    <option value="">Select a category</option>
                    <option value="property_deed">Property Deed</option>
                    <option value="will">Will</option>
                    <option value="marriage_license">Marriage License</option>
                    <option value="business_agreement">Business Agreement</option>
                    <option value="employment_contract">Employment Contract</option>
                    <option value="other">Other</option>
                  </Select>
                  <ErrorMessage name="category" component={ErrorText} />
                </FormGroup>
                
                <CheckboxContainer>
                  <Field type="checkbox" id="isPublic" name="isPublic" />
                  <Label htmlFor="isPublic" style={{ display: 'inline', marginBottom: 0 }}>
                    Make this template public
                  </Label>
                </CheckboxContainer>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Template Content</SectionTitle>
                
                <FormGroup>
                  <Label htmlFor="content.title">Document Title</Label>
                  <Input
                    type="text"
                    id="content.title"
                    name="content.title"
                    placeholder="Enter document title"
                  />
                  <ErrorMessage name="content.title" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="content.body">Document Body</Label>
                  <Textarea
                    as="textarea"
                    id="content.body"
                    name="content.body"
                    placeholder="Enter document body text"
                    rows={10}
                  />
                  <ErrorMessage name="content.body" component={ErrorText} />
                </FormGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Template Fields</SectionTitle>
                <p className="mb-4">
                  Define the fields that users will need to fill when creating a contract from this template.
                </p>
                
                <FieldArray name="fields">
                  {({ remove, push }) => (
                    <>
                      <FieldsList>
                        {values.fields.map((field, index) => (
                          <FieldItem key={index}>
                            <FormGroup>
                              <Label htmlFor={`fields.${index}.name`}>Field Name</Label>
                              <Input
                                type="text"
                                id={`fields.${index}.name`}
                                name={`fields.${index}.name`}
                                placeholder="e.g., partyName"
                              />
                              <ErrorMessage name={`fields.${index}.name`} component={ErrorText} />
                            </FormGroup>
                            
                            <FormGroup>
                              <Label htmlFor={`fields.${index}.label`}>Field Label</Label>
                              <Input
                                type="text"
                                id={`fields.${index}.label`}
                                name={`fields.${index}.label`}
                                placeholder="e.g., Party Name"
                              />
                              <ErrorMessage name={`fields.${index}.label`} component={ErrorText} />
                            </FormGroup>
                            
                            <FormGroup>
                              <Label htmlFor={`fields.${index}.type`}>Field Type</Label>
                              <Select
                                as="select"
                                id={`fields.${index}.type`}
                                name={`fields.${index}.type`}
                              >
                                <option value="">Select Type</option>
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="select">Select</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="textarea">Text Area</option>
                                <option value="signature">Signature</option>
                              </Select>
                              <ErrorMessage name={`fields.${index}.type`} component={ErrorText} />
                            </FormGroup>
                            
                            <div>
                              <CheckboxContainer>
                                <Field
                                  type="checkbox"
                                  id={`fields.${index}.required`}
                                  name={`fields.${index}.required`}
                                />
                                <Label htmlFor={`fields.${index}.required`} style={{ display: 'inline', marginBottom: 0 }}>
                                  Required
                                </Label>
                              </CheckboxContainer>
                              
                              {index > 0 && (
                                <RemoveButton type="button" onClick={() => remove(index)}>
                                  <FaTrash />
                                </RemoveButton>
                              )}
                            </div>
                          </FieldItem>
                        ))}
                      </FieldsList>
                      
                      <AddButton
                        type="button"
                        onClick={() => push({
                          name: '',
                          label: '',
                          type: '',
                          required: false,
                        })}
                      >
                        <FaPlus /> Add Field
                      </AddButton>
                    </>
                  )}
                </FieldArray>
              </FormSection>
              
              <SubmitButton type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? 'Creating...' : 'Create Template'}
              </SubmitButton>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </CreateTemplateContainer>
  );
};

export default CreateTemplatePage;
