import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';
import { useStateContext } from '@/context/StateContext';
import { doc, setDoc, getDocs, collection, query, where, updateDoc } from "firebase/firestore";
import { database } from '@/backend/Firebase';

export default function Services() {
  const { walletAddress, isConnected } = useStateContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchUserContracts();
    }
  }, [isConnected, walletAddress]);

  const fetchUserContracts = async () => {
    try {
      const contractsRef = collection(database, "contracts");
      const q = query(contractsRef, where("sellerAddress", "==", walletAddress));
      const querySnapshot = await getDocs(q);
      
      const userContracts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOrders(userContracts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e, orderId) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      const contractData = {
        ethPayerAddress: order.ethPayerAddress,
        sellerAddress: walletAddress,
        shippingLabelCode: order.shippingLabelCode,
        EthAmount: order.EthAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
        isDelivered: false
      };

      const docRef = doc(collection(database, "contracts"));
      await setDoc(docRef, contractData);
      
      // Refresh the contracts list
      await fetchUserContracts();
      alert("Contract created successfully!");
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract");
    }
  };

  const handleDeliveryStatus = async (contractId) => {
    try {
      const contractRef = doc(database, "contracts", contractId);
      await updateDoc(contractRef, {
        isDelivered: true,
        status: "delivered"
      });
      
      // Refresh the contracts list
      await fetchUserContracts();
      alert("Delivery status updated successfully!");
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Failed to update delivery status");
    }
  };

  const addNewOrder = () => {
    setOrders(prevOrders => [
      ...prevOrders, 
      {
        id: Math.max(...prevOrders.map(o => o.id), 0) + 1,
        ethPayerAddress: '',
        sellerAddress: '',
        shippingLabelCode: '',
        EthAmount: '',
        status: 'pending',
        isDelivered: false
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
        
        <OrdersContainer>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <CardHeader>Contract #{order.id}</CardHeader>
              <Form onSubmit={(e) => handleSubmit(e, order.id)}>
                <FormGroup>
                  <label htmlFor={`ethPayerAddress-${order.id}`}>ETH Payer Address</label>
                  <input
                    type="text"
                    id={`ethPayerAddress-${order.id}`}
                    value={order.ethPayerAddress}
                    onChange={(e) => handleInputChange(order.id, 'ethPayerAddress', e.target.value)}
                    placeholder="0x..."
                    required
                    disabled={order.status !== 'pending'}
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
                    disabled={order.status !== 'pending'}
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
                    disabled={order.status !== 'pending'}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor={`EthAmount-${order.id}`}>EthAmount</label>
                  <input
                    type="text"
                    id={`EthAmount-${order.id}`}
                    value={order.EthAmount}
                    onChange={(e) => handleInputChange(order.id, 'EthAmount', e.target.value)}
                    placeholder="Enter Cost of The Order"
                    required
                    disabled={order.status !== 'pending'}
                  />
                </FormGroup>

                <StatusGroup>
                  <StatusLabel>Status:</StatusLabel>
                  <StatusValue>{order.status}</StatusValue>
                </StatusGroup>

                {order.status === 'pending' ? (
                  <SubmitButton type="submit">
                    Create Contract
                  </SubmitButton>
                ) : (
                  walletAddress.toLowerCase() === order.sellerAddress.toLowerCase() && (
                    <DeliveryButton 
                      type="button"
                      onClick={() => handleDeliveryStatus(order.id)}
                      disabled={order.isDelivered}
                    >
                      {order.isDelivered ? 'Delivered' : 'Mark as Delivered'}
                    </DeliveryButton>
                  )
                )}
              </Form>
            </OrderCard>
          ))}
        </OrdersContainer>
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
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  background-color: #003366;
  color: white;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
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
  color: #4a90e2;
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

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#45a049'};
  }
`;
