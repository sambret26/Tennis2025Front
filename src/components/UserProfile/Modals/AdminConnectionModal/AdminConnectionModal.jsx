import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { connectAdmin } from '../../../../api/userService';
import TransparentLoader from '../../../Loader/TransparentLoader';
import './AdminConnectionModal.css';

const { Text } = Typography;

const AdminConnectionModal = ({ role, setRole, onClose, userId }) => {
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const adminConnection = useCallback(() => {
        setMessage('');
        if (password === '') {
            setMessage('Merci de rentrer un mot de passe admin.');
            return;
        }
        setIsLoading(true);
        connectAdmin(password, userId, role)
            .then((data) => {
                if (data === 401 || data === 403) {
                    setMessage('Le mot de passe admin est incorrect.');
                    return;
                }
                if (!data.token) {
                    throw new Error('Failed to connect user');
                }
                setRole(parseInt(role));
                localStorage.setItem('token', data.token);
                onClose();
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
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
        <Modal
            title="Connexion admin"
            visible={true}
            onCancel={onClose}
            footer={null} // Supprime les boutons par défaut
        >
            {/* Champ de saisie du mot de passe */}
            <Input.Password
                placeholder="Mot de passe admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="large"
                className="admin-password-input"
            />

            {/* Message d'erreur ou d'information */}
            <Text 
                className="admin-connection-message"
                type={message.includes('incorrect') ? 'danger' : 'secondary'}>
                {message}
            </Text>

            {/* Bouton de connexion */}
            <Button
                type="primary"
                onClick={adminConnection}
                block
                size="large"
                loading={isLoading} // Affiche un spinner si isLoading est true
            >
                Connexion
            </Button>

            {/* Loader */}
            {isLoading && <TransparentLoader message="Connexion admin en cours..." />}
        </Modal>
    );
};

export default AdminConnectionModal;