import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Contract from '../models/contractModel.js';
import Template from '../models/templateModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

// @desc    Create a new contract
// @route   POST /api/contracts
// @access  Private
export const createContract = asyncHandler(async (req, res) => {
  const { title, description, templateId, content, parties, expiryDate, isPublic } = req.body;

  // Verify template exists
  const template = await Template.findById(templateId);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  // Generate a unique verification code
  const verificationCode = uuidv4();

  // Create contract
  const contract = await Contract.create({
    title,
    description,
    templateId,
    creator: req.user._id,
    content,
    parties: parties.map(party => ({
      ...party,
      signed: party.email === req.user.email ? true : false,
      signatureTimestamp: party.email === req.user.email ? new Date() : null,
    })),
    status: 'pending_signatures',
    expiryDate: expiryDate || null,
    isPublic: isPublic || false,
    verificationCode,
    history: [
      {
        action: 'created',
        user: req.user._id,
        details: 'Contract created',
      },
    ],
  });

  if (contract) {
    // Update template usage count
    await Template.findByIdAndUpdate(templateId, { $inc: { usageCount: 1 } });

    // Add contract to user's contracts
    await User.findByIdAndUpdate(req.user._id, {
      $push: { contracts: contract._id },
    });

    // Create notifications for other parties
    const otherParties = parties.filter(party => party.email !== req.user.email);
    
    for (const party of otherParties) {
      // Find user if they exist in the system
      const user = await User.findOne({ email: party.email });
      
      if (user) {
        await Notification.create({
          recipient: user._id,
          type: 'signature_requested',
          title: 'Signature Requested',
          message: `${req.user.name} has requested your signature on "${title}"`,
          contractId: contract._id,
          actionRequired: true,
          actionLink: `/contracts/${contract._id}`,
        });
      }
      
      // In a real app, we would also send an email to non-users
    }

    res.status(201).json(contract);
  } else {
    res.status(400);
    throw new Error('Invalid contract data');
  }
});

// @desc    Get all contracts for a user
// @route   GET /api/contracts
// @access  Private
export const getContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.find({
    $or: [
      { creator: req.user._id },
      { 'parties.user': req.user._id },
      { 'parties.email': req.user.email },
    ],
  })
    .populate('templateId', 'name category')
    .populate('creator', 'name email')
    .sort({ createdAt: -1 });

  res.json(contracts);
});

// @desc    Get contract by ID
// @route   GET /api/contracts/:id
// @access  Private
export const getContractById = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id)
    .populate('templateId')
    .populate('creator', 'name email')
    .populate('parties.user', 'name email');

  if (contract) {
    // Check if user is authorized to view this contract
    const isAuthorized =
      contract.creator.toString() === req.user._id.toString() ||
      contract.parties.some(
        party =>
          (party.user && party.user._id.toString() === req.user._id.toString()) ||
          party.email === req.user.email
      ) ||
      contract.isPublic;

    if (isAuthorized) {
      res.json(contract);
    } else {
      res.status(403);
      throw new Error('Not authorized to access this contract');
    }
  } else {
    res.status(404);
    throw new Error('Contract not found');
  }
});

// @desc    Sign a contract
// @route   PUT /api/contracts/:id/sign
// @access  Private
export const signContract = asyncHandler(async (req, res) => {
  const { signatureHash } = req.body;
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  // Find the party entry for the current user
  const partyIndex = contract.parties.findIndex(
    party =>
      (party.user && party.user.toString() === req.user._id.toString()) ||
      party.email === req.user.email
  );

  if (partyIndex === -1) {
    res.status(403);
    throw new Error('You are not a party to this contract');
  }

  if (contract.parties[partyIndex].signed) {
    res.status(400);
    throw new Error('You have already signed this contract');
  }

  // Update the party's signature status
  contract.parties[partyIndex].signed = true;
  contract.parties[partyIndex].signatureTimestamp = new Date();
  contract.parties[partyIndex].signatureHash = signatureHash;

  // If the user doesn't have a user ID (external user), don't update it
  if (!contract.parties[partyIndex].user && req.user._id) {
    contract.parties[partyIndex].user = req.user._id;
  }

  // Add to history
  contract.history.push({
    action: 'signed',
    user: req.user._id,
    details: `Signed by ${req.user.name}`,
  });

  // Check if all parties have signed
  const allSigned = contract.parties.every(party => party.signed);
  
  if (allSigned) {
    contract.status = 'completed';
    
    // Generate document hash for blockchain storage
    const contentString = JSON.stringify(contract.content);
    const documentHash = crypto
      .createHash('sha256')
      .update(contentString)
      .digest('hex');
    
    contract.documentHash = documentHash;
    
    // In a real application, this is where we would store the hash on the blockchain
    // For now, we'll simulate it
    contract.blockchainData = {
      stored: true,
      transactionHash: '0x' + crypto.randomBytes(32).toString('hex'),
      blockNumber: Math.floor(Math.random() * 1000000),
      timestamp: new Date(),
      network: 'Ethereum',
    };
    
    contract.history.push({
      action: 'completed',
      details: 'All parties have signed the contract',
    });
    
    // Notify all parties
    for (const party of contract.parties) {
      if (party.user) {
        await Notification.create({
          recipient: party.user,
          type: 'contract_completed',
          title: 'Contract Completed',
          message: `All parties have signed "${contract.title}"`,
          contractId: contract._id,
        });
      }
    }
  }

  await contract.save();

  // Notify contract creator
  if (req.user._id.toString() !== contract.creator.toString()) {
    await Notification.create({
      recipient: contract.creator,
      type: 'contract_signed',
      title: 'Contract Signed',
      message: `${req.user.name} has signed "${contract.title}"`,
      contractId: contract._id,
    });
  }

  res.json(contract);
});

// @desc    Verify a contract
// @route   GET /api/contracts/verify/:code
// @access  Public
export const verifyContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({ verificationCode: req.params.code })
    .populate('templateId', 'name category')
    .populate('creator', 'name')
    .populate('parties.user', 'name');

  if (contract) {
    // For public verification, return limited data
    const verificationData = {
      title: contract.title,
      status: contract.status,
      createdAt: contract.createdAt,
      creator: contract.creator.name,
      template: contract.templateId.name,
      category: contract.templateId.category,
      parties: contract.parties.map(party => ({
        role: party.role,
        signed: party.signed,
        signatureTimestamp: party.signatureTimestamp,
      })),
      blockchainData: contract.blockchainData,
      documentHash: contract.documentHash,
      isVerified: contract.status === 'completed' && contract.blockchainData.stored,
    };

    res.json(verificationData);
  } else {
    res.status(404);
    throw new Error('Contract not found');
  }
});
