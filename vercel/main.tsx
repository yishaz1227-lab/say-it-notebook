import { createRoot } from 'react-dom/client';
import Home from '../app/page';
import '../app/globals.css';
import '../app/scrapbook.css';

// Reuse the original client component, including hash navigation, storage,
// recording and all responsive styles. No second implementation of the app.
createRoot(document.getElementById('root')!).render(<Home />);
