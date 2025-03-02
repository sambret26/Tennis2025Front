import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; // Assurez-vous de créer ce fichier CSS pour styliser la page
const NotFound = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/'); // Redirige l'utilisateur vers la page d'accueil
    window.location.reload(); // Recharge la page pour réessayer
  };

  return (
    <div className="error-container">
      <Result
        status="404"
        title="404"
        subTitle="Désolé, cette page n'existe pas."
        extra={
          <Button type="primary" onClick={handleRetry}>
            Retour à la page d'accueil
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;