const express = require('express');
const router = express.Router();
const Category = require('../schemas/category');

// 
router.get('/', async function (req, res, next) {
    try {
        let categories = await Category.find();
        res.status(200).send({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// 
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let category = await Category.findById(id);

        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Không tìm thấy danh mục"
            });
        }

        res.status(200).send({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

//
router.post('/', async function (req, res, next) {
    try {
        let newCategory = new Category({
            name: req.body.name,
            description: req.body.description
        });

        await newCategory.save();
        res.status(200).send({
            success: true,
            data: newCategory
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedData = {
            name: req.body.name,
            description: req.body.description
        };

        let updatedCategory = await Category.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCategory) {
            return res.status(404).send({
                success: false,
                message: "Không tìm thấy danh mục để cập nhật"
            });
        }

        res.status(200).send({
            success: true,
            data: updatedCategory
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

        let deletedCategory = await Category.findByIdAndUpdate(
            id,
            { isDelete: true },
            { new: true }
        );

        if (!deletedCategory) {
            return res.status(404).send({
                success: false,
                message: "Không tìm thấy danh mục để xóa"
            });
        }

        res.status(200).send({
            success: true,
            message: "Danh mục đã được xóa mềm",
            data: deletedCategory
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
