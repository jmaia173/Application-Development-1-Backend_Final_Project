const { app, setupDatabase } = require('./app');

const PORT = process.env.PORT || 3000;

setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});