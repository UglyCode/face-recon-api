const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup Redis!
const redisURI = process.env.REDIS_URL || 'localhost:6379';
const redisClient = redis.createClient({host: redisURI});

const handleSignIn = (pg, bcrypt, req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return Promise.reject('bad request');
    }

    return pg.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then( userData => {
            if (bcrypt.compareSync(password, userData[0].hash)){
                return pg.select('*').from('users').
                where('email', '=', email)
                    .then(user => user[0])
                    .catch(err => Promise.reject('oy-oy-oy-oy'))
            } else {
                Promise.reject('wrong email or password!')
            }
        })
        .catch(err => (
            Promise.reject('wrong credentials')));
};

const getAuthTokenId = () => {
    console.log('Auth sent');
};

const signToken = (email) => {
    const jwtPayload = {email};
    return jwt.sign(jwtPayload, 'SENIOR', {expiresIn: '2 days'});
};

const createSessions = (user) =>{
    const {id, email} = user;
    const token = signToken(email);
    return {success: 'true', userId: id, token};
};

const signInAuth = (pg, bcrypt) => (req, res) =>{
    const { authorisation } = req.headers;
    return authorisation ?
        getAuthTokenId() :
        handleSignIn(pg, bcrypt, req, res)
            .then(data => {
                return data.id && data.email ?
                    createSessions(data)
                    : Promise.reject(data);
            }).then(session => res.json(session))
            .catch(err => res.status(400).json(err));
};

module.exports = {signInAuth};
