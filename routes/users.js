const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const isSignedIn = require('../middleware/is-signed-in');

// Show the list of users this user is following
router.get('/:id/following', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following').lean();

    res.render('users/following', {
      title: `${user.username} is following`,
      user,
      followingList: user.following
    });
  } catch (err) {
    console.error('Error showing following:', err);
    res.status(500).send('Could not load following list');
  }
});

// Show the list of followers for this user
router.get('/:id/followers', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers').lean();

    res.render('users/followers', {
      title: `Followers of ${user.username}`,
      user,
      followerList: user.followers
    });
  } catch (err) {
    console.error('Error showing followers:', err);
    res.status(500).send('Could not load followers list');
  }
});

// Follow another user
router.post('/:id/follow', isSignedIn, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.userId);
    const targetUser = await User.findById(req.params.id);

    if (!currentUser || !targetUser || currentUser.id === targetUser.id) {
      return res.status(400).send('Invalid user');
    }

    if (!currentUser.following.includes(targetUser.id)) {
      currentUser.following.push(targetUser.id);
      targetUser.followers.push(currentUser.id);

      await currentUser.save();
      await targetUser.save();
    }

    res.redirect(`/users/${targetUser.id}`);
  } catch (err) {
    console.error('Error following user:', err);
    res.status(500).send('Could not follow user');
  }
});

// Unfollow a user
router.post('/:id/unfollow', isSignedIn, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.userId);
    const targetUser = await User.findById(req.params.id);

    if (!currentUser || !targetUser || currentUser.id === targetUser.id) {
      return res.status(400).send('Invalid user');
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUser.id
    );

    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== currentUser.id
    );

    await currentUser.save();
    await targetUser.save();

    res.redirect(`/users/${targetUser.id}`);
  } catch (err) {
    console.error('Error unfollowing user:', err);
    res.status(500).send('Could not unfollow user');
  }
});

// Show public profile of another user
router.get('/:id', isSignedIn, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id)
      .populate('followers')
      .populate('following')
      .lean();

    const trips = await Trip.find({ user: targetUser._id })
      .sort({ date: -1 })
      .lean();

    const isFollowing = targetUser.followers.some(
      follower => follower._id.toString() === req.session.userId
    );

    res.render('users/show', {
      user: targetUser,
      trips,
      isFollowing,
      isCurrentUser: req.session.userId === req.params.id
    });
  } catch (err) {
    console.error('Error loading user profile:', err);
    res.status(500).send('User profile could not be loaded');
  }
});

module.exports = router;
