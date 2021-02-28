const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const {Op} = require("sequelize");
const pagination=require("../utility")


/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            next(error);
        }
    }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
    let {page} = req.query
    if (!page) {
        page = 1;
    }
    // total books
    const books = await Book.findAll({});

    // decides how many paginated buttons should be there
    let pageCounts = Math.ceil(books.length / pagination)

    const paginatedBooks = await Book.findAll({
        order: [
            [
                'author', 'ASC'
            ],
            [
                'title', 'ASC'
            ],
        ],
        limit: pagination,
        offset: (page - 1) * pagination
    });
    res.render("books/index", {
        paginatedBooks,
        title: "Welcome to the library!",
        pageCounts,
        page
    });
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
    res.render("books/new-book", {
        book: {},
        title: "New Book"
    });
});

/* POST create article. */
router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("/books/" + book.id);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            res.render("books/new-book", {
                book,
                errors: error.errors,
                title: "New Book"
            })
        } else {
            throw error;
        }
    }
}));

/* Edit book form. */
router.get("/:id/edit", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render("books/update-book", {book, title: "Edit Book"});
    } else {
        res.render("books/page-not-found");
    }
}));

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render("books/show", {book, title: book.title});
    } else {
        res.render("books/page-not-found");
    }
}));


/* Update an book. */
router.post('/:id/edit', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect("/books/");
        } else {
            res.render("books/page-not-found");
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render("books/update-book", {
                book,
                errors: error.errors,
                title: "Edit Book"
            })
        } else {
            throw error;
        }
    }
}));

/* Get an a individual book to delete. */
router.get("/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render("books/delete", {book, title: "Delete Book"});
    } else {
        res.render("books/page-not-found");
    }
}));

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect("/books");
    } else {
        res.render("books/page-not-found");
    }
}));

module.exports = router;
