import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Créer une connexion à la base de données avec postgres-js
const connectionString = process.env.DATABASE_URL!;
const queryClient = postgres(connectionString);

// Utiliser le client avec drizzle
export const db = drizzle(queryClient, { schema });