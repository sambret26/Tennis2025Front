import React, { useEffect, useState, useCallback, useRef } from 'react';
import ResultInputModal from './ResultInputModal';
import { getMatches, updateMatchResult } from '../../api/matchesService';
import { getStartAndEndDate } from '../../api/settingsService';
import './Home.css'; 

const Home = () => {
    const [currentDate, setCurrentDate] = useState(null); // Initialisez à null
    const [planningText, setPlanningText] = useState('Planning du --/--');
    const [schedule, setSchedule] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [datesLoaded, setDatesLoaded] = useState(false);
    const [previousDate, setPreviousDate] = useState(null);
    const currentDateRef = useRef(currentDate);


    useEffect(() => {
        const loadDates = async () => {
            try {
                const data = await getStartAndEndDate();
                const startDateObj = new Date(data.startDate);
                const endDateObj = new Date(data.endDate);
                
                setStartDate(startDateObj);
                setEndDate(endDateObj);

                const today = new Date();
                if (today < startDateObj) {
                    setCurrentDate(startDateObj);
                } else if (today > endDateObj) {
                    setCurrentDate(endDateObj);
                } else {
                    setCurrentDate(today);
                }

                setDatesLoaded(true); // Indique que les dates ont été chargées
            } catch (error) {
                console.error('Error fetching dates:', error);
            }
        };

        loadDates();
    }, []); // Exécutez une seule fois au chargement du composant
    
    const formatDate = useCallback((date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
      }, []);


    const updateDate = useCallback((date) => {
        const formattedDate = formatDate(date);
        setPlanningText(`Planning du ${formattedDate}`);
    }, [formatDate]);

    useEffect(() => {
        if (datesLoaded) {
            updateDate(currentDate);
        }
    }, [currentDate, datesLoaded, updateDate]);

    useEffect(() => {
        const fetchMatches = async () => {
            setSchedule([]);
            try {
                const matches = await getMatches(currentDate);
                if (currentDateRef.current === currentDate) {
                    setSchedule(matches);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };
        
        if (datesLoaded && currentDate !== previousDate) {
            fetchMatches();
            setPreviousDate(currentDate);
            currentDateRef.current = currentDate;
        }
    }, [currentDate, datesLoaded, previousDate]);
    
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

    return (
        <div className="home-content">

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

            <div className="planning-text">
                <p id="planningText">{planningText}</p>
            </div>
            
            <div className="schedule-list">
                <ul id="scheduleTable">
                    <li className="header">
                        <span>Horaire</span>
                        <span>Court</span>
                        <span>Joueur 1</span>
                        <span>Joueur 2</span>
                        <span>Résultat</span>
                        <span></span>
                    </li>
                    {schedule.map((match, index) => (
                        <li key={index}>
                            <span>{match.hour}</span>
                            <span>{match.court.name}</span>
                            <span>{match.player1.fullName} ({match.player1.ranking})</span>
                            <span>{match.player2.fullName} ({match.player2.ranking})</span>
                            {match.winner ? (
                                <>
                                    <span>{getResultValue(match)}</span>
                                    <span> <button className="edit-button" onClick={() => handleEditResult(match)}>Modifier</button></span>
                                </>
                            ) : (
                                <>
                                    <span><button className="add-result-button" onClick={() => handleEditResult(match)}>Renseigner un résultat</button></span>
                                    <span></span>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
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