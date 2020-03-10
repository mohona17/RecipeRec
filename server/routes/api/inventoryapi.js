const Ingredient = require('../../models/Ingredient');

module.exports = (app) => {
    //delete an ingredient
    app.post('/api/ingredient/delete', (req, res, next) => {
        Ingredient.deleteOne({ userId: req.body.userId, name: req.body.name }, function (err, deleted) {
            if (err) {
                res.status(400).send(err);
            } 
            else {
                res.status(200).send({
                   message: "success"
                })
            }
        });
    });

    app.post('/api/ingredient/add', (req, res, next) => {
        //need items required in model 
        const { body } = req;
        const {
            name,
            userId,
            //quantity
        } = body;

        Ingredient.find({
            name: name,
            userId: userId,
        }, (err, ingredients) => {
            if (err) {
                res.status(400).send({
                    message: 'Server error.'
                })
            }
            //ingredient is already added 
            else if (ingredients.length > 0) {
                res.status(250).send({
                    message: 'duplicate'
                })
            }
            else {
                const newIngredient = new Ingredient();

                newIngredient.name = name;
                newIngredient.userId = userId;

                newIngredient.save((err, user) => {
                    if (!err) {
                        res.status(200).send({
                            message: "success"
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
        Ingredient.find({ userId: user }, (err, ingredients) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            else if (ingredients.length == 0) {
                res.send("No ingredients")
            }
            else {
                res.send(ingredients);
            }
        });
    });
}