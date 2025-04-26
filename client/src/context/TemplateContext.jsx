import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import AuthContext from './AuthContext';

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch all templates for the authenticated user
  useEffect(() => {
    if (isAuthenticated) {
      fetchTemplates();
    }
  }, [isAuthenticated]);

  // Fetch all templates
  const fetchTemplates = async (category = '') => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/templates', {
        params: { category }
      });
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching templates');
      setLoading(false);
      toast.error('Failed to load templates');
    }
  };

  // Fetch template by ID
  const fetchTemplateById = async (id) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/templates/${id}`);
      setTemplate(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching template');
      setLoading(false);
      toast.error('Failed to load template details');
      return null;
    }
  };

  // Create new template
  const createTemplate = async (templateData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/templates', templateData);
      setTemplates([data, ...templates]);
      setLoading(false);
      toast.success('Template created successfully');
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating template');
      setLoading(false);
      toast.error('Failed to create template');
      return null;
    }
  };

  // Update template
  const updateTemplate = async (id, templateData) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/api/templates/${id}`, templateData);
      
      // Update templates list
      setTemplates(
        templates.map((t) => (t._id === id ? data : t))
      );
      
      // Update current template if it's the one being viewed
      if (template && template._id === id) {
        setTemplate(data);
      }
      
      setLoading(false);
      toast.success('Template updated successfully');
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating template');
      setLoading(false);
      toast.error('Failed to update template');
      return null;
    }
  };

  // Delete template
  const deleteTemplate = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/templates/${id}`);
      
      // Remove from templates list
      setTemplates(templates.filter((t) => t._id !== id));
      
      // Clear current template if it's the one being deleted
      if (template && template._id === id) {
        setTemplate(null);
      }
      
      setLoading(false);
      toast.success('Template deleted successfully');
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting template');
      setLoading(false);
      toast.error('Failed to delete template');
      return false;
    }
  };

  // Clear current template
  const clearTemplate = () => {
    setTemplate(null);
  };

  return (
    <TemplateContext.Provider
      value={{
        templates,
        template,
        loading,
        error,
        fetchTemplates,
        fetchTemplateById,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        clearTemplate
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateContext;
