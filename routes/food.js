var express = require('express');
var router = express.Router();
let Food = require('../models/FoodModel');

/* GET home page. */
router.get('/', (request, response, next) => {
    response.render('index', { title: 'Welcome to my App' });
  });

router.get('/list_all_foods', (request, response, next) =>{
    //response.render('index',{ title: 'All foods'});
    Food.find({}).limit(100).sort({name: 1}).select({
        name: 1,
        foodDescription: 1,
        create_date: 1,
        status:1
    }).exec((err, foods) =>{
        if(err){
            response.json({
                result: "failed",
                data: [],
                message: `Error is ${err}` 
            });
        } else{
            response.json({
                result: "ok",
                data: foods,
                count: foods.length,
                message: "Query list of foods successfully"
            });
        }
    });
});

// api: "localhost:3000/get_food_with_id?food_id=5f23efd21c601d14ff22a755"
router.get('/get_food_with_id', (request, response, next) => {
    Food.findById( require('mongoose').Types.ObjectId(request.query.food_id),
    (err,food) =>{
        if(err) {
            response.json({
                result: "failed",
                data: {},
                message: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: food,
                message: "Query food by id successfully"
            });
        }
    });
});

// api: "localhost:3000/list_foods_with_criteria?name<food name>&limit= <number>"
router.get('/list_foods_with_criteria', (request, response, next) =>{

    // Check available name
    if(!request.query.name){
        response.json({
            result: "failed",
            data: [],
            message: "Input parameter is wrong!"
        });
    }

    let criteria = {
        //name: new RegExp(request.query.name, "i"),
        name: new RegExp('^' + request.query.name + '$', "i"),
    };
    const limit = parseInt(request.query.limit) > 0 ? parseInt(request.query.limit) : 100;

    Food.find(criteria).limit(limit).sort({name:1}).select({
        name: 1,
        foodDescription:1,
        status: 1,
        create_date: 1
    }).exec((err,foods) =>{
        if(err) {
            response.json ({
                result: "failed",
                data: [],
                message: `Error is : ${err}`
            });
        } else {
            response.json ({
                result: "ok",
                data: foods,
                count: foods.length,
                message: "Query list food with criteria successfully"
            });
        }
    });
})

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