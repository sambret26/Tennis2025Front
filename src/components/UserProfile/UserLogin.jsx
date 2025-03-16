import React, { useEffect, useState } from 'react';
import { Card, Input, Button, Space, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { DATA } from '../../utils/constants';

const { Text } = Typography;

const UserLogin = ({ userName, setUserName, password, setPassword, handleLogin, message, gotoCreateAccount }) => {
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleLogin();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleLogin]);

    useEffect(() => {
        let timer;
        if (showPassword) {
            timer = setTimeout(() => {
                setShowPassword(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showPassword]);

    return (
        <div className="user-profile-container">
            {/* Titre */}
            <Card className="custom-card">
                <h1>Connexion</h1>
            </Card>

            {/* Formulaire de connexion */}
            <Card className="custom-card">
                <Space direction="vertical" size="middle">
                    {/* Nom d'utilisateur */}
                    <Input
                        placeholder={DATA.USERNAME}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        size="large"
                    />

                    {/* Mot de passe */}
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={DATA.PASSWORD}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="large"
                        suffix={
                            <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            </span>
                        }
                    />

                    {/* Message */}
                    <Text type={'danger'}>
                        {message}
                    </Text>

                    {/* Bouton de connexion */}
                    <Button type="primary" onClick={handleLogin} block size="large">
                        Se connecter
                    </Button>

                    {/* Lien vers la page de création de compte */}
                    <Text className="link-text">
                        {DATA.NO_ACCOUNT}{' '}
                        <button className="link-button" onClick={gotoCreateAccount}>
                            {DATA.CREATE_ACCOUNT}
                        </button>
                    </Text>
                </Space>
            </Card>
        </div>
    );
};

export default UserLogin;