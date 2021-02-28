const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const {Op} = require("sequelize");

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) { // Forward error to the global error handler
            next(error);
        }
    }
}

router.get("/:query", asyncHandler(async (req, res) => {
    let {page} = req.query
    console.log('this', req.params.query)
    let query= req.params.query
   
    let offset = 0;
    if (!page) { // if page is not defined == null
        page = 1;
    }
    console.log('search working', page)
    const books = await
    Book.findAll({
        where: {
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
    });
    console.log(books.length)
  
    const bookQueried = await Book.findAll({
      where: {
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
    },
      limit: 5,
      offset: (page-1)*5
  });
    let pageCounts = Math.ceil(books.length / 5)
    if (bookQueried) {
        res.render("books/search", {bookQueried, title: "Search Results",  pageCounts,
        page, query});
    }
    else {
          res.render("books/page-not-found");
      }
  }));
  // search for specific thing
  router.post('/', asyncHandler(async (req, res, next) => {
    let query= req.body.q;
    let {page} = req.query
    let offset = 0;
    if (!page) { // if page is not defined == null
        page = 1;
    }
  
      console.log('yeee post search', page, req.body.q)
      const books = await
      Book.findAll({
          where: {
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
      });
  
      const bookQueried = await Book.findAll({
        where: {
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
      },
        limit: 5,
    });
      let pageCounts = Math.ceil(books.length / 5)
      if (bookQueried) {
          res.render("books/search", {bookQueried, title: "Search Results",  pageCounts,
          page, query});
      } else {
          res.render("books/page-not-found");
      }
  }));
  

  module.exports = router;