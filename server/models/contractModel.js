import mongoose from 'mongoose';

const signatureSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    signature: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    walletAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const contractSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    parties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    signatures: [signatureSchema],
    status: {
      type: String,
      required: true,
      enum: ['draft', 'pending', 'signed', 'expired', 'cancelled'],
      default: 'draft',
    },
    expiryDate: {
      type: Date,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
    },
    blockchainTxHash: {
      type: String,
    },
    blockchainAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
