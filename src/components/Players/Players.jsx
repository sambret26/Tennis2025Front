import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Layout, Table, Button, Typography, Checkbox, notification } from 'antd';
import { getAllPlayers } from '../../api/playersService';
import { getPredefinedReductions } from '../../api/reductionSettingsService';
import { updatePlayerPayments } from '../../api/paymentsService';
import { GlobalContext } from '../../App';
import PaymentDetail from './Modals/PaymentDetail/PaymentDetail';
import PlayersFilters from './PlayersFilters';
import Loader from '../Loader/Loader';
import PlayerTooltip from "../Tooltips/PlayerTooltip/PlayerTooltip";
import './Players.css';

const { Title } = Typography;
const { Sider, Content } = Layout;

const Players = ({ startDate, endDate, defaultDate }) => {
    const { role } = useContext(GlobalContext);
    
    const [players, setPlayers] = useState([]);
    const [filters, setFilters] = useState({
        rankings: [],
        selectedRankings: [],
        categories: [],
        selectedCategories: [],
        paymentStatus: 'all',
    });
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [globalReductions, setGlobalReductions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rankingList = useMemo(() => ['NC', '40', '30/5', '30/4', '30/3', '30/2', '30/1', '30', '15/5', '15/4', '15/3', '15/2', '15/1', '15'], []);

    const sortRankings = useCallback((rankings) => {
        return rankings.sort((a, b) => rankingList.indexOf(a) - rankingList.indexOf(b));
    }, [rankingList]);

    // Chargement des joueurs et des réductions
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [playersData, reductionsData] = await Promise.all([
                    getAllPlayers(),
                    getPredefinedReductions(),
                ]);
                
                const uniqueRankings = [...new Set(playersData.map((player) => player.ranking?.simple || 'NC'))];
                const uniqueRankingsSorted = sortRankings(uniqueRankings);
                const uniqueCategories = [...new Set(playersData.flatMap((player) => player.categories || []))];
                
                setPlayers(playersData);
                setFilters((prev) => ({
                    ...prev,
                    rankings: uniqueRankingsSorted,
                    categories: uniqueCategories,
                }));
                setGlobalReductions(reductionsData);
            } catch (error) {
                notification.error({
                    message: 'Erreur',
                    description: 'Erreur lors du chargement des données.',
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [sortRankings]);
    
    // Gestion des filtres
    const handleRankingFilterChange = (checkedValues) => {
        setFilters((prev) => ({ ...prev, selectedRankings: checkedValues }));
    };
    
    const handleCategoryFilterChange = (checkedValues) => {
        setFilters((prev) => ({ ...prev, selectedCategories: checkedValues }));
    };
    
    const handlePaymentStatusChange = (e) => {
        setFilters((prev) => ({ ...prev, paymentStatus: e.target.value }));
    };
    
    // Gestion du changement de statut de paiement
    const handlePaymentChange = async (player) => {
        try {
            if (player.balance.remainingAmount === 0) return;
            
            const newPayment = {
                amount: player.balance.remainingAmount,
                date: new Date().toISOString().split('T')[0],
                isFullPayment: true,
            };
            
            const updatedPayments = [...player.payments, newPayment];
            const updatedBalance = { ...player.balance, remainingAmount: 0 };
            
            await updatePlayerPayments(player.id, updatedPayments, updatedBalance);
            
            setPlayers((prevPlayers) =>
                prevPlayers.map((p) =>
                    p.id === player.id
                    ? { ...p, payments: updatedPayments, balance: updatedBalance }
                    : p
                )
            );
    
            notification.success({
                message: 'Succès',
                description: 'Le paiement a été enregistré.',
            });
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Erreur lors de la mise à jour du paiement.',
            });
        }
    };

    // Filtrage des joueurs
    const getFilteredPlayers = () => {
        return players.filter((player) => {
            const matchesRanking =
            filters.selectedRankings.length === 0 ||
            filters.selectedRankings.includes(player.ranking?.simple || 'NC');
            const matchesCategory =
            filters.selectedCategories.length === 0 ||
            player.categories.some((cat) => filters.selectedCategories.includes(cat));
            const matchesPaymentStatus =
            filters.paymentStatus === 'all' ||
            (filters.paymentStatus === 'paid' && player.balance.remainingAmount === 0) ||
            (filters.paymentStatus === 'partiallyPaid' &&
                player.balance.remainingAmount > 0 &&
                player.balance.remainingAmount < player.balance.finalAmount) ||
            (filters.paymentStatus === 'unpaid' &&
                player.balance.remainingAmount === player.balance.finalAmount);
                    
            return matchesRanking && matchesCategory && matchesPaymentStatus;
        });
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
        
    const rankingSorter = (a, b) => {
        const aRank = a.ranking ? a.ranking.simple : 'NC';
        const bRank = b.ranking ? b.ranking.simple : 'NC';
        const aIndex = rankingList.indexOf(aRank);
        const bIndex = rankingList.indexOf(bRank);
        return aIndex - bIndex;
    }
        
    const paymentDateSorted = (a, b) => {
        const paymentDateA = getLatestPaymentDate(a);
        if (!paymentDateA) return 1;
        const paymentDateB = getLatestPaymentDate(b);
        if (!paymentDateB) return -1;
        return paymentDateB - paymentDateA;
    }
        
    // Colonnes de la table
    const columns = [
        {
            title: 'Joueur',
            dataIndex: 'fullName',
            key: 'fullName',
            className: 'player-column',
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
            defaultSortOrder: 'ascend',
            render: (text, record) => (
                <div className="player-name">
                <span>
                {record.lastName} {record.firstName}
                </span>
                {role === 2 && <PlayerTooltip className="player-tooltip" player={record} table={false}/>}
                </div>
            ),
        },
        {
            title: 'Classement',
            dataIndex: 'ranking',
            key: 'ranking',
            className: 'ranking-column',
            sorter: (a, b) => rankingSorter(a, b),
            render: (ranking) => ranking?.simple || 'NC',
        },
        {
            title: 'Catégories',
            dataIndex: 'categories',
            key: 'categories',
            className: 'category-column',
            render: (categories) => categories.join(', '),
        },
        {
            title: 'Montant',
            dataIndex: 'balance',
            key: 'amount',
            className: 'amount-column',
            sorter: (a, b) => a.balance.finalAmount - b.balance.finalAmount,
            render: (balance) => `${balance.finalAmount}€`,
        },
        {
            title: 'Payé',
            dataIndex: 'balance',
            key: 'paid',
            className: 'paid-column',
            sorter: (a, b) => a.balance.remainingAmount - b.balance.remainingAmount,
            render: (balance, record) => (
                <Checkbox
                checked={balance.remainingAmount <= 0}
                disabled={role !== 2}
                onChange={() => handlePaymentChange(record)}
                />
            ),
        },
        {
            title: 'Date de paiement',
            key: 'paymentDate',
            className: 'payment-date-column',
            sorter: (a, b) => paymentDateSorted(a, b),
            render: (_, record) => formatDate(getLatestPaymentDate(record)),
        },
        {
            title: 'Détails',
            key: 'details',
            className: 'details-column',
            render: (_, record) => (
                <Button type="link" onClick={() => showPaymentDetail(record)}>
                Détails
                </Button>
            ),
        },
    ];
        
    // Affichage de la modale de détail des paiements
    const showPaymentDetail = (player) => {
        setSelectedPlayer(player);
        setIsModalOpen(true);
    };
    
    const handleModalClose = () => {
        setIsModalOpen(false);
    };
        
    const getRowClassName = (player) => {
        if (player.balance.remainingAmount < 0) return 'paid-too-much';
        if (player.balance.remainingAmount === 0) return 'paid';
        if (player.balance.remainingAmount !== player.balance.finalAmount) return 'partially-paid';
        return 'unpaid';
    };
    
    const getTable = () => {
        if (loading) return <Loader message="Chargement des joueurs..." />;
        return (
            <Table
                dataSource={getFilteredPlayers()}
                columns={columns}
                loading={loading}
                rowClassName={getRowClassName}
                locale={{ emptyText: 'Aucun joueur ne correspond aux filtres' }}
            />
        );
    }
        
    return (
        <Layout className="player-layout">
            <Sider
                width={300}
                className="filters-section"
                >
                <PlayersFilters
                    filters={filters}
                    handleRankingFilterChange={handleRankingFilterChange}
                    handleCategoryFilterChange={handleCategoryFilterChange}
                    handlePaymentStatusChange={handlePaymentStatusChange}
                />
            </Sider>
            <Content style={{ padding: '20px' }}>
                <Title level={2}>Gestion des joueurs</Title>
                  {getTable()}
            </Content>
            {selectedPlayer && isModalOpen && (
                <PaymentDetail
                    player={selectedPlayer}
                    onClose={handleModalClose}
                    globalReductions={globalReductions}
                    startDate={startDate}
                    endDate={endDate}
                    defaultDate={defaultDate}
                />
            )}
        </Layout>
    );
};

export default Players;