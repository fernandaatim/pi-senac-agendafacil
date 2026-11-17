import { SB_URL, SB_KEY } from './config.js';
export const supabase = createClient(SB_URL, SB_KEY);
export const ok = ({data, error}) => { if (error) throw error; return data; };