import ConnectionRequest from '../models/connectionRequest.mode.js';
import Notification from '../models/notifications.model.js';

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;
    // check if you are not sending request to yourseld
    if (senderId.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: 'You can not send request to yourself.' });
    }
    // check if the user is already connected to you
    if (req.user.connections.includes(userId)) {
      return res.status(400).json({ message: 'You are already connected.' });
    }
    // check if a request is already in progress
    const pendingRequest = await ConnectionRequest.find({
      sender: senderId,
      recepient: userId,
      status: 'pending',
    });
    if (pendingRequest) {
      return res.status(400).json({
        message: 'A connection request has already been sent.',
      });
    }
    // make a new connection request
    const newRequest = new ConnectionRequest({
      sender: senderId,
      recepient: userId,
    });
    await newRequest.save();
    res
      .status(201)
      .json({ message: 'Connection request has been sent successfully.' });
  } catch (error) {
    console.log(error);
  }
};
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await ConnectionRequest.findById(requestId)
      .populate('sender', ' name email username')
      .populate('recepient', ' name username');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    //check if the recepient's _id is same as the currently logged in user who got the connection request to accept
    if (request.recepient._id.toString() !== userId.toString()) {
      return res
        .status(404)
        .json({ error: 'Not authorized to accept this request.' });
    }
    if (request.status !== 'pending') {
      return res
        .status(200)
        .json({ message: 'Request has aleady been accepted.' });
    }
    await request.save();

    await ConnectionRequest.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });
    await ConnectionRequest.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });

    const notification = new Notification({
      recipient: request.sender._id,
      type: 'connectionAccepted',
      relatedUser: userId,
    });
    await notification.save();
    res.json({ message: 'Connection accepted successfully.' });
  } catch (error) {
    console.log(error);
  }
};

export const declineConnectionRequest = async (req, res) => {};

export const getUsersConnections = async (req, res) => {};

export const getConnectionRequests = async (req, res) => {};

export const removeConnection = async (req, res) => {};

export const getConnectionStatus = async (req, res) => {};
