import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from './components/Button';
import Block from './components/Block';

const InputWrapper = styled.div`
  background-color: #f7f7f7;
  & + & {
    border-top: 1px solid #ddd;
  }
`;

const Input = styled.input`
  font-size: 1em;
  padding: 0.2em 0.4em;
  display: block;
  width: 100%;
  border: 0;
  background-color: transparent;
`;

class SelectorCompositor extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    values: [],
  };

  static contextTypes = {
    enterPickerMode: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._handleAdd = this._handleAdd.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleClear = this._handleClear.bind(this);
  }

  _handleClear() {
    const { onChange } = this.props;
    onChange(['']);
  }

  _handleAdd() {
    const { values, onChange } = this.props;
    if (values[values.length - 1] !== '') {
      onChange(values.concat(''));
    }
  }

  _handleValueChange(index, value) {
    const { values, onChange } = this.props;

    const copy = values.slice();
    copy.splice(index, 1, value);
    onChange(copy);
  }

  _handleBlur() {
    const { values, onChange } = this.props;
    if (values.length > 1) {
      onChange(values.filter(val => val !== ''));
    }
  }

  _valueList() {
    const { values } = this.props;
    const valueLength = values.length;

    if (valueLength <= 0) return null;

    const inputs = values.map((value, index) => (
      <InputWrapper level={index} key={index}>
        <Input
          autoFocus={index === valueLength - 1}
          value={value}
          onChange={event => this._handleValueChange(index, event.target.value)}
          onBlur={this._handleBlur}
        />
      </InputWrapper>
    ));

    return <div>{inputs}</div>;
  }

  _actions() {
    return (
      <div>
        <Button style={{ marginLeft: 0 }} primary onClick={this.context.enterPickerMode}>吸取</Button>
        <Button primary onClick={this._handleAdd}>
          添加
        </Button>
        <Button onClick={this._handleClear}>
          清除
        </Button>
      </div>
    );
  }

  render() {
    return (
      <Block title="选择器">
        {this._valueList()}
        {this._actions()}
      </Block>
    );
  }
}

export default SelectorCompositor;
