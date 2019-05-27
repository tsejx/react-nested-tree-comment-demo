import React from 'react';
import './Comment.css';
import Vote from './Vote.js';
import Reply from './Reply.js'
import moment from 'moment'

function Comment(props) {
  const { commentId, isVoted, isCollapsed, author, content, datetime, children, depth, onVote, onReply, ...otherProps } = props;

  const cls = 'comment';

  const headingDom = (
    <div className={`${cls}-heading`}>
      <Vote isVoted={isVoted} style={{ marginTop: '-4px' }} onChange={() => onVote(commentId)} />
      <span className={`${cls}-author`}>{author}</span>
      <span className={`${cls}-datetime`}>on {moment(datetime).format('ll')}</span>
      {isVoted ? (
        <>
          <span>|</span>
          <span className={`${cls}-unvote`} onClick={() => onVote(commentId)}>unvote</span>
        </>
      ) : null}
      {isCollapsed ? (
        <span className={`${cls}-expand`}>[+]</span>
      ) : (
        <span className={`${cls}-collapsed`}>[-]</span>
      )}
    </div>
  );

  const contentDom = <div className={`${cls}-content`}>{content}</div>;

  return (
    <div className={`${cls}`} >
        <div className={`${cls}-inner`} style={depth > 1 ? { marginLeft: `${(depth-1)*42}px` } : {}}>
            {headingDom}
            {contentDom}
            <Reply onSubmit={(content) => onReply(commentId, content)} />
        </div>
    </div>
  )
}

export default Comment;
