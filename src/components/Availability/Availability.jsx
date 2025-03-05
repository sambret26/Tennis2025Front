import React, { useCallback, useEffect, useState, useContext } from "react";
import { getAllAvailabilities } from "../../api/availabilityService";
import { getAllPlayers } from "../../api/playersService";
import { getAllPlayersAvailabilities, updatePlayerAvailability } from "../../api/playerAvailabilityService";
import { getAllCommentsForDay } from "../../api/playerAvailabilityCommentService";
import { GlobalContext } from "../../App";
import PlayerComment from "./Modals/PlayerComment/PlayerComment";
import PlayerTooltip from "../Tooltips/PlayerTooltip/PlayerTooltip";
import './Availability.css';

const Availability = ({ startDate, endDate }) => {
    const { role } = useContext(GlobalContext);

    const AVAILABLE = 0;
    const NO_ANSWER = 2;
    const UNAVAILABLE = 4;

    const [tournamentDates, setTournamentDate] = useState({});
    const [currentDate, setCurrentDate] = useState(null);
    const [allAvailabilities, setAllAvailabilities] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [playersAvailabilities, setPlayersAvailabilities] = useState([]);
    const [playerComments, setPlayerComments] = useState({});
    const [isWeekend, setIsWeekend] = useState(false);
    const [playerInput, setPlayerInput] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isPlayerCommentModalOpen, setPlayerCommentModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadDates = async () => {
            try {
                const startDay = noHourDate(startDate);
                const endDay = noHourDate(endDate);
                const today = noHourDate();
                setTournamentDate({'startDate' : startDay, 'endDate' : endDay});
                if(today < startDay) setCurrentDate(startDay);
                else if (today > endDay) setCurrentDate(endDay);
                else setCurrentDate(today);
            } catch (error) {
                console.error('Error fetching dates:', error);
            }
        };

        const loadAvailabilities = async () => {
            try { setAllAvailabilities(await getAllAvailabilities()); }
            catch (error) { console.error('Error fetching availabilities:', error); }
        };

        const loadPlayers = async () => {
            try { setAllPlayers(await getAllPlayers()); }
            catch (error) { console.error('Error fetching players:', error); }
        };

        const loadPlayersAvailabilities = async () => {
            try { setPlayersAvailabilities(await getAllPlayersAvailabilities()); }
            catch (error) { console.error('Error fetching playersAvailabilities:', error); }
        };

        const initializeAll = async () => {
            await Promise.all([loadDates(), loadAvailabilities(), loadPlayers(), loadPlayersAvailabilities()]);
        };

        initializeAll();
    }, [startDate, endDate]);

    useEffect(() => {
        const loadComments = async () => {
            if (currentDate) {
                try {
                    setIsLoading(true);
                    const comments = await getAllCommentsForDay(formattedDate(currentDate));
                    const commentsByPlayer = comments.reduce((acc, comment) => {
                        acc[comment.playerId] = comment;
                        return acc;
                    }, {});
                    setPlayerComments(commentsByPlayer);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadComments();
    }, [currentDate]);

    useEffect(() => {
        if(currentDate) {
            const day = currentDate.getDay();
            setIsWeekend(day === 0 || day === 6);
        }
    }, [currentDate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const input = document.getElementById('playerInput');
            const suggestionList = document.getElementById('suggestionList');
            if (input && !input.contains(event.target)
                && suggestionList && !suggestionList.contains(event.target)) {
                setShowSuggestions(false);
            } else {
                setShowSuggestions(true);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePrevDay = useCallback(() => {
        const newDate = noHourDate(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        if(newDate >= tournamentDates.startDate) setCurrentDate(newDate);
    }, [currentDate, tournamentDates]);

    const handleNextDay = useCallback(() => {
        const newDate = noHourDate(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        if(newDate <= tournamentDates.endDate) setCurrentDate(newDate);
    }, [currentDate, tournamentDates]);

    useEffect(() => {
        const handlekeyPress = (event) => {
            if(event.key === 'ArrowLeft' && !isPlayerCommentModalOpen) handlePrevDay();
            else if (event.key === 'ArrowRight' && !isPlayerCommentModalOpen) handleNextDay();
        };
        window.addEventListener('keydown', handlekeyPress);
        return () => {
            window.removeEventListener('keydown', handlekeyPress);
        };
    }, [handleNextDay, handlePrevDay, isPlayerCommentModalOpen]);

    const handleInputChange = (e) => {
        setPlayerInput(e.target.value);
    };

    const handleSelectPlayer = (player) => {
        setPlayerInput('');
        if(!selectedPlayers.includes(player.id)) {
            setSelectedPlayers([...selectedPlayers, player.id]);
        }
    }

    const renderSuggestion = () => {
        if(!playerInput) {
            return null;
        }
        const filteredPlayers = allPlayers
        .filter(player => 
            player.fullName.toLowerCase().includes(playerInput.toLowerCase()) &&
            !selectedPlayers.includes(player.id)
        ).sort((a, b) => {
            const lastNameA = a.lastName.toLowerCase();
            const lastNameB = b.lastName.toLowerCase();
            if (lastNameA < lastNameB) return -1;
            if (lastNameA > lastNameB) return 1;
            const firstNameA = a.firstName.toLowerCase();
            const firstNameB = b.firstName.toLowerCase();
            if (firstNameA < firstNameB) return -1;
            if (firstNameA > firstNameB) return 1;
            return 0;
        });
        return (
            <div id="suggestionList" className="suggestion-list">
                {filteredPlayers.map(player => (
                    <div key={player.id} onClick={() => handleSelectPlayer(player)}>
                        {player.fullName}
                    </div>
                ))}
            </div>
        );
    };

    const formattedDate = (date) => {
        return date ? date.toISOString().split('T')[0] : '';
    };

    const noHourDate = (date = new Date()) => {
        const newDate = new Date(date);
        newDate.setHours(12, 0, 0, 0);
        return newDate;
    };

    const handleRemovePlayer = (playerId) => {
        setSelectedPlayers(selectedPlayers.filter(player => player !== playerId));
    };

    const updateAvailability = (availabilities, playerId, timeSlot, number) => {
        return availabilities.map(availability => {
            if (availability.playerId === playerId && availability.day === formattedDate(currentDate) && availability.timeSlot === timeSlot) {
                return { ...availability, available: number };
            }
            return availability;
        });
    };

    const stopBlur = () => {
        setTimeout(() => {
            const selectElement = document.activeElement;
            if (selectElement) {
                selectElement.blur(); // Retire le focus
            }
        }, 0);
    }

    const changeAvailability = (playerId, timeSlot, number) => {
        setPlayersAvailabilities(prevAvailabilities => {
            const existingAvailability = prevAvailabilities.find(avail => avail.playerId === playerId && avail.day === formattedDate(currentDate) && avail.timeSlot === timeSlot);
            if(existingAvailability) return updateAvailability(prevAvailabilities, playerId, timeSlot, number);
            return [...prevAvailabilities, { playerId, day: formattedDate(currentDate), timeSlot, number }];
        });
    };

    const handleAvailability = async (playerId, timeSlot, available) => {
        stopBlur();
        const availability = allAvailabilities.find(availability => availability.value === available);
        const number = availability ? availability.number : NO_ANSWER;
        changeAvailability(playerId, timeSlot, number);
        await updatePlayerAvailability(playerId, formattedDate(currentDate), timeSlot, number);
    };

    const handleDayAvailability = async (playerId, number) => {
        stopBlur();
        for (let i = 0; i < 3; i++) changeAvailability(playerId, i, number); 
        for (let i = 0; i < 3; i++) await updatePlayerAvailability(playerId, formattedDate(currentDate), i, number);
    }

    const handleCommentChange = async () => {
        try {
            const comments = await getAllCommentsForDay(formattedDate(currentDate));
            const commentsByPlayer = comments.reduce((acc, comment) => {
                acc[comment.playerId] = comment;
                return acc;
            }, {});
            setPlayerComments(commentsByPlayer);
        } catch (error) {
            console.error('Error refreshing comments:', error);
        }
    };

    const playersHeaders = () => {
        if (selectedPlayers.length === 0) {
            return (
                <thead className="header">
                    <tr>
                        <th colSpan={8} className="full-width">Séléctionnez au moins un joueur pour afficher ses disponibilités</th>
                    </tr>
                </thead>
            )
        }
        if (isWeekend) {
            return (
                <thead>
                    <tr className="header">
                        <th colSpan={2}></th>
                        <th colSpan={role === 2 ? 2 : 1}>Joueur</th>
                        <th>Matin</th>
                        <th>Après-midi</th>
                        <th>Soirée</th>
                        <th></th>
                    </tr>
                </thead>
            )
        }
        return (
            <thead>
                <tr className="header">
                    <th colSpan={2}></th>
                    <th colSpan={role === 2 ? 2 : 1}>Joueur</th>
                    <td>18h</td>
                    <td>19h30</td>
                    <td>21h</td>
                    <td></td>
                </tr>
            </thead>
        )
    };

    const availabilityActions = (playerId) => {
        if (role !== 2) return <td></td>
        return (
            <td className="availability-actions">
                <span className="available-player" onClick={() => handleDayAvailability(playerId, AVAILABLE)}>&#10003;</span>
                <span className="unavailable-player" onClick={() => handleDayAvailability(playerId, UNAVAILABLE)}>&#10060;</span>
            </td>
        )
    }

    return (
        <div>
            <div className="content-header">
                <h2>Gestion de la disponibilité des joueurs</h2>
            </div>

            <div className="calendar-container">
                <button id="prevDay" className="arrow-button"
                    onClick={handlePrevDay}
                    disabled={currentDate <= tournamentDates.startDate}
                >&#8249;</button>
                <input type="date" id="datePicker" 
                    value={formattedDate(currentDate)} 
                    onChange={(e) => setCurrentDate(noHourDate(e.target.value))} 
                    min={formattedDate(tournamentDates.startDate)} 
                    max={formattedDate(tournamentDates.endDate)}
                />
                <button id="nextDay" className="arrow-button"
                    onClick={handleNextDay}
                    disabled={currentDate >= tournamentDates.endDate}
                >&#8250;</button>
            </div>

            <div className="availability-input">
                <input type="text" id="playerInput" className="player-input"
                    placeholder="Entrez le nom d'un joueur"
                    value={playerInput} 
                    onChange={handleInputChange}
                    autoComplete="off" 
                />
                {showSuggestions && renderSuggestion()}
            </div>

            <div className="player-table-container">
                <table className="player-table">
                    {playersHeaders()}
                    <tbody>
                        {selectedPlayers.map((playerId) => {
                            const player = allPlayers.find(player => player.id === playerId);
                            const playerAvailabilities = playersAvailabilities.filter(availability =>
                                availability.playerId === playerId &&
                                availability.day === formattedDate(currentDate)
                            );
                            return (
                                <tr key={playerId}>
                                    <td className="player-remove" onClick={() => handleRemovePlayer(playerId)}>&#10060;</td>
                                    <td className="player-comment">
                                        <PlayerComment
                                            playerId={playerId}
                                            day={formattedDate(currentDate)}
                                            comment={playerComments[playerId]}
                                            onCommentChange={handleCommentChange}
                                            playerName={player ? player.fullName : ''}
                                            isModalOpen={isPlayerCommentModalOpen}
                                            setIsModalOpen={setPlayerCommentModalOpen}
                                            isLoading={isLoading}
                                        />
                                    </td>
                                    <td className="player-name">{player ? player.fullName : ''}</td>
                                    {role === 2 && <PlayerTooltip className="" player={player} table={true} />}
                                    {Array.from({length: 3}).map((_, timeSlotIndex) => {
                                        const playerAvailability = playerAvailabilities.find(availability => availability.timeSlot === timeSlotIndex);
                                        const playerAvailabilityNumber = playerAvailability ? playerAvailability.available : NO_ANSWER;
                                        const availability = playerAvailabilityNumber ? allAvailabilities.find(availability => availability.number === playerAvailabilityNumber) : '';
                                        const displayValue = availability ? availability.value : '';
                                        return (
                                            <td className="player-availability" key={timeSlotIndex} id={`availability-${playerId}-${formattedDate(currentDate)}-${timeSlotIndex}`}>
                                                <select value={displayValue}
                                                    onChange={(e) => handleAvailability(playerId, timeSlotIndex, e.target.value)}
                                                    disabled={role !== 2}
                                                >
                                                    {allAvailabilities.map((availability) => (
                                                        <option key={availability.number} value={availability.value}>
                                                            {availability.value}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        );
                                    })}
                                    {availabilityActions(playerId)}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Availability;