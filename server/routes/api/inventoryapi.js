const Ingredient = require('../../models/Ingredient');

module.exports = (app) => {
    //delete an ingredient
    app.delete('/api/ingredient/delete', (req, res, next) => {
        Ingredient.deleteOne({ userId: req.body.userId, name: req.body.name }, function (err, deleted) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send('{"message":"Successfully deleted '.concat(req.body.name));
            }
        });
    });

    //Add ingredient
    app.post('/api/ingredient/add', (req, res, next) => {
        //need items required in model 
        const { body } = req;
        const {
            name,
            userId,
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
            name: name, 
            userId: userId,
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
                newIngredient.userId = userId;

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

    //get list of ingredients WORKING ON THIS
    app.get('/api/ingredients', (req, res, next) => {
        const { query } = req;
        const { user } = query;
        Ingredient.find({userId: user}, (err, ingredients) =>{
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {               
                res.send(ingredients);
            }
        });
    });
}