const handleSignIn = (pg, bcrypt) => (req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status('400').json('bad request');
    }

    pg.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then( userData => {
            if (bcrypt.compareSync(password, userData[0].hash)){
                return pg.select('*').from('users').
                where('email', '=', email)
                    .then(user => res.json(user[0]))
                    .catch(err => res.status('400').json('oy-oy-oy-oy'))
            } else {
                res.status('400').json('wrong email or password!')
            }
        })
        .catch(err => res.status('400').json('wrong credentials'));
};

module.exports = {handleSignIn};
