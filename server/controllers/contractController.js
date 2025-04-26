import asyncHandler from 'express-async-handler';
import Contract from '../models/contractModel.js';
import { ethers } from 'ethers';

// @desc    Create a new contract
// @route   POST /api/contracts
// @access  Private
export const createContract = asyncHandler(async (req, res) => {
  try {
    const { title, content, parties, expiryDate, templateId, isPublic } = req.body;
    
    console.log('Received contract data:', { title, content, parties, expiryDate, templateId, isPublic });

    // Create the contract with the correct field mapping
  const contract = await Contract.create({
    title,
      content,
    creator: req.user._id,
      parties: [], // Initialize with empty array, we'll handle parties separately
    expiryDate,
    templateId,
    status: 'pending',
  });
    
    console.log('Contract created:', contract);

  if (contract) {
    res.status(201).json(contract);
  } else {
    res.status(400);
    throw new Error('Invalid contract data');
    }
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ message: error.message || 'Error creating contract' });
  }
});

// @desc    Get all contracts for a user
// @route   GET /api/contracts
// @access  Private
export const getContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.find({
    $or: [
      { creator: req.user._id },
      { parties: req.user._id },
    ],
  })
    .populate('creator', 'name email')
    .populate('parties', 'name email')
    .sort({ createdAt: -1 });

  res.json(contracts);
});

// @desc    Get contract by ID
// @route   GET /api/contracts/:id
// @access  Private
export const getContractById = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id)
    .populate('creator', 'name email walletAddress')
    .populate('parties', 'name email walletAddress')
    .populate('templateId');

  if (contract) {
    // Check if user is authorized to view this contract
    if (
      contract.creator._id.toString() === req.user._id.toString() ||
      contract.parties.some(party => party._id.toString() === req.user._id.toString())
    ) {
      res.json(contract);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this contract');
    }
  } else {
    res.status(404);
    throw new Error('Contract not found');
  }
});

// @desc    Update a contract
// @route   PUT /api/contracts/:id
// @access  Private
export const updateContract = asyncHandler(async (req, res) => {
  const { title, content, parties, expiryDate, status } = req.body;

  const contract = await Contract.findById(req.params.id);

  if (contract) {
    // Only creator can update the contract
    if (contract.creator.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this contract');
    }

    // Can only update if contract is in draft or pending status
    if (contract.status !== 'draft' && contract.status !== 'pending') {
      res.status(400);
      throw new Error('Cannot update a contract that has been signed or expired');
    }

    contract.title = title || contract.title;
    contract.content = content || contract.content;
    contract.parties = parties || contract.parties;
    contract.expiryDate = expiryDate || contract.expiryDate;
    contract.status = status || contract.status;

    const updatedContract = await contract.save();
    res.json(updatedContract);
  } else {
    res.status(404);
    throw new Error('Contract not found');
  }
});

// @desc    Delete a contract
// @route   DELETE /api/contracts/:id
// @access  Private
export const deleteContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id);

  if (contract) {
    // Only creator can delete the contract
    if (contract.creator.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this contract');
    }

    // Can only delete if contract is in draft or pending status
    if (contract.status !== 'draft' && contract.status !== 'pending') {
      res.status(400);
      throw new Error('Cannot delete a contract that has been signed or expired');
    }

    await contract.remove();
    res.json({ message: 'Contract removed' });
  } else {
    res.status(404);
    throw new Error('Contract not found');
  }
});

// @desc    Sign a contract
// @route   POST /api/contracts/:id/sign
// @access  Private
export const signContract = asyncHandler(async (req, res) => {
  const { signature, walletAddress } = req.body;

  const contract = await Contract.findById(req.params.id);

  if (contract) {
    // Check if user is a party to this contract
    const isParty = contract.parties.some(
      party => party.toString() === req.user._id.toString()
    );

    if (!isParty && contract.creator.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to sign this contract');
    }

    // Check if contract is in pending status
    if (contract.status !== 'pending') {
      res.status(400);
      throw new Error('Contract is not in pending status');
    }

    // Check if user has already signed
    const alreadySigned = contract.signatures.some(
      sig => sig.user.toString() === req.user._id.toString()
    );

    if (alreadySigned) {
      res.status(400);
      throw new Error('You have already signed this contract');
    }

    // Add signature
    contract.signatures.push({
      user: req.user._id,
      signature,
      walletAddress,
    });

    // Check if all parties have signed
    const requiredSigners = [...contract.parties, contract.creator];
    const allSigned = requiredSigners.every(signer =>
      contract.signatures.some(sig => sig.user.toString() === signer.toString())
    );

    if (allSigned) {
      contract.status = 'signed';
      
      // Store on blockchain (simplified for now)
      try {
        // This is a placeholder for actual blockchain integration
        const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER);
        const wallet = new ethers.Wallet('0x' + process.env.PRIVATE_KEY, provider);
        
        // In a real implementation, you would deploy a smart contract or use an existing one
        // This is just a placeholder to show the concept
        const contractHash = ethers.utils.id(JSON.stringify({
          content: contract.content,
          signatures: contract.signatures,
          timestamp: new Date().toISOString()
        }));
        
        contract.blockchainTxHash = contractHash;
        contract.blockchainAddress = wallet.address;
      } catch (error) {
        console.error('Blockchain storage error:', error);
        // Continue even if blockchain storage fails
      }
    }

    const updatedContract = await contract.save();
    res.json(updatedContract);
  } else {
    res.status(404);
    throw new Error('Contract not found');
  }
});
