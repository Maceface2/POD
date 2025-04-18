import React from 'react'
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import { FaShippingFast, FaLock, FaHandshake } from 'react-icons/fa'

const About = () => {
  return (
    <>
    <Navbar/>
    <Section>
      <Aboutdiv>
        <Header>
          Welcome to PayOnDelivery
        </Header>
        <Paragraph>
          PayOnDelivery (POD) is a revolutionary blockchain-based service that transforms how you pay for delivered goods. Using cryptocurrency and smart contracts, we ensure your payment is only released when your package safely arrives at its destination.
        </Paragraph>
        
        <StepsContainer>
          <Step>
            <StepIcon><FaShippingFast /></StepIcon>
            <StepTitle>Order & Ship</StepTitle>
            <StepText>Place your order and the seller ships your package while funds are securely held in escrow.</StepText>
          </Step>
          
          <Step>
            <StepIcon><FaLock /></StepIcon>
            <StepTitle>Smart Contract</StepTitle>
            <StepText>A blockchain smart contract securely holds your payment until delivery confirmation.</StepText>
          </Step>
          
          <Step>
            <StepIcon><FaHandshake /></StepIcon>
            <StepTitle>Delivery & Payment</StepTitle>
            <StepText>Once delivery is confirmed, the smart contract automatically releases payment to the seller.</StepText>
          </Step>
        </StepsContainer>
        
        <Paragraph>
          Our platform eliminates payment fraud, reduces disputes, and builds trust between buyers and sellers. With PayOnDelivery, you can shop with confidence knowing your money is only released when you receive what you paid for.
        </Paragraph>
      </Aboutdiv>
    </Section>
   
    </>
  )
}
const Section = styled.section`
  display: flex;
  font-family: arial;
  min-height: 100vh;
  color: #333;
  background: white;
  padding: 20px;
`;

const Aboutdiv = styled.div`
  display: flex;
  flex-direction: column;
  position: center;
  width: 100%;
  padding: 20px;
  margin-top: 20px;
  align-items: center;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  max-width: 1200px;
  margin: 40px 0;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  padding: 20px;
  margin: 15px;
  border: 2px solid #003366;
  border-radius: 12px;
  text-align: center;
  background: rgba(0, 51, 102, 0.05);
`;

const StepIcon = styled.div`
  font-size: 40px;
  color: #003366;
  margin-bottom: 15px;
`;

const StepTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #003366;
`;

const StepText = styled.p`
  font-size: 14px;
  line-height: 1.4;
`;

const Header = styled.h1`
  font-size: 36px;
  margin: 20px 0;
  color: #003366;
`;

const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.6;
  width: 90%;
  max-width: 800px;
  text-align: center;
  margin: 15px 0;
`;


export default About