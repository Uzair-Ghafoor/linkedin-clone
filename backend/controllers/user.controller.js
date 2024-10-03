import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';
export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select('connections'); // this will return an object with _id and connections parameters.

    // find the users who are not already connected, and also do not recommend out own profile
    const suggestedUsers = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currentUser.connections,
      },
    })
      .select('name username profilePicture headline')
      .limit(5);
    res.json(suggestedUsers);
  } catch (error) {
    console.log('error in the suggested Controller', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      '-password'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      profilePicture,
      headline,
      about,
      bannerImg,
      skills,
      experience,
      education,
    } = req.body;
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    //todo: check for the profile img and banner img cloudinary.
    if (req.body.profilePicture) {
      req.body.profilePicture = (
        await cloudinary.uploader.upload(req.body.profilePicture)
      ).secure_url;
    }
    if (req.body.bannerImg) {
      req.body.profilePicture = (
        await cloudinary.uploader.upload(req.body.bannerImg)
      ).secure_url;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name,
          username,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
          headline,
          about,
          bannerImg: req.body.bannerImg,
          skills,
          experience,
          education,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
  }
};
