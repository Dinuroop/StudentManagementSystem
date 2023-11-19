import React, { useEffect } from 'react'
import { useState } from 'react';
import './Students.css';

export default function Students() {
    const [Data, setData] = useState([]);
const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://studmanagementsys.onrender.com/get');
            console.log(response);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            setData(result);
            console.log(Data);
          } catch (err) {
            setError(err);
            console.log(error);
          }
        };
    
        fetchData();
      }, []);

      

  return (
    <div className="students-container">
        <h3>Student Details</h3>
      {error && <p className="error-message">Error: {error.message}</p>}
      {Data.length > 0 && (
        <table  className="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Age</th>
              <th>Date of Birth</th>
              <th>Class</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {Data.map((student) => (
              <tr key={student.StudentId}>
                <td>{student.StudentId}</td>
                <td>{student.FullName}</td>
                <td>{student.Age}</td>
                <td>{student.DateOfBrth}</td>
                <td>{student.Class}</td>
                <td>{student.percentage}</td>
                <td>{student.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
