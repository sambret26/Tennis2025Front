import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { updateToken } from '../../../../api/settingsService';
import { GlobalContext } from '../../../../App';
import { MESSAGES, LOADER, MODAL } from '../../../../utils/constants';
import TransparentLoader from '../../../Loader/TransparentLoader';
import PropTypes from 'prop-types';
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
            setMessageError(MESSAGES.ERROR.TOKEN);
            return;
        }
        setIsLoading(true);
        updateToken(token)
            .then(() => {
                setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.TOKEN);
                onClose();
            })
            .catch((error) => {
                console.error(error);
                setGlobalErrorMessage(MESSAGES.ERROR.CHANGE_TOKEN);
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
            title={MODAL.TOKEN.TITLE}
            open={true}
            onCancel={onClose}
            footer={null} // Supprime les boutons par défaut
        >
            {/* Champ de saisie du token */}
            <Input
                placeholder={MODAL.TOKEN.PLACEHOLDER}
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
                {MODAL.TOKEN.BUTTON}
            </Button>

            {isLoading && <TransparentLoader message={LOADER.CHANGE_TOKEN} />}
        </Modal>
    );
};

export default TokenModal;

TokenModal.propTypes = {
    onClose: PropTypes.func.isRequired
};
