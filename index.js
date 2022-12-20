const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
// const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000

app.use('/api/expense', expenseRoutes);

app.get('/health', (req, res) => res.send('Server up and running'));

app.get('/', (req, res) => res.send('Contact server is up and running'));

app.use(errorHandler);

app.listen(PORT, () => {
  // connectDB();
  console.log(`Server running on ${PORT}`);
});