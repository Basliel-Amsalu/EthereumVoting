import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getVotingContract, HARDHAT_VOTING_CONTRACT_ADDRESS } from '../lib/contracts';

const ContractDebugger: React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contractAddress, setContractAddress] = useState<string>(HARDHAT_VOTING_CONTRACT_ADDRESS);
  const [connectionStatus, setConnectionStatus] = useState<string>('Not connected');
  const [votingStatus, setVotingStatus] = useState<boolean | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Add a log message
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      try {
        if (window.ethereum) {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(browserProvider);
          addLog('Ethereum provider initialized');
        } else {
          setError('No Ethereum provider found. Please install MetaMask.');
          addLog('No Ethereum provider found');
        }
      } catch (err) {
        setError(`Error initializing provider: ${err instanceof Error ? err.message : String(err)}`);
        addLog(`Provider initialization error: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    initProvider();
  }, []);

  // Test connection
  const testConnection = async () => {
    if (!provider) {
      setError('Provider not initialized');
      return;
    }

    try {
      addLog('Testing contract connection...');
      setConnectionStatus('Connecting...');
      
      const contract = await getVotingContract(provider, contractAddress);
      
      // Test a simple view function
      const status = await contract.getVotingStatus();
      setVotingStatus(status);
      
      setConnectionStatus('Connected');
      addLog('Connection successful');
    } catch (err) {
      setConnectionStatus('Failed');
      setError(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
      addLog(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Get candidates
  const getCandidates = async () => {
    if (!provider) {
      setError('Provider not initialized');
      return;
    }

    try {
      addLog('Fetching candidates...');
      const contract = await getVotingContract(provider, contractAddress);
      const candidatesList = await contract.getCandidates();
      setCandidates(candidatesList);
      addLog(`Found ${candidatesList.length} candidates`);
    } catch (err) {
      setError(`Error fetching candidates: ${err instanceof Error ? err.message : String(err)}`);
      addLog(`Candidates error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="contract-debugger" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Contract Debugger</h2>
      
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffeeee', color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Contract Address</h3>
        <input 
          type="text" 
          value={contractAddress} 
          onChange={(e) => setContractAddress(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Connection Status: {connectionStatus}</h3>
        <button onClick={testConnection} style={{ padding: '8px 16px', marginRight: '10px' }}>
          Test Connection
        </button>
        
        {connectionStatus === 'Connected' && (
          <button onClick={getCandidates} style={{ padding: '8px 16px' }}>
            Get Candidates
          </button>
        )}
      </div>
      
      {votingStatus !== null && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Voting Status</h3>
          <p>{votingStatus ? 'Voting is active' : 'Voting is not active'}</p>
        </div>
      )}
      
      {candidates.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Candidates</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Proposal</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Votes</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidate.id.toString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidate.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidate.proposal}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidate.voteCount.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div>
        <h3>Debug Logs</h3>
        <div style={{ 
          height: '200px', 
          overflowY: 'scroll', 
          backgroundColor: '#f5f5f5', 
          padding: '10px',
          fontFamily: 'monospace'
        }}>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractDebugger;
