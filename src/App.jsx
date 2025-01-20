import React, { useState} from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import Calendar from './components/Calendar/Calendar';
import Availability from './components/Availability/Availability';
import Players from './components/Players/Players';
import Accounts from './components/Accounts/Accounts';
import Settings from './components/Settings/Settings';
import './App.css';

function App() {
  const [activeComponent, setActiveComponent] = useState('home'); // État pour suivre le composant actif

  const renderComponent = () => {
      switch (activeComponent) {
          case 'home':
              return <Home />;
          case 'calendar':
              return <Calendar />;
          case 'availability':
              return <Availability />;
          case 'players':
              return <Players />;
          case 'accounts':
              return <Accounts />;
          case 'settings':
              return <Settings />;
          default:
              return <Home />;
      }
  };

  return (
      <div className="app-container">
          <Sidebar setActiveComponent={setActiveComponent} />
          <div className="content">
              {renderComponent()} {/* Affiche le composant actif */}
          </div>
      </div>
  );
}

export default App;