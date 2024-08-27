require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/products')
const receiptRoutes = require('./routes/receipts')
const dealerRoutes = require('./routes/dealers')
const farmermeetingRoutes = require('./routes/farmermeeting')
const visitRoutes = require('./routes/visits')
const orderRoutes = require('./routes/orders')
const policyRoutes = require('./routes/policys')
const creditnoteRoutes = require('./routes/creditnotes')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)
app.use('/api/products',productRoutes)
app.use('/api/receipts',receiptRoutes)
app.use('/api/dealers', dealerRoutes)
app.use('/api/farmermeetings', farmermeetingRoutes)
app.use('/api/visits', visitRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/policys', policyRoutes)
app.use('/api/creditnotes', creditnoteRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })