const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: String, 
    ingredients: [String], 
    dificult: String
}, {versionKey: false});

module.exports = mongoose.model('recipe', RecipeSchema);