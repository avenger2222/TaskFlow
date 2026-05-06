import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = createApp();

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

