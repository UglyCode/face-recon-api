const handleProfileGet = (req, res, pg) =>{
    pg.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then( userData => {
            if (bcrypt.compareSync(req.body.password, userData[0].hash)){
                return pg.select('*').from('users').
                where('email', '=', req.body.email)
                    .then(user => res.json(user[0]))
                    .catch(err => res.status('400').json('oy-oy-oy-oy'))
            } else {
                res.status('400').json('wrong email or password!')
            }
        })
        .catch(err => res.status('400').json('wrong credentials'));
};

module.exports = {handleProfileGet};