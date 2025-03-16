import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { changeUserPassword } from '../../../../api/userService';
import { GlobalContext } from '../../../../App';
import { MESSAGES, LOADER, MODAL } from '../../../../utils/constants';
import TransparentLoader from '../../../Loader/TransparentLoader';
import PropTypes from 'prop-types';
import './ChangePasswordModal.css';

const { Text } = Typography;

const ChangePasswordModal = ({ onClose, userId }) => {
    const { setGlobalSuccessMessage, setGlobalErrorMessage } = useContext(GlobalContext);

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [messageError, setMessageError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkDatas = useCallback(() => {
        if (oldPassword === '') {
            setMessageError(MESSAGES.ERROR.NO_ACTUAL_PASSWORD);
            return false;
        }
        if (password === '') {
            setMessageError(MESSAGES.ERROR.NO_PASSWORD);
            return false;
        }
        if (password2 === '') {
            setMessageError(MESSAGES.ERROR.NO_PASSWORD2);
            return false;
        }
        if(password.length < 6) {
            setMessageError(MESSAGES.ERROR.MIN_PASSWORD);
            return false;
        }
        if (password !== password2) {
            setMessageError(MESSAGES.ERROR.PASSWORD_NOT_MATCH);
            return false;
        }
        if (oldPassword === password) {
            setMessageError(MESSAGES.ERROR.SAME_PASSWORD);
            return false;
        }
        return true;
    }, [oldPassword, password, password2]);

    const changePassword = useCallback(() => {
        setMessageError('');
        if (!checkDatas()) {
            return;
        }
        setIsLoading(true);
        changeUserPassword(userId, oldPassword, password)
            .then((data) => {
                if(data === 401) {
                    setMessageError(MESSAGES.ERROR.ACTUAL_PASSWORD);
                } else {
                    setGlobalSuccessMessage(MESSAGES.SUCCESS.UPDATE.CHANGE_PASSWORD);
                    onClose();
                }
            })
            .catch((error) => {
                console.error(error);
                setGlobalErrorMessage(MESSAGES.ERROR.CHANGE_PASSWORD);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [userId, oldPassword, password, checkDatas, setGlobalSuccessMessage, setGlobalErrorMessage, onClose]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                changePassword();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [changePassword]);

    return (
        <Modal
            title={MODAL.CHANGE_PASSWORD.TITLE}
            open={true}
            onCancel={onClose}
            footer={null} // Supprime les boutons par défaut
        >
            {/* Champ de saisie du mot de passe actuel */}
            <Input.Password
                placeholder={MODAL.CHANGE_PASSWORD.PLACEHOLDER}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                size="large"
                className="input-password"
            />

            {/* Champ de saisie du nouveau mot de passe */}
            <Input.Password
                placeholder={MODAL.CHANGE_PASSWORD.PLACEHOLDER2}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="large"
                className="input-password"
            />

            {/* Champ de saisie de la confirmation du mot de passe */}
            <Input.Password
                placeholder={MODAL.CHANGE_PASSWORD.PLACEHOLDER3}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                size="large"
                className="input-password"
            />

            {/* Message d'erreur */}
            <Text
                className="change-password-error-message"
                type={'danger'}>
                {messageError}
            </Text>

            {/* Bouton de changement de mot de passe */}
            <Button
                type="primary"
                onClick={changePassword}
                block
                size="large"
                loading={isLoading}
            >
                {MODAL.CHANGE_PASSWORD.BUTTON}
            </Button>

            {isLoading && <TransparentLoader message={LOADER.CHANGE_PASSWORD} />}
        </Modal>
    );
};

export default ChangePasswordModal;

ChangePasswordModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired
};
