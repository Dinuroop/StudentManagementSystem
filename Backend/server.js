const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
// const bodyParser = require(body-parser)


const app = express();
app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.json("Listenig at port 5000")
})

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password :'Dinu@2468',
    database : 'sms2',
    connectionLimit : 10,
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 30000,
})

pool.query(`select * from students`,(err,res)=>{
    if(err){
        console.log('Something is wrong '+err);
    }else{
        console.log(res);
    }
})

pool.query(`select * from subjects`,(err,res)=>{
    if(err){
        console.log('Something is wrong '+err);
    }else{
        console.log(res);
    }
})

app.get('/get',(req,res)=>{
    pool.query(`select * from students`,(err,result)=>{
        if (err){
            console.log(err);
        }
        res.json(result);
    })
})

// Adding new student
app.post('/add', (req, res) => {
    const {
      StudentId,
      FullName,
      Age,
      DateOfBirth,
      Class,
    } = req.body;
  
    // Assuming 'students' is the table name
    const query = `
      INSERT INTO students (
        StudentId,
        FullName,
        Age,
        DateOfBrth,
        Class
      ) VALUES (?, ?, ?, ?, ?)
    `;
  
    const values = [
      parseInt(StudentId),
      FullName,
      parseInt(Age),
      DateOfBirth,
      Class // Assuming it's stored as JSON in the database
    ];
  
    pool.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      res.status(200).send('Data successfully added to the database');
    });
  });

// getting student details for a particular id

app.get('/get/:studentId', (req, res) => {
    const studentId = req.params.studentId;
  
    pool.query('SELECT * FROM students WHERE StudentId = ?', [studentId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      const studentDetails = result[0];
      res.json(studentDetails);
    });
  });
  
//  Applying changes in the database

app.put('/update/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const updatedDetails = req.body;
  
    pool.query('UPDATE students SET ? WHERE StudentId = ?', [updatedDetails, studentId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json({ message: 'Student details updated successfully' });
    });
  });

  // Deleting the record

  app.delete('/delete/:studentId', (req, res) => {
    const studentId = req.params.studentId;
  
    pool.query('DELETE FROM students WHERE StudentId = ?', [studentId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json({ message: 'Student record deleted successfully' });
    });
  });

// MultiSearch

app.get('/search/:searchType/:searchTerm', (req, res) => {
    const { searchType, searchTerm } = req.params;
  
    let query;
    let queryParams;
  
    switch (searchType) {
      case 'studentId':
        query = 'SELECT * FROM students WHERE StudentId = ?';
        break;
      case 'className':
        query = 'SELECT * FROM students WHERE Class = ?';
        break;
      case 'studentName':
        query = 'SELECT * FROM students WHERE FullName LIKE ?';
        queryParams = [`%${searchTerm}%`];
      case 'age':
        query = 'SELECT * FROM students WHERE Age LIKE ?';
        queryParams = [`%${searchTerm}%`];
        break;
      default:
        return res.status(400).json({ error: 'Invalid search type' });
    }
  
    pool.query(query, queryParams || searchTerm, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      res.status(200).json(result);
    });
  });

