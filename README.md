# Quiz-App

A simple and interactive Quiz Application built with React. Users can answer multiple-choice questions, get immediate feedback for correct or wrong answers, track their score, and reset the quiz to try again.

Features

Displays one question at a time with four options.

Immediate feedback for correct and wrong answers.

Highlights the correct answer if the user selects the wrong one.

Tracks and displays the user’s score at the end.

Reset functionality to restart the quiz.

Shows progress: current question out of total.

Tech Stack

Frontend: React.js

Styling: CSS (custom)

State Management: React Hooks

Data: Local JSON array of quiz questions

Main React Concepts Used

useState: To manage state for current question, score, lock (answer selected), and result.

useRef: To access DOM elements for dynamically applying CSS classes (correct/wrong answer highlighting).

Conditional Rendering: To show either the quiz or the result screen based on user progress.

Event Handling: To handle clicks on options and navigation between questions.

Array Mapping: For clearing styles dynamically on each new question.

Project Structure
quiz-app/
│
├── src/
│   ├── assets/
│   │   └── data.js        # Quiz questions array
│   ├── components/
│   │   └── Quiz.jsx       # Main Quiz component
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
├── package.json
└── Quiz.css

How to Run

Clone the repository:

git clone <repository_url>


Navigate to the project folder:

cd quiz-app


Install dependencies:

npm install


Start the development server:

npm start


Open http://localhost:3000
 in your browser to view the app.

Future Enhancements

Add timer for each question.

Store user progress using local storage.

Fetch quiz questions from an API instead of local JSON.

Add multiple quiz categories and difficulty levels.
