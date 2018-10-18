import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import Block from './components/Block';
import AttributeCell from './AttributeCell';

const CellContaier = styled.div`
  position: relative;
  display: inline-block;
`;

const Checker = styled.input.attrs({
  type: 'checkbox',
})`
  position: absolute;
  right: 0.7em;
  bottom: 1em;
  margin: 0;
`;

class AttributeCompositor extends PureComponent {
  constructor(props) {
    super(props);

    this._onAttrClick = this._onAttrClick.bind(this);
    this._onCheckClick = this._onCheckClick.bind(this);
    this._handleAlias = this._handleAlias.bind(this);
  }

  _onAttrClick(attrId) {
    this.props.onActiveChange(attrId);
  }

  _onCheckClick(attrId) {
    this._handleSelectChange(attrId);
    this.props.onActiveChange(attrId);
  }

  _handleAlias(attr) {
    this.props.onAttrChange(attr);
  }

  _handleSelectChange(attrId) {
    const { selected } = this.props;

    const copyed = selected.slice();
    const index = selected.indexOf(attrId);
    if (index === -1) {
      copyed.push(attrId);
    } else {
      copyed.splice(index, 1);
    }

    return this.props.onSelectChange(copyed);
  }

  _renderCell({ data, active }) {
    return <AttributeCell active={active} key={data} name={data} />;
  }

  _renderAttrs() {
    const { attributes, activedId, selected } = this.props;

    return (
      <Fragment>
        {attributes.map(attr => (
          <CellContaier key={attr.id}>
            <AttributeCell
              active={attr.id === activedId}
              id={attr.id}
              name={attr.name}
              alias={attr.alias}
              onClick={this._onAttrClick}
              onAlias={this._handleAlias}
            />
            <Checker
              checked={selected.indexOf(attr.id) !== -1}
              onClick={() => this._onCheckClick(attr.id)}
              readOnly
            />
          </CellContaier>
        ))}
      </Fragment>
    );
  }

  render() {
    if (this.props.attributes.length <= 0) return null;

    return <Block title="属性">{this._renderAttrs()}</Block>;
  }
}

export default AttributeCompositor;
