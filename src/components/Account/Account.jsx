import React, { useEffect, useState } from 'react';
import DetailModal from './Modals/DetailModal';
import TransactionManagementModal from './Modals/TransactionManagementModal';
import { getAccountData } from '../../api/accountService';
import './Account.css';
import Loader from '../Loader/Loader';
import TransparentLoader from '../Loader/TransparentLoader';

const Account = ({ startDate, endDate }) => {
    const [amountInCash, setAmountInCash] = useState(0);
    const [profit, setProfit] = useState(0);
    const [withdrawn, setWithdrawn] = useState(0);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isTransactionManagementModalOpen, setTransactionManagementModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [reload, setReload] = useState(false);
    const [days, setDays] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isTransparentLoaderVisible, setIsTransparentLoaderVisible] = useState(false);

    useEffect(() => {   
        const loadAccountData = async () => {
            try {
                setIsTransparentLoaderVisible(true);
                const data = await getAccountData();
                setAmountInCash(data.totalDeposit + data.totalPayments - data.totalWithdrawal);
                setProfit(data.totalPayments);
                setWithdrawn(data.totalWithdrawal);
            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally {
                setIsTransparentLoaderVisible(false);
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
                console.error('Error fetching dates:', error);
            }
        }

        loadAccountData();
        loadDays();
    }, [reload, startDate, endDate]);

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

    if (isLoading) {
        return <Loader message="Chargement des données..." />;
    }

    return (
        <div className="account-tab">
            <h2>Montant dans la caisse : {amountInCash}€</h2>
            <div>
                <h3 style={{ float: 'right' }}>Bénéfice : {profit}€</h3>
                <h3 style={{ float: 'left' }}>Retiré : {withdrawn}€</h3>
            </div>
            <div className="day-list">
                {days.map((day, index) => (
                    <div key={index} className="day-item" onClick={() => handleDayClick(day)}>{day}</div>
                ))}
            </div>
            <div>
                <button className="button-account" onClick={handleManageTransactions}>Gérer les transactions</button>
            </div>
            {isTransparentLoaderVisible && <TransparentLoader message="Mise à jour des données..." />}
            {isDetailModalOpen && <DetailModal days={days} day={selectedDay} onClose={closeDetailModal} />}
            {isTransactionManagementModalOpen && <TransactionManagementModal onClose={closeTransactionManagementModal} onChange={() => setReload(!reload)} setIsTransparentLoaderVisible={setIsTransparentLoaderVisible} />}
        </div>
    );
};

export default Account;