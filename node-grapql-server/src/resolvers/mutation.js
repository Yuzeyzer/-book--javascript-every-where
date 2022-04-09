const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');

module.exports = {
  newNote: async (parent, { content }, { models }) => {
    return await models.Note.create({
      content: content,
      author: 'Yuzeyzer'
    });
  },
  deleteNote: async (parent, { id }, { models }) => {
    try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  updateNote: async (parent, { id, content }, { models }) => {
    try {
      return await models.Note.findOneAndUpdate(
        { _id: id },
        { $set: { content: content } },
        { new: true }
      );
    } catch (err) {
      console.error(err);
      return err.message;
    }
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = gravatar(trimmedEmail);

    try {
      const user = await models.User.create({
        username,
        email: trimmedEmail,
        avatar,
        password: hashedPassword
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.error(err);
      throw new Error('Error creating account');
    }
  }
};
