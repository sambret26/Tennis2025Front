import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { connectAdmin, askAccess } from '../../../../api/userService';
import TransparentLoader from '../../../Loader/TransparentLoader';
import { GlobalContext } from '../../../../App';
import { MESSAGES, CONSOLE, LOADER, MODAL, BUTTON } from '../../../../utils/constants';
import PropTypes from 'prop-types';
import './AdminConnectionModal.css';

const { Text } = Typography;

const AdminConnectionModal = ({ role, setRole, onClose, userId }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage, getRoleName } = useContext(GlobalContext);

    const [messageError, setMessageError] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const adminConnection = useCallback(() => {
        setMessageError('');
        if (password === '') {
            setMessageError(MESSAGES.ERROR.NO_ADMIN_PASSWORD);
            return;
        }
        setLoadingMessage(LOADER.ADMIN_CONNECTION);
        setIsLoading(true);
        connectAdmin(password, userId, role)
            .then((data) => {
                if (data === 401 || data === 403) {
                    setMessageError(MESSAGES.ERROR.ADMIN_PASSWORD);
                    return;
                }
                if (!data.token) {
                    throw new Error(CONSOLE.CONNECTION);
                }
                setRole(parseInt(role));
                localStorage.setItem('token', data.token);
                onClose();
                setGlobalSuccessMessage(MESSAGES.SUCCESS.ADMIN_CONNECTION);
            })
            .catch((error) => {
                console.error(error);
                setGlobalErrorMessage(MESSAGES.ERROR.ADMIN_CONNECTION);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [onClose, role, setRole, password, userId, setGlobalSuccessMessage, setGlobalErrorMessage]);

    const handleRequestAccess = () => {
        setLoadingMessage(LOADER.ACCESS_REQUEST);
        setIsLoading(true);
        askAccess(userId, role)
            .then((data) => {
                if (data === 404) {
                    setMessageError(MESSAGES.ERROR.GLOBAL);
                    return;
                }
                setGlobalSuccessMessage(`Demande d’accès ${getRoleName(role)} envoyée avec succès.`);
                onClose();
            })
            .catch((error) => {
                console.error(error);
                setGlobalErrorMessage(MESSAGES.ERROR.REQUEST_ACCESS);
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
            title={MODAL.ADMIN_CONNECTION.TITLE}
            open={true}
            onCancel={onClose}
            footer={null} // Supprime les boutons par défaut
        >
            {/* Champ de saisie du mot de passe */}
            <Input.Password
                placeholder={MODAL.ADMIN_CONNECTION.PLACEHOLDER}
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
                {MODAL.ADMIN_CONNECTION.BUTTON}
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
                {BUTTON.REQUEST_ACCESS} {getRoleName(role)}   
            </Button>

            {/* Loader */}
            {isLoading && <TransparentLoader message={loadingMessage} />}
        </Modal>
    );
};

export default AdminConnectionModal;

AdminConnectionModal.propTypes = {
    role: PropTypes.number.isRequired,
    setRole: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired
};
