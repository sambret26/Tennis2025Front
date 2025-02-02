import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import Calendar from './components/Calendar/Calendar';
import Availability from './components/Availability/Availability';
import Players from './components/Players/Players';
import Account from './components/Account/Account';
import Settings from './components/Settings/Settings';
import { getStartAndEndDate } from './api/settingsService';

import './App.css';

function App() {
  const [activeComponent, setActiveComponent] = useState('home'); // État pour suivre le composant actif
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [defaultDate, setDefaultDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDates = async () => {
        try {
            const data = await getStartAndEndDate();
            const startDateObj = new Date(data.startDate);
            const endDateObj = new Date(data.endDate);
            
            setStartDate(startDateObj);
            setEndDate(endDateObj);

            const today = new Date();
            if (today < startDateObj) {
                setDefaultDate(startDateObj);
             } else if (today > endDateObj) {
                setDefaultDate(endDateObj);
             } else {
                setDefaultDate(today);
             }

        } catch (error) {
            console.error('Error fetching dates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    loadDates();
    }, []); // Exécutez une seule fois au chargement du composant

  const renderComponent = () => {
    if (isLoading) {
        return <div>Loading...</div>; // Affichez un message de chargement ou un spinner
    }

    switch (activeComponent) {
        case 'home':
            return <Home startDate={startDate} endDate={endDate} defaultDate={defaultDate} />;
        case 'calendar':
            return <Calendar />;
        case 'availability':
            return <Availability startDate={startDate} endDate={endDate} />;
        case 'players':
            return <Players startDate={startDate} endDate={endDate} defaultDate={defaultDate} />;
        case 'account':
            return <Account startDate={startDate} endDate={endDate} />;
        case 'settings':
            return <Settings />;
        default:
        return <Home startDate={startDate} endDate={endDate} defaultDate={defaultDate} />;
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