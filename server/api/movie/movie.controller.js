const Movie = require('./movie.model');
const responseHandler = require('../../components/utilities').responseHandler;
const findQuery = require('objection-find');

// allowed query parameters: include, page*, limit, filter, order and fields
// https://github.com/TryGhost/Ghost/issues/5463

exports.create = function (req, res) {
  Movie.query()
    .insert(req.body)
    .then(movie => responseHandler(null, res, 201, movie))
    .catch(err => responseHandler(err, res));
};

exports.addActor = function (req, res) {
  Movie.query()
    .findById(req.params.id)
    .then(movie => {
      if (movie === void 0) {
        return responseHandler(new Error(), res, 404, movie);
      }
      movie
        .$relatedQuery('actors')
        .relate(req.body)
        .then(actor => responseHandler(null, res, 200, actor))
        .catch(err => responseHandler(err, res));
    });
};

exports.update = function (req, res) {
  Movie.query()
    .patchAndFetchById(req.params.id, req.body)
    .then(movie => responseHandler(null, res, 200, movie))
    .catch(err => responseHandler(err, res));
};

exports.index = function (req, res) {
  findQuery(Movie)
    .allowEager('[type, director, actors]')
    .build(req.query.filter)
    .eager(req.query.include)
    .orderBy(req.query.sort.by, req.query.sort.order)
    .page(req.query.page.number, req.query.page.size)
    .then(movies => responseHandler(null, res, 200, movies))
    .catch(err => responseHandler(err, res));
};

exports.show = function (req, res) {
  Movie.query()
    .findById(req.params.id)
    .allowEager('[type, director, actors]')
    .eager(req.query.eager)
    .then(movie => responseHandler(null, res, 200, movie))
    .catch(err => responseHandler(err, res));
};

exports.destroy = function (req, res) {
  Movie.query()
    .deleteById(req.params.id)
    .then(() => res.status(204).send())
    .catch(err => responseHandler(err, res));
};

