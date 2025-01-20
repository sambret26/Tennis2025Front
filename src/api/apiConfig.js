import { ENV } from '../config.js';

let API_URL;

if (ENV === 'development') {
    API_URL = 'http://localhost:5000';
} else {
    API_URL = 'https://web-production-309e.up.railway.app';
}

export { API_URL };