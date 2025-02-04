import React from 'react';
import './Loader.css';

const TransparentLoader = ({ message }) => {
    return (
        <div className="transparent-loader-container">
            <div className="transparent-loader"></div>
            <p className="transparent-loader-message">{message}</p>
        </div>
    );
};

export default TransparentLoader;