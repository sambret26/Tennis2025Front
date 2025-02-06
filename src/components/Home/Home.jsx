import React, { useEffect, useState, useCallback, useRef } from 'react';
import ResultInputModal from './Modals/ResultInputModal';
import { getMatches, updateMatchResult, updatePlayerAvailability } from '../../api/matchesService';
import { getAllPlayersAvailabilitiesForDay } from '../../api/playerAvailabilityService';
import PlayerTooltip from '../Tooltips/PlayerTooltip/PlayerTooltip';
import AvailableTooltip from '../Tooltips/AvailableTooltip/AvailableTooltip';

import './Home.css'; 

const Home = ({ startDate, endDate, defaultDate, role }) => {
    const NO_ANSWER = 0;
    const UNAVAILABLE = 1;
    const AVAILABLE = 2;

    const [currentDate, setCurrentDate] = useState(defaultDate);
    const [planningText, setPlanningText] = useState('Planning du --/--');
    const [dateText, setDateText] = useState('--/--');
    const [schedule, setSchedule] = useState([]);
    const [allAvailabilities, setAllAvailabilities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [previousDate, setPreviousDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewProfile, setViewProfile] = useState(role);
    const [isWeekend, setIsWeekend] = useState(false);
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
        if(currentDate) {
            const day = currentDate.getDay();
            setIsWeekend(day === 0 || day === 6);
        }
    }, [currentDate]);

    useEffect(() => {

        const loadAvailabilities = async () => {
            try { return await getAllPlayersAvailabilitiesForDay(currentDate); }
            catch (error) { console.error('Error fetching availabilities:', error); }
        };

        const fetchMatches = async () => {
            try { return await getMatches(currentDate); }
            catch (error) { console.error('Error fetching matches:', error); }
        };

        const initializeAll = async () => {
            setSchedule([]);
            setIsLoading(true);
            const [availabilities, matches] = await Promise.all([loadAvailabilities(), fetchMatches()]);
            if (currentDateRef.current !== currentDate) return;
            setSchedule(matches);
            setAllAvailabilities(availabilities);
            setIsLoading(false);
        };
        
        if (currentDate !== previousDate) {
            initializeAll();
            setPreviousDate(currentDate);
            currentDateRef.current = currentDate;
        }
    }, [currentDate, previousDate]);

    const getNextDay = (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return nextDay;
    };

    const canViewDate = useCallback((date) => {
        if (role === 0) return date <= defaultDate;
        if (role === 1) return date <= getNextDay(defaultDate);
        return true;
    }, [role, defaultDate]);
    
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
        if (newDate <= endDate && canViewDate(newDate)) {
            setCurrentDate(newDate);
        }
    }, [currentDate, endDate, canViewDate]);
    
    useEffect(() => {
        const handleKeyPress = (event) => {
            if(event.key === 'ArrowLeft' && !showModal) handlePrevDay();
            else if (event.key === 'ArrowRight' && !showModal) handleNextDay();
        };
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleNextDay, handlePrevDay, showModal]);

    const handleEditResult = (match) => {
        setCurrentMatch(match);
        setShowModal(true);
    };

    const handleSaveResult = async (matchId, playerId, score) => {
        if (!playerId) {
            score = null;
        }
        let finish = 0;
        setSchedule(prevSchedule => {
            return prevSchedule.map(match => {
                if (match.id !== matchId) return match;
                let winner = getWinnerName(match, playerId);
                finish = winner === null ? 0 : 1;
                return { ...match, score, winner: winner, winnerId: playerId, finish: finish};
            });
        });
        setShowModal(false);
        await updateMatchResult(matchId, playerId, score, finish);
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

    const switchViewProfile = () => {
        if (viewProfile === 0) setViewProfile(role);
        else setViewProfile(0);
    };

    const getMatchClassName = (match) => {
        if (viewProfile !== 2) return 'black-row';
        if (match.finish) return 'black-row';
        if (match.player1Availability === UNAVAILABLE || match.player2Availability === UNAVAILABLE) return 'red-row';
        if (match.player1Availability === AVAILABLE && match.player2Availability === AVAILABLE) return 'green-row';
        return 'black-row';
    };

    const hourToSlot = (hour) => {
        try{
            const datas = hour.split(':');
            let h = 0, m = 0;
            if (datas.length === 2) {
                h = parseInt(datas[0]);
                m = parseInt(datas[1]);
            }
            if (datas.length === 1) h = parseInt(datas[0]);
            if (isWeekend) {
                if (h < 12) return 0;
                if (h < 18) return 1;
                return 2;
            }
            if (h < 19 || (h===19 && m===0)) return 0;
            if (h < 20 || (h===20 && m < 31)) return 1;
            return 2;
        } catch {
            return null;
        }
    }

    const hasAvailabilityInformation = (playerId, hour) => {
        let timeSlot = hourToSlot(hour);
        if (timeSlot === undefined || timeSlot === null) return 'black-row';
        for (const availability of allAvailabilities) {
            if (availability.playerId === playerId && availability.timeSlot === timeSlot) {
                if (availability.available === 0) return 'violet-row'; //Available
                if (availability.available === 1) return 'blue-row'; // Probably available
                if (availability.available === 2) return 'black-row'; // No answer
                if (availability.available === 3) return 'yellow-row'; // Probably unavailable
                if (availability.available === 4) return 'orange-row'; // Unavailable
            }
        }
        return 'black-row';
    }

    const getPlayerClassName = (finish, playerAvailability, playerId, hour) => {
        if (viewProfile !== 2) return 'black-row';
        if (finish) return 'black-row'; //Match terminé, pas de couleur
        if (playerAvailability === UNAVAILABLE) return 'red-row'; //Match refusé : rouge
        if (playerAvailability === AVAILABLE) return 'green-row'; //Match accepté : vert
        let a =  hasAvailabilityInformation(playerId, hour);
        return a;
    }

    const handlePlayer1Availability = async (match, available) => {
        match.player1Availability = available;
        setSchedule(prevSchedule => {
            return prevSchedule.map(m => m.id === match.id ? match : m);
        });
        await updatePlayerAvailability(match.id, available, 1);
    }

    const handlePlayer2Availability = async (match, available) => {
        match.player2Availability = available;
        setSchedule(prevSchedule => {
            return prevSchedule.map(m => m.id === match.id ? match : m);
        });
        await updatePlayerAvailability(match.id, available, 2);
    }

    const putAvailableTooltip = (match, handlePlayerAvailability) => {
        if(viewProfile !== 2  || match.finish) return (<td className="schedule-actions"></td>)
        return (<AvailableTooltip className={getPlayerClassName(match.finish, match.player1Availability, match.player1.id, match.hour)} match={match} handlePlayerAvailability={handlePlayerAvailability} AVAILABLE={AVAILABLE} UNAVAILABLE={UNAVAILABLE} NO_ANSWER={NO_ANSWER}/>);
    }

    const putPlayerTooltip = (match, player) => {
        if(viewProfile !== 2) return (<td className="schedule-actions"></td>);
        if(player === 1) return (<PlayerTooltip className={getPlayerClassName(match.finish, match.player1Availability, match.player1.id, match.hour)} player={match.player1} />);
        return (<PlayerTooltip className={getPlayerClassName(match.finish, match.player2Availability, match.player2.id, match.hour)} player={match.player2} />);
    }

    const showSwitch = () => {
        if (role === 0) return;
        return (
            <div className="switch-container">
                <label className="switch">
                    <input type="checkbox" checked={viewProfile > 0 } onChange={() => switchViewProfile(!viewProfile)} />
                    <span className="slider round"></span>
                </label>
                <span className="switch-label">{viewProfile === 2 ? "Admin" : viewProfile === 1 ? "Staff" : "Visiteur"}</span>
            </div>
        )
    }

    const matchResult = (match) => {
        if(match.winner) {
            if (viewProfile === 0) return (<td className="schedule-col-result">{getResultValue(match)}</td>);
            return (
                <>
                    <td className="schedule-col-result">{getResultValue(match)}</td>
                    <td className="schedule-col-edit"> <button className="gray-button" onClick={() => handleEditResult(match)}>Modifier</button></td>
                </>
            )
        }
        if (viewProfile === 0) return (<td className="schedule-col-result"> Aucun résultat disponible</td>);
        return (
            <>
                <td className="schedule-col-result"><button className="gray-button" onClick={() => handleEditResult(match)}>Renseigner un résultat</button></td>
                <td className="schedule-col-edit"></td>
            </>
        )
    }

    const scheduleHeaders = () => {
        if(schedule.length > 0) {
            return (
                <thead className="header">
                    <tr>
                        <th>Horaire</th>
                        <th>Court</th>
                        <th colSpan={3}>Joueur 1</th>
                        <th colSpan={3}>Joueur 2</th>
                        <th>Résultat</th>
                        <th></th>
                    </tr>
                </thead>
            );
        }
        return (
            <thead className="header">
                <tr>
                    <th colSpan={10} className="full-width">Aucun match programmé le {dateText}</th>
                </tr>
            </thead>
        );
    };

    const scheduleList = () => {
        return (
        <div className="schedule-table-container">
            <table className="schedule-table">
                {scheduleHeaders()}
                <tbody>
                    {schedule.map((match, index) => (
                        <tr className={getMatchClassName(match)} key={index}>
                            <td className="schedule-col-hour">{match.hour}</td>
                            <td className="schedule-col-court">{match.court.name}</td>
                            <td className={`schedule-col-player ${getPlayerClassName(match.finish, match.player1Availability, match.player1.id, match.hour)}`}>{match.player1.fullName} ({match.player1.ranking})</td>
                            {putAvailableTooltip(match, handlePlayer1Availability)}
                            {putPlayerTooltip(match, 1)}
                            <td className={`schedule-col-player ${getPlayerClassName(match.finish, match.player2Availability, match.player2.id, match.hour)}`}>{match.player2.fullName} ({match.player2.ranking})</td>
                            {putAvailableTooltip(match, handlePlayer2Availability)}
                            {putPlayerTooltip(match, 2)}
                            {matchResult(match)}
                        </tr>
                    ))}
                </tbody>
            </table>
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
            {showSwitch()}
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