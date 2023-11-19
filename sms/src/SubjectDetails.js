
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledAddSubjectsContainer = styled.div`
  text-align: center;
  margin-top: 20px;

  label {
    flex: 1;
    margin-right: 10px;
    margin-bottom: 12px;
  }

  input {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 16px;
    border: 2px solid #3498db;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  div {
    margin-bottom: 10px;

    label {
      flex: 1;
      margin-right: 10px;
    }

    input {
      flex: 1;
      padding: 10px;
      margin-left: 10px;
      font-size: 16px;
      border: 2px solid #3498db;
      border-radius: 4px;
    }
  }

  button {
    margin-top: 10px;
    padding: 10px 20px;
    margin-left:20px;
    font-size: 16px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;


const SubjectDetails = () => {
  const navigate = useNavigate();
  const [subjectData, setSubjectData] = useState([{ subjectName: '', marks: '' }]);
  const [StudentId, setStudentId] = useState();

  const handleAddSubject = () => {
    setSubjectData([...subjectData, { subjectName: '', marks: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedSubjectData = [...subjectData];
    updatedSubjectData[index][field] = value;
    setSubjectData(updatedSubjectData);
  };

  const handleAddSubjects = async () => {
    try {
      const response = await fetch(`https://studmanagementsys.onrender.com/${StudentId}/addSubjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjects: subjectData }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle success, e.g., show a success message or redirect
      console.log('Subjects added successfully!');
      alert("Details added sucessfully");
      navigate("/AddStudent");
    } catch (err) {
      console.error('Error adding subjects:', err.message);
    }
  };

  return (
    <StyledAddSubjectsContainer>
        <h3>Add Subjects for the Student</h3>
        <label>
            Student Id:
            <input
              type="text"
              value={StudentId}
              onChange={(e) => {setStudentId(e.target.value) 
              console.log(StudentId)}}
            />
          </label>
      {subjectData.map((subject, index) => (
        <div key={index}>
          <label>
            Subject Name:
            <input
              type="text"
              value={subject.subjectName}
              onChange={(e) => handleInputChange(index, 'subjectName', e.target.value)}
            />
          </label>
          <label>
            Marks:
            <input
              type="number"
              value={subject.marks}
              onChange={(e) => handleInputChange(index, 'marks', e.target.value)}
            />
          </label>
        </div>
      ))}

      <button onClick={handleAddSubject}>Add New Subject</button>
      <button onClick={handleAddSubjects}>Add Subjects to the DB</button>
    </StyledAddSubjectsContainer>
  );
};

export default SubjectDetails;

