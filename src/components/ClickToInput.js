import React, { Component } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  background-color: #fff;
  color: inherit;
  font-size: 0.8em;
  border: 0;
  width: ${props => (props.width ? props.width : '4em')};
  &:focus {
    outline: none;
  }
`;

class ClickToInput extends Component {
  state = {
    edit: false,
  };

  static defaultProps = {
    autoFocus: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      edit: props.defaulEdit !== undefined ? props.defaulEdit : false,
    };

    this._handleInputBlur = this._handleInputBlur.bind(this);
    this._handleEnterEdit = this._handleEnterEdit.bind(this);
    this._handleRefUpdate = this._handleRefUpdate.bind(this);
  }

  _getEdit() {
    return this.props.edit !== undefined ? this.props.edit : this.state.edit;
  }

  _handleRefUpdate(ref) {
    this._inputRef = ref;
  }

  _handleEnterEdit(event) {
    event.stopPropagation();

    if (this.props.edit !== undefined) {
      this.props.onEditChange(true);
    } else {
      this.setState({
        edit: true,
      });
    }
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick();
    }
  }

  _handleInputBlur() {
    if (this.props.edit !== undefined) {
      this.props.onEditChange(false);
    } else {
      this.setState({
        edit: false,
      });
    }
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  _renderInput() {
    const { onDoubleClick, onBlur, value, ...rest } = this.props;

    return (
      <Input
        innerRef={this._handleRefUpdate}
        {...rest}
        value={value}
        onBlur={this._handleInputBlur}
      />
    );
  }

  _renderText() {
    const { value } = this.props;

    return (
      <React.Fragment>
        <svg fill="#000" viewBox="0 0 24 24" height={12} width={12} onClick={this._handleEnterEdit}>
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
        <span style={{ marginLeft: 2 }}>{value}</span>
      </React.Fragment>
    );
  }

  componentWillUpdate() {
    this._prevEdit = this._getEdit();
  }

  componentDidUpdate() {
    const edit = this._getEdit();
    if (edit && !this._prevEdit) {
      this._inputRef.select();
    }
  }

  render() {
    const edit = this._getEdit();
    // eslint-disable-next-line no-unused-vars
    const { onBlur, value, ...rest } = this.props;

    return (
      <div style={{ display: 'inline' }}>{edit ? this._renderInput() : this._renderText()}</div>
    );
  }
}

export default ClickToInput;
