const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')

const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

const ApIFeatures = require('../utils/apiFeatures')

const cloudinary = require('cloudinary')

//create new product => /api/v1/seller/product/new
exports.newProduct = catchAsyncErrors (async(req,res,next) =>{
    
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product

    })
})

//Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 20;
    const productCount = await Product.countDocuments();
  
    // get user ID from the authenticated user (assuming you're using JWT or similar for authentication)
    const userId = req.user.id;
  
    const apiFeatures = new ApIFeatures(Product.find({ user: userId }), req.query)
      .search()
      .filter()
      .pagination(resPerPage);
  
    const products = await apiFeatures.query;
  
    res.status(200).json({
      success: true,
      count: products.length,
      productCount,
      resPerPage,
      products,
    });
  });
  

//Get single procudt details => /api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors (async(req, res, next) =>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success:true,
        product
    })
})


//Update Product => /api/v1/seller/prdouct/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

})

//Delete product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors (async(req,res,next) =>{
  
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }

    await product.remove();

    res.status(200).json({
        success:true,
        message:'Product is deleted.'
    })





})




