import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import UserProfile from './components/UserProfile/UserProfile';
import Home from './components/Home/Home';
import Calendar from './components/Calendar/Calendar';
import Availability from './components/Availability/Availability';
import Players from './components/Players/Players';
import Account from './components/Account/Account';
import Settings from './components/Settings/Settings';
import { getStartAndEndDate } from './api/settingsService';
import { getProfils } from './api/profilsService';
import {jwtDecode } from 'jwt-decode';
import './App.css';
import Loader from './components/Loader/Loader';
import { message } from 'antd';

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [activeComponent, setActiveComponent] = useState('home'); // État pour suivre le composant actif
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [defaultDate, setDefaultDate] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(0);
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [profils, setProfils] = useState([]);
  const [globalSuccessMessage, setglobalSuccessMessage] = useState('');
  const [globalErrorMessage, setglobalErrorMessage] = useState('');

  useEffect(() => {

    const connect = () => {
        const token = localStorage.getItem('token');
        if(!token) {
            return;
        }
        const data = jwtDecode(token);
        setUsername(data.name);
        setUserId(data.id);
        setRole(parseInt(data.profileValue));
    }

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

    const loadProfils = async () => {
        try {
            const data = await getProfils();
            setProfils(data);
        } catch (error) {
            console.error('Error fetching profils:', error);
        }
    }

    connect();
    loadDates();
    loadProfils();
    }, []); // Exécutez une seule fois au chargement du composant

    useEffect(() => {
        if (globalSuccessMessage) {
            messageApi.open({
                type: 'success',
                content: globalSuccessMessage,
            });
            setglobalSuccessMessage('');
        }
    }, [globalSuccessMessage, messageApi]);

    useEffect(() => {
        if (globalErrorMessage) {
            messageApi.open({
                type: 'error',
                content: globalErrorMessage,
            });
            setglobalErrorMessage('');
        }
    }, [globalErrorMessage, messageApi]);

  const renderComponent = () => {
    if (isLoading) {
        return <Loader message="Chargement de l'application..." />;
    }

    switch (activeComponent) {
        case 'profil':
            return <UserProfile username={username} setUsername={setUsername} userId={userId} setUserId={setUserId} role={role} setRole={setRole} profils={profils} />;
        case 'home':
            return <Home startDate={startDate} endDate={endDate} defaultDate={defaultDate} role={role} />;
        case 'calendar':
            return <Calendar />;
        case 'availability':
            return <Availability startDate={startDate} endDate={endDate} role={role} />;
        case 'players':
            return <Players startDate={startDate} endDate={endDate} defaultDate={defaultDate} role={role} />;
        case 'account':
            return <Account startDate={startDate} endDate={endDate} />;
        case 'settings':
            return <Settings setGlobalSuccessMessage={setglobalSuccessMessage} setGlobalErrorMessage={setglobalErrorMessage} />;
        default:
        return <Home startDate={startDate} endDate={endDate} defaultDate={defaultDate} />;
    }
  };

  return (
    <>
    {contextHolder}
      <div className="app-container">
          <Sidebar setActiveComponent={setActiveComponent} role={role} />
          <div className="content">
              {renderComponent()} {/* Affiche le composant actif */}
          </div>
      </div>
  </>
  );
}

export default App;