import { Pool } from 'pg';

const pool = new Pool({
    user: 'calendar',
    host: '127.0.0.1',
    database: 'calendar',
    password: 'test24password',
    port: 5432,
});

export default pool;
