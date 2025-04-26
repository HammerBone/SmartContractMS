import asyncHandler from 'express-async-handler';
import Contract from '../models/contractModel.js';
import { ethers } from 'ethers';

// @desc    Verify a contract's authenticity
// @route   GET /api/verify/:id
// @access  Public
export const verifyContract = asyncHandler(async (req, res) => {
  // Find contract by ID instead of verification code
  const contract = await Contract.findById(req.params.id)
    .populate('creator', 'name email')
    .populate('parties', 'name email');

  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  // Only verify signed contracts
  if (contract.status !== 'signed') {
    res.status(400);
    throw new Error('Contract is not signed and cannot be verified');
  }

  // Verify blockchain record if available
  let blockchainVerified = false;
  if (contract.blockchainTxHash) {
    try {
      // In a real implementation, you would verify the contract on the blockchain
      // This is just a placeholder to show the concept
      const contractHash = ethers.utils.id(JSON.stringify({
        content: contract.content,
        signatures: contract.signatures,
        timestamp: contract.updatedAt
      }));
      
      blockchainVerified = contractHash === contract.blockchainTxHash;
    } catch (error) {
      console.error('Blockchain verification error:', error);
    }
  }

  res.json({
    verified: true,
    blockchainVerified,
    contract: {
      title: contract.title,
      createdAt: contract.createdAt,
      signedAt: contract.updatedAt,
      creator: {
        name: contract.creator.name,
        email: contract.creator.email,
      },
      parties: contract.parties.map(party => ({
        name: party.name,
        email: party.email,
      })),
      signatures: contract.signatures.length,
    },
  });
});

// @desc    Get verification history for user's contracts
// @route   GET /api/verify/history
// @access  Private
export const getVerificationHistory = asyncHandler(async (req, res) => {
  // This would typically be stored in a separate collection
  // For now, we'll just return the user's signed contracts
  const contracts = await Contract.find({
    $or: [
      { creator: req.user._id },
      { parties: req.user._id },
    ],
    status: 'signed',
  })
    .select('title createdAt updatedAt blockchainTxHash')
    .sort({ updatedAt: -1 });

  res.json(contracts);
});
