import React, { PureComponent } from 'react';
import './Editor.css';

export default class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  onSubmit() {
    const { value } = this.state;
    if (!value || !value.trim()) {
      alert('请输入评论内容');
      return;
    }
    this.props.onSubmit(value);
    this.setState({ value: '' });
  }

  render() {
    return (
      <div className="editor">
        <textarea value={this.state.value} className="editor-textarea" onChange={this.onChange} />
        <button type="button" className="editor-submit" onClick={this.onSubmit}>
          Add comment
        </button>
      </div>
    );
  }
}
