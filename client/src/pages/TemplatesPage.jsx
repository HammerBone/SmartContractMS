import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFileAlt, FaPlus, FaFilter } from 'react-icons/fa';
import TemplateContext from '../context/TemplateContext';
import Loader from '../components/common/Loader';

// Base path for the application
const BASE_PATH = '/proxy/3000';

const TemplatesContainer = styled.div`
  padding: 2rem 0;
`;

const TemplatesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2a75e8;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    color: white;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--light-gray)'};
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-color);
    color: ${props => props.active ? 'white' : 'var(--primary-color)'};
  }
`;

const TemplatesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TemplateCard = styled(Link)`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
  color: var(--text-color);
  text-decoration: none;
  display: block;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const TemplateIcon = styled.div`
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const TemplateTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const TemplateDescription = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TemplateMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--medium-gray);
`;

const TemplateCategory = styled.span`
  padding: 0.3rem 0.6rem;
  background-color: var(--light-gray);
  border-radius: 20px;
  font-size: 0.7rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: var(--medium-gray);
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
`;

const CategorySelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TemplatesPage = () => {
  const { templates, loading, error, fetchTemplates } = useContext(TemplateContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = (template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <TemplatesContainer>
        <PageTitle>Contract Templates</PageTitle>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>
            {error}
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
      </TemplatesContainer>
    );
  }

  return (
    <TemplatesContainer>
      <TemplatesHeader>
        <PageTitle>Contract Templates</PageTitle>
        <CreateButton to="/templates/create">
          <FaPlus /> Create Template
        </CreateButton>
      </TemplatesHeader>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CategorySelect
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="employment">Employment</option>
          <option value="sales">Sales</option>
          <option value="service">Service</option>
          <option value="rental">Rental</option>
          <option value="other">Other</option>
        </CategorySelect>
      </SearchContainer>

      <TemplatesGrid>
        {filteredTemplates.map(template => (
          <TemplateCard key={template._id} to={`${BASE_PATH}/templates/${template._id}`}>
            <TemplateIcon>
              <FaFileAlt />
            </TemplateIcon>
            <TemplateTitle>{template.name}</TemplateTitle>
            <TemplateDescription>{template.description}</TemplateDescription>
            <TemplateMeta>
              <TemplateCategory>
                {template.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </TemplateCategory>
              <span>Used {template.usageCount} times</span>
            </TemplateMeta>
          </TemplateCard>
        ))}
      </TemplatesGrid>
    </TemplatesContainer>
  );
};

export default TemplatesPage;
