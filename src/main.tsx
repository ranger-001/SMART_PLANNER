import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create a consistent ID element reference
const rootElement = document.getElementById('root');

// Add a console log to help with debugging
console.log('Mounting React app to root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found! Make sure there is a div with id="root" in your HTML');
} else {
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log('React app rendered successfully');
}