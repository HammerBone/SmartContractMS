import asyncHandler from 'express-async-handler';
import Template from '../models/templateModel.js';

// @desc    Create a new template
// @route   POST /api/templates
// @access  Private
export const createTemplate = asyncHandler(async (req, res) => {
  const { name, description, category, content, fields, isPublic } = req.body;

  const template = await Template.create({
    name,
    description,
    category,
    content,
    fields,
    isPublic: isPublic !== undefined ? isPublic : true,
    creator: req.user._id,
  });

  if (template) {
    res.status(201).json(template);
  } else {
    res.status(400);
    throw new Error('Invalid template data');
  }
});

// @desc    Get all templates
// @route   GET /api/templates
// @access  Private
export const getTemplates = asyncHandler(async (req, res) => {
  const { category } = req.query;
  
  let query = {
    $or: [
      { isPublic: true },
      { creator: req.user._id },
    ],
  };
  
  if (category) {
    query.category = category;
  }
  
  const templates = await Template.find(query)
    .populate('creator', 'name')
    .sort({ usageCount: -1 });

  res.json(templates);
});

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Private
export const getTemplateById = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id).populate(
    'creator',
    'name email'
  );

  if (template) {
    // Check if user is authorized to view this template
    const isAuthorized =
      template.isPublic ||
      (template.creator && template.creator._id.toString() === req.user._id.toString());

    if (isAuthorized) {
      res.json(template);
    } else {
      res.status(403);
      throw new Error('Not authorized to access this template');
    }
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Update a template
// @route   PUT /api/templates/:id
// @access  Private
export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (template) {
    // Only the creator can update the template
    if (template.creator.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this template');
    }

    template.name = req.body.name || template.name;
    template.description = req.body.description || template.description;
    template.category = req.body.category || template.category;
    template.content = req.body.content || template.content;
    template.fields = req.body.fields || template.fields;
    
    if (req.body.isPublic !== undefined) {
      template.isPublic = req.body.isPublic;
    }

    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Delete a template
// @route   DELETE /api/templates/:id
// @access  Private
export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (template) {
    // Only the creator can delete the template
    if (template.creator.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this template');
    }

    await Template.deleteOne({ _id: template._id });
    res.json({ message: 'Template removed' });
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});
