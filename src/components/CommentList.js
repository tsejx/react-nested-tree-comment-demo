import React from 'react';
import Editor from './Editor.js';
import Comment from './Comment.js';
import createHash from '../utils/createHash.js';
import './CommentList.css';

export default class CommentList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentList: {},
    };
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.updateCommentField = this.updateCommentField.bind(this);
    this.handleCommentReply = this.handleCommentReply.bind(this);
  }

  componentDidMount() {
    this.refreshDataList();
  }

  refreshDataList() {
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
  }

  updateDataList(newData) {
    const { commentList } = this.state;
    const updateData = Object.assign({}, commentList, newData);
    localStorage.setItem('list', JSON.stringify(updateData));
    this.refreshDataList();
  }

  handleCommentSubmit(value) {
    const { finalId, total, comments } = this.state.commentList;
    const id = 't1_' + createHash();
    const finalComment = comments[finalId];
    finalComment.nextId = id;

    comments[id] = {
      id: id,
      author: 'Admin',
      createdTime: new Date().getTime(),
      vote: false,
      content: value,
      parentId: null,
      lastChildId: null,
      depth: 1,
      prevId: finalComment.id,
      nextId: null,
      collapsed: false,
    };

    const newData = {
      total: total + 1,
      finalId: id,
      comments: comments,
    };

    this.updateDataList(newData);
  }

  updateCommentField(id, field, updateValue) {
    const { comments } = this.state.commentList;
    comments[id][field] = updateValue;
    const newData = comments;
    this.updateDataList(newData);
  }

  handleCommentReply(parentId, content) {
    let newData = {};
    let isFinalComment = null;
    const { finalId, total, comments } = this.state.commentList;
    // 回复的评论
    const parentComment = comments[parentId];
    // 回复的评论的最后子评论
    const lastChilComment = parentComment.lastChildId ? comments[parentComment.lastChildId] : null;
    // 新建评论 id
    const commentId = 't1_' + createHash();
    const currentComment = {
      id: commentId,
      author: 'Admin',
      createdTime: new Date().getTime(),
      vote: false,
      content: content,
      parentId: parentId,
      depth: parentComment.depth + 1,
    };

    // 有子节点 - 最后子节点下个节点不为空
    // 有子节点 - 最后子节点下个节点为新增评论是最后评论
    // 有子节点 - 最后子节点下个节点为空
    // 无子节点 - 新增评论非最后评论
    // 无子节点 - 新增评论是最后评论

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
            // 若下个节点为空，则置空
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
        } else {
          while (depth > expectDepth) {
            lastComment = comments[nextId];
            // 若下个节点为空，则置空
            nextId = lastComment.nextId;
            depth = lastComment.depth;
          }

          // 是最后评论
          isFinalComment = true;
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
        }
      } else {
        // 最后子节点的下个节点为空
        isFinalComment = true;
        const prevComment = lastChilComment;
        // 父节点
        parentComment.lastChildId = currentComment.id;
        // 上个节点
        prevComment.nextId = currentComment.id;
        // 新建节点
        currentComment.prevId = prevComment.id;
        currentComment.nextId = null;
      }
    } else {
      // 无子节点
      if (parentComment.nextId && parentComment.id !== finalId) {
        // 不是最后评论
        const nextComment = parentComment.nextId ? comments[parentComment.nextId] : null;
        // 上条评论指向（也就是父节点）
        parentComment.nextId = currentComment.id;
        parentComment.lastChildId = currentComment.id;
        // 下条评论指向
        nextComment.prevId = currentComment.id;
        // 新建评论双向指向
        currentComment.prevId = parentComment.id;
        currentComment.nextId = nextComment.id;
      } else {
        // 是最后评论
        isFinalComment = true;
        // 父节点指向新建评论
        parentComment.nextId = commentId;
        parentComment.lastChildId = currentComment.id;
        // 新建评论双向指向
        currentComment.prevId = parentComment.id;
        currentComment.nextId = null;
      }
    }

    // 当前评论存入评论列表
    comments[currentComment.id] = currentComment;
    newData.total = total + 1;
    newData.comments = comments;
    newData.finalId = isFinalComment ? currentComment.id : finalId;
    this.updateDataList(newData);
  }

  renderCommentList() {
    const { initialId, finalId, total, comments } = this.state.commentList;

    let renderData = [];
    let current = null;
    let nextId = null;
    let collapsedDepth = null;

    for (let i = 0; i < total; i++) {
      current = i > 0 ? comments[nextId] : comments[initialId];

      if (!collapsedDepth && current.collapsed) {
        collapsedDepth = current.depth;
      }

      // 当前评论数据
      const component = (
        <Comment
          key={current.id}
          commentId={current.id}
          author={current.author}
          content={<p>{current.content}</p>}
          isVoted={current.vote}
          isCollapsed={current.collapsed}
          isNoshow={collapsedDepth && current.depth > collapsedDepth}
          datetime={current.createdTime}
          depth={current.depth}
          onUpdate={this.updateCommentField} // 点赞
          onReply={this.handleCommentReply} // 回复
        />
      );

      renderData.push(component);

      if (collapsedDepth && current.nextId && comments[current.nextId].depth <= collapsedDepth) {
        collapsedDepth = null;
      }
      if (current.id === finalId) break;
      nextId = current.nextId;
    }
    return renderData;
  }
  render() {
    return (
      <>
        <Editor onSubmit={this.handleCommentSubmit} />
        <div className="comment-list">{this.renderCommentList()}</div>
      </>
    );
  }
}
