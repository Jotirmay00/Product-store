
const connectDB  = require('./db/connect')
require('dotenv').config()
const express = require('express')
const app  = express()
const products = require('./routes/product')


const port = process.env.PORT || 8000


// middleware to parse json
app.use(express.json())


//middleware for routing
app.use('/api/v1/products',products)


// Connecting to Database
const start = async ()=>{

    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port , ()=>{
            console.log(`The server is running on port ${port}`)
        })

    } catch (error) {
        console.log(error)
    }

}

start()

