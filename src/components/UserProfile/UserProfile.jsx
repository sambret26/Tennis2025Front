import React, { useState, useContext } from 'react';
import { connectUser, createAccount } from '../../api/userService';
import { jwtDecode } from 'jwt-decode';
import { GlobalContext } from '../../App';import UserLogin from './UserLogin';
import { MESSAGES, LOADER } from '../../utils/constants';
import CreateAccount from './CreateAccount';
import UserData from './UserData';
import TransparentLoader from '../Loader/TransparentLoader';

import './UserProfile.css';

const UserProfile = ({username, setUsername, userId, setUserId, profils}) => {
    const { role, setRole, setGlobalSuccessMessage, setGlobalErrorMessage } = useContext(GlobalContext);

    const [isLoggedIn, setIsLoggedIn] = useState(userId !== null);
    const [userNameValue, setUserNameValue] = useState(username || '');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const [tryToCreateAccount, setTryToCreateAccount] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const checkDatas = (min6) => {
        if (userNameValue === '') {
            setMessage(MESSAGES.ERROR.PUT_USERNAME);
            return false;
        }
        if (password === '') {
            setMessage(MESSAGES.ERROR.PUT_PASSWORD);
            return false;
        }
        if (min6 && password.length < 6) {
            setMessage(MESSAGES.MIN_PASSWORD);
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
                setMessage(MESSAGES.ERROR.INVALID);
                return;
            }
            if(data.token) {
                localStorage.setItem('token', data.token);
                login(data.token)
            }
            setGlobalSuccessMessage(MESSAGES.SUCCESS.CONNECTION);
        }).catch(error => {
            console.error(error);
            setGlobalErrorMessage(MESSAGES.ERROR.CONNECTION);
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
                setMessage(MESSAGES.ERROR.USERNAME_ALREADY_EXISTS);
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
        setPassword2('');
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
        if(isLoading) return <TransparentLoader message={LOADER.PROFIL} />
        if(isLoggedIn) return <UserData userName={username} userId={userId} role={role} setRole={setRole} handleLogout={handleLogout} profils={profils}/>;
        if(tryToCreateAccount) return <CreateAccount userName={userNameValue} setUserName={setUserNameValue} password={password} setPassword={setPassword} password2={password2} setPassword2={setPassword2} handleCreateAccount={handleCreateAccount} message={message} setMessage={setMessage} gotoLogin={gotoLogin} />;
        return <UserLogin userName={userNameValue} setUserName={setUserNameValue} password={password} setPassword={setPassword} handleLogin={handleLogin} message={message} gotoCreateAccount={gotoCreateAccount} />;
    }


    return (
        <div>
            {renderComponent()}
        </div>
    );
};

export default UserProfile;