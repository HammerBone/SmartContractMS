import mongoose from 'mongoose';

const templateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['property_deed', 'will', 'marriage_license', 'business_agreement', 'employment_contract', 'other'],
    },
    content: {
      type: Object,
      required: true,
    },
    fields: [
      {
        name: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
          enum: ['text', 'number', 'date', 'select', 'checkbox', 'textarea', 'signature'],
        },
        required: {
          type: Boolean,
          default: false,
        },
        options: [String], // For select fields
        placeholder: String,
        defaultValue: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model('Template', templateSchema);

export default Template;
