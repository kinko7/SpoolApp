
const app = require('./app.js');
const { conn } = require('./src/db.js');

conn.sync({ force: false }).then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log('%s listening at 3001, so working'); // eslint-disable-line no-console
  });
});
