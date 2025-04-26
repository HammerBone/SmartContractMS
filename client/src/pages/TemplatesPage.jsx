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

const TemplatesPage = () => {
  const { templates, loading, fetchTemplates } = useContext(TemplateContext);
  const [activeCategory, setActiveCategory] = useState('all');

  // Helper function to prepend base path to routes
  const getPath = (path) => `${BASE_PATH}${path}`;

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      fetchTemplates();
    } else {
      fetchTemplates(category);
    }
  };

  const formatCategory = (category) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <TemplatesContainer>
      <TemplatesHeader>
        <PageTitle>Contract Templates</PageTitle>
        <CreateButton to={getPath('/templates/create')}>
          <FaPlus /> Create Template
        </CreateButton>
      </TemplatesHeader>

      <FilterContainer>
        <FilterButton
          active={activeCategory === 'all'}
          onClick={() => handleCategoryFilter('all')}
        >
          <FaFilter /> All
        </FilterButton>
        <FilterButton
          active={activeCategory === 'property_deed'}
          onClick={() => handleCategoryFilter('property_deed')}
        >
          Property Deed
        </FilterButton>
        <FilterButton
          active={activeCategory === 'will'}
          onClick={() => handleCategoryFilter('will')}
        >
          Will
        </FilterButton>
        <FilterButton
          active={activeCategory === 'marriage_license'}
          onClick={() => handleCategoryFilter('marriage_license')}
        >
          Marriage License
        </FilterButton>
        <FilterButton
          active={activeCategory === 'business_agreement'}
          onClick={() => handleCategoryFilter('business_agreement')}
        >
          Business Agreement
        </FilterButton>
        <FilterButton
          active={activeCategory === 'employment_contract'}
          onClick={() => handleCategoryFilter('employment_contract')}
        >
          Employment Contract
        </FilterButton>
      </FilterContainer>

      {loading ? (
        <Loader />
      ) : templates.length > 0 ? (
        <TemplatesList>
          {templates.map((template) => (
            <TemplateCard key={template._id} to={getPath(`/templates/${template._id}`)}>
              <TemplateIcon>
                <FaFileAlt />
              </TemplateIcon>
              <TemplateTitle>{template.name}</TemplateTitle>
              <TemplateDescription>{template.description}</TemplateDescription>
              <TemplateMeta>
                <TemplateCategory>
                  {formatCategory(template.category)}
                </TemplateCategory>
                <span>Used {template.usageCount} times</span>
              </TemplateMeta>
            </TemplateCard>
          ))}
        </TemplatesList>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <FaFileAlt />
          </EmptyStateIcon>
          <EmptyStateText>No templates found for this category.</EmptyStateText>
          <CreateButton to={getPath('/templates/create')}>
            <FaPlus /> Create Your First Template
          </CreateButton>
        </EmptyState>
      )}
    </TemplatesContainer>
  );
};

export default TemplatesPage;
