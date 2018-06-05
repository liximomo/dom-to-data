import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Block from './components/Block';

const Preview = styled.textarea.attrs({
  readOnly: true,
})`
  display: block;
  resize: none;
  width: 100%;
  min-height: 5em;
  max-height: 50vh;
  overflow-y: scroll;
  border: 1px solid #ddd;
  border-radius: 0.2em;
  resize: vertical;

  &:focus {
    outline: none;
    border: 1px solid ${props => props.theme.color.primary};
  }
`;

class Result extends PureComponent {
  constructor(props) {
    super(props);
    this._handleRefUpdate = this._handleRefUpdate.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  _onClick() {
    this._textareaRef.select();
    document.execCommand('copy');
  }

  _handleRefUpdate(ref) {
    this._textareaRef = ref;
  }

  render() {
    return (
      <Block title="结果">
        <Preview
          innerRef={this._handleRefUpdate}
          value={this.props.children}
          onClick={this._onClick}
        />
      </Block>
    );
  }
}

export default Result;
