import { DB } from './db/types';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely'
import dotenv from 'dotenv';

dotenv.config();
const dialect = new PostgresDialect({
	pool: new Pool({
		database: process.env.DB,
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_PORT as string),
		max: 10,
	}),
});

export const db = new Kysely<DB>({
	dialect,
}); 