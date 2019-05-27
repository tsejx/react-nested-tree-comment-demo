import React from 'react';
import './Vote.css';

export default function Vote(props) {
  const { style, isVoted, onChange } = props;

  return (
    <>
      {isVoted ? (
        <div className="vote-empty" />
      ) : (
        <div style={style ? style : {}} className="vote-icon" onClick={onChange}>
          <span />
        </div>
      )}
    </>
  );
}
