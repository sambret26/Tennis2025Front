import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { getAccountDataForADay } from '../../../api/accountService';
import { GlobalContext } from '../../../App';
import { MESSAGES, CONSOLE, COUNT } from '../../../utils/constants';
import PropTypes from 'prop-types';
import './DetailModal.css';

const DetailModal = ({ days, day, onClose }) => {
    const {setGlobalErrorMessage} = useContext(GlobalContext);

    const [payments, setPayments] = useState([]);
    const [amountDayBefore, setAmountDayBefore] = useState(0);
    const [amountDay, setAmountDay] = useState(0);
    const [amountWithdrawn, setAmountWithdrawn] = useState(0);
    const [profit, setProfit] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [countRegister, setCountRegister] = useState(false)
    const [selectedDay, setSelectedDay] = useState(day);
    const [total, setTotal] = useState(0);
    const [difference, setDifference] = useState(0);
    const [hasToCount, setHasToCount] = useState(false)
    const [inputValues, setInputValues] = useState();
    const [previousDate, setPreviousDate] = useState(null);
    const currentDateRef = useRef(selectedDay);

    const setInputValuesToZero = () => {
        setInputValues({
            chequeAmount: 0,
            fiftyEuroBills: 0,
            twentyEuroBills: 0,
            tenEuroBills: 0,
            fiveEuroBills: 0,
            twoEuroCoins: 0,
            oneEuroCoins: 0,
            otherAmount: 0,
        });
    }

    useEffect(() => {
        const loadAccountData = async () => {
            try {
                setIsLoading(true);
                const data = await getAccountDataForADay(formatDate(selectedDay));
                if (currentDateRef.current !== selectedDay) return;
                setAmountDayBefore(data.amountDayBefore);
                setAmountWithdrawn(data.withdraws);
                const totalPayments = Array.isArray(data.payments) ? data.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0;
                setProfit(totalPayments);
                setAmountDay(data.amountDayBefore + totalPayments - data.withdraws);
                setPayments(data.payments);
                setDifference(data.amountDayBefore + totalPayments - data.withdraws);
                setInputValuesToZero();
            } catch (error) {
                setGlobalErrorMessage(MESSAGES.ERROR.UPDATE.DATA);
                console.error(CONSOLE.FETCH.DATA, error);
            } finally {
                if (currentDateRef.current === selectedDay) {
                    setIsLoading(false);
                };
            }
        };

        if(selectedDay !== previousDate) {
            loadAccountData();
            setPreviousDate(selectedDay);
            currentDateRef.current = selectedDay;
        }
    }, [selectedDay, previousDate, setGlobalErrorMessage]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
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
                console.error(CONSOLE.PARSE_DATE, dateString);
            } 
        return data[2] + '-' + data[1] + '-' + data[0];
        } catch (error) {
            console.error(CONSOLE.PARSE_DATE, error);
        }
    };

    const handlePrevDay = useCallback(() => {
        if (countRegister) return;
        const index = days.indexOf(selectedDay);
        if (index > 0) {
            setSelectedDay(days[index - 1]);
        }
    }, [days, selectedDay, countRegister]);

    const handleNextDay = useCallback(() => {
        if (countRegister) return;
        const index = days.indexOf(selectedDay);
        if (index < days.length - 1) {
            setSelectedDay(days[index + 1]);
        }
    }, [days, selectedDay, countRegister]);

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

    useEffect(() => {

        const handleTotal = () => {
            if(!hasToCount) return;
            let newTotal = inputValues.chequeAmount +
                inputValues.fiftyEuroBills * 50 +
                inputValues.twentyEuroBills * 20 +
                inputValues.tenEuroBills * 10 +
                inputValues.fiveEuroBills * 5 +
                inputValues.twoEuroCoins * 2 +
                inputValues.oneEuroCoins +
                inputValues.otherAmount;
            setTotal(newTotal);
            setHasToCount(false);
            setDifference(amountDay - newTotal);
        };

        handleTotal();

    }, [inputValues, hasToCount, amountDay]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: Number(value), // Convert to number
        }));
        setHasToCount(true);
    };

    const showDifference = () => {
        let message = '';
        let className = '';
        if(!difference){
            message = MESSAGES.SUCCESS.COUNT;
            className = 'green-label';
        }
        if(difference > 0){
            message = `Il manque ${difference}€`;
            className = 'red-label';
        }
        if(difference < 0){
            message = `Il y a ${-difference}€ en trop`;
            className = 'blue-label';
        }
        return <label className={className}>{message}</label>
    };

    const countRegistrationSection = () => {
        return (
        <div className="count-registration-section">
            <div>
                <label className="count-registration-label">{COUNT.CHEQUE_AMOUNT}</label>
                <input type="number"className="count-input" name="chequeAmount" value={inputValues.chequeAmount || ''} onChange={handleInputChange}></input>
            </div>
            <div>
                <label className="count-registration-label">{COUNT.FIFTY_EURO_BILLS}</label>
                <input type="number" className="count-input" name="fiftyEuroBills" value={inputValues.fiftyEuroBills || ''} onChange={handleInputChange}></input>
            </div>
            <div>
                <label className="count-registration-label">{COUNT.TWENTY_EURO_BILLS}</label>
                <input type="number" className="count-input" name="twentyEuroBills" value={inputValues.twentyEuroBills || ''} onChange={handleInputChange}></input>
            </div>
            <div>
                <label className="count-registration-label">{COUNT.TEN_EURO_BILLS}</label>
                <input type="number" className="count-input" name="tenEuroBills" value={inputValues.tenEuroBills || ''} onChange={handleInputChange}></input>
            </div>
            <div>
                <label className="count-registration-label">{COUNT.FIVE_EURO_BILLS}</label>
                <input type="number" className="count-input" name="fiveEuroBills" value={inputValues.fiveEuroBills || ''} onChange={handleInputChange}></input>
            </div>
            <div>
                <label className="count-registration-label">{COUNT.TWO_EURO_COINS}</label>
                <input type="number" className="count-input" name="twoEuroCoins" value={inputValues.twoEuroCoins || ''} onChange={handleInputChange}></input>
            </div>
            <div>
                <label className="count-registration-label">{COUNT.ONE_EURO_COINS}</label>
                <input type="number" className="count-input" name="oneEuroCoins" value={inputValues.oneEuroCoins || ''} onChange={handleInputChange}></input>
            </div>
            <div>
                <label className="count-registration-label">{COUNT.OTHER_AMOUNT}</label>
                <input type="number" className="count-input" name="otherAmount" value={inputValues.otherAmount || ''} onChange={handleInputChange}></input>
            </div>
            <div>
                <label className="count-registration-total-label">{COUNT.TOTAL} {total}€</label>
                {showDifference()}
            </div>

        </div>);
    }

    const paymentListSection = () => {
        if (isLoading) return;
        if (payments.length === 0) {
            return (
                <div className="detail-payments-section">
                    <h3 className="detail-subtitle">{COUNT.NO_PAYMENT} {selectedDay}</h3>
                </div>
            );
        };
        return (
            <div className="detail-payments-section">
                <h3 className="detail-subtitle">{COUNT.PAYMENT_LIST}</h3>
                <table className="detail-table">
                    <thead>
                        <tr>
                            <th className="detail-th">{COUNT.PLAYER}</th>
                            <th className="detail-th">{COUNT.AMOUNT}</th>
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
    };

    return (
        <div className="detail-modal">
            <div className="detail-content">
                <div className="detail-header">
                    <button id="prevDayDetail" className="arrow-button"
                        onClick={handlePrevDay}
                        disabled={selectedDay === days[0] || (isLoading || countRegister)}
                    >&#8249;</button>
                    <h2 className="detail-title">Bilan comptable du {selectedDay}</h2>
                    <button id="nextDayDetail" className="arrow-button"
                    onClick={handleNextDay}
                    disabled={selectedDay === days[days.length - 1] || (isLoading || countRegister)}
                >&#8250;</button>
                <button className="close-button" onClick={onClose}>✖</button>
                </div>
                {isLoading ? (
                    <div className="detail-summary">
                        <div>{COUNT.LOADING}</div>
                    </div>
                ) : (
                    <>
                        <div className="detail-summary">
                            <span className="flex-row">
                                <p>{COUNT.AMOUNT_DAY_BEFORE} : {amountDayBefore}€</p>
                                <p>{COUNT.AMOUNT_DAY} : {amountDay}€</p>
                            </span>
                            <span className="flex-row">
                                <p>{COUNT.WITHDRAWAL} : {amountWithdrawn}€</p>
                                <p>{COUNT.PROFIT} : {profit}€</p>
                            </span>
                        </div>
                        <div className="switch-container-detail">
                            <span className="switch-label-before-detail">{COUNT.DISPLAY_PAYMENTS}</span>
                            <label className="switch-detail">
                                <input type="checkbox" checked={countRegister} onChange={() => setCountRegister(!countRegister)} />
                                <span className="slider-detail round-detail"></span>
                            </label>
                            <span className="switch-label-after-detail">{COUNT.COUNT_CASH}</span>
                        </div>
                    </>
                )}
                {!countRegister && paymentListSection()}
                {countRegister && countRegistrationSection()}
            </div>
        </div>
    );
};

export default DetailModal;

DetailModal.propTypes = {
    days: PropTypes.array.isRequired,
    day: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};
