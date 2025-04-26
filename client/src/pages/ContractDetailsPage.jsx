import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import ContractContext from '../context/ContractContext';
import AuthContext from '../context/AuthContext';
import Loader from '../components/common/Loader';
import { blockchainService } from '../services/blockchainService';
import { QRCodeSVG } from 'qrcode.react';

// Base path for the application
const BASE_PATH = '/proxy/3000';

const ContractContainer = styled.div`
  padding: 2rem 0;
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

const ContractHeader = styled.div`
  margin-bottom: 2rem;
`;

const ContractTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ContractDescription = styled.p`
  color: var(--dark-gray);
  margin-bottom: 1rem;
`;

const ContractMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.pending {
    background-color: rgba(255, 190, 11, 0.1);
    color: var(--warning-color);
  }
  
  &.completed {
    background-color: rgba(56, 176, 0, 0.1);
    color: var(--success-color);
  }
  
  &.expired {
    background-color: rgba(217, 4, 41, 0.1);
    color: var(--danger-color);
  }
  
  &.draft {
    background-color: rgba(173, 181, 189, 0.1);
    color: var(--dark-gray);
  }
`;

const ContractContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContentSection = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-gray);
`;

const DocumentContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
`;

const PartiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PartyItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
`;

const PartyInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PartyName = styled.div`
  font-weight: 500;
`;

const PartyRole = styled.div`
  font-size: 0.8rem;
  color: var(--dark-gray);
`;

const PartyStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  
  &.signed {
    color: var(--success-color);
  }
  
  &.pending {
    color: var(--warning-color);
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background-color: #2a75e8;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: var(--medium-gray);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BlockchainInfo = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const BlockchainItem = styled.div`
  margin-bottom: 0.5rem;
  
  strong {
    display: inline-block;
    min-width: 120px;
  }
  
  span {
    word-break: break-all;
  }
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
`;

const QRCodeLabel = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
  text-align: center;
`;

const VerificationLink = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  word-break: break-all;
  text-align: center;
