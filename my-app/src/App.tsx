import React from 'react';
import logo from './logo.svg';
import CourseYearTable from './tables/CourseYearTable';
import './App.css';
import ProfAverageTable from "./tables/ProfAverageTable";

function App() {
  return (
    <div className="App">
      <h1>Welcome To Our UBC Course Info Generator</h1>
        <br/>
        <br/>
        <h2 className = "CourseTableHeader">UBC Courses Available In Your Year</h2>
        <CourseYearTable/>
        <br/>
        <h2 className = "CourseTableHeader">UBC Course Professor Averages</h2>
        <ProfAverageTable/>
    </div>
  );
}

export default App;
