import { createContext, useState, useEffect, useContext, useCallback } from 'react';
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

  // Fetch all templates
  const fetchTemplates = useCallback(async (category = '') => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/templates', {
        params: { category }
      });
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError(error.response?.data?.message || 'Error fetching templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all templates for the authenticated user
  useEffect(() => {
    if (isAuthenticated) {
      fetchTemplates();
    }
  }, [isAuthenticated, fetchTemplates]);

  // Fetch template by ID
  const fetchTemplateById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/templates/${id}`);
      setTemplate(data);
      return data;
    } catch (error) {
      console.error('Error fetching template:', error);
      setError(error.response?.data?.message || 'Error fetching template');
      toast.error('Failed to load template details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new template
  const createTemplate = async (templateData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/templates', templateData);
      setTemplates(prevTemplates => [data, ...prevTemplates]);
      toast.success('Template created successfully');
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      setError(error.response?.data?.message || 'Error creating template');
      toast.error('Failed to create template');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update template
  const updateTemplate = async (id, templateData) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/templates/${id}`, templateData);
      
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
      await api.delete(`/templates/${id}`);
      
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
