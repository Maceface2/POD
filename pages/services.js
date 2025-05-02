import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';
import { useStateContext } from '@/context/StateContext';
import { doc, setDoc, getDocs, collection, query, where, updateDoc } from "firebase/firestore";
import { database } from '@/backend/Firebase';
import { ethers } from 'ethers';
import { ContractHandler } from '@/backend/contractHandler';

export default function Services() {
  const { walletAddress, isConnected, connectWallet } = useStateContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchUserContracts();
    } else {
      setLoading(false);
    }
  }, [isConnected, walletAddress]);

  const fetchUserContracts = async () => {
    try {
      const contractsRef = collection(database, "contracts");
      // Query for contracts where user is either buyer or seller
      const q = query(contractsRef, where("ethPayerAddress", "==", walletAddress));
      const q2 = query(contractsRef, where("sellerAddress", "==", walletAddress));
      
      // Execute queries separately to ensure both work
      const [buyerSnapshot, sellerSnapshot] = await Promise.all([
        getDocs(q),
        getDocs(q2),
      ]);
      
      const buyerContracts = buyerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        role: 'buyer'
      }));
      
      const sellerContracts = sellerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        role: 'seller'
      }));
      
      // Combine and sort contracts by creation date
      const allContracts = [...buyerContracts, ...sellerContracts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(allContracts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e, orderId) => {
    e.preventDefault();
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      // Create blockchain contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Use the createSmartContract method from ContractHandler
      const contractInstance = await ContractHandler.createSmartContract(
        signer,
        {
          sellerAddress: order.sellerAddress,
          EthAmount: order.EthAmount
        }
      );
      
      // Check if we have a valid contract instance
      if (!contractInstance || !contractInstance.contractAddress) {
        throw new Error("Failed to deploy contract properly");
      }
      
      const contractData = {
        ethPayerAddress: walletAddress,
        sellerAddress: order.sellerAddress,
        shippingLabelCode: order.shippingLabelCode,
        EthAmount: order.EthAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
        isDelivered: false,
        contractAddress: contractInstance.contractAddress
      };

      const docRef = doc(collection(database, "contracts"));
      await setDoc(docRef, contractData);
      
      // Refresh the contracts list
      await fetchUserContracts();
      alert("Contract created successfully!");
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract: " + error.message);
    }
  };

  const handleDeliveryStatus = async (contractId) => {
    try {
      const order = orders.find(o => o.id === contractId);
      
      if (!order) {
        throw new Error("Order not found");
      }
      
      if (!order.contractAddress) {
        throw new Error("Contract address not found in order data");
      }
      
      // Connect to the blockchain contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const contractHandler = new ContractHandler(order.contractAddress, signer);
      
      // Mark as delivered on the blockchain
      const tx = await contractHandler.markAsDelivered();
      
      // Update Firestore
      const contractRef = doc(database, "contracts", contractId);
      await updateDoc(contractRef, {
        isDelivered: true,
        status: "delivered"
      });
      
      // Refresh the contracts list
      await fetchUserContracts();
      alert("Delivery confirmed and payment released to seller!");
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Failed to update delivery status: " + error.message);
    }
  };

  const addNewOrder = () => {
    setOrders(prevOrders => [
      ...prevOrders, 
      {
        id: Math.random().toString(36).substr(2, 9), // Generate a unique ID
        ethPayerAddress: walletAddress,
        sellerAddress: '',
        shippingLabelCode: '',
        EthAmount: '',
        status: 'draft',
        isDelivered: false,
        role: 'buyer',
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const handleInputChange = (orderId, field, value) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, [field]: value }
          : order
      )
    );
  };

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <Title>Please connect your wallet to view and create contracts</Title>
          <ConnectButton onClick={connectWallet}>Connect Wallet</ConnectButton>
        </PageContainer>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <Title>Loading contracts...</Title>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <Header>
          <Title>PayOnDelivery Contracts</Title>
          <AddButton onClick={addNewOrder}>+</AddButton>
        </Header>
        
        {orders.length === 0 ? (
          <EmptyState>
            <EmptyMessage>You don't have any contracts yet</EmptyMessage>
            <EmptySubMessage>Click the + button to create a new contract</EmptySubMessage>
          </EmptyState>
        ) : (
          <OrdersContainer>
            {orders.map(order => (
              <OrderCard key={order.id}>
                <CardHeader>
                  Contract #{order.id.slice(0, 6)}
                  <RoleBadge role={order.role}>{order.role === 'buyer' ? 'You are the Buyer' : 'You are the Seller'}</RoleBadge>
                </CardHeader>
                <Form onSubmit={(e) => handleSubmit(e, order.id)}>
                  <FormGroup>
                    <label htmlFor={`ethPayerAddress-${order.id}`}>Buyer Address</label>
                    <input
                      type="text"
                      id={`ethPayerAddress-${order.id}`}
                      value={order.ethPayerAddress}
                      onChange={(e) => handleInputChange(order.id, 'ethPayerAddress', e.target.value)}
                      placeholder="0x..."
                      required
                      disabled={order.status !== 'draft'}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor={`sellerAddress-${order.id}`}>Seller Address</label>
                    <input
                      type="text"
                      id={`sellerAddress-${order.id}`}
                      value={order.sellerAddress}
                      onChange={(e) => handleInputChange(order.id, 'sellerAddress', e.target.value)}
                      placeholder="0x..."
                      required
                      disabled={order.status !== 'draft'}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor={`shippingLabelCode-${order.id}`}>Shipping Label Code</label>
                    <input
                      type="text"
                      id={`shippingLabelCode-${order.id}`}
                      value={order.shippingLabelCode}
                      onChange={(e) => handleInputChange(order.id, 'shippingLabelCode', e.target.value)}
                      placeholder="Enter shipping label code"
                      required
                      disabled={order.status !== 'draft'}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor={`EthAmount-${order.id}`}>BNB Amount</label>
                    <input
                      type="text"
                      id={`EthAmount-${order.id}`}
                      value={order.EthAmount}
                      onChange={(e) => handleInputChange(order.id, 'EthAmount', e.target.value)}
                      placeholder="Enter Cost of The Order"
                      required
                      disabled={order.status !== 'draft'}
                    />
                  </FormGroup>
                  
                  {order.status !== 'draft' && (
                    <FormGroup>
                      <label>Contract Address</label>
                      <ContractAddressDisplay>{order.contractAddress || "Not deployed yet"}</ContractAddressDisplay>
                    </FormGroup>
                  )}

                  <StatusGroup>
                    <StatusLabel>Status:</StatusLabel>
                    <StatusValue status={order.status}>{order.status}</StatusValue>
                  </StatusGroup>

                  {order.status === 'draft' ? (
                    <SubmitButton type="submit">
                      Create Contract
                    </SubmitButton>
                  ) : (
                    order.role === 'buyer' && !order.isDelivered && (
                      <DeliveryButton 
                        type="button"
                        onClick={() => handleDeliveryStatus(order.id)}
                        disabled={order.isDelivered}
                      >
                        {order.isDelivered ? 'Delivered' : 'Mark as Delivered'}
                      </DeliveryButton>
                    )
                  )}
                  
                  {order.isDelivered && (
                    <DeliveredMessage>This order has been delivered and payment released</DeliveredMessage>
                  )}
                </Form>
              </OrderCard>
            ))}
          </OrdersContainer>
        )}
      </PageContainer>
    </>
  );
}

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4a90e2;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
  
  &:hover {
    background-color: #357abd;
    transform: scale(1.05);
  }
`;

const OrdersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const OrderCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background-color: #003366;
  color: white;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RoleBadge = styled.span`
  background-color: ${props => props.role === 'buyer' ? '#4a90e2' : '#45a049'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: normal;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #555;
  }

  input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #4a90e2;
    }
  }
`;

const SubmitButton = styled.button`
  background-color: #4a90e2;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

const StatusGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const StatusLabel = styled.span`
  font-weight: 500;
  color: #555;
`;

const StatusValue = styled.span`
  color: ${props => {
    switch(props.status) {
      case 'draft': return '#f39c12';
      case 'pending': return '#3498db';
      case 'delivered': return '#2ecc71';
      default: return '#4a90e2';
    }
  }};
  font-weight: 600;
`;

const DeliveryButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#4CAF50'};
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#45a049'};
  }
`;

const ConnectButton = styled.button`
  background-color: #4a90e2;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
`;

const EmptyMessage = styled.h2`
  color: #555;
  margin-bottom: 1rem;
`;

const EmptySubMessage = styled.p`
  color: #777;
  font-size: 1.1rem;
`;

const DeliveredMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
`;

const ContractAddressDisplay = styled.div`
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
  color: #333;
  margin-top: 0.5rem;
`;