import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, Space, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Text } = Typography;

const CreateAccount = ({ userName, setUserName, password, setPassword, password2, setPassword2, handleCreateAccount, message, setMessage, gotoLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const setInitialMessage = useCallback(() => {
        setMessage('Attention, ne rentrez pas un mot de passe important, un opérateur peut le voir.');
    }, [setMessage]);

    const checkDatas = useCallback(() => {
        if (password !== password2) {
            setMessage('Les mots de passe ne correspondent pas.');
            return;
        }
        setInitialMessage();
        handleCreateAccount();
    }, [handleCreateAccount, password, password2, setInitialMessage, setMessage]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                checkDatas();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleCreateAccount, checkDatas]);

    useEffect(() => {
        if (message === '') setInitialMessage();
    }, [message, setInitialMessage]);

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
        <div className="user-profile-container">
            {/* Titre */}
            <Card className="custom-card">
                <h1>Créez votre compte</h1>
            </Card>

            {/* Formulaire de création de compte */}
            <Card className="custom-card">
                <Space direction="vertical" size="middle">
                    {/* Nom d'utilisateur */}
                    <Input
                        placeholder="Nom d'utilisateur"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        size="large"
                    />

                    {/* Mot de passe */}
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="large"
                        suffix={
                            <span 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="password-toggle"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter') setShowPassword(!showPassword) }}
                            >
                                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            </span>
                        }
                    />

                    {/* Confirmation du mot de passe */}
                    <Input
                        type={showPassword2 ? 'text' : 'password'}
                        placeholder="Confirmez votre mot de passe"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        size="large"
                        suffix={
                            <span
                                onClick={() => setShowPassword2(!showPassword2)}
                                className="password-toggle"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter') setShowPassword2(!showPassword2) }}
                            >
                                {showPassword2 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            </span>
                        }
                    />

                    {/* Message */}
                    <Text type={message.includes('Attention') ? 'secondary' : 'danger'}>
                        {message}
                    </Text>

                    {/* Bouton de création de compte */}
                    <Button type="primary" onClick={checkDatas} block size="large">
                        Créez votre compte
                    </Button>

                    {/* Lien vers la page de connexion */}
                    <Text className="link-text">
                        Vous avez déjà un compte ?{' '}
                        <button onClick={gotoLogin} className="link-button">
                            Connectez-vous.
                        </button>
                    </Text>
                </Space>
            </Card>
        </div>
    );
};

export default CreateAccount;

CreateAccount.propTypes = {
    userName: PropTypes.string.isRequired,
    setUserName: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    password2: PropTypes.string.isRequired,
    setPassword2: PropTypes.func.isRequired,
    handleCreateAccount: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
    gotoLogin: PropTypes.func.isRequired
};
