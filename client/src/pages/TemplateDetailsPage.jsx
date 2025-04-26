import { useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaEdit, FaTrash, FaFileContract } from 'react-icons/fa';
import TemplateContext from '../context/TemplateContext';
import AuthContext from '../context/AuthContext';
import Loader from '../components/common/Loader';

// Base path for the application
const BASE_PATH = '/proxy/3000';

const TemplateContainer = styled.div`
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

const TemplateHeader = styled.div`
  margin-bottom: 2rem;
`;

const TemplateTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const TemplateDescription = styled.p`
  color: var(--dark-gray);
  margin-bottom: 1rem;
`;

const TemplateMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: var(--light-gray);
`;

const TemplateContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContentSection = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-gray);
`;

const DocumentContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
`;

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldItem = styled.div`
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
`;

const FieldName = styled.div`
  font-weight: 500;
  margin-bottom: 0.3rem;
`;

const FieldDetails = styled.div`
  font-size: 0.9rem;
  color: var(--dark-gray);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FieldDetail = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.danger ? 'var(--danger-color)' : 'var(--primary-color)'};
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: ${props => props.danger ? '#c50322' : '#2a75e8'};
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CreateContractButton = styled(Link)`
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
  text-align: center;
  
  &:hover {
    background-color: #7028d8;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    color: white;
  }
`;

const TemplateDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { template, loading, fetchTemplateById, deleteTemplate } = useContext(TemplateContext);
  const { user } = useContext(AuthContext);

  // Helper function to prepend base path to routes
  const getPath = (path) => `${BASE_PATH}${path}`;

  useEffect(() => {
    fetchTemplateById(id);
  }, [fetchTemplateById, id]);

  const formatCategory = (category) => {
    if (!category) return '';
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const success = await deleteTemplate(id);
      if (success) {
        navigate(getPath('/templates'));
      }
    }
  };

  const isCreator = template && user && template.creator && template.creator._id === user._id;

  if (loading || !template) {
    return <Loader />;
  }

  return (
    <TemplateContainer>
      <BackLink to={getPath('/templates')}>
        <FaArrowLeft /> Back to Templates
      </BackLink>
      
      <TemplateHeader>
        <TemplateTitle>{template.name}</TemplateTitle>
        <TemplateDescription>{template.description}</TemplateDescription>
        
        <TemplateMeta>
          <MetaItem>
            <strong>Category:</strong>{' '}
            <CategoryBadge>{formatCategory(template.category)}</CategoryBadge>
          </MetaItem>
          <MetaItem>
            <strong>Created:</strong> {formatDate(template.createdAt)}
          </MetaItem>
          <MetaItem>
            <strong>Creator:</strong> {template.creator?.name || 'System'}
          </MetaItem>
          <MetaItem>
            <strong>Usage:</strong> {template.usageCount} contracts
          </MetaItem>
        </TemplateMeta>
      </TemplateHeader>
      
      <TemplateContent>
        <div>
          <ContentSection>
            <SectionTitle>Template Content</SectionTitle>
            <DocumentContent>
              <h3>{template.content.title}</h3>
              <p>{template.content.body}</p>
            </DocumentContent>
          </ContentSection>
        </div>
        
        <div>
          <ContentSection>
            <SectionTitle>Template Fields</SectionTitle>
            <FieldsList>
              {template.fields.map((field, index) => (
                <FieldItem key={index}>
                  <FieldName>{field.label}</FieldName>
                  <FieldDetails>
                    <FieldDetail>
                      <strong>Name:</strong> {field.name}
                    </FieldDetail>
                    <FieldDetail>
                      <strong>Type:</strong> {field.type}
                    </FieldDetail>
                    <FieldDetail>
                      <strong>Required:</strong> {field.required ? 'Yes' : 'No'}
                    </FieldDetail>
                  </FieldDetails>
                </FieldItem>
              ))}
            </FieldsList>
          </ContentSection>
          
          <ContentSection>
            <SectionTitle>Actions</SectionTitle>
            <CreateContractButton to={getPath(`/contracts/create?template=${template._id}`)}>
              <FaFileContract /> Create Contract with this Template
            </CreateContractButton>
            
            {isCreator && (
              <>
                <ActionButton onClick={() => navigate(getPath(`/templates/edit/${template._id}`))}>
                  <FaEdit /> Edit Template
                </ActionButton>
                <ActionButton danger onClick={handleDelete}>
                  <FaTrash /> Delete Template
                </ActionButton>
              </>
            )}
          </ContentSection>
        </div>
      </TemplateContent>
    </TemplateContainer>
  );
};

export default TemplateDetailsPage;
