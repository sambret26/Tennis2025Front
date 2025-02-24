import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { changeUserPassword } from '../../../../api/userService';
import TransparentLoader from '../../../Loader/TransparentLoader';
import './ChangePasswordModal.css';

const { Text } = Typography;

const ChangePasswordModal = ({ onClose, userId, setSuccessMessage }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [messageError, setMessageError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkDatas = useCallback(() => {
        if (oldPassword === '') {
            setMessageError('Merci de rentrer votre mot de passe actuel.');
            return false;
        }
        if (password === '') {
            setMessageError('Merci de rentrer votre nouveau mot de passe.');
            return false;
        }
        if (password2 === '') {
            setMessageError('Merci de confirmer votre nouveau mot de passe.');
            return false;
        }
        if(password.length < 6) {
            setMessageError('Le mot de passe doit contenir au moins 6 caractères.');
            return false;
        }
        if (password !== password2) {
            setMessageError('Les mots de passe ne correspondent pas.');
            return false;
        }
        if (oldPassword === password) {
            setMessageError('Le mot de passe actuel et le nouveau mot de passe sont identiques.');
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
                    setMessageError('Mot de passe actuel incorrect.');
                } else {
                    setSuccessMessage('Mot de passe changé avec succès.');
                    onClose();
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [userId, oldPassword, password, checkDatas, setSuccessMessage, onClose]);

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
            title="Changer le mot de passe"
            open={true}
            onCancel={onClose}
            footer={null} // Supprime les boutons par défaut
        >
            {/* Champ de saisie du mot de passe actuel */}
            <Input.Password
                placeholder="Mot de passe actuel"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                size="large"
                className="input-password"
            />

            {/* Champ de saisie du nouveau mot de passe */}
            <Input.Password
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="large"
                className="input-password"
            />

            {/* Champ de saisie de la confirmation du mot de passe */}
            <Input.Password
                placeholder="Confirmez votre nouveau mot de passe"
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
                Changer le mot de passe
            </Button>

            {isLoading && <TransparentLoader message="Changement de mot de passe en cours..." />}
        </Modal>
    );
};

export default ChangePasswordModal;