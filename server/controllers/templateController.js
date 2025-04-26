import asyncHandler from 'express-async-handler';
import Template from '../models/templateModel.js';

// @desc    Create a new template
// @route   POST /api/templates
// @access  Private
export const createTemplate = asyncHandler(async (req, res) => {
  const { title, description, content, category, fields, isPublic } = req.body;

  const template = await Template.create({
    title,
    description,
    content,
    category,
    fields,
    creator: req.user._id,
    isPublic: isPublic || false,
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
  // Get public templates and user's own templates
  const templates = await Template.find({
    $or: [
      { isPublic: true },
      { creator: req.user._id },
    ],
  })
    .populate('creator', 'name')
    .sort({ createdAt: -1 });

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
    // Check if template is public or user is the creator
    if (template.isPublic || template.creator._id.toString() === req.user._id.toString()) {
      res.json(template);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this template');
    }
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Update a template
// @route   PUT /api/templates/:id
// @access  Private/Admin
export const updateTemplate = asyncHandler(async (req, res) => {
  const { title, description, content, category, isPublic } = req.body;

  const template = await Template.findById(req.params.id);

  if (template) {
    template.title = title || template.title;
    template.description = description || template.description;
    template.content = content || template.content;
    template.category = category || template.category;
    template.isPublic = isPublic !== undefined ? isPublic : template.isPublic;

    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Delete a template
// @route   DELETE /api/templates/:id
// @access  Private/Admin
export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (template) {
    await template.remove();
    res.json({ message: 'Template removed' });
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});
