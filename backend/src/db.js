import mongoose from 'mongoose';
import { ensureDemoUsers } from './controllers/authController.js';

let connectPromise = null;
let demoUsersEnsured = false;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectPromise) return connectPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  connectPromise = mongoose
    .connect(uri)
    .then(async (conn) => {
      if (!demoUsersEnsured) {
        await ensureDemoUsers();
        demoUsersEnsured = true;
      }
      return conn;
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
}

