const Comment = require('../models/Comment');

// POST /comments/:tripId - Create comment
async function create(req, res) {
  try {
    await Comment.create({
      text: req.body.text,
      user: req.session.userId,
      trip: req.params.tripId
    });

    res.redirect(`/trips/${req.params.tripId}`);
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).send('Failed to post comment.');
  }
}

// DELETE /comments/:commentId - Delete comment
async function destroy(req, res) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).send('Comment not found');

    if (comment.user.toString() !== req.session.userId) {
      return res.status(403).send('Not authorised to delete this comment');
    }

    await comment.deleteOne();
    res.redirect(`/trips/${comment.trip}`);
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).send('Failed to delete comment.');
  }
}

module.exports = {
  create,
  destroy
};
