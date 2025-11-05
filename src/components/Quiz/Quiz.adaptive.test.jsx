import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Quiz from './Quiz';

// Mock the data module to provide test data
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

describe('Adaptive Mode', () => {
  test('shows difficulty indicator in adaptive mode', async () => {
    render(<Quiz />);
    
    // Switch to mode selection first
    const switchModeBtn = screen.getByText('🔄 Switch Mode');
    fireEvent.click(switchModeBtn);
    
    // Start in adaptive mode
    const adaptiveMode = screen.getByText('Adaptive Challenge');
    fireEvent.click(adaptiveMode);
    
    // Check for difficulty indicator
    await screen.findByText(/🌱 Easy|⚡ Medium|🚀 Hard/);
    const difficultyIndicator = screen.getByText(/🌱 Easy|⚡ Medium|🚀 Hard/);
    expect(difficultyIndicator).toBeInTheDocument();
  });
});