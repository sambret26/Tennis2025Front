import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import './ResultInputModal.css';

const { Text } = Typography;

const ResultInputModal = ({ match, onClose, onSave }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(match.winner ? match.winnerId : null);
    const [displayScore, setDisplayScore] = useState(match.winner ? (match.score ? match.score : '') : 'Sélectionnez un vainqueur');
    const [score, setScore] = useState(match.score || '');
    const [errorMessage, setErrorMessage] = useState('Error');
    const [errorColor, setErrorColor] = useState('');

    const selectedPlayerRef = useRef(selectedPlayer);
    const displayScoreRef = useRef(displayScore);
    const scoreRef = useRef(score);

    const handleSave = useCallback(() => {
        if (selectedPlayerRef.current) {
            if (!formatScoreOk(scoreRef.current)) {
                setErrorMessage("Format incorrect");
                setErrorColor('red');
                setTimeout(() => {
                    setErrorColor('');
                }, 5000);
                return;
            }
            if (!scoreOk(scoreRef.current)) {
                setErrorMessage("Score incohérent");
                setErrorColor('red');
                setTimeout(() => {
                    setErrorColor('');
                }, 5000);
                return;
            }
        } else {
            scoreRef.current = '';
        }
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

        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Empêche l'action par défaut de l'élément actif
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
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

    const getErrorClassName = () => {
        return errorColor === 'red' ? 'error-message red-error-message' : 'error-message';
    };

    return (
        <Modal
            title="Renseigner un résultat"
            open={true}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Annuler
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Enregistrer
                </Button>,
            ]}
            className="result-input-modal"
        >
            <div className="radio-label">
                <label htmlFor={`player1-${match.id}`}>{match.player1.fullName}</label>
                <input
                    type="radio"
                    id={`player1-${match.id}`}
                    checked={selectedPlayer === match.player1Id}
                    onClick={() => handleRadioChange(match.player1Id)}
                    onChange={()=> {}}
                />
                <label>VS</label>
                <input
                    type="radio"
                    id={`player2-${match.id}`}
                    checked={selectedPlayer === match.player2Id}
                    onClick={() => handleRadioChange(match.player2Id)}
                    onChange={() => {}}
                />
                <label htmlFor={`player2-${match.id}`}>{match.player2.fullName}</label>
            </div>
            <Input
                type="text"
                value={displayScore}
                onChange={(e) => setBothScore(e.target.value)}
                placeholder={selectedPlayer ? "Entrez le score" : "Sélectionnez un vainqueur"}
                disabled={!selectedPlayer}
                className="score-input"
            />
            <Text className={getErrorClassName()}>
                {errorMessage}
            </Text>
        </Modal>
    );
};

export default ResultInputModal;

const formatScoreOk = (score) => {
    const regex = /^\d\/\d(\(\d{1,2}\))?\s\d\/\d(\(\d{1,2}\))?(\s\d{1,2}\/\d{1,2}(\(\d{1,2}\))?)?$/;
    return regex.test(score) || score === null || score === '';
};

const scoreOk = (score) => {
    if (score === null || score === '') return true;
    let sets = score.split(' ');
    let winnerSet1 = checkScore(sets[0]);
    if (!winnerSet1) return false;
    let winnerSet2 = checkScore(sets[1]);
    if (!winnerSet2) return false;
    if (winnerSet1 === winnerSet2) {
        if (sets.length === 2) return true;
        return false;
    }
    if (sets.length !== 3) return false;
    return checkScore(sets[2], true) !== 0;
};

const checkScore = (score, last=false) => {
    let scoreSet;
    let tieBreak;
    if (score.includes('(')) {
        scoreSet = score.split('(')[0].split('/');
        tieBreak = true;
    } else {
        scoreSet = score.split('/');
        tieBreak = false;
    }
    if (last && (parseInt(scoreSet[0]) >= 10 || parseInt(scoreSet[1]) >= 10)) return 1
    if (scoreSet[0] === '7') {
        if (scoreSet[1] === '5') {
            if (tieBreak) return 0;
            return 1;
        }
        if (scoreSet[1] === '6') return 1;
        return 0;
    }
    if (scoreSet[1] === '7') {
        if (scoreSet[0] === '5') {
            if (tieBreak) return 0;
            return 2;
        }
        if (scoreSet[0] === '6') return 2;
        return 0;
    }
    if (tieBreak) return 0;
    if (scoreSet[0] !== '6' && scoreSet[1] !== '6') return 0;
    if (scoreSet[0] === '6') {
        if (scoreSet[1] < '0' || scoreSet[1] > '5') return 0;
        return 1;
    }
    if (scoreSet[0] < '0' || scoreSet[0] > '5') return 0;
    return 2;
};