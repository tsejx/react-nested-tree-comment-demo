import React, { PureComponent } from 'react';
import './Heading.css';
import Vote from './Vote.js'

export default class Heading extends PureComponent {

  render() {

    const { data, onVote } = this.props

    const cls = 'heading';

    return (
      <div className={`${cls}`}>
        <div className={`${cls}-header`}>

          <Vote isVoted={data.isVoted} style={{display: 'inline-block'}} onChange={onVote} />

          <div className={`${cls}-header-title`}>{data.header}</div>
          <div className={`${cls}-header-sitestr`}>
            (<a href={data.url}>{data.domain}</a>)
          </div>
        </div>
        <div className={`${cls}-sub-header`}>
          <div>
            {data.points} points by <a href="#">{data.author}</a>{' '}
            <a href="#" style={{ marginRight: 6 }}>on {data.createdTime}</a>
          </div>
          {' | '}
          {data.isVoted ? (
            <>
              <a href="#" style={{ margin: '0 6px' }} onClick={onVote}>unvote</a>
              {' | '}
            </>
          ) : null}
          <a href="#" style={{ margin: '0 6px' }}>hide</a>
          {' | '}
          <a href="#" style={{ margin: '0 6px' }}>past</a>
          {' | '}
          <a href="#" style={{ margin: '0 6px' }}>web</a>
          {' | '}
          <a href="#" style={{ margin: '0 6px' }}>favorite</a>
          {' | '}
          <a href="#" style={{ margin: '0 6px' }}>{data.comments} comments</a>
        </div>
      </div>
    );
  }
}
