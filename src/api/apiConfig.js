import { ENV } from '../config.js';

let URL;

if (ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://web-production-1fc3.up.railway.app';
}

const API_URL = URL;

export { API_URL };