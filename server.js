

// using express

const express =require ("express");
const mongoose =require('mongoose');
const cors = require('cors')
//create an instance of express
const app = express();
app.use(express.json());//middleware to parse json request body 
app.use(cors())

//create a route for the root url
// app.get('/',(req,res)=>{
//     res.send("hello world")
// })its for understanding the concepet of routing

//sample in memory storage for todo items
// let todos =[];


//connecting to mongodb
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("db connected");
})
.catch((err)=>{
    console.log(err);
})

//creating a schema for todo list
const todoSchema =new mongoose.Schema({
  title:{
    required:true,
    type:String
  },
  description: String  
})

//creating a model for todolist
const todomodel = mongoose.model('todo',todoSchema);
//create a new todo item
app.post('/todos',async(req,res)=>{
    const {title,description} =req.body;
    // const newtodo ={
    //     id:todos.length +1,
    //     title,
    //     description
    // };

    // todos.push(newtodo);
    // console.log(todos);
try{
    const newtodo = new todomodel({title,description});
    await newtodo.save();

    res.status(201).json(newtodo);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error saving todo"});
    }
});


//get all items
app.get('/todos',async(req,res)=>{
    try {
       const todos =await todomodel.find();
       res.json(todos); 
    } catch (error) {
         console.log(error);
        res.status(500).json({message: "Error saving todo"});
        
    }
   
})

//update a todo item
app.put("/todos/:id",async(req,res)=>{
   
    try {
       
    const {title,description} =req.body;
      const id = req.params.id;
        const updatedtodo = await todomodel.findByIdAndUpdate(
            id,
            {title,description}
            ,{new:true}
        )
        if(!updatedtodo){
            return res.status(404).json({message: "todo not found"});
        }
        res.json(updatedtodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error updating todo"});
    }
})

//delete a todo item
app.delete("/todos/:id",async(req,res)=>{
    try {
        const id =req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end();
    }catch (error) {
        console.log(error);
        res.status(500).json({message:"error deleting todos"});
    }
    
})
//start the server on port 5000
const port =5000;
app.listen(port,() => {
    console.log("server is listening to port"+port);
});