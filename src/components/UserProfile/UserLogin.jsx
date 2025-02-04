import React, { useEffect } from 'react';

const UserLogin = ({ userName, setUserName, password, setPassword, handleLogin, message, gotoCreateAccount }) => {

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

    return (
        <div>
            <h1 className='user-profile-title'>Connexion</h1>
            <input type='text' placeholder="Nom d'utilisateur" className='user-profile-input' value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type='password' placeholder='Mot de passe' className='user-profile-input' value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className='user-profile-message'> {message} </div>
            <button onClick={handleLogin} className='user-profile-login-button'>Se connecter</button>
            <p onClick={gotoCreateAccount} className='user-profile-register'>Pas de compte? Créez-en un.</p>
        </div>
    );
};

export default UserLogin;