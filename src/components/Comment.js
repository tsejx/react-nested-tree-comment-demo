import React from 'react';
import './Comment.css';
import Vote from './Vote.js';
import Reply from './Reply.js';
import moment from 'moment';
import classnames from 'classnames';

function Comment(props) {
  const {
    commentId,
    isVoted,
    isCollapsed,
    isNoshow,
    author,
    content,
    datetime,
    depth,
    onReply,
    onUpdate,
  } = props;

  const cls = 'comment';
  const wrapperCls = isNoshow ? classnames(`${cls}-noshow`, `${cls}`) : classnames(`${cls}`);

  return (
    <div className={wrapperCls}>
      <div
        className={`${cls}-inner`}
        style={depth > 1 ? { marginLeft: `${(depth - 1) * 42}px` } : {}}
      >
        <div className={`${cls}-heading`}>
          <Vote
            isVoted={isVoted || isCollapsed}
            style={{ marginTop: '-4px' }}
            onChange={() => onUpdate(commentId, 'vote', true)}
          />
          <span className={`${cls}-author`}>{author}</span>
          <span className={`${cls}-datetime`}>on {moment(datetime).format('ll')}</span>
          {isVoted ? (
            <>
              <span>|</span>
              <span className={`${cls}-unvote`} onClick={() => onUpdate(commentId, 'vote', false)}>
                unvote
              </span>
            </>
          ) : null}
          {isCollapsed ? (
            <span
              className={`${cls}-expand`}
              onClick={() => onUpdate(commentId, 'collapsed', false)}
            >
              [+]
            </span>
          ) : (
            <span
              className={`${cls}-collapsed`}
              onClick={() => onUpdate(commentId, 'collapsed', true)}
            >
              [-]
            </span>
          )}
        </div>
        {!isCollapsed ? (
          <>
            <div className={`${cls}-content`}>{content}</div>
            <Reply onSubmit={content => onReply(commentId, content)} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Comment;
