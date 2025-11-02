const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World desde Express');
});

// Ejemplo CRUD de tareas. 
let tasks = [];
let nextId = 1;

// POST create
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const newTask = { id: nextId++, title, description, status: 'todo' };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// GET all (con filtro por status)
app.get('/tasks', (req, res) => {
  const { status } = req.query;
  if (status) return res.json(tasks.filter(t => t.status === status));
  res.json(tasks);
});

// GET by id
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// PUT (update full)
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const { title, description, status } = req.body;
  if (status && !['todo','doing','done'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;

  res.json(task);
});

// PATCH solo status
app.patch('/tasks/:id/status', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  
  const { status } = req.body;
  if (!['todo','doing','done'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  task.status = status;
  res.json(task);
});

// DELETE
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.json({ message: 'Task deleted successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
