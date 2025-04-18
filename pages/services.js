import { useState } from 'react';
import styled from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';
export default function Services() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      ethPayerAddress: '',
      sellerAddress: '',
      shippingLabelCode: '',
      EthAmount:''
    }
  ]);

  const addNewOrder = () => {
    setOrders(prevOrders => [
      ...prevOrders, 
      {
        id: Math.max(...prevOrders.map(o => o.id)) + 1,
        ethPayerAddress: '',
        sellerAddress: '',
        shippingLabelCode: '',
        EthAmount:''
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

  return (
    <>
      <Navbar />
      <PageContainer>
        <Header>
          <Title>PayOnDelivery Orders</Title>
          <AddButton onClick={addNewOrder}>+</AddButton>
        </Header>
        
        <OrdersContainer>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <CardHeader>Order #{order.id}</CardHeader>
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
                  />
                </FormGroup>

                <SubmitButton type="submit">
                  Create Order
                </SubmitButton>
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
