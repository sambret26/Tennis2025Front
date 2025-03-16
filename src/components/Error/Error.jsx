import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MESSAGES, BUTTON } from '../../utils/constants';
import './Error.css'; // Assurez-vous de créer ce fichier CSS pour styliser la page

const Error = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/'); // Redirige l'utilisateur vers la page d'accueil
    window.location.reload(); // Recharge la page pour réessayer
  };

  return (
    <div className="error-container">
      <Result
        status="500"
        title="500"
        subTitle={MESSAGES.ERROR.BAD}
        extra={
          <Button type="primary" onClick={handleRetry}>
            {BUTTON.RETRY}
          </Button>
        }
      />
    </div>
  );
};

export default Error;