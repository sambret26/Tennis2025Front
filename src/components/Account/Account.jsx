import React, { useEffect, useState, useContext } from 'react';
import { Card, Button, Typography } from 'antd';
import DetailModal from './Modals/DetailModal';
import TransactionManagementModal from './Modals/TransactionManagementModal';
import { getAccountData } from '../../api/accountService';
import { GlobalContext } from '../../App';
import { CONSOLE, LOADER, MESSAGES, DATA } from '../../utils/constants';
import Loader from '../Loader/Loader';
import TransparentLoader from '../Loader/TransparentLoader';
import PropTypes from 'prop-types';
import './Account.css';

const { Title, Text } = Typography;

const Account = ({ startDate, endDate }) => {

    const {setGlobalErrorMessage} = useContext(GlobalContext);

    const [amountInCash, setAmountInCash] = useState(0);
    const [profit, setProfit] = useState(0);
    const [withdrawn, setWithdrawn] = useState(0);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isTransactionManagementModalOpen, setTransactionManagementModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [reload, setReload] = useState(false);
    const [days, setDays] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransparentLoaderVisible, setIsTransparentLoaderVisible] = useState(false);

    useEffect(() => {
        const loadAccountData = async () => {
            try {
                const data = await getAccountData();
                setAmountInCash(data.totalDeposit + data.totalPayments - data.totalWithdrawal);
                setProfit(data.totalPayments);
                setWithdrawn(data.totalWithdrawal);
            } catch (error) {
                setGlobalErrorMessage(MESSAGES.ERROR.GET.DATA);
                console.error(CONSOLE.FETCH.ACCOUNT, error);
            } finally {
                setIsLoading(false);
            }
        };

        const loadDays = async () => {
            try {
                const startDay = noHourDate(startDate);
                const endDay = noHourDate(endDate);
                const days = [];
                for (let dt = startDay; dt <= endDay; dt.setDate(dt.getDate() + 1)) {
                    days.push(new Date(dt).toLocaleDateString());
                }
                setDays(days);
            } catch (error) {
                console.error(CONSOLE.FETCH.DATE, error);
            }
        };

        loadAccountData();
        loadDays();
    }, [reload, startDate, endDate, setGlobalErrorMessage]);

    const noHourDate = (date = new Date()) => {
        const newDate = new Date(date);
        newDate.setHours(12, 0, 0, 0);
        return newDate;
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setDetailModalOpen(true);
    };

    const handleManageTransactions = () => {
        setTransactionManagementModalOpen(true);
    };

    const closeDetailModal = () => setDetailModalOpen(false);
    const closeTransactionManagementModal = () => setTransactionManagementModalOpen(false);

    // Calcul du nombre de colonnes nécessaires
    const getNumberOfColumns = () => {
        const numberOfDays = days.length;
        return Math.ceil(numberOfDays / 15);
    };

    if (isLoading) {
        return <Loader message={LOADER.ACCOUNT} />;
    }

    return (
        <div className="account-tab">
            {/* Titre et montants */}
            <Card className="account-card no-bottom-padding">
                <Title level={2}>{DATA.AMOUNT_IN_CASH} : {amountInCash}€</Title>
                <div className="account-card-content-top">
                    <Text strong className="benefit-text">{DATA.BENEFIT} : {profit}€</Text>
                    <Text strong className="withdrawn-text">{DATA.WITHDRAWN} : {withdrawn}€</Text>
                </div>
            </Card>

            {/* Liste des jours */}
            <Card className="account-card no-top-padding">
                <div className="days-grid" style={{ gridTemplateColumns: `repeat(${getNumberOfColumns()}, 1fr)` }}>
                    {days.map((day, index) => (
                        <button key={index} className="day-item" onClick={() => handleDayClick(day)}>
                            {day}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Bouton de gestion des transactions */}
            <div className="account-card-content-bottom">
                <Button type="primary" onClick={handleManageTransactions}>
                    {DATA.TRANSACTION_MANAGEMENT}
                </Button>
            </div>

            {/* Loaders et modales */}
            {isTransparentLoaderVisible && <TransparentLoader message={LOADER.SAVE} />}
            {isDetailModalOpen && <DetailModal days={days} day={selectedDay} onClose={closeDetailModal} />}
            {isTransactionManagementModalOpen && (
                <TransactionManagementModal
                    onClose={closeTransactionManagementModal}
                    onChange={() => setReload(!reload)}
                    setIsTransparentLoaderVisible={setIsTransparentLoaderVisible}
                />
            )}
        </div>
    );
};

export default Account;

Account.propTypes = {
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired
};