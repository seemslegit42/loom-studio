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
    render(<Header onForge={() => {}} isForging={false} />);
    const logoElement = screen.getByText('LOOM');
    expect(logoElement).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Header onForge={() => {}} isForging={false} />);
    const inputElement = screen.getByPlaceholderText(
      'Scribe an incantation to summon a new agent...'
    );
    expect(inputElement).toBeInTheDocument();
  });
});
