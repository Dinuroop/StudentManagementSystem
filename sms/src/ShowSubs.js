// StudentSubjectsComponent.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 400px;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SubjectsContainer = styled.div`
  margin-top: 20px;
`;

const Heading = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

const Span = styled.span`
  margin-left: 10px;
`;

const EditButton = styled.button`
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: 10px;
  background-color: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const NotFoundMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
  color: #e74c3c;
`;

const ShowSubs = () => {
  const [studentId, setStudentId] = useState('');
  const [subjectsAndMarks, setSubjectsAndMarks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [notFound, setNotFound] = useState(false);


    const handleSearch = async() =>{
        try {
            const response = await fetch(`http://localhost:5000/getSubjects/${studentId}`);
            if (!response.ok) {
              if (response.status === 404) {
                  setNotFound(true);
                  setSubjectsAndMarks(null);
                  // setShowSubjects(false);
                } else {
                  throw new Error('Network response was not ok');
                }
            }else {
              setNotFound(false);
              const result = await response.json();
              setSubjectsAndMarks(result);
            }
          } catch (err) {
            console.error('Error fetching student details:', err.message);
          } 
    }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/updateSubjects/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subjectsAndMarks),
      });

      console.log(subjectsAndMarks);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsEditing(false);
      console.log('Changes successfully saved to the database!');
    } catch (err) {
      console.error('Error updating student details:', err.message);
    }
  };

  return (
    <Container>
      <Label>
        Student ID:
        <Input
          type="number"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </Label>
      <Button onClick={handleSearch}>Search</Button>
      {notFound && <NotFoundMessage>NOT FOUND!</NotFoundMessage>}
      {subjectsAndMarks.length > 0 && (
        <SubjectsContainer>
          <Heading>Subjects and Marks:</Heading>
          <List>
            {subjectsAndMarks.map((subject, index) => (
              <ListItem key={index}>
                {subject.subject_name}:
                {isEditing ? (
                  <Input
                    type="text"
                    value={subject.marks}
                    onChange={(e) => {
                      const updatedSubjectsAndMarks = [...subjectsAndMarks];
                      updatedSubjectsAndMarks[index].marks = e.target.value;
                      setSubjectsAndMarks(updatedSubjectsAndMarks);
                    }}
                  />
                ) : (
                  <Span>{subject.marks}</Span>
                )}
              </ListItem>
            ))}
          </List>

          {isEditing ? (
            <SaveButton onClick={handleSave}>Save</SaveButton>
          ) : (
            <EditButton onClick={handleEdit}>Edit</EditButton>
          )}
        </SubjectsContainer>
      )}
    </Container>
  );
};

export default ShowSubs;

