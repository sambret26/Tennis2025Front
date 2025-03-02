import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
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
        subTitle="Désolé, quelque chose s'est mal passé."
        extra={
          <Button type="primary" onClick={handleRetry}>
            Réessayer
          </Button>
        }
      />
    </div>
  );
};

export default Error;