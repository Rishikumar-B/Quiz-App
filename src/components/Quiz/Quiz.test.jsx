import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Quiz from './Quiz';

// Mock the data module
vi.mock('../../assets/data', () => ({
  data: [
    {
      id: 1,
      question: 'What is 2 + 2?',
      option1: '3',
      option2: '4',
      option3: '5',
      option4: '6',
      ans: 2,
      difficulty: 'easy',
      explanation: 'Basic math'
    },
    {
      id: 2,
      question: 'What is the capital of France?',
      option1: 'London',
      option2: 'Berlin',
      option3: 'Paris',
      option4: 'Madrid',
      ans: 3,
      difficulty: 'medium',
      explanation: 'Geography knowledge'
    }
  ]
}));

describe('Quiz Component', () => {
  test('renders quiz title', async () => {
    render(<Quiz />);
    
    // Should start with classic mode, so check for classic quiz title
    await screen.findByText('📚 Classic Quiz');
    const quizTitle = screen.getByText('📚 Classic Quiz');
    expect(quizTitle).toBeInTheDocument();
  });

  test('renders the first question', async () => {
    render(<Quiz />);
    
    // Wait for question to load and check
    await screen.findByText(/Q1\./);
    const question = screen.getByText(/Q1\./);
    expect(question).toBeInTheDocument();
  });

  test('renders all options', async () => {
    render(<Quiz />);
    
    // Wait for options to appear
    await screen.findByText(/Q1\./);
    
    // Options should be rendered
    const optionCards = document.querySelectorAll('.option-card');
    expect(optionCards.length).toBe(4); // Should have 4 options
  });
});