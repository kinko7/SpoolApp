require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { DB_USER, DB_PASSWORD, DB_HOST}= process.env
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//////

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/gpt`,
    {
      logging: false, // set to console.log to see the raw SQL queries
      native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    }
  );

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

 

  ////

  const Pict = sequelize.define('Pict', {
    id: {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    Name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    When: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Where: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Review: {
        type: Sequelize.STRING,
        allowNull: false
    }
  });
  
  // Sincroniza el modelo con la base de datos. Esto creará la tabla 'Users' si aún no existe.
  sequelize.sync();
  
  ///
  const fs = require('fs');
const info = require("./info.json")
app.post('/post', (req, res) => {
    // const jsonData = fs.readFileSync('info.json');
   
    Pict.bulkCreate(info)
    .then(() => {
      res.send('Data loaded successfully.');
    })
    .catch((error) => {
      console.error('Unable to load data:', error);
      res.status(500).send('Error loading data.');
    });
});
app.post('/picture', (req, res) => {
   const{
    Name, When,Where,Review,id,Author
   } = req.body
   const newpict = 
    Pict.create({
        id,Name, When,Where,Review,Author
    })
    

    .then(() => {
      res.send(newpict);
    })
    .catch((error) => {
      console.error('Unable to load data:', error);
      res.status(500).send('Error loading data.');
    });
});

///

app.get('/pictures', (req, res) => {
    Pict.findAll()
      .then((users) => {
        res.send(users);
      })
      .catch((error) => {
        console.error('Unable to fetch data:', error);
        res.status(500).send('Error fetching data.');
      });
  });
  