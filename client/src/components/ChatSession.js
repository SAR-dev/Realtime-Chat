import React from 'react';
import Proptypes from 'prop-types';
import { format } from 'date-fns';
import TimeAgo from 'react-timeago';

const ChatSession = props => {
  const { messages } = props;
  return messages.map(message => {
    const time = format(new Date(`${message.updatedAt}`), 'HH:mm');

    return (
      <li className="message" key={message.id}>
        <div>
          <span className="user-id">{message.senderId} <TimeAgo date={message.updatedAt} /></span>
          <span className="user-message">{message.text}</span>
        </div>
        <div className="time">
          <span className="message-time">
            {time}
          </span>
        </div>
      </li>
    );
  });
};

ChatSession.propTypes = {
  messages: Proptypes.arrayOf(Proptypes.object).isRequired,
};

export default ChatSession;

