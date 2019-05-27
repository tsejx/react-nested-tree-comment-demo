import React from 'react';
import './App.css';
import Navigation from './components/Navigation.js';
import Heading from './components/Heading.js';
import Editor from './components/Editor.js';
import Comment from './components/Comment.js';
import createHash from './utils/createHash.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsDetail: {},
      commentList: {},
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.refreshDataInfo();
    this.refreshDataList();
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

  refreshDataList = () => {
    if (localStorage.getItem('list')) {
      this.setState({ commentList: JSON.parse(localStorage.getItem('list')) });
    } else {
      window
        .fetch('./data.json')
        .then(res => res.json())
        .then(data => {
          localStorage.setItem('list', JSON.stringify(data));
          this.setState({ commentList: data });
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

  handleCommentSubmit = value => {
    const { commentList } = this.state;

    const { finalId, total, comments } = commentList;

    const id = 't1_' + createHash();

    const finalComment = comments[finalId];

    finalComment.nextId = id;

    const addComment = {
      id: id,
      author: 'bcherny',
      createdTime: new Date().getTime(),
      vote: false,
      content: value,
      parentId: null,
      lastChildId: null,
      depth: 1,
      prevId: finalComment.id,
      nextId: null,
    };

    const newComments = Object.assign({}, comments, {
      // 原来最后的评论
      [finalId]: comments[finalId],
      // 新增评论
      [id]: addComment,
    });

    const newData = Object.assign(
      {},
      { ...commentList },
      {
        total: total + 1,
        finalId: id,
        comments: newComments,
      }
    );

    localStorage.setItem('list', JSON.stringify(newData));

    this.refreshDataList();
  };

  handleCommentVote = id => {
    const { commentList } = this.state;

    const { comments } = commentList;

    comments[id].vote = !comments[id].vote;

    const newData = Object.assign({}, commentList, {
      comments,
    });

    localStorage.setItem('list', JSON.stringify(newData));

    this.refreshDataList();
  };

  handleCommentCollapse = () => {};

  handleCommentReply = (parentId, content) => {
    let newData = null;

    const { commentList } = this.state;

    const { finalId, total, comments } = commentList;

    const commentId = 't1_' + createHash();

    const currentComment = {
      id: commentId,
      author: 'bcherny',
      createdTime: new Date().getTime(),
      vote: false,
      content: content,
    };

    const parentComment = comments[parentId];
    const parentLastChildId = parentComment.lastChildId;
    const lastChilComment = parentLastChildId ? comments[parentLastChildId] : null;
    const nextComment = parentComment.nextId ? comments[parentComment.nextId] : null;

    currentComment.parentId = parentComment.id;
    currentComment.depth = parentComment.depth + 1;

    if (lastChilComment) {
      // 有子节点

      let expectDepth = parentComment.depth;
      let nextId = lastChilComment.nextId;

      if (nextId) {
        // 最后子节点下个节点不为空
        let lastComment = comments[nextId];
        let depth = lastComment.depth;

        if (lastComment && lastComment.nextId) {
          while (depth > expectDepth) {
            if (!nextId) break;
            lastComment = comments[nextId];
            // 弱下个节点为空，则置空
            nextId = lastComment.nextId || null;
            depth = lastComment.depth || 0;
          }

          // 不是最后评论
          // 声明上条评论和下条评论
          const prevComment = comments[lastComment.prevId];
          const nextComment = lastComment;
          // 父节点评论指向
          parentComment.lastChildId = currentComment.id;
          // 上条评论指向（也就是父节点）
          prevComment.nextId = currentComment.id;
          // 下条评论指向
          nextComment.prevId = currentComment.id;
          // 新建评论双向指向
          currentComment.prevId = prevComment.id;
          currentComment.nextId = nextComment.id;
          // 当前评论存入评论列表
          comments[currentComment.id] = currentComment;

          newData = Object.assign(
            {},
            { ...commentList },
            {
              total: total + 1,
              comments,
            }
          );
        } else {
          while (depth > expectDepth) {
            lastComment = comments[nextId];
            // 弱下个节点为空，则置空
            nextId = lastComment.nextId;
            depth = lastComment.depth;
          }

          // 是最后评论
          const prevComment = comments[lastComment.prevId];
          const nextComment = lastComment;
          // 父节点
          parentComment.lastChildId = currentComment.id;
          // 上个节点
          prevComment.nextId = currentComment.id;
          // 下个节点
          nextComment.prevId = currentComment.id;
          // 新建节点
          currentComment.prevId = prevComment.id;
          currentComment.nextId = nextComment.id;
          // 当前评论存入评论列表
          comments[currentComment.id] = currentComment;
          newData = Object.assign(
            {},
            { ...commentList },
            {
              total: total + 1,
              // 改变最后评论指向
              finalId: currentComment.id,
              comments,
            }
          );
        }
      } else {
        // 最后子节点的下个节点为空

        const prevComment = lastChilComment;
        // 父节点
        parentComment.lastChildId = currentComment.id;
        // 上个节点
        prevComment.nextId = currentComment.id;
        // 新建节点
        currentComment.prevId = prevComment.id;
        currentComment.nextId = null;
        // 当前评论存入评论列表
        comments[currentComment.id] = currentComment;
        newData = Object.assign(
          {},
          { ...commentList },
          {
            total: total + 1,
            // 改变最后评论指向
            finalId: currentComment.id,
            comments,
          }
        );
      }
    } else {
      // 无子节点

      if (parentComment.nextId && parentComment.id !== finalId) {
        // 不是最后评论
        // 上条评论指向（也就是父节点）
        parentComment.nextId = currentComment.id;
        parentComment.lastChildId = currentComment.id;
        // 下条评论指向
        nextComment.prevId = currentComment.id;
        // 新建评论双向指向
        currentComment.prevId = parentComment.id;
        currentComment.nextId = nextComment.id;
        // 当前评论存入评论列表
        comments[currentComment.id] = currentComment;
        newData = Object.assign(
          {},
          { ...commentList },
          {
            total: total + 1,
            comments,
          }
        );
      } else {
        // 是最后评论

        // 父节点指向新建评论
        parentComment.nextId = commentId;
        parentComment.lastChildId = currentComment.id;
        // 新建评论双向指向
        currentComment.prevId = parentComment.id;
        currentComment.nextId = null;
        // 当前评论存入评论列表
        comments[commentId] = currentComment;

        newData = Object.assign(
          {},
          { ...commentList },
          {
            total: total + 1,
            // 改变最后评论指向
            finalId: currentComment.id,
            comments: comments,
          }
        );
      }
    }

    localStorage.setItem('list', JSON.stringify(newData));

    this.refreshDataList();
  };

  renderCommentList() {
    const {
      commentList: { initialId, finalId, total, comments },
    } = this.state;

    let renderData = [];
    let current = null;
    let prevId = null;
    let prevType = null;
    let nextId = null;
    let nextType = null;

    for (let i = 0; i < total; i++) {
      if (i > 0) {
        current = comments[nextId];
      } else {
        current = comments[initialId];
      }

      // 当前评论数据
      const component = (
        <Comment
          key={current.id}
          commentId={current.id}
          author={current.author}
          content={<p>{current.content}</p>}
          isVoted={current.vote}
          datetime={current.createdTime}
          depth={current.depth}
          // 点赞
          onVote={this.handleCommentVote}
          // 折叠
          onCallapse={() => this.handleCommentCollapse()}
          // 回复
          onReply={this.handleCommentReply}
        />
      );

      renderData.push(component);

      if (current.id === finalId) break;

      prevId = current.id;
      nextId = current.nextId;
    }

    return renderData;
  }

  render() {
    const { newsDetail, commentList } = this.state;

    return (
      <div className="App">
        <div className="container">
          <Navigation />
          <div className="content">
            <Heading data={newsDetail} onVote={this.handleDetailVote} />
            <Editor onSubmit={this.handleCommentSubmit} />
            <div className="comment-list">{this.renderCommentList()}</div>
          </div>
        </div>
      </div>
    );
  }
}
