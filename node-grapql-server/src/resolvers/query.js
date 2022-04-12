module.exports = {
  note: async (parent, args, { models }) => await models.Note.findById(args.id),
  notes: async (parent, args, { models }) => await models.Note.find(),
  user: async (parent, args, { models }) => await models.User.findOne({ username: args.username }),
  users: async (parent, args, { models }) => await models.User.find(),
  me: async (parent, args, { models, user }) => await models.User.findById(user.id)
};
