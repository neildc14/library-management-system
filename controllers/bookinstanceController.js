var BookInstance = require("../models/bookinstance");
var Book = require("../models/book");
var navlinks = require("./modules/navlinks");

//middleware
var { body, validationResult } = require("express-validator");
// Display list of all BookInstances.
exports.bookinstance_list = function (req, res, next) {
  BookInstance.find()
    .populate("book")
    .exec(function (err, list_bookinstances) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: list_bookinstances,
        active: "/catalog/bookinstances",
        navlinks,
      });
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function (err, bookinstance) {
      if (err) return next(err);
      if (bookinstance === null) {
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookinstance_detail", {
        title: `Copy: ${bookinstance.book.title}`,
        bookinstance: bookinstance,
        active: "/catalog/bookinstances/:id",
        navlinks,
      });
    });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function (req, res, next) {
  Book.find({}, "title").exec(function (err, books) {
    if (err) {
      return next(err);
    }
    res.render("bookinstance_form", {
      title: "Create BookInstance",
      book_list: books,
      active: "/catalog/bookinstance/create",
      errors: null,
      bookinstance: undefined,
      navlinks,
    });
  });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body("book").trim().isLength({ min: 1 }).escape(),
  body("imprint").trim().isLength({ min: 1 }).escape(),
  body("status").trim().isLength({ min: 1 }).escape(),
  body("due_back").optional({ checkFalsy: true }).isISO8601().toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      Book.find({}, "title").exec((err, books) => {
        if (err) {
          return next(err);
        }
        console.log(due_back);
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          bookinstance: bookinstance,
          errors: errors.array(),
          selected_book: bookinstance.book._id,
          active: "/catalog/bookinstance/create",
          navlinks,
        });
      });
      return;
    } else {
      bookinstance.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(bookinstance.url);
      });
    }
  },
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function (err, bookinstance) {
      if (err) return next(err);
      if (bookinstance === null) {
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookinstance_delete", {
        title: `Delete: ${bookinstance.book.title}`,
        bookinstance: bookinstance,
        active: "/catalog/bookinstances/:id/delete",
        navlinks,
      });
    });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res) {
  BookInstance.findById(req.body.bookinstanceid)
    .populate("book")
    .exec(function (err, bookinstance) {
      if (err) return next(err);
      if (bookinstance === null) {
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      } else {
        BookInstance.findByIdAndRemove(
          req.body.bookinstanceid,
          function deleteBookInstance(err) {
            if (err) {
              return next(err);
            }
            res.redirect("/catalog/bookinstances");
          }
        );
      }
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function (err, bookinstance) {
      if (err) return next(err);
      if (bookinstance === null) {
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookinstance_update", {
        title: `Update: ${bookinstance.book.title}`,
        bookinstance: bookinstance,
        errors: null,
        active: "/catalog/bookinstances/:id/update",
        navlinks,
      });
    });
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  body("book").trim().isLength({ min: 1 }).escape(),
  body("imprint").trim().isLength({ min: 1 }).escape(),
  body("status").trim().isLength({ min: 1 }).escape(),
  body("due_back").optional({ checkFalsy: true }).isISO8601().toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var bookinstance = {
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    };

    if (!errors.isEmpty()) {
      BookInstance.find({}, "title").exec((err, bookinstance) => {
        if (err) {
          return next(err);
        }

        res.render("bookinstance_update", {
          title: `Update: ${bookinstance.book.title}`,
          bookinstance: bookinstance,
          errors: errors.array(),
          selected_book: bookinstance.book._id,
          active: "/catalog/bookinstances/:id/update",
          navlinks,
        });
      });
      return;
    } else {
      BookInstance.findByIdAndUpdate(
        req.params.id,
        bookinstance,
        {},
        function (err, this_bookinstance) {
          if (err) {
            return next(err);
          }
          this_bookinstance.save();
          res.redirect("/catalog/bookinstances");
        }
      );
    }
  },
];
