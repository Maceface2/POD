import { useRouter } from 'next/router';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import {auth} from '@/backend/Firebase'
import { ethers } from 'ethers';

const Context = createContext();

export const StateContext = ({ children }) => {
  // Variables to Carry Across Multiple Pages
  const [user, setUser] = useState(undefined);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const router = useRouter();
  const { asPath } = useRouter();

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
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
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setWalletAddress('');
          setIsConnected(false);
        }
      });
    }

//wallet connect
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // AUTHENTICATION REMEMBER ME USEEFFECT
  // useEffect(() => {
  //   const unsubscribe = onIdTokenChanged(auth, (user) => {
  //     if(user){
  //       console.log('Token or user state changed:', user)
  //       user.getIdToken().then((token) => {
  //         console.log('New ID token:', token)
  //       })
  //       setUser(user)
  //     } else {
  //       setUser(null) //there is no user signed in
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        walletAddress,
        setWalletAddress,
        isConnected,
        setIsConnected
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
