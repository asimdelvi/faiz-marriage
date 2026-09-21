import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { config } from './config';
import { applyTheme } from './lib/theme';
import './index.css';

/* Paint the palette before React mounts so the first frame is already on-brand. */
applyTheme(config.colors);

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
