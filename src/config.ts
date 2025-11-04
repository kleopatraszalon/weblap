declare global { interface Window { KLEO_API_BASE?: string } }
export const API_BASE: string = (typeof window !== 'undefined' && window.KLEO_API_BASE) ? window.KLEO_API_BASE : 'http://localhost:5000';
