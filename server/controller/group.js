const { groupModel } = require("../model/groupSch");
const { userModel } = require("../model/userSch");
const axios = require("axios");

const createGroup = async (req, res) => {
  try {
    const { GroupName, GroupDescription , TargetFunds } = req.body;
    const Image = req.file ? req.file.filename : null;


    const newGroup = new groupModel({
      GroupName,
      GroupDescription,
      TargetFunds,
      Image,
      Members: 0, // Initialize Members field to 0
    });

    await newGroup.save();

    return res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getGroup = async (req, res) => {
  try {
    const groups = await groupModel.find({}, "GroupName GroupDescription TargetFunds Image createdAt Members");

    return res.status(200).json({ groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.userId;

    const user = await userModel.findById(userId);

    if (user.JoinedGroups.includes(groupId)) {
      return res.status(400).json({ message: "User has already joined this group" });
    }

    await groupModel.findByIdAndUpdate(groupId, { $push: { userIds: userId } });
    await userModel.findByIdAndUpdate(userId, { $push: { JoinedGroups: groupId } });

    res.status(200).json({ message: "User joined the group successfully" });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const incrementMembers = async (req, res) => {
  try {
    const { groupId } = req.body;

    await groupModel.findByIdAndUpdate(groupId, { $inc: { Members: 1 } });
    const updatedGroup = await groupModel.findById(groupId, "Members");

    res.status(200).json({ message: "Members incremented successfully", members: updatedGroup.Members });
  } catch (error) {
    console.error("Error incrementing members:", error);
    res.status(500).json({ error: "Server error" });
  }
};



const getTopGroups = async (req, res) => {
  try {
    // Use Mongoose to fetch the top groups based on the Members field in descending order
    const topGroups = await groupModel
      .find()
      .sort({ Members: -1 })
      .limit(5) // You can adjust the limit as needed
      .exec();

    res.status(200).json({ topGroups });
  } catch (error) {
    console.error("Error fetching top groups:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateJoinStatus = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { isJoined } = req.body;

    const updatedGroup = await groupModel.findByIdAndUpdate(
      groupId,
      { isJoined },
      { new: true }
    );

    if (updatedGroup) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Group not found" });
    }
  } catch (error) {
    console.error("Error updating join status:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};



module.exports = {
  createGroup,
  getGroup,
  joinGroup,
  incrementMembers,
  getTopGroups,
  updateJoinStatus,
};