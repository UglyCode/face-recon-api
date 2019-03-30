const express = require('express');
const bp = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const imageIncrease = require('./controllers/image');

const PORT = process.env.PORT || 3001;
const DATABASE_LINK = process.env.DATABASE_URL;
console.log(DATABASE_LINK);

const pg = knex({
   client: 'pg',
   connection: {
      connectionString: DATABASE_LINK,
      ssl: false
   }
});


const app = express();
app.use(bp.json());
app.use(cors());

app.get('/', (req, res)=>{
   pg.select('*').from('users')
       .then(response => res.json(response));
});


app.post('/signIn', signIn.signInAuth(pg, bcrypt));

app.post('/register', (req,res) => register.handleRegister(req, res, pg, bcrypt));

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, pg)});

app.put('/image', (req, res) => {imageIncrease.handleImageIncrease(req, res, pg)});

app.post('/image', (req, res) => {imageIncrease.getFaceRecognitionObject(req, res)});

app.post('/profile/:id', (req, res) => {profile.handleProfileUpdate(req,res,pg)});


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//    // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//    // res = false
// });

app.listen(PORT, ()=>{
   console.log(`server started at port ${PORT}--`);
});