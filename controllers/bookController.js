var Book = require("../models/book");
var Author = require("../models/author");
var Genre = require("../models/genre");
var BookInstance = require("../models/bookinstance");

var mongoose = require("mongoose");
var async = require("async");
var navlinks = require("./modules/navlinks");

//middleware
var { body, validationResult, check } = require("express-validator");

exports.index = function (req, res) {
  async.parallel(
    {
      book_count: function (callback) {
        Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      book_instance_count: function (callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: function (callback) {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count: function (callback) {
        Author.countDocuments({}, callback);
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "San Jose City Library",
        error: err,
        data: results,
        active: "/catalog",
        navlinks,
      });
    }
  );
};

// Display list of all Books.
exports.book_list = function (req, res, next) {
  Book.find({}, "title author") //this selects only title and author
    .sort({ title: 1 })
    .populate("author")
    .exec(function (err, list_books) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("book_list", {
        title: "Book List",
        book_list: list_books,
        active: "/catalog/books",
        navlinks,
      });
    });
};

// Display detail page for a specific book.
exports.book_detail = function (req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id);
  async.parallel(
    {
      book: function (callback) {
        Book.findById(id).populate("author").populate("genre").exec(callback);
      },

      book_instance: function (callback) {
        BookInstance.find({ book: id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }

      res.render("book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
        active: "/catalog/book/:id",
        navlinks,
      });
    }
  );
};

// Display book create form on GET.
// Display book create form on GET.
exports.book_create_get = function (req, res, next) {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      authors: function (callback) {
        Author.find().exec(callback);
      },
      genres: function (callback) {
        Genre.find().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("book_form", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
        active: "/catalog/book/create",
        book: undefined,
        errors: null,
        navlinks,
      });
    }
  );
};

// Handle book create on POST.
exports.book_create_post = [
  // async (req, res, next) => {
  //   let payload = req.body.payload;
  //   let search = await Genre.find({
  //     name: { $regex: new RegExp("^" + payload + ".*", "i") },
  //   });
  //   search = search.slice(0, 10);
  //   res.render("book_form", { payload: search });
  //   next();
  // },
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitize fields.
  [body("title").toLowerCase().trim().isLength({ min: 1 }).escape()],
  [body("author").toLowerCase().trim().isLength({ min: 1 }).escape()],
  [body("summary").toLowerCase().trim().isLength({ min: 1 }).escape()],
  [body("isbn").toLowerCase().trim().isLength({ min: 1 }).escape()],
  body("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function (callback) {
            Author.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          //Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
            active: "/catalog/book/create",
            navlinks,
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save book.
      book.save(function (err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  },
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id);
  async.parallel(
    {
      book: function (callback) {
        Book.findById(id).populate("author").populate("genre").exec(callback);
      },

      book_instance: function (callback) {
        BookInstance.find({ book: id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }

      res.render("book_delete", {
        title: "Delete Book",
        book: results.book,
        book_instances: results.book_instance,
        active: "/catalog/book/:id/delete",
        navlinks,
      });
    }
  );
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res, next) {
  const id = mongoose.Types.ObjectId(req.body.bookid.trim());
  async.parallel(
    {
      book: function (callback) {
        Book.findById(id).exec(callback);
      },
      book_instance: function (callback) {
        BookInstance.find({ book: id })
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.book_instance.length > 0) {
        res.render("book_delete", {
          title: "Delete Book",
          book: results.book,
          book_instances: results.book_instance,
          active: "/catalog/authors/:id/delete",
          navlinks,
        });
        return;
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        Book.findByIdAndRemove(id, function deleteBook(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect("/catalog/books");
        });
      }
    }
  );
};

// Display book update form on GET.
exports.book_update_get = function (req, res, next) {
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      authors: function (callback) {
        Author.find(callback);
      },
      genres: function (callback) {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.

      results.genres.forEach((genre) => {
        results.book.genre.forEach((genre_of_book) => {
          if (genre._id.toString() == genre_of_book._id.toString()) {
            genre.checked = true;
          }
        });
      });

      res.render("book_form", {
        title: "Update Book",
        authors: results.authors,
        genres: results.genres,
        errors: null,
        active: "/catalog/book/:id/update",
        book: results.book,
        check: check,
        navlinks,
      });
    }
  );
};

// Handle book update on POST.
exports.book_update_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitize fields.
  [body("title").toLowerCase().trim().isLength({ min: 1 }).escape()],
  [body("author").toLowerCase().trim().isLength({ min: 1 }).escape()],
  [body("summary").toLowerCase().trim().isLength({ min: 1 }).escape()],
  [body("isbn").toLowerCase().trim().isLength({ min: 1 }).escape()],
  body("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    var book = {
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function (callback) {
            Author.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          //Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Update Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
            active: "/catalog/books/:id/update",
            navlinks,
          });
        }
      );
      return;
    } else {
      Book.findByIdAndUpdate(
        req.params.id,
        book,
        {},
        function (err, this_book) {
          if (err) {
            return next(err);
          } else {
            this_book.save();
            res.redirect(this_book.url);
          }
        }
      );
    }
  },
];
