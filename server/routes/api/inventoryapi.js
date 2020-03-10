const Ingredient = require('../../models/Ingredient');

module.exports = (app) => {
    //delete an ingredient
    app.post('/api/ingredient/delete', (req, res, next) => {
        Ingredient.deleteOne({ userId: req.body.userId, name: req.body.name }, function (err, deleted) {
            if (err) {
                res.status(400).send(err);
            } 
            else {
                res.send('success')
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
            if (err) res.status(400) 
            else if (ingredients.length > 0) res.send('duplicate')
            else {
                const newIngredient = new Ingredient();

                newIngredient.name = name;
                newIngredient.userId = userId;

                newIngredient.save((err, user) => {
                    if (!err) {
                        res.send('success')
                    }
                });
            }
        });


    });

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