var express = require('express');
var router = express.Router();
let Food = require('../models/FoodModel');

/* GET home page. */
router.get('/', (request, response, next) => {
    response.render('index', { title: 'Welcome to my App' });
  });

router.get('/list_all_foods', (request, response, next) =>{
    response.render('index',{ title: 'All foods'});
});

router.post('/add_new_food', (request, response, next) => {
    const newFood = new Food ({
        name: request.body.name,
        foodDescription: request.body.foodDescription
    });
    newFood.save((err) =>{
        if(err){
            response.json({
                result:"failed",
                data: {},
                message: `Error is: ${err}`
            });
        } else {
            response.json ({
                result: "ok",
                data: {
                    name: request.body.name,
                    foodDescription: request.body.foodDescription
                }
            });
        }
    });
});

module.exports = router;