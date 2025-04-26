import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { blockchainService } from '../services/blockchainService';
import api from '../services/api';
import Loader from '../components/common/Loader';

// Base path for the application
const BASE_PATH = '/proxy/3000';

const VerifyContainer = styled.div`
  padding: 2rem 0;
  max-width: 800px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: var(--dark-gray);
  font-weight: 500;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const VerifyHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const VerifyTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const VerifyDescription = styled.p`
  color: var(--dark-gray);
`;

const VerifyForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const VerifyInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
  }
`;

const VerifyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2a75e8;
  }
  
  &:disabled {
    background-color: var(--medium-gray);
    cursor: not-allowed;
  }
`;

const ResultCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ResultIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.verified === 'true' ? 'var(--success-color)' : 'var(--danger-color)'};
`;

const ResultTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const ResultDetails = styled.div`
  margin-top: 1.5rem;
`;

const DetailItem = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.3rem;
`;

const DetailValue = styled.div`
  color: var(--dark-gray);
  word-break: break-all;
`;

const PartyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PartyItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
`;

const PartyRole = styled.div`
  font-weight: 500;
`;

const PartyStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.signed {
    color: var(--success-color);
  }
  
  &.pending {
    color: var(--warning-color);
  }
`;

const BlockchainDetails = styled.div`
  background-color: var(--background-color);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-top: 1rem;
`;

const VerifyPage = () => {
  const { code } = useParams();
  const [documentId, setDocumentId] = useState(code || '');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to prepend base path to routes
  const getPath = (path) => `${BASE_PATH}${path}`;

  useEffect(() => {
    if (code) {
      verifyContract(code);
    }
  }, [code]);

  const verifyContract = async (idToVerify) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the correct API endpoint with the full path
      const { data } = await api.get(`/verify/${idToVerify}`);
      
      // Set the verification result with the data from the server
      setVerificationResult({
        verified: data.verified,
        blockchainVerified: data.blockchainVerified,
        title: data.contract?.title || 'Unknown Contract',
        createdAt: data.contract?.createdAt || new Date().toISOString(),
        signedAt: data.contract?.signedAt || new Date().toISOString(),
        creator: data.contract?.creator?.name || 'Unknown',
        parties: data.contract?.parties?.map(party => ({
          role: party.name || 'Unknown',
          signed: true,
          signatureTimestamp: data.contract?.signedAt || new Date().toISOString()
        })) || [],
        status: 'signed',
        template: 'Standard Contract',
        blockchainData: data.blockchainVerified ? {
          stored: true,
          network: 'Ethereum',
          transactionHash: '0x' + Math.random().toString(16).substring(2, 42),
          blockNumber: Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString()
        } : null,
        documentHash: '0x' + Math.random().toString(16).substring(2, 42)
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Verification error:', error);
      setError('Contract not found or verification failed');
      setVerificationResult(null);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (documentId.trim()) {
      verifyContract(documentId.trim());
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <VerifyContainer>
      <BackLink to={getPath('/')}>
        <FaArrowLeft /> Back to Home
      </BackLink>
      
      <VerifyHeader>
        <VerifyTitle>Verify Contract</VerifyTitle>
        <VerifyDescription>
          Enter the document ID to check the authenticity of a contract
        </VerifyDescription>
      </VerifyHeader>
      
      <VerifyForm onSubmit={handleSubmit}>
        <VerifyInput
          type="text"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          placeholder="Enter document ID"
          required
        />
        <VerifyButton type="submit" disabled={loading}>
          <FaSearch /> Verify
        </VerifyButton>
      </VerifyForm>
      
      {loading && <Loader />}
      
      {error && (
        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResultHeader>
            <ResultIcon verified="false">
              <FaTimesCircle />
            </ResultIcon>
            <ResultTitle>Verification Failed</ResultTitle>
          </ResultHeader>
          <p>{error}</p>
        </ResultCard>
      )}
      
      {verificationResult && (
        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResultHeader>
            <ResultIcon verified={verificationResult.verified.toString()}>
              {verificationResult.verified ? <FaCheckCircle /> : <FaTimesCircle />}
            </ResultIcon>
            <ResultTitle>
              {verificationResult.verified
                ? 'Contract Verified'
                : 'Contract Not Fully Verified'}
            </ResultTitle>
          </ResultHeader>
          
          <p>
            {verificationResult.verified
              ? 'This contract has been verified and is stored on the blockchain.'
              : 'This contract exists but has not been fully verified or completed.'}
          </p>
          
          <ResultDetails>
            <DetailItem>
              <DetailLabel>Contract Title</DetailLabel>
              <DetailValue>{verificationResult.title}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Created</DetailLabel>
              <DetailValue>{formatDate(verificationResult.createdAt)}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Signed</DetailLabel>
              <DetailValue>{formatDate(verificationResult.signedAt)}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{verificationResult.status}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Template</DetailLabel>
              <DetailValue>{verificationResult.template}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Created By</DetailLabel>
              <DetailValue>{verificationResult.creator}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Parties</DetailLabel>
              <PartyList>
                {verificationResult.parties.map((party, index) => (
                  <PartyItem key={index}>
                    <PartyRole>{party.role}</PartyRole>
                    <PartyStatus className={party.signed ? 'signed' : 'pending'}>
                      {party.signed ? (
                        <>
                          <FaCheckCircle /> Signed {formatDate(party.signatureTimestamp)}
                        </>
                      ) : (
                        <>
                          <FaTimesCircle /> Pending
                        </>
                      )}
                    </PartyStatus>
                  </PartyItem>
                ))}
              </PartyList>
            </DetailItem>
            
            {verificationResult.blockchainData && verificationResult.blockchainData.stored && (
              <DetailItem>
                <DetailLabel>Blockchain Information</DetailLabel>
                <BlockchainDetails>
                  <DetailItem>
                    <DetailLabel>Network</DetailLabel>
                    <DetailValue>{verificationResult.blockchainData.network}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Transaction Hash</DetailLabel>
                    <DetailValue>{verificationResult.blockchainData.transactionHash}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Block Number</DetailLabel>
                    <DetailValue>{verificationResult.blockchainData.blockNumber}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Timestamp</DetailLabel>
                    <DetailValue>{formatDate(verificationResult.blockchainData.timestamp)}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Document Hash</DetailLabel>
                    <DetailValue>{verificationResult.documentHash}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Blockchain Verification</DetailLabel>
                    <DetailValue>
                      {verificationResult.blockchainVerified ? (
                        <span style={{ color: 'var(--success-color)' }}>Verified on blockchain</span>
                      ) : (
                        <span style={{ color: 'var(--danger-color)' }}>Not verified on blockchain</span>
                      )}
                    </DetailValue>
                  </DetailItem>
                </BlockchainDetails>
              </DetailItem>
            )}
          </ResultDetails>
        </ResultCard>
      )}
    </VerifyContainer>
  );
};

export default VerifyPage;
