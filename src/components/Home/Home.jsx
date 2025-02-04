import React, { useEffect, useState, useCallback, useRef } from 'react';
import ResultInputModal from './Modals/ResultInputModal';
import { getMatches, updateMatchResult } from '../../api/matchesService';
import './Home.css'; 

const Home = ({ startDate, endDate, defaultDate }) => {
    const [currentDate, setCurrentDate] = useState(defaultDate);
    const [planningText, setPlanningText] = useState('Planning du --/--');
    const [dateText, setDateText] = useState('--/--');
    const [schedule, setSchedule] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [previousDate, setPreviousDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentDateRef = useRef(currentDate);
    
    const formatDate = useCallback((date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
      }, []);

    const updateDate = useCallback((date) => {
        const formattedDate = formatDate(date);
        setPlanningText(`Planning du ${formattedDate}`);
        setDateText(formattedDate);
    }, [formatDate]);

    useEffect(() => {
        updateDate(currentDate);
    }, [currentDate, updateDate]);

    useEffect(() => {
        const fetchMatches = async () => {
            setSchedule([]);
            setIsLoading(true);
            try {
                const matches = await getMatches(currentDate);
                if (currentDateRef.current === currentDate) {
                    setSchedule(matches);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                if (currentDateRef.current === currentDate) {
                    setIsLoading(false);
                }
            }
        };
        
        if (currentDate !== previousDate) {
            fetchMatches();
            setPreviousDate(currentDate);
            currentDateRef.current = currentDate;
        }
    }, [currentDate, previousDate]);
    
    const handlePrevDay = useCallback(() => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        if (newDate >= startDate) {
            setCurrentDate(newDate);
        }
    }, [currentDate, startDate]);

    const handleNextDay = useCallback(() => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        if (newDate <= endDate) {
            setCurrentDate(newDate);
        }
    }, [currentDate, endDate]);
    
    useEffect(() => {
        const handleKeyPress = (event) => {
            if(event.key === 'ArrowLeft') {
                handlePrevDay();
            } else if (event.key === 'ArrowRight') {
                handleNextDay();
            }
        };
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleNextDay, handlePrevDay]);

    const handleEditResult = (match) => {
        setCurrentMatch(match);
        setShowModal(true);
    };

    const handleSaveResult = async (matchId, playerId, score) => {
        if (!playerId) {
            score = null;
        }
        setSchedule(prevSchedule => {
            return prevSchedule.map(match => 
                match.id === matchId ? { ...match, score, winner: getWinnerName(match, playerId), winnerId: playerId } : match
            );
        });
        setShowModal(false);
        await updateMatchResult(matchId, playerId, score);
    };

    const getWinnerName = (match, playerId) => {
        if (!match || !playerId) {
            return null;
        }
        const fullName = match.player1Id === playerId ? match.player1.fullName : match.player2.fullName;
        return { 'fullName': fullName };
    };

    const getResultValue = (match) => {
        let value = match.winner.fullName;
        if (match.score) {
            value += ` (${match.score})`;
        }
        return value;
    };

    const scheduleHeaders = () => {
        if(schedule.length > 0) {
            return (
                <li className="header">
                    <span>Horaire</span>
                    <span>Court</span>
                    <span>Joueur 1</span>
                    <span>Joueur 2</span>
                    <span>Résultat</span>
                    <span></span>
                </li>
            );
        }
        return (
            <li className="header">
                <span className="full-width">Aucun match programmé le {dateText}</span>
                <span></span>
            </li>
        );
    };

    const scheduleList = () => {
        return (
        <div className="schedule-list">
            <ul className="schedule-table">
                {scheduleHeaders()}
                {schedule.map((match, index) => (
                    <li key={index}>
                        <span>{match.hour}</span>
                        <span>{match.court.name}</span>
                        <span>{match.player1.fullName} ({match.player1.ranking})</span>
                        <span>{match.player2.fullName} ({match.player2.ranking})</span>
                        {match.winner ? (
                            <>
                                <span>{getResultValue(match)}</span>
                                <span> <button className="gray-button" onClick={() => handleEditResult(match)}>Modifier</button></span>
                            </>
                        ) : (
                            <>
                                <span><button className="gray-button" onClick={() => handleEditResult(match)}>Renseigner un résultat</button></span>
                                <span></span>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        )
    }

    const planning = () => {

        if(isLoading) {
            return (
                <div className="planning-text">
                    <p>Chargement du planning du {dateText}...</p>
                </div>
            )
        }

        return (
            <div className="planning-text">
                <p>{planningText}</p>
            </div>
        )
    }

    return (
        <div>
            <div className="calendar-container">
                <button id="prevDay" className="arrow-button" 
                    onClick={handlePrevDay}
                    disabled={currentDate <= startDate}
                >&#8249;</button>
                <input type="date" id="datePicker" 
                    value={currentDate ? currentDate.toISOString().split('T')[0] : ''} // Affiche rien tant que currentDate est null
                    onChange={(e) => setCurrentDate(new Date(e.target.value))} 
                    min={startDate ? startDate.toISOString().split('T')[0] : undefined} 
                    max={endDate ? endDate.toISOString().split('T')[0] : undefined} 
                />
                <button id="nextDay" className="arrow-button" 
                    onClick={handleNextDay}
                    disabled={currentDate >= endDate}
                >&#8250;</button>
            </div>
            {planning()}
            {!isLoading && scheduleList()}
            {showModal && (
                <ResultInputModal
                    match={currentMatch}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveResult}
                />
            )}
        </div>
    );
};

export default Home;