import React , {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './welcome.css'; // Import the CSS file

const WelcomePage = () => {
  return (
    <div className="container">
      <h1 className="title">Welcome to DoIt!</h1>
      <p className="message">
        "The secret of getting ahead is getting started." - Mark Twain
      </p>
      <p className="encouragement">
        "Every accomplishment starts with the decision to try."
      </p>
      <p className="encouragement">
        "Small steps every day lead to big achievements."
      </p>
      <div className="button-container">
        <button className="button">
          Get Started
        </button>
        
       
      </div>
    </div>
  );
};

export default WelcomePage;
