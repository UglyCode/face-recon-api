const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
});

const getFaceRecognitionObject = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(response => {
            return res.json(response);
        })
        .catch(err => res.status('400').json("can't get answer from clarifai APIs"))
};


const handleImageIncrease = (req, res, pg) => {
    const {id} = req.body;
    pg('users')
        .where('id','=', Number(id))
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries))
        .catch(err => res.status('400').json("can't increment your entries, sorry."));
};

module.exports = {handleImageIncrease, getFaceRecognitionObject};