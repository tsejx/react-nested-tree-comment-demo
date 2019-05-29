import React, { PureComponent } from 'react';
import './Heading.css';
import Vote from './Vote.js';

export default class Heading extends PureComponent {
  state = {
    newsDetail: {},
  };

  componentDidMount() {
    this.refreshDataInfo();
  }

  refreshDataInfo = () => {
    if (localStorage.getItem('info')) {
      this.setState({ newsDetail: JSON.parse(localStorage.getItem('info')) });
    } else {
      window
        .fetch('./info.json')
        .then(res => res.json())
        .then(data => {
          localStorage.setItem('info', JSON.stringify(data));
          this.setState({ newsDetail: data });
        })
        .catch(err => console.warn(err));
    }
  };

  handleDetailVote = () => {
    const { newsDetail } = this.state;

    const newData = Object.assign({}, newsDetail, { isVoted: !newsDetail.isVoted });

    this.setState({ newsDetail: { ...newsDetail, isVoted: !newsDetail.isVoted } });

    localStorage.setItem('info', JSON.stringify(newData));
  };

  render() {
    const { newsDetail } = this.state;

    const { handleDetailVote } = this;

    const cls = 'heading';

    return (
      <div className={`${cls}`}>
        <div className={`${cls}-header`}>
          <Vote
            isVoted={newsDetail.isVoted}
            style={{ display: 'inline-block' }}
            onChange={handleDetailVote}
          />

          <div className={`${cls}-header-title`}>{newsDetail.header}</div>
          <div className={`${cls}-header-sitestr`}>
            (<a href={newsDetail.url}>{newsDetail.domain}</a>)
          </div>
        </div>
        <div className={`${cls}-sub-header`}>
          <div>
            {newsDetail.points} points by <a href="#user">{newsDetail.author}</a>{' '}
            <a href="#time" style={{ marginRight: 6 }}>
              on {newsDetail.createdTime}
            </a>
          </div>
          {' | '}
          {newsDetail.isVoted ? (
            <>
              <a href="#unvote" style={{ margin: '0 6px' }} onClick={handleDetailVote}>
                unvote
              </a>
              {' | '}
            </>
          ) : null}
          <a href="#hide" style={{ margin: '0 6px' }}>
            hide
          </a>
          {' | '}
          <a href="#past" style={{ margin: '0 6px' }}>
            past
          </a>
          {' | '}
          <a href="#web" style={{ margin: '0 6px' }}>
            web
          </a>
          {' | '}
          <a href="#favorite" style={{ margin: '0 6px' }}>
            favorite
          </a>
          {' | '}
          <a href="#comments" style={{ margin: '0 6px' }}>
            {newsDetail.comments} comments
          </a>
        </div>
      </div>
    );
  }
}
