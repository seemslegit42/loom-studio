import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/components/loom/header';
import '@testing-library/jest-dom';

// Mock the usePromptAnalysis hook
jest.mock('@/hooks/use-prompt-analysis', () => ({
  usePromptAnalysis: () => ({
    analysis: null,
    isLoading: false,
  }),
}));

describe('Header', () => {
  it('renders the application logo', () => {
    render(<Header />);
    const logoElement = screen.getByText('ΛΞVON');
    expect(logoElement).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Header />);
    const inputElement = screen.getByPlaceholderText(
      'BEEP: Scribe a new agent to analyze market sentiment...'
    );
    expect(inputElement).toBeInTheDocument();
  });
});
