import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import './index.css'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
