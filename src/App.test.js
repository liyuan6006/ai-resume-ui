import { render, screen } from '@testing-library/react';
import App from './App';

test('renders personal profile assistant heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /personal profile assistant/i });
  expect(heading).toBeInTheDocument();
});
