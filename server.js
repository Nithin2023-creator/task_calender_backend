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
    title: String,
    description: String,
    status: { type: String, default: 'Pending' } // Ensure status is saved
});

const Task = mongoose.model('Task', taskSchema);

// Routes

// Get tasks for a specific date
app.get('/tasks', async (req, res) => {
    try {
        const { date } = req.query;
        const tasks = await Task.find({ date });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

app.get('/', async (req, res) => {
    res.json({ message: 'Welcome to Task Manager API' });
});

// Add a new task
app.post('/tasks', async (req, res) => {
    try {
        const { date, title, description, status } = req.body;
        const newTask = new Task({ date, title, description, status: status || 'Pending' });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error: error.message });
    }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, status },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
