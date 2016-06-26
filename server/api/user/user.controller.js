const User = require('./user.model');
const UserSerializer = require('./user.serializer');
const responseHandler = require('../../components/utilities').responseHandler.bind(UserSerializer);
const findQuery = require('objection-find');

exports.update = function (req, res) {
  User.query()
    .patchAndFetchById(req.params.id, req.body)
    .then(user => res.send(user));
};

exports.index = function (req, res) {
  findQuery(User)
    .build(req.query.filter)
    .eager(req.query.include)
    .orderBy(req.query.sort.by, req.query.sort.order)
    .page(req.query.page.number, req.query.page.size)
    .where('id', req.params.id)
    .then(types => responseHandler(null, res, 200, types.results, {total: types.total}))
    .catch(err => responseHandler(err, res));
};

exports.show = function (req, res) {
  User.query()
    .findById(req.user)
    .then(user => res.send(user));
};

exports.destroy = function (req, res) {
  User.query()
    .delete()
    .where('id', req.params.id)
    .then(() => responseHandler(null, res, 204))
    .catch(err => responseHandler(err, res));
};

exports.unlink = function(req,res) {
  let provider = req.query.provider;

  let providers = ['facebook'];
  if (providers.indexOf(provider) === -1) {
    return res.status(404).send('Unknown provider');
  }

  User.query()
    .findById(req.user)
    .update({[provider]: null})
    .then((user) => {
      res.status(200).send(user);
    });
};
