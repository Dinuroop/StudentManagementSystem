// StudentSearch.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledSearchContainer = styled.div`
  text-align: center;
  margin-top: 20px;

  input {
    padding: 10px;
    font-size: 16px;
    border: 2px solid #3498db;
    border-radius: 4px;
    margin-right: 10px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const StyledDetailsContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 400px;
  margin: 20px auto;
  text-align: left;

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
    margin-top: 10px;
  }

  .edit-button {
    background-color: #3498db;
    color: #fff;
    border: none;
  }

  .delete-button {
    background-color: #e74c3c;
    color: #fff;
    border: none;
  }
`;

const NotFoundMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
  color: #e74c3c;
`;

const EditDelete = () => {
  const navigate = useNavigate();
  const [searchedStudentId, setSearchedStudentId] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://studmanagementsys.onrender.com/get/${searchedStudentId}`);
      if (!response.ok) {
        if (response.status === 404) {
            setNotFound(true);
            setStudentDetails(null);
            // setShowSubjects(false);
          } else {
            throw new Error('Network response was not ok');
          }
      }else {
        setNotFound(false);
        const result = await response.json();
        setStudentDetails(result);
      }
    } catch (err) {
      console.error('Error fetching student details:', err.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://studmanagementsys.onrender.com/update/${searchedStudentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentDetails),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsEditing(false);
      console.log('Changes successfully saved to the database!');
      alert("Changes done sucessfully!");
      navigate('/Edit&Delete')
    } catch (err) {
      console.error('Error updating student details:', err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://studmanagementsys.onrender.com/delete/${searchedStudentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Student record successfully deleted from the database!');
      alert("Deleted sucessfully")
      setStudentDetails(null); // Clear the details after deletion
    } catch (err) {
      console.error('Error deleting student record:', err.message);
    }
  };

  return (
    <div>
      <StyledSearchContainer>
        <input
          type="text"
          placeholder="Search by Student ID"
          value={searchedStudentId}
          onChange={(e) => setSearchedStudentId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </StyledSearchContainer>
      {notFound && <NotFoundMessage>NOT FOUND!</NotFoundMessage>}
      {studentDetails && (
        <StyledDetailsContainer>
          <label>
            Student ID:
            <input
              type="text"
              name="StudentId"
              value={studentDetails.StudentId}
              onChange={(e) => setStudentDetails({ ...studentDetails, StudentId: e.target.value })}
              disabled={!isEditing}
            />
          </label>

          <label>
            Full Name:
            <input
              type="text"
              name="FullName"
              value={studentDetails.FullName}
              onChange={(e) => setStudentDetails({ ...studentDetails, FullName: e.target.value })}
              disabled={!isEditing}
            />
          </label>

          <label>
            Age:
            <input
              type="text"
              name="Age"
              value={studentDetails.Age}
              onChange={(e) => setStudentDetails({ ...studentDetails, Age: e.target.value })}
              disabled={!isEditing}
            />
          </label>

          <label>
            Date of Birth:
            <input
              type="date"
              name="DateOfBrth"
              value={studentDetails.DateOfBrth}
              onChange={(e) => setStudentDetails({ ...studentDetails, DateOfBrth: e.target.value })}
              disabled={!isEditing}
            />
          </label>

          <label>
            Class:
            <input
              type="text"
              name="Class"
              value={studentDetails.Class}
              onChange={(e) => setStudentDetails({ ...studentDetails, Class: e.target.value })}
              disabled={!isEditing}
            />
          </label>
        
          {isEditing ? (
            <button onClick={handleSave}>Save Changes</button>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}

        <button className="delete-button" onClick={handleDelete}>
            Delete
        </button>
        </StyledDetailsContainer>
      )}
    </div>
  );
};

export default EditDelete;

