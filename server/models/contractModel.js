import mongoose from 'mongoose';

const contractSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parties: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        email: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
        signed: {
          type: Boolean,
          default: false,
        },
        signatureTimestamp: {
          type: Date,
        },
        signatureHash: {
          type: String,
        },
      },
    ],
    content: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending_signatures', 'completed', 'expired', 'cancelled'],
      default: 'draft',
    },
    blockchainData: {
      stored: {
        type: Boolean,
        default: false,
      },
      transactionHash: {
        type: String,
      },
      blockNumber: {
        type: Number,
      },
      timestamp: {
        type: Date,
      },
      network: {
        type: String,
      },
    },
    documentHash: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      unique: true,
    },
    history: [
      {
        action: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        details: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
