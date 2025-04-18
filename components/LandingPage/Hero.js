import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Hero = () => {
  return (
    <Section>
        <Container>
          <ImageColumn>
            <img src="/delivered_picture.svg" alt="Delivery Illustration" />
          </ImageColumn>
          <HeroTextColumn>
            <Header>
              POD - Pay on Delivery
            </Header>
            <SubheaderAndStarsColumn>
              <SubHeader>Secure payments using smart contracts</SubHeader>
              <FeaturesList>
                <Item>Pay only when you receive your goods</Item>
                <Item>Blockchain-secured transactions</Item>
                <Item>No middleman fees</Item>
              </FeaturesList>
              <Link href="">
                <SignupButton>Connect Wallet</SignupButton>
              </Link>
            </SubheaderAndStarsColumn>
          </HeroTextColumn>
        </Container>
        {/* new home page additions */}
        <ProcessSection>
          <SecurityImageContainer>
            <ImageLabel>Blockchain Security</ImageLabel>
            <SecurityImage>
              <img src="/securityImage.svg" alt="Security Illustration" />
            </SecurityImage>
          </SecurityImageContainer>
          {/* sample order agreement */}
          <OrderAgreementBox>
            <AgreementTitle>Order Agreement</AgreementTitle>
            <AgreementContent>
              <AgreementRow>
                <AgreementLabel>Order ID:</AgreementLabel>
                <AgreementValue>ORD-2023-9078</AgreementValue>
              </AgreementRow>
              <AgreementRow>
                <AgreementLabel>Buyer:</AgreementLabel>
                <AgreementValue>0x71C...93E4</AgreementValue>
              </AgreementRow>
              <AgreementRow>
                <AgreementLabel>Seller:</AgreementLabel>
                <AgreementValue>0x45A...F721</AgreementValue>
              </AgreementRow>
              <AgreementRow>
                <AgreementLabel>Amount:</AgreementLabel>
                <AgreementValue>0.25 ETH</AgreementValue>
              </AgreementRow>
              <AgreementRow>
                <AgreementLabel>Status:</AgreementLabel>
                <AgreementStatus>In Transit</AgreementStatus>
              </AgreementRow>
            </AgreementContent>
          </OrderAgreementBox>
          {/*  */}
          <ProcessImageContainer>
            <ImageLabel>On Delivery Payment Exchange</ImageLabel>
            <ProcessImage>
              <img src="/DeliveryImage.jpg" alt="Delivery Exchange" />
            </ProcessImage>
          </ProcessImageContainer>
        </ProcessSection>
    </Section>
  );
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  min-height: 150vh;
  color: #001f3f;
  background: #ffffff;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 0 7vw;
`;

const HeroTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: auto;
  width: 50%;
`;

const ImageColumn = styled.div`
  width: 40%;  
  img {
    width: 100%; 
    height: auto;
    margin-right: 30px;
  }
`;

const ProcessSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 30px;
  padding: 0 7vw;
  margin-bottom: 50px;
`;

const ImageLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #001f3f;
  margin-bottom: 10px;
  text-align: center;
`;

const SecurityImageContainer = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 60px;
`;

const SecurityImage = styled.div`
  width: 80%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 31, 63, 0.1);
  background-color: #f8f9fa;
  padding: 20px;
  
  img {
    width: 100%;
    height: auto;
  }
`;

const ProcessImageContainer = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProcessImage = styled.div`
  width: 100%;  
  height: auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 31, 63, 0.1);
  
  img {
    display: block;
    width: 100%; 
    height: auto;
    border-radius: 8px;
  }
`;

const OrderAgreementBox = styled.div`
  grid-column: 2;
  grid-row: 1;
  background-color:rgb(233, 236, 239);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 31, 63, 0.1);
  width: 80%;
  height:275px;
  justify-self: center;
`;

const AgreementTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #001f3f;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
`;

const AgreementContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: clamp(0.9rem, 1.25vw, 1.2rem);
  /* font-size: 1rem; */
  gap: 10px;
`;

const AgreementRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;

const AgreementLabel = styled.span`
  font-weight: 600;
  color: #4a4a4a;
`;

const AgreementValue = styled.span`
  color: #001f3f;
`;

const AgreementStatus = styled.span`
  color: #ff8800;
  font-weight: 600;
`;

const Header = styled.h1`
  font-size: calc(2rem + 2vw);
  color: #001f3f;
`;

const SubHeader = styled.h2`
  font-size: calc(1rem + 1vw);
  margin-top: 20px;
  color: #001f3f;
`;

const SubheaderAndStarsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

const FeaturesList = styled.ul`
  list-style-type: circle;
  padding: 0;
  margin: 20px 0;
`;

const Item = styled.li`
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #001f3f;
`;

const SignupButton = styled.button`
  width: 50%;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #ffffff;
  background-color: #001f3f;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #003366;
  }
`;

export default Hero;