`;

const ContractDetailsPage = () => {
  const { id } = useParams();
  const { contract, loading, fetchContractById, signContract } = useContext(ContractContext);
  const { user } = useContext(AuthContext);
  const [signing, setSigning] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState('');

  useEffect(() => {
    fetchContractById(id);
  }, [fetchContractById, id]);

  useEffect(() => {
    if (contract && contract.verificationCode) {
      // In a real app, this would be the full domain
      const baseUrl = window.location.origin;
      setVerificationUrl(`${baseUrl}${BASE_PATH}/verify/${contract.verificationCode}`);
    }
  }, [contract]);

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

  const handleSignContract = async () => {
    try {
      setSigning(true);
      
      // In a real app, this would use the user's private key
      // For demo purposes, we'll simulate signing with the blockchain service
      const { signature } = await blockchainService.signData(
        contract.content,
        'demo_private_key'
      );
      
      await signContract(contract._id, signature);
      setSigning(false);
    } catch (error) {
      console.error('Error signing contract:', error);
      setSigning(false);
    }
  };

  const canSign = () => {
    if (!contract || !user) return false;
    
    const userParty = contract.parties.find(
      party => (party.user && party.user._id === user._id) || party.email === user.email
    );
    
    return userParty && !userParty.signed;
  };

  if (loading || !contract) {
    return <Loader />;
  }

  return (
    <ContractContainer>
      <BackLink to={`${BASE_PATH}/contracts`}>
        <FaArrowLeft /> Back to Contracts
      </BackLink>
      
      <ContractHeader>
        <ContractTitle>{contract.title}</ContractTitle>
        <ContractDescription>{contract.description}</ContractDescription>
        
        <ContractMeta>
          <MetaItem>
            <strong>Created:</strong> {formatDate(contract.createdAt)}
          </MetaItem>
          <MetaItem>
            <strong>Template:</strong> {contract.templateId?.name || 'Custom'}
          </MetaItem>
          <MetaItem>
            <strong>Status:</strong>{' '}
            <StatusBadge
              className={
                contract.status === 'pending_signatures'
                  ? 'pending'
                  : contract.status === 'completed'
                  ? 'completed'
                  : contract.status === 'expired'
                  ? 'expired'
                  : 'draft'
              }
            >
              {contract.status === 'pending_signatures'
                ? 'Pending Signatures'
                : contract.status === 'completed'
                ? 'Completed'
                : contract.status === 'expired'
                ? 'Expired'
                : 'Draft'}
            </StatusBadge>
          </MetaItem>
        </ContractMeta>
      </ContractHeader>
      
      <ContractContent>
        <div>
          <ContentSection>
            <SectionTitle>Document Content</SectionTitle>
            <DocumentContent>
              {/* In a real app, this would render the actual contract content */}
              {JSON.stringify(contract.content, null, 2)}
            </DocumentContent>
          </ContentSection>
          
          {contract.blockchainData && contract.blockchainData.stored && (
            <ContentSection>
              <SectionTitle>Blockchain Information</SectionTitle>
              <BlockchainInfo>
                <BlockchainItem>
                  <strong>Status:</strong>{' '}
                  <span className="text-success">Stored on Blockchain</span>
                </BlockchainItem>
                <BlockchainItem>
                  <strong>Network:</strong>{' '}
                  <span>{contract.blockchainData.network}</span>
                </BlockchainItem>
                <BlockchainItem>
                  <strong>Transaction:</strong>{' '}
                  <span>{contract.blockchainData.transactionHash}</span>
                </BlockchainItem>
                <BlockchainItem>
                  <strong>Block Number:</strong>{' '}
                  <span>{contract.blockchainData.blockNumber}</span>
                </BlockchainItem>
                <BlockchainItem>
                  <strong>Timestamp:</strong>{' '}
                  <span>{formatDate(contract.blockchainData.timestamp)}</span>
                </BlockchainItem>
                <BlockchainItem>
                  <strong>Document Hash:</strong>{' '}
                  <span>{contract.documentHash}</span>
                </BlockchainItem>
              </BlockchainInfo>
            </ContentSection>
          )}
        </div>
        
        <div>
          <ContentSection>
            <SectionTitle>Parties</SectionTitle>
            <PartiesList>
              {contract.parties.map((party, index) => (
                <PartyItem key={index}>
                  <PartyInfo>
                    <PartyName>
                      {party.user ? party.user.name : party.email}
                    </PartyName>
                    <PartyRole>{party.role}</PartyRole>
                  </PartyInfo>
                  <PartyStatus className={party.signed ? 'signed' : 'pending'}>
                    {party.signed ? (
                      <>
                        <FaCheck /> Signed {formatDate(party.signatureTimestamp)}
                      </>
                    ) : (
                      <>
                        <FaTimes /> Pending
                      </>
                    )}
                  </PartyStatus>
                </PartyItem>
              ))}
            </PartiesList>
            
            {canSign() && (
              <ActionButton onClick={handleSignContract} disabled={signing}>
                {signing ? 'Signing...' : 'Sign Contract'}
              </ActionButton>
            )}
            
            <ActionButton disabled>
              <FaDownload /> Download Contract
            </ActionButton>
          </ContentSection>
          
          {contract.verificationCode && (
            <ContentSection>
              <SectionTitle>Verification</SectionTitle>
              <QRCodeContainer>
                <QRCodeSVG value={verificationUrl} size={150} />
                <QRCodeLabel>
                  Scan this QR code to verify the authenticity of this contract
                </QRCodeLabel>
                <VerificationLink>{verificationUrl}</VerificationLink>
              </QRCodeContainer>
            </ContentSection>
          )}
        </div>
      </ContractContent>
    </ContractContainer>
  );
};

export default ContractDetailsPage;
