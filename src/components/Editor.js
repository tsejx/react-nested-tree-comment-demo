import React, { Component } from 'react';
import './Editor.css';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  onSubmit = () => {
    const { value } = this.state;
    if (!value || !value.trim()) {
      alert('请输入评论内容');
      return;
    }

    this.props.onSubmit(value)

    this.setState({ value: '' })
  };

  render() {
    return (
      <div className="editor">
        <textarea value={this.state.value} className="editor-textarea" onChange={this.onChange} />
        <button className="editor-submit" onClick={this.onSubmit}>
          Add comment
        </button>
      </div>
    );
  }
}
