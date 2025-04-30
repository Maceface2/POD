import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { ethers } from 'ethers';
import { useStateContext } from '@/context/StateContext';

const Navbar = () => {
  // wallet connect 
  const { walletAddress, setWalletAddress, isConnected, setIsConnected } = useStateContext();

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
      } else {
        alert('Please install MetaMask to use this feature');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  return (
    <Nav>
      <Logo href="/">POD</Logo>
      <NavLinks>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/services">Services</NavLink>
        {/* wallet connect html */}
        {isConnected ? (
          <NavLink href="" style={{ cursor: 'default' }}>
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </NavLink>
        ) : (
          <NavLink href="" onClick={connectWallet}>
            Connect Wallet
          </NavLink>
        )}
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  background-color: #003366;
  font-family: sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: ${props => props.primary ? 'bold' : 'normal'};
  background-color: ${props => props.primary ? '#3498db' : 'transparent'};
  
  &:hover {
    background-color:rgb(3, 6, 59);
  }
`;

export default Navbar;
