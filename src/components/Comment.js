import React from 'react';
import './Comment.css';
import Vote from './Vote.js';
import Reply from './Reply.js';
import moment from 'moment';
import classnames from 'classnames'

function Comment(props) {
  const {
    commentId,
    isVoted,
    isCollapsed,
    isNoshow,
    author,
    content,
    datetime,
    children,
    depth,
    onVote,
    onReply,
    onCallapse,
    ...otherProps
  } = props;

  const cls = 'comment';

  if (isCollapsed) {
    console.log(commentId, isCollapsed);
  }

  const headingDom = (
    <div className={`${cls}-heading`}>
      <Vote
        isVoted={isVoted || isCollapsed}
        style={{ marginTop: '-4px' }}
        onChange={() => onVote(commentId)}
      />
      <span className={`${cls}-author`}>{author}</span>
      <span className={`${cls}-datetime`}>on {moment(datetime).format('ll')}</span>
      {isVoted ? (
        <>
          <span>|</span>
          <span className={`${cls}-unvote`} onClick={() => onVote(commentId)}>
            unvote
          </span>
        </>
      ) : null}
      {isCollapsed ? (
        <span className={`${cls}-expand`} onClick={() => onCallapse(commentId)}>
          [+]
        </span>
      ) : (
        <span className={`${cls}-collapsed`} onClick={() => onCallapse(commentId)}>
          [-]
        </span>
      )}
    </div>
  );

  const contentDom = <div className={`${cls}-content`}>{content}</div>;

  const wrapperCls = isNoshow ? classnames(`${cls}-noshow`, `${cls}`) : classnames(`${cls}`);

  return (
    <div className={wrapperCls}>
      <div
        className={`${cls}-inner`}
        style={depth > 1 ? { marginLeft: `${(depth - 1) * 42}px` } : {}}
      >
        {headingDom}
        {!isCollapsed ? (
          <>
            {contentDom}
            <Reply onSubmit={content => onReply(commentId, content)} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Comment;
