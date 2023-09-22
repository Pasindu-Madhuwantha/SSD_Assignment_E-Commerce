const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const generateTrackingNumber = require('../utils/generateTrackingNumber');
const sendEmail = require('../utils/sendEmail');


// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})


// Get single order   =>   /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        orders
    })
})


// Get all orders - seller  =>   /api/v1/seller/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const sellerId = req.user.id; // Assuming you are using Passport.js for authentication and user data is stored in req.user
    const orders = await Order.find({ "orderItems.product": { "$in": await Product.find({ user: sellerId }, { _id: 1 }) } });

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})




// Update / Process order - seller  =>   /api/v1/seller/order/:id

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    if (req.body.status === "Shipped") {
        // Generate tracking number
        const trackingNumber = await generateTrackingNumber(order);

        // Set tracking number and update order status to "Shipped"
        order.trackingNumber = trackingNumber;
        order.orderStatus = "Shipped";

        // Update stock and set order status to "Delivered"
        order.orderItems.forEach(async (item) => {
            await updateStock(item.product, item.quantity);
        });

        // Send email to user
        const populateUserName = await Order.findById(order._id).populate('user');
        const userName = populateUserName.user.name;
        const message = `Hello ${userName},\n\nYour order (${order._id}) has been shipped and is on its way to you. Your tracking number is ${order.trackingNumber}.\n\nHere are the details of your order:\n\n` +
        order.orderItems.map(item => (
          `Product name: ${item.name}\nPrice: ${item.price}\nQuantity: ${item.quantity}\n\n`
        )).join('') +
        `Total price: ${order.totalPrice}\n\nThank you for shopping with us!\n\n`;

        await sendEmail({
          email: order.shippingInfo.email,
          subject: 'Order Shipped',
          message,
        });

    } else if (req.body.status === "Delivered") {

        order.orderStatus = "Delivered";
        order.deliveredAt = Date.now();
    } else {
        return next(new ErrorHandler("Invalid status", 400));
    }

    await order.save();

    res.status(200).json({
        success: true,
    });
});


async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false })
}

// Delete order   =>   /api/v1/seller/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }

    await order.remove()

    res.status(200).json({
        success: true
    })
})