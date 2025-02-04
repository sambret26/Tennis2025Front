import React, { useEffect, useState, useCallback } from 'react';
import { connectAdmin } from '../../../../api/userService';
import './AdminConnectionModal.css';
import TransparentLoader from '../../../Loader/TransparentLoader';

const AdminConnectionModal = ({ role, setRole, onClose, userId }) => {
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const adminConnection = useCallback(() => {
        setMessage('');
        if(password === '') {
            setMessage("Merci de rentrer un mot de passe admin.");
            return;
        }
        setIsLoading(true);
        connectAdmin(password, userId, role).then(data => {
            if(data === 401 || data === 403) {
                setMessage("Le mot de passe admin est incorrect.");
                return;
            }
            if(!data.token) {
                throw new Error('Failed to connect user');
            }
            setRole(parseInt(role));
            localStorage.setItem('token', data.token);
            onClose();
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [onClose, role, setRole, password, userId]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                adminConnection();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [adminConnection]);

    return (
        <div className="admin-connection-modal">
            <div className="admin-connection-content">
                <div className='admin-connection-header'>
                    <h2 className='admin-connection-title'>Connexion admin</h2>
                    <button className="close-button-admin" onClick={onClose}>✖</button>
                </div>
                <div>
                    <input type='password' placeholder='Mot de passe admin' className='user-profile-input' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className='admin-connection-message'> {message} </div>
                </div>
                <div className='admin-connection-button'>
                    <button className='admin-connection-green-button' onClick={adminConnection}>Connexion</button>
                </div>
            </div>
            {isLoading && <TransparentLoader message="Connexion admin en cours..." />}
        </div>
    );
};

export default AdminConnectionModal;