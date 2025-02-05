import React, { useState, useEffect } from 'react';
import PaymentDetail from './Modals/PaymentDetail/PaymentDetail';
import { getAllPlayers } from '../../api/playersService';
import { updatePlayerPayments } from '../../api/paymentsService';
import { getPredefinedReductions } from '../../api/reductionSettingsService';
import TransparentLoader from '../Loader/TransparentLoader';
import PlayerTooltip from "../Tooltips/PlayerTooltip/PlayerTooltip";
import './Players.css';

const Players = ({ startDate, endDate, defaultDate }) => {
    const [players, setPlayers] = useState([]);
    const [filters, setFilters] = useState({
        rankings: [],
        selectedRankings: new Set(),
        categories: [],
        selectedCategories: new Set(),
        paymentStatus: 'all'
    });
    const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'asc' });
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [globalReductions, setGlobalReductions] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                const data = await getAllPlayers();
                
                if (!Array.isArray(data)) {
                    console.error('Expected array of players, got:', typeof data);
                    return;
                }
                
                // Extraire les classements uniques et les sélectionner par défaut
                const uniqueRankings = [...new Set(data.map(player => 
                    player.ranking?.simple || player.ranking.simple || 'NC'
                ))].filter(Boolean);
                
                // Extraire les catégories uniques et les sélectionner par défaut
                const uniqueCategories = [...new Set(data.flatMap(player => player.categories || []))];
                
                setPlayers(data);
                setFilters(prev => ({
                    ...prev,
                    rankings: uniqueRankings,
                    selectedRankings: new Set(uniqueRankings),
                    categories: uniqueCategories,
                    selectedCategories: new Set(uniqueCategories)
                }));
            } catch (error) {
                console.error('Erreur lors du chargement des joueurs:', error);
            } finally {
                setLoading(false);
            }
        };
    
        const fetchGlobalRecuctions = async () => {
            try {
                const data = await getPredefinedReductions();
                setGlobalReductions(data);
            } catch (error) {
                console.error('Erreur lors du chargement des réductions:', error);
            }
        };
        
        fetchPlayers();
        fetchGlobalRecuctions();
    }, []);

    useEffect(() => {
    }, [players]);

    useEffect(() => {
    }, [filters]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedPlayers = () => {
        const sortedPlayers = [...players];
        return sortedPlayers.sort((a, b) => {
            if (sortConfig.key === 'lastName') {
                const compareResult = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
                return sortConfig.direction === 'asc' ? compareResult : -compareResult;
            }
            if (sortConfig.key === 'ranking') {
                const rankOrder = ['NC', '40', '30/5', '30/4', '30/3', '30/2', '30/1', '30', '15/5', '15/4', '15/3', '15/2', '15/1', '15'];
                const aRank = a.ranking?.simple || a.ranking.simple || 'NC';
                const bRank = b.ranking?.simple || b.ranking.simple || 'NC';
                const aIndex = rankOrder.indexOf(aRank);
                const bIndex = rankOrder.indexOf(bRank);
                return sortConfig.direction === 'asc' ? aIndex - bIndex : bIndex - aIndex;
            }
            if (sortConfig.key === 'amount') {
                return sortConfig.direction === 'asc' ? b.balance.finalAmount - a.balance.finalAmount : a.balance.finalAmount - b.balance.finalAmount;
            }
            if (sortConfig.key === 'paid') {
                if ((a.balance.remainingAmount === 0) === (b.balance.remainingAmount === 0)) return 0;
                if (sortConfig.direction === 'asc') {
                    return a.balance.remainingAmount === 0 ? -1 : 1;
                }
                return a.balance.remainingAmount === 0 ? 1 : -1;
            }
            if (sortConfig.key === 'partiallyPaid') {
                const aValue = a.paid ? 2 : (a.partiallyPaid ? 1 : 0);
                const bValue = b.paid ? 2 : (b.partiallyPaid ? 1 : 0);
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
            if (sortConfig.key === 'paymentDate') {
                const paymentDateA = getLatestPaymentDate(a);
                const paymentDateB = getLatestPaymentDate(b);
                if (!paymentDateA) return sortConfig.direction === 'asc' ? 1 : 1;
                if (!paymentDateB) return sortConfig.direction === 'asc' ? -1 : -1;
                return sortConfig.direction === 'asc' 
                    ? new Date(paymentDateB) - new Date(paymentDateA)
                    : new Date(paymentDateA) - new Date(paymentDateB);
            }
            return 0;
        });
    };

    const getFilteredPlayers = () => {
        return getSortedPlayers().filter(player => {
            // Filtre par classement
            const playerRanking = player.ranking?.simple || player.ranking.simple || 'NC';
            if (!filters.selectedRankings.has(playerRanking)) {
                return false;
            }

            // Filtre par catégorie
            const playerCategories = player.categories || [];
            const hasMatchingCategory = playerCategories.some(cat => 
                filters.selectedCategories.has(cat)
            );
            if (!hasMatchingCategory) {
                return false;
            }

            // Filtre par statut de paiement
            if (filters.paymentStatus === 'paid' && player.balance.remainingAmount > 0) {
                return false;
            }           
            if (filters.paymentStatus === 'partiallyPaid' && (player.balance.remainingAmount === 0 || player.balance.remainingAmount === player.balance.finalAmount)) {
                return false;
            }
            if (filters.paymentStatus === 'unpaid' && (player.balance.remainingAmount !== player.balance.finalAmount)) {
                return false;
            }
            return true;
        });
    };

    const handleRankingFilterChange = (ranking, checked) => {
        setFilters(prev => ({
            ...prev,
            selectedRankings: checked 
                ? new Set([...prev.selectedRankings, ranking])
                : new Set([...prev.selectedRankings].filter(r => r !== ranking))
        }));
    };

    const handleCategoryFilterChange = (category, checked) => {
        setFilters(prev => ({
            ...prev,
            selectedCategories: checked
                ? new Set([...prev.selectedCategories, category])
                : new Set([...prev.selectedCategories].filter(c => c !== category))
        }));
    };

    const handlePaymentStatusChange = (status) => {
        setFilters(prev => ({
            ...prev,
            paymentStatus: status
        }));
    };

    const getRowClassName = (player) => {
        if (player.balance.remainingAmount === 0) return 'paid';
        if (player.balance.remainingAmount !== player.balance.finalAmount) return 'partially-paid';
        return 'unpaid';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Obtenir le jour
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtenir le mois (0-11)
        return `${day}/${month}`; // Retourner le format jj/mm
    };

    const getLatestPaymentDate = (player) => {
        if (player.payments && player.payments.length > 0) {
            return player.payments.reduce((lastDate, payment) => {
                const paymentDate = new Date(payment.date);
                return !lastDate || paymentDate > new Date(lastDate) ? payment.date : lastDate;
            }, null);
        }
        return null;
    };

    const playersHeaders = () => {
        if(getFilteredPlayers().length > 0){
            return (
                <thead>
                    <tr>
                        <th colSpan={2} onClick={() => handleSort('lastName')}>
                            Joueur {sortConfig.key === 'lastName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('ranking')}>
                            Classement {sortConfig.key === 'ranking' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Catégories</th>
                        <th onClick={() => handleSort('amount')}>
                            Montant {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('paid')}>
                            Payé {sortConfig.key === 'paid' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('paymentDate')}>
                            Date de paiement {sortConfig.key === 'paymentDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Détails</th>
                    </tr>
                </thead>
            );
        }
        return (
            <tr>
                <th colSpan={7}>Aucun joueur ne correspond aux filtres</th>
            </tr>
        )
    };

    return (
        <div className="players-container">
            <h1>Gestion des joueurs</h1>
            <div className="players-content">
                <div className="filters-section">
                    <div className="ranking-filters">
                        <h3>Classements</h3>
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.selectedRankings.size === filters.rankings.length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFilters(prev => ({
                                            ...prev,
                                            selectedRankings: new Set(filters.rankings)
                                        }));
                                    } else {
                                        setFilters(prev => ({
                                            ...prev,
                                            selectedRankings: new Set()
                                        }));
                                    }
                                }}
                            />
                            Tous les classements
                        </label>
                        {filters.rankings.map(ranking => {
                            return (
                                <label key={ranking}>
                                    <input
                                        type="checkbox"
                                        checked={filters.selectedRankings.has(ranking)}
                                        onChange={(e) => handleRankingFilterChange(ranking, e.target.checked)}
                                    />
                                    {ranking}
                                </label>
                            );
                        })}
                    </div>

                    <div className="category-filters">
                        <h3>Catégories</h3>
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.selectedCategories.size === filters.categories.length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFilters(prev => ({
                                            ...prev,
                                            selectedCategories: new Set(filters.categories)
                                        }));
                                    } else {
                                        setFilters(prev => ({
                                            ...prev,
                                            selectedCategories: new Set()
                                        }));
                                    }
                                }}
                            />
                            Toutes les catégories
                        </label>
                        {filters.categories.map(category => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    checked={filters.selectedCategories.has(category)}
                                    onChange={(e) => handleCategoryFilterChange(category, e.target.checked)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>

                    <div className="payment-status-filters">
                        <h3>Statut de paiement</h3>
                        <label>
                            <input
                                type="radio"
                                name="paymentStatus"
                                value="all"
                                checked={filters.paymentStatus === 'all'}
                                onChange={() => handlePaymentStatusChange('all')}
                            />
                            Tous
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentStatus"
                                value="paid"
                                checked={filters.paymentStatus === 'paid'}
                                onChange={() => handlePaymentStatusChange('paid')}
                            />
                            Payé
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentStatus"
                                value="partiallyPaid"
                                checked={filters.paymentStatus === 'partiallyPaid'}
                                onChange={() => handlePaymentStatusChange('partiallyPaid')}
                            />
                            Partiellement payé
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentStatus"
                                value="unpaid"
                                checked={filters.paymentStatus === 'unpaid'}
                                onChange={() => handlePaymentStatusChange('unpaid')}
                            />
                            Non payé
                        </label>
                    </div>
                </div>

                <div className="players-table-content">
                    {loading && <TransparentLoader message="Chargement des joueurs..." />}
                    <div className="players-table-container">
                        {!loading && (
                            <table className="players-table">
                                {playersHeaders()}
                                <tbody>
                                    {getFilteredPlayers().map(player => (
                                        <tr key={player.id} className={getRowClassName(player)}>
                                            <td className="col-player">{player.lastName} {player.firstName}</td>
                                            <PlayerTooltip className="" player={player} />
                                            <td>{player.ranking?.simple || player.ranking.simple || 'NC'}</td>
                                            <td>{player.categories.join(', ')}</td>
                                            <td>{player.balance.finalAmount}€</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={player.balance.remainingAmount === 0}
                                                    onChange={async (e) => {
                                                        try {
                                                            if (player.balance.remainingAmount === 0) return; //TODO que faire si c'est déjà coché
                                                            // Créer un nouvel objet de paiement
                                                            const newPayment = {
                                                                amount: player.balance.remainingAmount,
                                                                date: new Date().toISOString().split('T')[0], // Date courante au format ISO
                                                                isFullPayment: true
                                                            };
                                                            player.payments.push(newPayment);
                                                            player.balance.remainingAmount = 0;
                                                            updatePlayerPayments(player.id, player.payments, player.balance);
                                                            setPlayers((prevPlayers) =>
                                                                prevPlayers.map((p) => (p.id === player.id ? { ...p, payments: player.payments } : p))
                                                            );
                                                        } catch (error) {
                                                            console.error("Erreur lors de la création du paiement :", error);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                {formatDate(getLatestPaymentDate(player))}
                                            </td>
                                            <td className="col-payment-detail">
                                                <button onClick={() => setSelectedPlayer(player)}>
                                                    Détail du paiement
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {selectedPlayer && (
                <PaymentDetail
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                    globalReductions={globalReductions}
                    startDate={startDate}
                    endDate={endDate}
                    defaultDate={defaultDate}
                />
            )}
        </div>
    );
};

export default Players;