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
  }
};
