import { Providers } from './providers/index.js';
import { AppRoutes } from './routes/index.js';
import './App.css';

/**
 * Main application component
 */
function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
