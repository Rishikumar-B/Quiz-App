# Quiz App

A simple and interactive **Quiz Application** built with **React**. Users can answer multiple-choice questions, get immediate feedback, track their score, and reset the quiz to try again.
---

## Features

- **Single Question Display:** Shows one question at a time with four options.  
- **Immediate Feedback:** Highlights correct or wrong answers when an option is selected.  
- **Score Tracking:** Keeps track of the user’s score and displays it at the end.  
- **Reset Quiz:** Restart the quiz at any time.  
- **Progress Indicator:** Shows the current question out of total.

---

## Tech Stack

- **Frontend:** React.js  
- **Styling:** CSS  
- **State Management:** React Hooks (`useState`, `useRef`)  
- **Data:** Local JSON array of quiz questions

---

## Main React Concepts Used

- **useState:** To manage current question, score, answer lock, and result state.  
- **useRef:** To access DOM elements for highlighting correct/wrong answers.  
- **Conditional Rendering:** To show either the quiz or the final result.  
- **Event Handling:** To handle clicks on options and navigation between questions.  
- **Array Mapping:** For resetting option styles dynamically on each new question.

---

## Project Structure

<img width="605" height="456" alt="image" src="https://github.com/user-attachments/assets/56473957-39bc-4200-9675-2a73c648173b" />

## Future Enhancements

Add a timer for each question.

Store user progress using local storage.

Fetch quiz questions from an API instead of local JSON.

Add multiple quiz categories and difficulty levels.

