// SearchComponent.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const StyledSearchContainer = styled.div`
  text-align: center;
  margin-top: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    
  }

  input {
    padding: 10px;
    font-size: 16px;
    border: 2px solid #3498db;
    border-radius: 4px;
    margin-left: 10px;
    margin-bottom: 16px;
  }

  select {
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

  .results-container {
    margin-top: 20px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    max-width: 500px;
  }

  .result-item {
    background-color: #f5f5f5;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 8px;
  }

  p {
    margin-top: 20px;
  }
`;

const MultiSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('studentId'); // Default search type

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://studmanagementsys.onrender.com/search/${searchType}/${searchTerm}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setSearchResults(result);
    } catch (err) {
      console.error('Error fetching search results:', err.message);
    }
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  return (
    <StyledSearchContainer>
      <label>
        Search Term:
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
      <select value={searchType} onChange={handleSearchTypeChange}>
        <option value="studentId">Student ID</option>
        <option value="className">Class Name</option>
        <option value="studentName">Student Name</option>
        <option value="age">Age</option>
      </select>
      <button onClick={handleSearch}>Search</button>

      {searchResults.length > 0 ? (
        <div className="results-container">
          <h2>Search Results:</h2>
          <ul>
            {searchResults.map((result) => (
              <li key={result.StudentId} className="result-item">
                <p>
                  <strong>Student ID:</strong> {result.StudentId}
                </p>
                <p>
                  <strong>Name:</strong> {result.FullName}
                </p>
                <p>
                  <strong>Class:</strong> {result.Class}
                </p>
                <p>
                  <strong>Age:</strong> {result.Age}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </StyledSearchContainer>
  );
};

export default MultiSearch;

