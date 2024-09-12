const cron = require('node-cron');
const { postSchema } = require("../utils/schema");
const { postCluster } = require("../models");

const create = async (req, res) => {
  try {
    let body = await postSchema.validate(req.body);
    let data = await postCluster.create(body);
    return res.send({
      message: "Successfully, Create Post",
      result: true,
      data: data,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};


// Function to create an empty post
const createPost = async (postData) => {
  try {
    let data = await postCluster.create(postData);
    console.log('Successfully created post:', data);
    return data;
  } catch (error) {
    console.error('Error creating post:', error.message);
    throw error;
  }
};

// Function to process users and create posts
const processUsers = async () => {
  try {
    console.log('Running cron job to check and create daily posts...');

    // Get unique user IDs
    const userIds = await postCluster.distinct('userId'); 

    for (const userId of userIds) {
      // Get today's date and set the start and end of the day
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1); // End of day is the start of the next day

      // Find if there's already a post for today
      const existingPost = await postCluster.findOne({
        userId: userId,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });

      // If no post exists, create a new one
      if (!existingPost) {
        await createPost({
          userId: userId,
          mood: null,
          activities: [],
          feelings: [],
          goalAchieve: false,
          note: null,
          dayDescription: "NA",
          tomorrowDescription: "NA"
        });
        console.log(`Created empty post for user ${userId}`);
      } else {
        console.log(`Post already exists for user ${userId} today.`);
      }
    }
  } catch (error) {
    console.error('Error in processing users:', error);
  }
};

// Schedule a cron job to run at 11:55 PM every day
cron.schedule('55 23 * * *', () => {
  processUsers();
});


const getAll = async (req, res) => {
  try {
    let data = await postCluster
      .find()
      .populate("userId")
      .populate("mood")
      .populate("activities")
      .populate("feelings")
      .populate("note");
    if (data.length === 0) {
      return res.send({
        message: "Not Found",
        result: false,
        data: [],
      });
    }

    return res.send({
      message: "Successfully Found",
      result: true,
      data: data,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: [],
    });
  }
};

const getByUserId = async (req, res) => {
  try {
    let id = req.params.id;
    const today = new Date();
    const startDate = new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000)); // 6 days ago
    let data = await postCluster
      .find({
        userId: id,
        createdAt: {
          $gte: startDate,
          $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        }
      })
      .populate("userId")
      .populate("mood")
      .populate("activities")
      .populate("feelings")
      .populate("note");

    if (data.length === 0) {
      return res.send({
        message: "Not Found",
        result: false,
        data: [],
      });
    }

    return res.send({
      message: "Successfully Found",
      result: true,
      data: data,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: [],
    });
  }
};

const getById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await postCluster
      .findOne({ _id: id })
      .populate("userId")
      .populate("mood")
      .populate("activities")
      .populate("feelings")
      .populate("note");
    if (data == null) {
      return res.send({
        message: "Not Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully Found",
      result: true,
      data: data,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const deleteById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await postCluster.findByIdAndDelete(id);
    if (data == null) {
      return res.send({
        message: "Not Found",
        result: false,
        data: {},
      });
    }

    return res.send({
      message: "Successfully Delete",
      result: true,
      data: data,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
      data: {},
    });
  }
};

const updateUserPostsForLastWeek = async () => {
  try {
    const users = await postCluster.distinct('userId'); // Get unique user IDs
    const today = new Date();

    // Loop through each user
    for (const userId of users) {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 7); // Start date is 7 days ago

      // Check for existing posts in the last 7 days
      const existingPosts = await postCluster.find({
        userId: userId,
        createdAt: {
          $gte: startDate,
          $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // Up to the end of today
        }
      });

      // If no posts exist for the last 7 days, create an empty post for each missing day
      for (let d = 0; d < 7; d++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(startDate.getDate() + d);
        
        const postExists = existingPosts.some(post => {
          const postDate = new Date(post.createdAt);
          return postDate.toDateString() === checkDate.toDateString();
        });

        if (!postExists) {
          await createPost({
            userId: userId,
            mood: null,
            activities: [],
            feelings: [],
            goalAchieve: false,
            note: null,
            dayDescription: "NA",
            tomorrowDescription: "NA"
          });
          console.log(`Created empty post for user ${userId} on ${checkDate.toDateString()}`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating user posts:', error.message);
  }
};

module.exports = {
  create,
  getAll,
  getByUserId,
  getById,
  deleteById,
};
