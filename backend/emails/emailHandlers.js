import { client, sender } from '../lib/mailtrap.js';
import { createWelcomeEmailTemplate } from './emailTemplates.js';
createWelcomeEmailTemplate;
export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recepient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recepient,
      subject: 'Welcome to Linked',
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: 'welcome',
    });
    console.log('email sent successfully.');
  } catch (error) {
    throw error;
  }
};

export const sendCommentNotificationEmail = async (
  recepientEmail,
  recepientName,
  commenterName,
  postUrl,
  commentContent
) => {
  const recepient = [{ email: recepientEmail }];
  try {
    const response = await client.send({
      from: sender,
      to: recepient,
      subject: 'Comment Notification',
      html: createCommentNotificationEmailTemplate(
        recepientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: 'comment',
    });
    console.log('email sent successfully.');
  } catch (error) {
    throw error;
  }
};
