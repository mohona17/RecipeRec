const Ingredient = require('../../models/Ingredient');

module.exports = (app) => {
    //Sign Up
    app.post('/api/ingredient/add', (req, res, next) => {
        //need items required in model 
        const { body } = req;
        const {
            name,
            //quantity
        } = body;

        //Verifying all needed fields are present
        if (!name) {
            return res.send({
                success: false,
                message: 'Error: did not add ingredient.'
            })
        };
        Ingredient.find({
            name:name
        }, (err, ingredients) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Server error.'
                })
            }
            //ingredient is already added 
            else if (ingredients.length > 0) {
                return res.send({
                    success: false,
                    message: 'You already have this ingredient.'
                })
            }
            else {
                const newIngredient = new Ingredient();

                newIngredient.name = name;

                newIngredient.save((err, user) => {
                    if (err) {
                        return res.send({
                            success: true,
                            message: 'Ingredient created.'
                        })
                    }
                });
            }
        });


    });
}