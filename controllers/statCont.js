const { userCluster, postCluster, noteCluster } = require("../models");

const setStreak = (posts) => {
  let streak = 1;

  posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  let previousDate = new Date(posts[0].createdAt).setHours(0, 0, 0, 0);

  for (let i = 1; i < posts.length; i++) {
    let currentDate = new Date(posts[i].createdAt).setHours(0, 0, 0, 0);
    let dayDifference = (currentDate - previousDate) / (1000 * 60 * 60 * 24);

    if (dayDifference === 1) {
      streak++;
    } else if (dayDifference > 1) {
      streak = 0;
      break;
    }

    previousDate = currentDate;
  }

  return streak;
};

const getById = async (req, res) => {
  try {
    let id = req.params.id;

    let user = await userCluster.findOne({ _id: id });
    if (user == null) {
      return res.send({
        message: "No User Found",
        result: false,
        data: {},
      });
    }

    let streak = 0;
    let posts = await postCluster.find({ userId: id });
    let notes = await noteCluster.find({ userId: id });

    if (posts.length != 0) {
      streak = setStreak(posts);
    }

    let json = {
      streak: streak,
      posts: posts.length,
      notes: notes.length,
      user: user,
    };

    return res.send({
      message: "Successfully, Get User Stats",
      result: true,
      data: json,
    });
  } catch (error) {
    return res.send({
      message: error.message,
      result: false,
      data: {},
    });
  }
};

const getAll = async (req, res) => {
  try {
    let allList = [];

    let users = await userCluster.find();
    if (users.length === 0) {
      return res.send({
        message: "No User Found",
        result: false,
        data: [],
      });
    }

    let posts = await postCluster.find();

    let notes = await noteCluster.find();

    for (const user of users) {
      let streak = 0;
      let userPosts = [];
      let userNotes = [];

      for (const post of posts) {
        if (user._id.equals(post.userId)) {
          userPosts.push(post);
        }
      }

      for (const note of notes) {
        if (user._id.equals(note.userId)) {
          userNotes.push(note);
        }
      }

      if (userPosts.length != 0) {
        streak = setStreak(userPosts);
      }

      let obj = {
        streak: streak,
        posts: userPosts.length,
        notes: userNotes.length,
        user: user,
      };

      allList.push(obj);
    }

    return res.send({
      message: "Successfully, Get User Stats",
      result: true,
      data: allList,
    });
  } catch (error) {
    return res.send({
      message: error.message,
      result: false,
      data: [],
    });
  }
};

module.exports = {
  getById,
  getAll,
};
