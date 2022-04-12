const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

const gravatar = require('../util/gravatar');

module.exports = {
  newNote: async (parent, { content }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a Note!');
    }

    return await models.Note.create({
      content: content,
      author: mongoose.Types.ObjectId(user.id)
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a Note!');
    }

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError(
        'You do not have permission to delete this Note!'
      );
    }

    try {
      await note.remove();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  updateNote: async (parent, { id, content }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a Note!');
    }

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError(
        'You do not have permission to delete this Note!'
      );
    }

    try {
      return await models.Note.findOneAndUpdate(
        { _id: id },
        { $set: { content } },
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
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    const trimmedEmail = email.trim().toLowerCase();

    const user = await models.User.findOne({
      $or: [{ username }, { email: trimmedEmail }]
    });

    if (!user) {
      throw new AuthenticationError(
        'There is no user with that email or username'
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  toggleFavorite: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError(
        'You must be signed in to favorite a Note!'
      );
    }

    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);

    if (hasUser >= 0) {
      return await models.Note.findOneAndUpdate(
        id,
        {
          $pull: { favoritedBy: user.id },
          $inc: { favoriteCount: -1 }
        },
        { new: true }
      );
    }
    return await models.Note.findOneAndUpdate(
      id,
      {
        $push: { favoritedBy: user.id },
        $inc: { favoriteCount: 1 }
      },
      { new: true }
    );
  }
};
