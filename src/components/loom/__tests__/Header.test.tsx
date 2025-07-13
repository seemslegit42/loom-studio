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
    render(<Header onForge={() => {}} />);
    const logoElement = screen.getByText('LOOM');
    expect(logoElement).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Header onForge={() => {}} />);
    const inputElement = screen.getByPlaceholderText(
      'Scribe an incantation or select an archetype to begin...'
    );
    expect(inputElement).toBeInTheDocument();
  });
});
