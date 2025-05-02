import { useRouter } from 'next/router';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/backend/Firebase';
import { ethers } from 'ethers';

const Context = createContext();

// BSC Testnet configuration
const BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const BSC_TESTNET_CHAIN_ID = 97;

export const StateContext = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);

  const router = useRouter();
  const { asPath } = useRouter();

  // Initialize provider
  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setWalletAddress('');
          setIsConnected(false);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          // Check if we're on BSC testnet
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          
          if (network.chainId !== BigInt(BSC_TESTNET_CHAIN_ID)) {
            try {
              // Request to switch to BSC testnet
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}` }],
              });
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask
              if (switchError.code === 4902) {
                try {
                  // Add BSC testnet to MetaMask
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}`,
                      chainName: 'BSC Testnet',
                      nativeCurrency: {
                        name: 'BNB',
                        symbol: 'tBNB',
                        decimals: 18
                      },
                      rpcUrls: [BSC_TESTNET_RPC],
                      blockExplorerUrls: ['https://testnet.bscscan.com']
                    }]
                  });
                } catch (addError) {
                  console.error('Error adding BSC testnet:', addError);
                  return false;
                }
              } else {
                console.error('Error switching to BSC testnet:', switchError);
                return false;
              }
            }
          }
          
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          return true;
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error);
        return false;
      }
    } else {
      alert('Please install MetaMask to use this feature');
      return false;
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
  };

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        walletAddress,
        setWalletAddress,
        isConnected,
        setIsConnected,
        provider,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
