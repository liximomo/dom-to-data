import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Pickiee from './components/Pickiee';
import ClickToInput from './components/ClickToInput';

const TextTruncated = styled.div`
  overflow: hidden;
  white-space: nowrap;
`;

const BigName = TextTruncated.extend`
  font-size: 1.2em;
  line-height: 2.5em;
`;

const Name = TextTruncated.extend`
  font-size: 1em;
  margin-top: 0.3em;
`;

const SmallName = TextTruncated.extend`
  font-size: 0.8em;
  color: #777;
`;

class AttributeCell extends PureComponent {
  state = {
    edit: false,
    alias: '',
  };

  constructor(props) {
    super(props);

    this._enterEdit = this._enterEdit.bind(this);
    this._onEditChange = this._onEditChange.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  _handleInput(event) {
    this.props.onAlias({
      id: this.props.id,
      alias: event.target.value,
    });
  }

  _onEditChange(edit) {
    this.setState({
      edit,
    });
  }

  _enterEdit() {
    if (this.state.edit) {
      return;
    }

    this.setState({
      edit: true,
    });
  }

  _renderSingleName() {
    return <BigName onDoubleClick={this._enterEdit}>{this.props.name}</BigName>;
  }

  _renderFullView() {
    const { edit } = this.state;
    const { name, alias } = this.props;
    return (
      <React.Fragment>
        <Name>
          <ClickToInput
            edit={edit}
            autoFocus
            placeholder="别名"
            value={alias}
            onChange={this._handleInput}
            onEditChange={this._onEditChange}
          />
        </Name>
        <SmallName>{name}</SmallName>
      </React.Fragment>
    );
  }

  _handleClick() {
    this.props.onClick(this.props.id);
  }

  render() {
    const { edit } = this.state;
    const { active, alias } = this.props;

    return (
      <Pickiee active={active} onClick={this._handleClick}>
        {edit || alias.length ? this._renderFullView() : this._renderSingleName()}
      </Pickiee>
    );
  }
}

export default AttributeCell;