// Adding Subjects in the database
app.post('/:StudentId/addSubjects', (req, res) => {
    const { StudentId } = req.params;
    const { subjects } = req.body;
  
    if (!StudentId || !subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
  
    const insertQuery = 'INSERT INTO subjects (StudentId, subject_name, marks) VALUES (?, ?, ?)';
  
    // Use the connection pool to execute the SQL query for each subject
    pool.getConnection((err, connection) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      subjects.forEach(({ subjectName, marks }) => {
        connection.query(insertQuery, [StudentId, subjectName, marks], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
        });
      });
  
      // Calculate percentage and grade based on the received marks
      const totalMarks = subjects.reduce((total, { marks }) => total + parseFloat(marks), 0);
      const percentage = (totalMarks / (subjects.length * 100)) * 100;
  
      let grade;
      if (percentage >= 90) {
        grade = 'A+';
      } else if (percentage >= 80) {
        grade = 'A';
      } else if (percentage >= 70) {
        grade = 'B';
      } else if (percentage >= 60) {
        grade = 'C';
      } else if (percentage >= 50) {
        grade = 'D';
      } else {
        grade = 'F';
      }
  
      // Update the students table with the calculated percentage and grade
      const updateQuery = 'UPDATE students SET percentage = ?, grade = ? WHERE StudentId = ?';
      connection.query(updateQuery, [percentage, grade, StudentId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        connection.release();
        res.status(200).json({ message: 'Subjects added successfully' });
      });
    });
  });
  
  //Displaying subjects and marks
  app.get('/getSubjects/:StudentId', (req, res) => {
    const { StudentId } = req.params;
  
    if (!StudentId) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
  
    const selectQuery = 'SELECT subject_name, marks FROM subjects WHERE StudentId = ?';
  
    // Use the connection pool to execute the SQL query
    pool.getConnection((err, connection) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      connection.query(selectQuery, [StudentId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        connection.release();
        res.status(200).json(result);
      });
    });
  });

  // Updating Marks

  app.put('/updateSubjects/:StudentId', async (req, res) => {
    const StudentId  = req.params.StudentId;
    const subjectsAndMarks  = req.body;
  
    try {
      // Update subjects table
      await Promise.all(
        subjectsAndMarks.map(async ({ subject_name, marks }) => {
          const updateSubjectQuery = `
            UPDATE subjects
            SET marks = ?
            WHERE StudentId = ? AND subject_name = ?;
          `;
          pool.query(updateSubjectQuery, [marks, StudentId, subject_name]);
        })
      );
  
      // Recalculate percentage and grade in the students table
      
      const updateStudentQuery = `
        UPDATE students
        SET percentage = (
          SELECT AVG(marks) FROM subjects WHERE StudentId = ?
        ), grade = (
          CASE
            WHEN (SELECT AVG(marks) FROM subjects WHERE StudentId = ?) >= 90 THEN 'A+'
            WHEN (SELECT AVG(marks) FROM subjects WHERE StudentId = ?) >= 80 THEN 'A'
            WHEN (SELECT AVG(marks) FROM subjects WHERE StudentId = ?) >= 70 THEN 'B'
            WHEN (SELECT AVG(marks) FROM subjects WHERE StudentId = ?) >= 60 THEN 'C'
            WHEN (SELECT AVG(marks) FROM subjects WHERE StudentId = ?) >= 50 THEN 'D'
            ELSE 'F'
          END
        )
        WHERE StudentId = ?;
      `;
  
      pool.query(updateStudentQuery, [StudentId,StudentId,StudentId,StudentId,StudentId,StudentId, StudentId],(err,result)=>{
        if(err){
          console.log(err);
        }else{
          console.log(result);
        }
      });
  
      res.json({ success: true, message: 'Marks updated successfully.' });
    } catch (error) {
      errorHandler(res, error);
    }
  });
  

// Finding Average 

app.get('/getAverageMarks/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const query = await calculateAverageMarks('studentId', studentId);
    pool.query(query,(err,resu)=>{
      if(err){
        console.log(err);
      }else{
        res.json({ averageMarks: resu[0].averageMarks });
      }
    })
    ;
  } catch (error) {
    console.error('Error calculating average marks:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for calculating average marks based on student name
app.get('/getAverageMarksByName/:studentName', async (req, res) => {
  const { studentName } = req.params;
  try {
    const query = await calculateAverageMarks('studentName', studentName);
    pool.query(query,(err,resu)=>{
      if(err){
        console.log(err);
      }else{
        res.json({ averageMarks: resu[0].averageMarks });
      }
    })
    ;
  } catch (error) {
    console.error('Error calculating average marks:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for calculating average marks based on class
app.get('/getAverageMarksByClass/:class', async (req, res) => {
  const { class: studentClass } = req.params;
  try {
    const query = await calculateAverageMarks('class', studentClass);
    pool.query(query,(err,resu)=>{
      if(err){
        console.log(err);
      }else{
        res.json({ averageMarks: resu[0].averageMarks });
      }
    });
  } catch (error) {
    console.error('Error calculating average marks:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to calculate average marks based on search type and value
const calculateAverageMarks = async (searchType, searchValue) => {
  let whereClause = '';
  if (searchType === 'studentId') {
    whereClause = `WHERE students.StudentId = ${searchValue}`;
  } else if (searchType === 'studentName') {
    whereClause = `WHERE students.FullName = '${searchValue}'`;
  } else if (searchType === 'class') {
    whereClause = `WHERE students.Class = '${searchValue}'`;
  }

  const query = `
    SELECT AVG(subjects.marks) AS averageMarks
    FROM students
    JOIN subjects ON students.StudentId = subjects.StudentId
    ${whereClause}
  `;

  return query; 
};

app.listen(5000,()=>console.log("Listening at port 5000"));