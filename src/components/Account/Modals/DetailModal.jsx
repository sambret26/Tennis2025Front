import React, { useCallback, useEffect, useState } from 'react';
import { getAccountDataForADay } from '../../../api/accountService';
import './DetailModal.css';

const DetailModal = ({ days, day, onClose }) => {
    const [payments, setPayments] = useState([]);
    const [amountDayBefore, setAmountDayBefore] = useState(0);
    const [amountDay, setAmountDay] = useState(0);
    const [amountWithdrawn, setAmountWithdrawn] = useState(0);
    const [profit, setProfit] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(day);

    useEffect(() => {
        const loadAccountData = async () => {
            try {
                setIsLoading(true);
                const data = await getAccountDataForADay(formatDate(selectedDay));
                setAmountDayBefore(data.amountDayBefore);
                setAmountWithdrawn(data.withdraws);
                const totalPayments = Array.isArray(data.payments) ? data.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0;
                setProfit(totalPayments);
                setAmountDay(data.amountDayBefore + totalPayments - data.withdraws);
                setPayments(data.payments);
            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAccountData();
    }, [selectedDay]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    const formatDate = (dateString) => {
        try {
            const data = dateString.split('/');
            if (data.length !== 3) {
                console.error("Error parsing date :", dateString);
            } 
        return data[2] + '-' + data[1] + '-' + data[0];
        } catch (error) {
            console.error("Error parsing date :", error);
        }
    };

    const handlePrevDay = useCallback(() => {
        if (isLoading) return;
        const index = days.indexOf(selectedDay);
        if (index > 0) {
            setSelectedDay(days[index - 1]);
        }
    }, [days, isLoading, selectedDay]);

    const handleNextDay = useCallback(() => {
        if (isLoading) return;
        const index = days.indexOf(selectedDay);
        if (index < days.length - 1) {
            setSelectedDay(days[index + 1]);
        }
    }, [days, isLoading, selectedDay]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if(event.key === 'ArrowLeft') handlePrevDay();
            else if (event.key === 'ArrowRight') handleNextDay();
        };
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleNextDay, handlePrevDay]);

    const paymentListSection = () => {
        if (isLoading) return;
        if (payments.length > 0) {
            return (
                <div className="detail-payments-section">
                    <h3 className="detail-subtitle">Liste des paiements :</h3>
                    <table className="detail-table">
                        <thead>
                            <tr>
                                <th className="detail-th">Joueur</th>
                                <th className="detail-th">Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td className="detail-td">{payment.playerFullName}</td>
                                    <td className="detail-td">{payment.amount}€</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        return (
            <div className="detail-payments-section">
                <h3 className="detail-subtitle">Aucun paiment le {selectedDay}</h3>
            </div>
        );
    };

    return (
        <div className="detail-modal">
            <div className="detail-content">
                <div className="detail-header">
                    <button id="prevDayDetail" className="arrow-button-detail"
                        onClick={handlePrevDay}
                        disabled={selectedDay === days[0]}
                    >&#8249;</button>
                    <h2 className="detail-title">Bilan comptable du {selectedDay}</h2>
                    <button id="nextDayDetail" className="arrow-button-detail"
                    onClick={handleNextDay}
                    disabled={selectedDay === days[days.length - 1]}
                >&#8250;</button>
                <button className="close-button-detail" onClick={onClose}>✖</button>
                </div>
                {isLoading ? (
                    <div className="detail-summary">
                        <div>Chargement des données du jour...</div>
                    </div>
                ) : (
                    <div className="detail-summary">
                        <span className="flex-row">
                            <p>Montant de la veille : {amountDayBefore}€</p>
                            <p>Montant du soir : {amountDay}€</p>
                        </span>
                        <span className="flex-row">
                            <p>Retraits : {amountWithdrawn}€</p>
                            <p>Bénéfice : {profit}€</p>
                        </span>
                    </div>
                )}
                {paymentListSection()}
            </div>
        </div>
    );
};

export default DetailModal;