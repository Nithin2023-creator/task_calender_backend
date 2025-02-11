// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Define Task Schema
const taskSchema = new mongoose.Schema({
    date: String, // Format: YYYY-MM-DD
    category: String, // 'DSA', 'Subjects', 'Development'
    title: String,
    description: String
});
const Task = mongoose.model('Task', taskSchema);

// Routes

// Get tasks for a specific date
app.get('/tasks', async (req, res) => {
    const { date } = req.query;
    const tasks = await Task.find({ date });
    res.json(tasks);
});
app.get('/', async (req, res) => {
    res.json({ message: 'welcome' });
});


// Add a new task
app.post('/tasks', async (req, res) => {
    const { date, category, title, description } = req.body;
    const newTask = new Task({ date, category, title, description });
    await newTask.save();
    res.json(newTask);
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { title, description }, { new: true });
    res.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
