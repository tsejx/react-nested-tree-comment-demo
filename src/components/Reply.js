import React from 'react';
import './Reply.css';

export default class Reply extends React.PureComponent {
  state = {
    inputValue: '',
    isEditing: false,
  };

  toggleEditState = () => {
    this.setState({ isEditing: !this.state.isEditing });
  };

  onInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleSubmit = () => {
    const { inputValue } = this.state;

    this.props.onSubmit(inputValue);

    this.setState({ isEditing: false, inputValue: '' });
  };

  render() {
    const { inputValue, isEditing } = this.state;

    const cls = 'reply';

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
