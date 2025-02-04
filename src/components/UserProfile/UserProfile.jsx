import React, { useState } from 'react';
import { connectUser, createAccount } from '../../api/userService';
import UserLogin from './UserLogin';
import CreateAccount from './CreateAccount';
import UserData from './UserData';
import './UserProfile.css';
import { jwtDecode } from 'jwt-decode';
import TransparentLoader from '../Loader/TransparentLoader';

const UserProfile = ({username, setUsername, userId, setUserId, role, setRole, profils}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(userId !== null);
    const [userNameValue, setUserNameValue] = useState(username || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [tryToCreateAccount, setTryToCreateAccount] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const checkDatas = (min6) => {
        if (userNameValue === '') {
            setMessage("Veuillez rentrer un nom d'utilisateur.");
            return false;
        }
        if (password === '') {
            setMessage("Veuillez rentrer un mot de passe.");
            return false;
        }
        if (min6 && password.length < 6) {
            setMessage("Le mot de passe doit contenir au moins 6 caractères.");
            return false;
        }
        return true;
    }

    const login = (token) => {
        const data = jwtDecode(token);
        setUsername(data.name);
        setIsLoggedIn(true);
        setRole(parseInt(data.profileValue));
        setUserId(data.id);
    }

    const handleLogin = () => {
        setMessage('');
        if (checkDatas(false) === false) return;
        setIsLoading(true);
        connectUser(userNameValue, password).then(data => {
            if(data === 401 || data === 404) {
                setMessage("Le nom d'utilisateur ou le mot de passe est incorrect.");
                return;
            }
            if(data.token) {
                localStorage.setItem('token', data.token);
                login(data.token)
            }
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const handleCreateAccount = () => {
        setMessage('');
        if (checkDatas(true) === false) return;
        setIsLoading(true);
        createAccount(userNameValue, password).then(data => {
            if(data === 409) {
                setMessage("Le nom d'utilisateur est déjà utilisé.");
                return;
            }
            if(data.token) {
                localStorage.setItem('token', data.token);
                login(data.token);
            }
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const gotoCreateAccount = () => {
        setTryToCreateAccount(true);
        setUserNameValue('');
        setPassword('');
        setMessage('');
    };

    const gotoLogin = () => {
        setTryToCreateAccount(false);
        setUserNameValue('');
        setPassword('');
        setMessage('');
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUsername(null);
        setIsLoggedIn(false);
        setUserId(null);
        setRole(0);
        setUserNameValue('');
        setPassword('');
    };

    const renderComponent = () => {
        if(isLoading) return <TransparentLoader message="Chargement du profil..." />
        if(isLoggedIn) return <UserData userName={username} userId={userId} role={role} setRole={setRole} handleLogout={handleLogout} profils={profils}/>;
        if(tryToCreateAccount) return <CreateAccount userName={userNameValue} setUserName={setUserNameValue} password={password} setPassword={setPassword} handleCreateAccount={handleCreateAccount} message={message} setMessage={setMessage} gotoLogin={gotoLogin} />;
        return <UserLogin userName={userNameValue} setUserName={setUserNameValue} password={password} setPassword={setPassword} handleLogin={handleLogin} message={message} gotoCreateAccount={gotoCreateAccount} />;
    }


    return (
        <div>
            {renderComponent()}
        </div>
    );
};

export default UserProfile;