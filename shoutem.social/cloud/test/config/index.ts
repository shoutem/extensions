import { requireEnvString, requireEnvNumber } from '../../core/env';

const API_EXPOSED_PORT = requireEnvNumber('API_EXPOSED_PORT', 80);
const API_HOST = requireEnvString('API_HOST', 'localhost');
const API_PROTOCOL = requireEnvString('API_PROTOCOL', 'http');

const apiUrl = `${API_PROTOCOL}://${API_HOST}:${API_EXPOSED_PORT}`;

export { apiUrl };
