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


const handleProfileUpdate = (req, res, pg) => {
    const {id} = req.params;
    const {name, age, pet } = req.body.formInput;
    pg('users')
        .where({id})
        .update({name})
        .then(response =>{
            if (response) {
                res.json('all done')
            } else{
                res.status(400).json('smth went wrong')
            }
        })
        .catch(err => res.status(500).json('error appeared while updating'))
};

module.exports = {handleProfileGet, handleProfileUpdate};