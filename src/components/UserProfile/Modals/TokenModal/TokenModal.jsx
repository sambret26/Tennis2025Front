import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { updateToken } from '../../../../api/settingsService';
import { GlobalContext } from '../../../../App';
import TransparentLoader from '../../../Loader/TransparentLoader';
import './TokenModal.css';

const { Text } = Typography;

const TokenModal = ({ onClose }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage } = useContext(GlobalContext);

    const [token, setToken] = useState('');
    const [messageError, setMessageError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const changeToken = useCallback(() => {
        setMessageError('');
        if (token === '') {
            setMessageError('Merci de rentrer votre nouveau token.');
            return;
        }
        setIsLoading(true);
        updateToken(token)
            .then(() => {
                setGlobalSuccessMessage('Token changé avec succès.');
                onClose();
            })
            .catch((error) => {
                console.error(error);
                setGlobalErrorMessage("Une erreur est survenue lors du changement du token.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [token, setGlobalSuccessMessage, setGlobalErrorMessage, onClose]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                changeToken();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [changeToken]);

    return (
        <Modal
            title="Changer le token"
            open={true}
            onCancel={onClose}
            footer={null} // Supprime les boutons par défaut
        >
            {/* Champ de saisie du token */}
            <Input
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                size="large"
                className="input-token"
            />

            {/* Message d'erreur */}
            <Text
                className="change-token-error-message"
                type={'danger'}>
                {messageError}
            </Text>

            {/* Bouton de changement de token */}
            <Button
                type="primary"
                onClick={changeToken}
                block
                size="large"
                loading={isLoading}
            >
                Changer le token
            </Button>

            {isLoading && <TransparentLoader message="Changement du token en cours..." />}
        </Modal>
    );
};

export default TokenModal;