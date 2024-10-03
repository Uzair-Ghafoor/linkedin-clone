import { sendCommentNotificationEmail } from '../emails/emailHandlers.js';
import cloudinary from '../lib/cloudinary.js';
import Notification from '../models/notifications.model.js';
import Post from '../models/post.model.js';

export const getFeedPost = async (req, res) => {
  try {
    const posts = await Post.find({
      author: {
        $in: req.user.connections,
      },
    })
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    let newPost;
    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newPost = await Post.create({
        author: req.user._id,
        content,
        image: imgResult.secure_url,
      });
    } else {
      newPost = await Post.create({
        author: req.user._id,
        content,
      });
    }
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'you are not authorized to delete this post',
      });
    }
    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split('/').pop().split('.')[0]
      );
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const post = await Post.findById(postId);
    const newComment = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
    ).populate('author', 'name email username profilePicture headline');
    if (!newComment) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: 'comment',
        relatedUser: req.user._id,
        relatedPost: id,
      });
      await newNotification.save();
      try {
        const postUrl = `http://localhost:5173/post/${postId}`;
        await sendCommentNotificationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          postUrl,
          content
        );
      } catch (error) {
        console.log('Error sending email:', error);
      }
    }

    res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: req.user._id },
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: req.user._id },
      });
      if (post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          type: 'like',
          relatedUser: req.user._id,
          relatedPost: postId,
        });
        await newNotification.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
