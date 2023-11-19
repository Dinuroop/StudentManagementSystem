import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

export const StyledFormContainer = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export const StyledForm = styled.form`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 400px;

  label {
    display: block;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    box-sizing: border-box;
  }

  button {
    background-color: #3498db;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export default function AddStud() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StudentId: '',
        FullName: '',
        Age: '',
        DateOfBirth: '',
        Class: '',
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch('https://studmanagementsys.onrender.com/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          navigate("/subjectdetails");
    
          // Reset the form after successful submission
          setFormData({
            StudentId: '',
            FullName: '',
            Age: '',
            DateOfBirth: '',
            Class: '',
          });
    
          console.log('Data successfully submitted to the database!');
        } catch (err) {
          console.error('Error submitting data:', err.message);
        }
      };
    
      return (
        <StyledFormContainer>
          <StyledForm onSubmit={handleSubmit}>
          <h3 style={{textAlign:'center'}}>Add New Student</h3>
            {/* Add form input fields here */}
            <label>
              Student ID:
              <input
                type="text"
                name="StudentId"
                placeholder='Ex:22'
                value={formData.StudentId}
                onChange={handleChange}
              />
            </label>

            <label>
              Full Name:
              <input
                type="text"
                name="FullName"
                placeholder='Ex:Sahith Sai'
                value={formData.FullName}
                onChange={handleChange}
              />
            </label>

            <label>
              Age:
              <input
                type="number"
                name="Age"
                placeholder='Ex:23'
                value={formData.Age}
                onChange={handleChange}
              />
            </label>

            <label>
              Date Of Birth:
              <input
                type="date"
                name="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={handleChange}
              />
            </label>

            <label>
              Class:
              <input
                type="text"
                name="Class"
                placeholder='Ex:Class 12'
                value={formData.Class}
                onChange={handleChange}
              />
            </label>

            <button type="submit">Submit & Next</button>
          </StyledForm>
        </StyledFormContainer>
      );
}
