var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product')

function buildQuery(obj){
  console.log(obj);
  let result = {};
  if(obj.name){
    result.name=new RegExp(obj.name,'i');
  }
  result.price = {};
  if(obj.price){
    if(obj.price.$gte){
      result.price.$gte = obj.price.$gte;
    }else{
      result.price.$gte = 0
    }
    if(obj.price.$lte){
      result.price.$lte = obj.price.$lte;
    }else{
      result.price.$lte = 10000;
    }
    
  }
  return result;
}

/* GET users listing. */
router.get('/', async function(req, res, next) {
  
  
  let query = buildQuery(req.query);

  query.isDelete = false;

  let products = await productModel.find(query);

  res.status(200).send({
    success:true,
    data:products
  });
});
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let product = await productModel.findById(id);
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:"khong co id phu hop"
    });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price:req.body.price,
      quantity: req.body.quantity,
      category:req.body.category
    })
    await newProduct.save();
    res.status(200).send({
      success:true,
      data:newProduct
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;

    let updatedData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category
    };

    let updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm để cập nhật"
      });
    }

    res.status(200).send({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;

    // Cập nhật trường isDelete thành true
    let deletedProduct = await productModel.findByIdAndUpdate(
      id, 
      { isDelete: true }, 
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm để xóa"
      });
    }

    res.status(200).send({
      success: true,
      message: "Sản phẩm đã được xóa mềm",
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
