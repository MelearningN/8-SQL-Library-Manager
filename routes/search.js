const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const {Op} = require("sequelize");
const pagination = require("../utility")

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            next(error);
        }
    }
}

router.get("/:query", asyncHandler(async (req, res) => {
    let {page} = req.query
    let query = req.params.query
    if (!page) {
        page = 1;
    }
    let searchQuery = {
        [Op.or]: [
            {
                title: {
                    [Op.like]: `%${
                        query
                    }%`
                }
            }, {
                author: {
                    [Op.like]: `%${
                        query
                    }%`
                }
            }, {
                genre: {
                    [Op.like]: `%${
                        query
                    }%`
                }
            }, {
                year: {
                    [Op.like]: `%${
                        query
                    }%`
                }
            }

        ]
    }
    // total searched books
    const books = await Book.findAll({where: searchQuery});
    // Paginated results
    const paginatedBooks = await Book.findAll({
        where: searchQuery,
        limit: pagination,
        offset: (page - 1) * pagination
    });
    let pageCounts = Math.ceil(books.length / pagination)
    if (paginatedBooks) {
        res.render("books/search", {
            paginatedBooks,
            title: "Search Results",
            pageCounts,
            page,
            query
        });
    } else {
        res.redirect("/error");
    }
}));

// search for specific thing
router.post('/', asyncHandler(async (req, res, next) => {
    let query = req.body.q;
    let {page} = req.query
    if (!page) { // if page is not defined == null
        page = 1;
    }
    let searchQuery = {
        [Op.or]: [
            {
                title: {
                    [Op.like]: `%${
                        req.body.q
                    }%`
                }
            }, {
                author: {
                    [Op.like]: `%${
                        req.body.q
                    }%`
                }
            }, {
                genre: {
                    [Op.like]: `%${
                        req.body.q
                    }%`
                }
            }, {
                year: {
                    [Op.like]: `%${
                        req.body.q
                    }%`
                }
            }

        ]
    }

    // total search results
    const books = await Book.findAll({where: searchQuery});

    // results by pagination
    const paginatedBooks = await Book.findAll({where: searchQuery, limit: pagination});
    let pageCounts = Math.ceil(books.length / pagination)
    if (paginatedBooks) {
        res.render("books/search", {
            paginatedBooks,
            title: "Search Results",
            pageCounts,
            page,
            query
        });
    } else {
        res.redirect("/error");
    }
}));


module.exports = router;
