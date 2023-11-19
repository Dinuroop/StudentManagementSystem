import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 400px;
  margin-top:100px;
  margin-right:auto;
  margin-left: auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Label = styled.label`
  display: block;
  margin: 10px 0;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  margin-top: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #2980b9;
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
`;

const ResultTitle = styled.h3`
  color: #333;
`;

const ResultValue = styled.p`
  font-size: 18px;
  color: #333;
`;

const Average = () => {
        const [inputType, setInputType] = useState('studentId');
        const [inputValue, setInputValue] = useState('');
        const [averageMarks, setAverageMarks] = useState(null);
      
        const handleInputChange = (e) => {
          setInputValue(e.target.value);
        };
      
        const handleInputTypeChange = (e) => {
          setInputType(e.target.value);
        };
      
        const handleCalculateAverage = async () => {
          try {
            let url = '';
            if (inputType === 'studentId') {
              url = `https://studmanagementsys.onrender.com/getAverageMarks/${inputValue}`;
            } else if (inputType === 'studentName') {
              url = `https://studmanagementsys.onrender.com/getAverageMarksByName/${inputValue}`;
            } else if (inputType === 'class') {
              url = `https://studmanagementsys.onrender.com/getAverageMarksByClass/${inputValue}`;
            }
      
            const response = await fetch(url);
            console.log(response)
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const result = await response.json();
            console.log(result);
            setAverageMarks(result.averageMarks);
          } catch (error) {
            console.error('Error calculating average marks:', error.message);
          }
        };

  return (
    <Container>
      <Title>Calculate Average Marks</Title>
      <Label>
        Search by:
        <Select value={inputType} onChange={handleInputTypeChange}>
          <option value="studentId">Student ID</option>
          <option value="studentName">Student Name</option>
          <option value="class">Class</option>
        </Select>
      </Label>
      <Label>
        {inputType === 'studentId' && 'Student ID:'}
        {inputType === 'studentName' && 'Student Name:'}
        {inputType === 'class' && 'Class:'}
        <Input type="text" value={inputValue} onChange={handleInputChange} />
      </Label>
      <Button onClick={handleCalculateAverage}>Calculate Average</Button>

      {averageMarks !== null && (
        <ResultContainer>
          <ResultTitle>Average Marks:</ResultTitle>
          <ResultValue>{averageMarks}</ResultValue>
        </ResultContainer>
      )}
    </Container>
  );
};

export default Average;


