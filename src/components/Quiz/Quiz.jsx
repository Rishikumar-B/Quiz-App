import React, { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const option_array = [option1, option2, option3, option4];

  // Timer effect
  useEffect(() => {
    if (!result) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [result]);

  const checkAns = (e, ans, optionIndex) => {
    if (lock === false) {
      setSelectedOption(optionIndex);
      setLock(true);
      
      if (question.ans === ans) {
        e.target.classList.add("correct");
        setScore(prev => prev + 1);
      } else {
        e.target.classList.add("wrong");
        option_array[question.ans - 1].current.classList.add("correct");
      }
      
      // Show explanation after a delay
      setTimeout(() => {
        setShowExplanation(true);
      }, 1000);
    }
  }

  const next = () => {
    if (lock === true) {
      if (index === data.length - 1) {
        setResult(true);
        return 0;
      }
      setIndex(prev => prev + 1);
      setQuestion(data[index + 1]);
      setLock(false);
      setSelectedOption(null);
      setShowExplanation(false);
      
      option_array.forEach((option) => {
        if (option.current) {
          option.current.classList.remove("wrong");
          option.current.classList.remove("correct");
        }
      });
    }
  }

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setLock(false);
    setResult(false);
    setScore(0);
    setTimer(0);
    setSelectedOption(null);
    setShowExplanation(false);
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculatePercentage = () => {
    return Math.round((score / data.length) * 100);
  };

  const getScoreMessage = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return "Excellent! 🎉";
    if (percentage >= 70) return "Great job! 👍";
    if (percentage >= 50) return "Good effort! 😊";
    return "Keep practicing! 💪";
  };

  return (
    <div className='quiz-container'>
      <div className='quiz-header'>
        <h1>🧠 Brainy Quiz</h1>
        <div className='quiz-stats'>
          <div className='timer'>⏱️ {formatTime(timer)}</div>
          <div className='progress'>Question {index + 1} of {data.length}</div>
          <div className='score'>Score: {score}</div>
        </div>
      </div>

      <div className='progress-bar'>
        <div 
          className='progress-fill' 
          style={{width: `${((index + 1) / data.length) * 100}%`}}
        ></div>
      </div>

      {result ? (
        <div className='result-section'>
          <div className='result-card'>
            <h2>Quiz Completed! 🎊</h2>
            <div className='score-circle'>
              <span className='score-percent'>{calculatePercentage()}%</span>
              <span className='score-text'>{score}/{data.length} correct</span>
            </div>
            <p className='score-message'>{getScoreMessage()}</p>
            <div className='quiz-stats-final'>
              <div className='stat'>
                <span className='stat-label'>Time Taken</span>
                <span className='stat-value'>{formatTime(timer)}</span>
              </div>
              <div className='stat'>
                <span className='stat-label'>Accuracy</span>
                <span className='stat-value'>{calculatePercentage()}%</span>
              </div>
            </div>
            <button onClick={reset} className="play-again-btn">
              🔄 Play Again
            </button>
          </div>
        </div>
      ) : (
        <div className='question-section'>
          <div className='question-card'>
            <h2 className='question-text'>
              <span className='question-number'>Q{index + 1}.</span>
              {question.question}
            </h2>
            
            <div className='options-grid'>
              {['option1', 'option2', 'option3', 'option4'].map((option, idx) => (
                <div
                  key={idx}
                  ref={option_array[idx]}
                  className={`option-card ${selectedOption === idx ? 'selected' : ''}`}
                  onClick={(e) => checkAns(e, idx + 1, idx)}
                >
                  <span className='option-letter'>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className='option-text'>{question[option]}</span>
                </div>
              ))}
            </div>

            {showExplanation && question.explanation && (
              <div className='explanation'>
                <strong>💡 Explanation:</strong> {question.explanation}
              </div>
            )}

            <div className='navigation'>
              <button 
                onClick={next} 
                className="next-btn"
                disabled={!lock}
              >
                {index === data.length - 1 ? 'Finish Quiz' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz;