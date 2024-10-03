export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .populate('relatedUser', 'name username profilePicture')
      .populate('relatedPost', 'content, image');
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
};
export const readNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      {
        _id: id,
        recipient: req.user._id,
      },
      {
        read: true,
      },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    console.log(error);
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete({
      _id: id,
      recipient: req.user._id,
    });
    res.status(200).json('Notification deleted successfully');
  } catch (error) {
    console.log(error);
  }
};
