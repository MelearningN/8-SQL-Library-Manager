const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require("sequelize");

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET articles listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render("books/index", { books, title: "Welcome to the library!"});
}));

/* Create a new article form. */
 router.get('/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST create article. */
 router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
})); 

/* Edit article form. */
 router.get("/:id/edit", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/update-book", { book, title: "Edit Book" });      
  } else {
    res.render("books/page-not-found");
  }
}));

/* GET individual article. */
 router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/show", { book, title: book.title });  
  } else {
    res.render("books/page-not-found");
  }
}));

router.get("/search/:query", asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        { title: req.params.query },
        { author: req.params.query }
      ]
    }
  });
  if(books) {
    res.render("books/");  
  } else {
    res.render("books/page-not-found");
  }
}));
// search for specific thing
router.post('/search',  asyncHandler ( async (req, res, next) => {
  console.log('yeee', req.body)
  const books= await
        Book.findAll({
          where: {
            [Op.or]: [
              {
                title: {
                  [Op.like]: `%${req.body.q}%`
                }
              },
              {
                author: {
                  [Op.like]: `%${req.body.q}%`
                }
              },
              {
                genre: {
                  [Op.like]: `%${req.body.q}%`
                }
              },
              {
                year: {
                  [Op.like]: `%${req.body.q}%`
                }
              }

            ]
          }
  });
  console.log('heye', books)
  if(books) {
    res.render("books/", {books, title: "Search Results"});  
  } else {
    res.render("books/page-not-found");
  }
}));

/* Update an article. */
 router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/"); 
    } else {
      res.render("books/page-not-found");
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

/* Delete article form. */
 router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/delete", { book, title: "Delete Book" });
  } else {
    res.render("books/page-not-found");
  }
}));

/* Delete individual article. */
 router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.render("books/page-not-found");
  }
}));

module.exports = router;