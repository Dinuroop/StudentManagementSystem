import React from 'react';
import styled from 'styled-components';
import sms from './assests/sms.jpg'

// Styled components for styling
const Container = styled.div`
  display: flex;
  height: 80vh;
`;

const WelcomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding-right: 20px;
  margin-left:100px;
`;

const WelcomeMessage = styled.h1`
  font-size: 48px;
  color: #333;
`;

const ImageContainer = styled.div`
  margin-top:50px;
  margin-left:50px;
  flex: 1;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius:50px;
  object-fit: cover;
`;

const First = () => {
  return (
    <Container>
      <ImageContainer>
        <Image src={sms} alt="Welcome" />
      </ImageContainer>
      <WelcomeContainer>
        <WelcomeMessage>Welcome to Student Management System</WelcomeMessage>
      </WelcomeContainer>
    </Container>
  );
};

export default First;

