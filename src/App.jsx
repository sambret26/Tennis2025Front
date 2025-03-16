import React, { useState, useEffect, createContext, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Ajoutez useNavigate
import { getStartAndEndDate } from './api/competitionService';
import { getProfils } from './api/profilsService';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';
import { ADMIN } from './utils/constants';
import Sidebar from './components/Sidebar/Sidebar';
import UserProfile from './components/UserProfile/UserProfile';
import Home from './components/Home/Home';
import Calendar from './components/Calendar/Calendar';
import Availability from './components/Availability/Availability';
import Players from './components/Players/Players';
import Account from './components/Account/Account';
import Settings from './components/Settings/Settings';
import Error from './components/Error/Error';
import NotFound from './components/NotFound/NotFound';
import Loader from './components/Loader/Loader';
import './App.css';


export const GlobalContext = createContext();

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [defaultDate, setDefaultDate] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profils, setProfils] = useState([]);
  const [globalSuccessMessage, setGlobalSuccessMessage] = useState('');
  const [globalErrorMessage, setGlobalErrorMessage] = useState('');
  const [globalLoadingMessage, setGlobalLoadingMessage] = useState('');
  const [error, setError] = useState(true);
  const [settingError, setSettingError] = useState(false);
  const [reload, setReload] = useState(false)
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const connect = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      try {
        const data = jwtDecode(token);
        setUsername(data.name);
        setUserId(data.id);
        setRole(parseInt(data.profileValue));
      } catch (error) {
        console.error('Error decoding token:', error);
        throw error;
      }
    };

    const loadDates = async () => {
      try {
        const data = await getStartAndEndDate();
        if (!data) {
          setGlobalErrorMessage('Aucune compétition n\'est configurée!');
          setError(false);
          setSettingError(true);
          if (role === ADMIN) navigate('/settings')
          else navigate('/profil');
          return;
        }
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
        setError(false);
        setSettingError(false);
      } catch (error) {
        console.error('Error fetching dates:', error);
        navigate('/error');
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
    };
    connect();
    loadDates();
    loadProfils();
  }, [navigate, reload, role]);

  useEffect(() => {
    if (globalSuccessMessage) {
      messageApi.open({
        type: 'success',
        content: globalSuccessMessage,
      });
      setGlobalSuccessMessage('');
    }
  }, [globalSuccessMessage, messageApi]);

  useEffect(() => {
    if (globalErrorMessage) {
      messageApi.open({
        type: 'error',
        content: globalErrorMessage,
      });
      setGlobalErrorMessage('');
    }
  }, [globalErrorMessage, messageApi]);

  useEffect(() => {
    if (globalLoadingMessage) {
      messageApi.open({
        type: 'loading',
        content: globalLoadingMessage,
      });
      setGlobalLoadingMessage('');
    }
  }, [globalLoadingMessage, messageApi]);

  const value = useMemo(() => {

    const getRoleName = (role) => {
      switch (role) {
        case 0:
          return 'Visiteur';
        case 1:
          return 'Staff';
        case 2:
          return 'Admin';
        default:
          return 'Inconnu';
      }
    };

    return {
      setGlobalErrorMessage,
      setGlobalSuccessMessage,
      setGlobalLoadingMessage,
      role,
      setRole,
      getRoleName
    }
  }, [setGlobalErrorMessage, setGlobalSuccessMessage, setGlobalLoadingMessage, role, setRole]);


  const getAppRouter = () => {
    if (isLoading) {
      return <Loader message="Chargement de l'application..." />;
    }
    if (error) {
      return <Error />;
    }
    if (settingError) {
      return (
        <Routes>
          <Route path="/profil" element={<UserProfile username={username} setUsername={setUsername} userId={userId} setUserId={setUserId} profils={profils} />} />
          <Route path="/settings" element={<Settings setSettingError={setSettingError} setReload={setReload} />} />
        </Routes>
      )
    }
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home startDate={startDate} endDate={endDate} defaultDate={defaultDate}/>} />
        <Route path="/profil" element={<UserProfile username={username} setUsername={setUsername} userId={userId} setUserId={setUserId} profils={profils} />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/availability" element={<Availability startDate={startDate} endDate={endDate} />} />
        <Route path="/players" element={<Players startDate={startDate} endDate={endDate} defaultDate={defaultDate} />} />
        <Route path="/account" element={<Account startDate={startDate} endDate={endDate} />} />
        <Route path="/settings" element={<Settings setSettingError={setSettingError} setReload={setReload} />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  };

  return (
    <GlobalContext.Provider value={value}>
      {contextHolder}
      <div className="app-container">
        <Sidebar error={error} settingError={settingError} />
        <div className="content">
          {getAppRouter()}
        </div>
      </div>
    </GlobalContext.Provider>
  );
  
}

export default App;