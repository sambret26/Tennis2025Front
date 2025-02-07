import React, { useEffect, useState } from 'react';

const UserLogin = ({ userName, setUserName, password, setPassword, handleLogin, message, gotoCreateAccount }) => {

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleLogin();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleLogin]);

    useEffect(() => {
        let timer;
        if (showPassword) {
            timer = setTimeout(() => {
                setShowPassword(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showPassword]);

    return (
        <div>
            <h1 className='user-profile-title'>Connexion</h1>
            <input type='text' placeholder="Nom d'utilisateur" className='user-profile-input username-input' value={userName} onChange={(e) => setUserName(e.target.value)} />
            <div className = 'password-input-container'>
                <input type={showPassword ? 'text' : 'password'} placeholder='Mot de passe' className='user-profile-input' value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className = 'password-icon' onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
            </div>
            <div className='user-profile-message'> {message} </div>
            <button onClick={handleLogin} className='user-profile-login-button'>Se connecter</button>
            <div>
                <p onClick={gotoCreateAccount} className='link'>Pas de compte? Créez-en un.</p>
            </div>
        </div>
    );
};

export default UserLogin;