import React, { useState, useEffect, useCallback } from 'react';

const CreateAccount = ({ userName, setUserName, password, setPassword, handleCreateAccount, message, setMessage, gotoLogin }) => {

    const [password2, setPassword2] = useState('');

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

    return (
        <div>
            <h1 className='user-profile-title'>Créez votre compte</h1>
            <input type='text' placeholder="Nom d'utilisateur" className='user-profile-input' value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type='password' placeholder='Mot de passe' className='user-profile-input' value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type='password' placeholder='Confirmez votre mot de passe' className='user-profile-input' value={password2} onChange={(e) => setPassword2(e.target.value)} />
            <div className='user-profile-message'> {message} </div>
            <button onClick={checkDatas} className='user-profile-login-button'>Créez votre compte</button>
            <p onClick={gotoLogin} className='user-profile-register'>Vous avez déjà un compte? Connectez-vous.</p>
        </div>
    );
};

export default CreateAccount;