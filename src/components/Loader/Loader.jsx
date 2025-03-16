import React from 'react';
import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ message, global = true }) => {

    const getClassName = (global) => {
        return global ? 'loader-container loader-global-container' : 'loader-container loader-local-container';
    }

    return (
        <div className={getClassName(global)}>
            <div className="loader"></div>
            <p className="loader-message">{message}</p>
        </div>
    );
};

export default Loader;

Loader.propTypes = {
    message: PropTypes.string.isRequired,
    global: PropTypes.bool
};
