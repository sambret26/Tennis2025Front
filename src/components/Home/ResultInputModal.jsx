// src/components/Home/ResultInputModal.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ResultInputModal = ({ match, onClose, onSave }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(match.winner ? match.winnerId : null);
    const [displayScore, setDisplayScore] = useState('');
    const [score, setScore] = useState(match.score);

    const selectedPlayerRef = useRef(selectedPlayer);
    const displayScoreRef = useRef(displayScore);
    const scoreRef = useRef(score);

    const handleSave = useCallback(() => {
        onSave(match.id, selectedPlayerRef.current, scoreRef.current);
    }, [match.id, onSave]);

    useEffect(() => {
        selectedPlayerRef.current = selectedPlayer;
        displayScoreRef.current = displayScore;
        scoreRef.current = score;
    }, [selectedPlayer, displayScore, score]);

    useEffect(() => {
        if (match) {
            setSelectedPlayer(match.winner ? match.winnerId : null);
            setDisplayScore(match.winner ? (match.score ? match.score : '') : 'Sélectionnez un vainqueur');
            setScore(match.score);
        }

        // Gestionnaire d'événements pour la touche "Entrée"
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Empêche l'action par défaut de l'élément actif
                handleSave(); // Appelle la fonction de sauvegarde
            }
        };

        // Ajoutez l'écouteur d'événements
        window.addEventListener('keydown', handleKeyPress);

        // Nettoyage de l'écouteur d'événements lors du démontage
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [match, handleSave]);

    const handleRadioChange = (playerId) => {
        setSelectedPlayer(selectedPlayer === playerId ? null : playerId);
        setDisplayScore(selectedPlayer === playerId ? '' : score ? score : '')
    };

    const setBothScore = (value) => {
        setDisplayScore(value);
        setScore(value);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Renseigner un résultat</h2>
                <button className="close-button" onClick={onClose}>✖</button>
                <div className="radio-label">
                    <label>{match.player1.fullName}</label>
                    <input
                        type="radio"
                        checked={selectedPlayer === match.player1Id}
                        onClick={() => handleRadioChange(match.player1Id)}
                        onChange={()=> {}}
                    />
                    <span>VS</span>
                    <input
                        type="radio"
                        checked={selectedPlayer === match.player2Id}
                        onClick={() => handleRadioChange(match.player2Id)}
                        onChange={() => {}}
                    />
                    <label>{match.player2.fullName}</label>
                </div>
                <input
                    type="text"
                    value={displayScore}
                    onChange={(e) => {setBothScore(e.target.value)}}
                    placeholder={selectedPlayer ? "Entrez le score" : "Sélectionnez un vainqueur"}
                    disabled={!selectedPlayer}
                />
                <div>
                    <button className="save-button" onClick={handleSave}>Enregistrer</button>
                    <button className="cancel-button" onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default ResultInputModal;