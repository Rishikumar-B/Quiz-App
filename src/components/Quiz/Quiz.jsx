import React, { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';

// Categorize questions by difficulty
const categorizeQuestions = (questions) => {
  const easy = questions.filter(q => q.difficulty === 'easy' || !q.difficulty);
  const medium = questions.filter(q => q.difficulty === 'medium');
  const hard = questions.filter(q => q.difficulty === 'hard');
  
  return { easy, medium, hard };
};

const Quiz = () => {
  const [gameMode, setGameMode] = useState('classic'); // 'classic' or 'adaptive'
  const [index, setIndex] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1); // 0: easy, 1: medium, 2: hard
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [questionsByDifficulty, setQuestionsByDifficulty] = useState({ easy: [], medium: [], hard: [] });

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const option_array = [option1, option2, option3, option4];

  // Initialize questions by difficulty
  useEffect(() => {
    const categorized = categorizeQuestions(data);
    setQuestionsByDifficulty(categorized);
    
    // Start with medium difficulty questions
    if (categorized.medium.length > 0) {
      setCurrentQuestions(shuffleArray([...categorized.medium]));
      setQuestion(categorized.medium[0]);
    } else if (categorized.easy.length > 0) {
      setCurrentQuestions(shuffleArray([...categorized.easy]));
      setQuestion(categorized.easy[0]);
    }
  }, []);

  // Timer
  useEffect(() => {
    if (!result && question) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [result, question]);

  // Helper function to shuffle array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Get next question based on difficulty
  const getNextQuestion = (currentDiffLevel, wasCorrect) => {
    const { easy, medium, hard } = questionsByDifficulty;
    
    let nextDifficulty = currentDiffLevel;
    
    // Adjust difficulty based on performance
    if (wasCorrect) {
      nextDifficulty = Math.min(currentDiffLevel + 1, 2); // Move to harder questions
    } else {
      nextDifficulty = Math.max(currentDiffLevel - 1, 0); // Move to easier questions
    }
    
    setDifficultyLevel(nextDifficulty);
    
    // Select questions from the appropriate difficulty level
    let availableQuestions = [];
    switch (nextDifficulty) {
      case 0: availableQuestions = easy; break;
      case 1: availableQuestions = medium; break;
      case 2: availableQuestions = hard; break;
      default: availableQuestions = medium;
    }
    
    // If no questions available at this level, try adjacent levels
    if (availableQuestions.length === 0) {
      if (nextDifficulty === 0) availableQuestions = medium;
      else if (nextDifficulty === 2) availableQuestions = medium;
      else availableQuestions = easy.length > 0 ? easy : hard;
    }
    
    // Shuffle and get next question
    const shuffled = shuffleArray([...availableQuestions]);
    return shuffled[0];
  };

  const checkAns = (e, ans, optionIndex) => {
    if (lock === false && question) {
      setSelectedOption(optionIndex);
      setLock(true);
      
      const isCorrect = question.ans === ans;
      
      // Track performance
      setPerformanceHistory(prev => [...prev, {
        questionId: question.id,
        difficulty: question.difficulty || 'medium',
        isCorrect,
        timeSpent: timer
      }]);
      
      if (isCorrect) {
        e.target.classList.add("correct");
        setScore(prev => prev + getPointsForDifficulty(question.difficulty));
      } else {
        e.target.classList.add("wrong");
        option_array[question.ans - 1].current.classList.add("correct");
      }
      
      setTimeout(() => {
        setShowExplanation(true);
      }, 1000);
    }
  }

  const getPointsForDifficulty = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  };

  const next = () => {
    if (lock === true && question) {
      const isCorrect = performanceHistory[performanceHistory.length - 1]?.isCorrect || false;
      
      if (performanceHistory.length >= 10) { // Quiz length
        setResult(true);
        return 0;
      }
      
      // Get next question based on adaptive logic
      const nextQuestion = getNextQuestion(difficultyLevel, isCorrect);
      
      if (nextQuestion) {
        setQuestion(nextQuestion);
        setIndex(prev => prev + 1);
        setLock(false);
        setSelectedOption(null);
        setShowExplanation(false);
        
        option_array.forEach((option) => {
          if (option.current) {
            option.current.classList.remove("wrong");
            option.current.classList.remove("correct");
          }
        });
      } else {
        setResult(true);
      }
    }
  }

  const reset = () => {
    const { medium } = questionsByDifficulty;
    const initialQuestions = shuffleArray([...medium]);
    setQuestion(initialQuestions[0] || data[0]);
    setLock(false);
    setResult(false);
    setScore(0);
    setTimer(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setDifficultyLevel(1);
    setPerformanceHistory([]);
    setIndex(0);
  }

  const startAdaptiveMode = () => {
    setGameMode('adaptive');
    reset();
  }

  const startClassicMode = () => {
    setGameMode('classic');
    reset();
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculatePercentage = () => {
    const totalQuestions = performanceHistory.length;
    const correctAnswers = performanceHistory.filter(p => p.isCorrect).length;
    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  };

  const getScoreMessage = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return "Brilliant! Your mind is sharp! 🧠";
    if (percentage >= 70) return "Great job! You're learning fast! 🚀";
    if (percentage >= 50) return "Good effort! Keep challenging yourself! 💪";
    return "Every expert was once a beginner! Keep going! 🌟";
  };

  const getDifficultyStats = () => {
    const stats = { easy: 0, medium: 0, hard: 0 };
    performanceHistory.forEach(entry => {
      stats[entry.difficulty] = (stats[entry.difficulty] || 0) + 1;
    });
    return stats;
  };

  // Game mode selection screen
  if (!gameMode && !result) {
    return (
      <div className='mode-selection'>
        <div className='mode-card'>
          <h1>🎮 Quiz Modes</h1>
          <p>Choose your challenge!</p>
          
          <div className='mode-options'>
            <div className='mode-option' onClick={startClassicMode}>
              <div className='mode-icon'>📚</div>
              <h3>Classic Mode</h3>
              <p>Traditional fixed-difficulty quiz</p>
              <ul>
                <li>✅ Consistent difficulty</li>
                <li>✅ Predictable progression</li>
                <li>✅ Standard scoring</li>
              </ul>
            </div>
            
            <div className='mode-option' onClick={startAdaptiveMode}>
              <div className='mode-icon'>🧠</div>
              <h3>Adaptive Challenge</h3>
              <p>AI-powered quiz that adapts to your skill level!</p>
              <ul>
                <li>🤖 Smart difficulty adjustment</li>
                <li>🎯 Personalized questions</li>
                <li>📊 Dynamic scoring (Easy:1pt, Medium:2pt, Hard:3pt)</li>
                <li>🚀 Optimal learning curve</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return <div className='loading'>Loading quiz...</div>;
  }

  return (
    <div className='quiz-container'>
      <div className='quiz-header'>
        <h1>
          {gameMode === 'adaptive' ? '🧠 Adaptive Quiz' : '📚 Classic Quiz'}
          <button className='mode-switch-btn' onClick={() => setGameMode(null)}>
            🔄 Switch Mode
          </button>
        </h1>
        <div className='quiz-stats'>
          <div className='timer'>⏱️ {formatTime(timer)}</div>
          
          {gameMode === 'adaptive' && (
            <div className={`difficulty-indicator ${question.difficulty}`}>
              {question.difficulty === 'easy' && '🌱 Easy'}
              {question.difficulty === 'medium' && '⚡ Medium'}
              {question.difficulty === 'hard' && '🚀 Hard'}
            </div>
          )}
          
          <div className='progress'>Question {index + 1} of 10</div>
          <div className='score'>Score: {score}</div>
        </div>
      </div>

      <div className='progress-bar'>
        <div 
          className='progress-fill' 
          style={{width: `${((index + 1) / 10) * 100}%`}}
        ></div>
      </div>

      {result ? (
        <div className='result-section'>
          <div className='result-card'>
            <h2>Quiz Completed! 🎊</h2>
            <div className='score-circle'>
              <span className='score-percent'>{calculatePercentage()}%</span>
              <span className='score-text'>{performanceHistory.filter(p => p.isCorrect).length}/10 correct</span>
            </div>
            
            {gameMode === 'adaptive' && (
              <div className='adaptive-stats'>
                <h3>📈 Your Learning Journey</h3>
                <div className='difficulty-breakdown'>
                  <div className='diff-stat'>
                    <span className='diff-label easy'>🌱 Easy</span>
                    <span className='diff-count'>{getDifficultyStats().easy}</span>
                  </div>
                  <div className='diff-stat'>
                    <span className='diff-label medium'>⚡ Medium</span>
                    <span className='diff-count'>{getDifficultyStats().medium}</span>
                  </div>
                  <div className='diff-stat'>
                    <span className='diff-label hard'>🚀 Hard</span>
                    <span className='diff-count'>{getDifficultyStats().hard}</span>
                  </div>
                </div>
                <div className='performance-trend'>
                  <p>
                    Your final difficulty level: 
                    <strong className={`trend-${question.difficulty}`}>
                      {question.difficulty === 'easy' ? ' Beginner' : 
                       question.difficulty === 'medium' ? ' Intermediate' : ' Advanced'}
                    </strong>
                  </p>
                </div>
              </div>
            )}
            
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
              <div className='stat'>
                <span className='stat-label'>Total Score</span>
                <span className='stat-value'>{score}</span>
              </div>
            </div>
            
            <div className='result-actions'>
              <button onClick={reset} className="play-again-btn">
                🔄 Play Again
              </button>
              <button onClick={() => setGameMode(null)} className="switch-mode-btn">
                🎮 Change Mode
              </button>
            </div>
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
                {index === 9 ? 'Finish Quiz' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz;