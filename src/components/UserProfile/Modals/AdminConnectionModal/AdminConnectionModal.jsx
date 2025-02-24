import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { connectAdmin, askAccess } from '../../../../api/userService';
import TransparentLoader from '../../../Loader/TransparentLoader';
import './AdminConnectionModal.css';

const { Text } = Typography;

const AdminConnectionModal = ({ role, setRole, onClose, userId, setSuccessMessage }) => {
    const [messageError, setMessageError] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

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

    const adminConnection = useCallback(() => {
        setMessageError('');
        if (password === '') {
            setMessageError('Merci de rentrer un mot de passe admin.');
            return;
        }
        setLoadingMessage('Connexion admin en cours...');
        setIsLoading(true);
        connectAdmin(password, userId, role)
            .then((data) => {
                if (data === 401 || data === 403) {
                    setMessageError('Le mot de passe admin est incorrect.');
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

    const handleRequestAccess = () => {
        setLoadingMessage('Demande d’accès en cours...');
        setIsLoading(true);
        askAccess(userId, role)
            .then((data) => {
                if (data === 404) {
                    setMessageError('Une erreur est survenue.');
                    return;
                }
                setSuccessMessage(`Demande d’accès ${getRoleName(role)} envoyée avec succès.`);
                onClose();
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

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
            open={true}
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

            {/* Message d'erreur */}
            <Text
                className="admin-connection-message"
                type={'danger'}>
                {messageError}
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

            {/* Séparateur "OU" */}
            <div className="separator">
                <Text>OU</Text>
            </div>

            {/* Bouton "Demander les accès" */}
            <Button
                type="default" // Style secondaire
                onClick={handleRequestAccess}
                block
                size="large"
                style={{ marginTop: '0' }} // Réinitialiser la marge supérieure
            >
                Faire une demande d'accès {getRoleName(role)}
            </Button>

            {/* Loader */}
            {isLoading && <TransparentLoader message={loadingMessage} />}
        </Modal>
    );
};

export default AdminConnectionModal;