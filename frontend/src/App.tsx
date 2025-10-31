// src/App.tsx
import React from 'react';
import Navbar from './module-1/home/components/Navbar'; 
import Footer from './module-1/home/components/Footer';// Adjust the path if necessary
import HeroSection from './module-1/home/components/HeroSection';
import SectionOne from './module-1/home/components/SectionOne';
// import './App.css'; // Import your main App styles if needed

function App() {
  // Example state from default CRA, remove if not needed
  // const [count, setCount] = useState<number>(0);

  return (
    <div className="App">
      <Navbar />
      <HeroSection/>
      <SectionOne/>
      <Footer/>
      {/* Your other components can go here */}
      {/* <header className="App-header">
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header> */}
    </div>
  );
}

export default App;
