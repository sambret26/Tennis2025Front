import React, { useState, useEffect, useCallback } from 'react';

const CreateAccount = ({ userName, setUserName, password, setPassword, handleCreateAccount, message, setMessage, gotoLogin }) => {

    const [password2, setPassword2] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const setInitialMessage = useCallback(() => {
        setMessage('Attention, ne rentrez pas un mot de passe important, un opérateur peut le voir.');
    }, [setMessage]);

    useEffect(() => {

        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleCreateAccount ();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleCreateAccount]);

    useEffect(() => {
        setInitialMessage();
    }, [setInitialMessage]);

    const checkDatas = () => {
        if(password !== password2) {
            setMessage('Les mots de passe ne correspondent pas.');
            return false;
        }
        setInitialMessage();
        handleCreateAccount();
    };

    useEffect(() => {
        let timer;
        if (showPassword) {
            timer = setTimeout(() => {
                setShowPassword(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showPassword]);

    useEffect(() => {
        let timer;
        if (showPassword2) {
            timer = setTimeout(() => {
                setShowPassword2(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showPassword2]);

    return (
        <div>
            <h1 className='user-profile-title'>Créez votre compte</h1>
            <input type='text' placeholder="Nom d'utilisateur" className='user-profile-input username-input' value={userName} onChange={(e) => setUserName(e.target.value)} />
            <div className = 'password-input-container'>
                <input type={showPassword ? 'text' : 'password'} placeholder='Mot de passe' className='user-profile-input' value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className = 'password-icon' onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
            </div>
            <div className = 'password-input-container'>
                <input type={showPassword2 ? 'text' : 'password'} placeholder='Confirmez votre mot de passe' className='user-profile-input' value={password2} onChange={(e) => setPassword2(e.target.value)} />
                <span className = 'password-icon' onClick={() => setShowPassword2(!showPassword2)}>{showPassword2 ? '🙈' : '👁️'}</span>
            </div>
            <div className='user-profile-message'> {message} </div>
            <button onClick={checkDatas} className='user-profile-login-button'>Créez votre compte</button>
            <div>
                <p onClick={gotoLogin} className='link'>Vous avez déjà un compte? Connectez-vous.</p>
            </div>
        </div>
    );
};

export default CreateAccount;