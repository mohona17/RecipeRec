const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  userId:{
    type: String, 
    default:''
  }
//   quantity: {
//     type: String,
//     default: '',
//   },
});

module.exports = mongoose.model('Ingredient', IngredientSchema);
