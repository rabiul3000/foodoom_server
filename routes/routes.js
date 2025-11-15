import express from 'express'
import usersRoute from './usersRoute.js'
import foodsRoute from './foodsRoute.js'
import ordersRoute from './ordersRoute.js'
import paymentsRoute from './paymentsRoute.js'


const router = express.Router()



router.use('/users', usersRoute)
router.use('/foods', foodsRoute)
router.use('/orders', ordersRoute)
router.use('/payments', paymentsRoute)


export default router;