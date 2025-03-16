import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { DATA, MESSAGES, MODAL, BUTTON } from '../../../utils/constants';
import PropTypes from 'prop-types';
import './ResultInputModal.css';

const { Text } = Typography;

const ResultInputModal = ({ match, onClose, onSave }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(match.winner ? match.winnerId : null);
    const [displayScore, setDisplayScore] = useState(match.winner ? (match.score ? match.score : '') : DATA.SELECT_WINNER);
    const [score, setScore] = useState(match.score || '');
    const [errorMessage, setErrorMessage] = useState('Error');
    const [errorColor, setErrorColor] = useState('');

    const selectedPlayerRef = useRef(selectedPlayer);
    const displayScoreRef = useRef(displayScore);
    const scoreRef = useRef(score);

    const handleSave = useCallback(() => {
        if (selectedPlayerRef.current) {
            if (!formatScoreOk(scoreRef.current)) {
                setErrorMessage(MESSAGES.ERROR.INVALID_FORMAT);
                setErrorColor('red');
                setTimeout(() => {
                    setErrorColor('');
                }, 5000);
                return;
            }
            if (!scoreOk(scoreRef.current)) {
                setErrorMessage(MESSAGES.ERROR.INVALID_SCORE);
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
            setDisplayScore(match.winner ? (match.score ? match.score : '') : DATA.SELECT_WINNER);
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
            title={MODAL.RESULT.TITLE}
            open={true}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {BUTTON.CANCEL}
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    {BUTTON.SAVE}
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
                <label htmlFor="vs">{DATA.VS}</label>
                <input className='visually-hidden' id="vs" type="radio" />
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
                placeholder={selectedPlayer ? MODAL.RESULT.PLACEHOLDER : DATA.SELECT_WINNER}
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

const parseScore = (score) => {
    const tieBreak = score.includes('(');
    const scoreSet = tieBreak ? score.split('(')[0].split('/') : score.split('/');
    return { scoreSet, tieBreak };
};

const isValidScore = (score) => {
    return score >= 0 && score <= 7;
};

const checkWinningConditions = (scoreSet, tieBreak, last) => {
    if (last && (parseInt(scoreSet[0]) >= 10 || parseInt(scoreSet[1]) >= 10)) return 1;

    if (scoreSet[0] === '7' && scoreSet[1] === '5') return tieBreak ? 0 : 1;
    if (scoreSet[0] === '7' && scoreSet[1] === '6') return 1;
    if (scoreSet[1] === '7' && scoreSet[0] === '5') return tieBreak ? 0 : 2;
    if (scoreSet[1] === '7' && scoreSet[0] === '6') return 2;

    return null; // No winner yet
};

const checkScore = (score, last = false) => {
    const { scoreSet, tieBreak } = parseScore(score);

    const winningCondition = checkWinningConditions(scoreSet, tieBreak, last);
    if (winningCondition !== null) return winningCondition;

    if (tieBreak) return 0;

    if (scoreSet[0] !== '6' && scoreSet[1] !== '6') return 0;

    if (scoreSet[0] === '6') {
        if (!isValidScore(scoreSet[1])) return 0;
        return 1;
    }

    if (!isValidScore(scoreSet[0])) return 0;
    return 2;
};

ResultInputModal.propTypes = {
    match: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};
