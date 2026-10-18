const express = require('express');
const sequelize = require('./database');
const User = require('./models/user');
const { validateUserMiddleware } = require('./validators');

const app = express();
app.use(express.json());
app.use(express.static('public'));


app.post('/api/users', validateUserMiddleware, async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
});

app.get('/api/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.get('/api/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'user not found' });
  res.json(user);
});

app.put('/api/users/:id', validateUserMiddleware, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'user not found' });
  
  await user.update(req.body);
  res.json(user);
});

app.delete('/api/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'user not found' });
  
  await user.destroy();
  res.json({ message: 'User erfolgreich gelöscht' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'internal server error' });
});

const PORT = 3000;
sequelize.sync({ force: false }).then(() => {
  console.log('SQLite sync');
  app.listen(PORT, () => console.log(`server is on ${PORT}`));
});
