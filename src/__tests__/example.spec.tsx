import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TestComponent from '../components/TestComponent';

describe('Home', () => {
  it('renders a heading', () => {
    render(<TestComponent />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
