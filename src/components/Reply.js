import React from 'react';
import './Reply.css';

export default class Reply extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isEditing: false,
    };
    this.toggleEditState = this.toggleEditState.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleEditState() {
    this.setState({ isEditing: !this.state.isEditing });
  }

  onInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  handleSubmit() {
    const { inputValue } = this.state;
    if (!inputValue || !inputValue.trim()) {
      alert('请输入评论内容');
      return;
    }
    this.props.onSubmit(inputValue);
    this.setState({ isEditing: false, inputValue: '' });
  }

  render() {
    const cls = 'reply';
    const { inputValue, isEditing } = this.state;

    return (
      <div className={`${cls}`}>
        {!isEditing ? (
          <span className={`${cls}-btn`} onClick={this.toggleEditState}>
            Reply
          </span>
        ) : (
          <>
            <textarea
              value={inputValue}
              className={`${cls}-textarea`}
              onChange={this.onInputChange}
            />
            <div>
              <span className={`${cls}-submit`} onClick={this.handleSubmit}>
                Submit
              </span>
              <span className={`${cls}-cancel`} onClick={this.toggleEditState}>
                Cancel
              </span>
            </div>
          </>
        )}
      </div>
    );
  }
}
