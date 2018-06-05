import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import recomputed, { $state, property, shallow } from 'recomputed';
import mapperManager from './core/mapperManager';
import findCommon from './utils/findCommon';
import SelectorCompositor from './SelectorCompositor';
import AttributeCompositor from './AttributeCompositor';
import ElementPicker from './ElementPicker';
import MapperCompositor from './MapperCompositor';
import Result from './Result';

const AppMode = {
  NORAML: 0,
  MINIMAL: 1,
  PICKER: 2,
};

const Container = styled.div`
  color: #000;
  font-size: 14px;
  box-sizing: border-box;
  pointer-events: auto;

  & *,
  & *:before,
  & *:after {
    box-sizing: border-box;
  }
`;

const ContentContainer = Container.extend`
  position: fixed;
  top: 1em;
  right: 0.5em;
  background: #f3ebec;
  border-radius: 6px;
  width: 400px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23);
  padding-bottom: 0.8em;
  z-index: 99999999;
`;

const Close = styled.button`
  position: absolute;
  top: 0em;
  right: 0em;
  font-size: 1.2em;
  color: #000;
  cursor: default;
  padding: 0 0.5em;
  background: transparent;
  border: 0;

  &:hover {
    color: ${props => props.theme.color.primary};
  }
`;

function getAttributeNames(element) {
  return element.getAttributeNames();
}

function calcAttrs(element, attrs) {
  if (attrs.length > 1) {
    return attrs.reduce((obj, attr) => {
      obj[attr.alias || attr.name] = attr.mapper.handle(element, attr.name);
      return obj;
    }, {});
  }

  return attrs[0].mapper.handle(element, attrs[0].name);
}

function calcResult(elements, attrs, customMapperLookup) {
  if (elements.length <= 0) return '';

  if (attrs.length <= 0) return '';

  const calcElement = el => calcAttrs(el, attrs);

  let result;
  if (elements.length > 1) {
    result = elements.map(calcElement);
  } else {
    result = calcElement(elements[0]);
  }

  return typeof result === 'object' ? JSON.stringify(result, null, 4) : result;
}

class App extends Component {
  static childContextTypes = {
    backToNoramlMode: PropTypes.func,
    enterPickerMode: PropTypes.func,
    addSelector: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectors: [],
      activedAttrId: null,
      selectedAttrId: [],
      attrCustom: {},
      mode: AppMode.MINIMAL,
    };

    const composer = recomputed(this);
    this._handleRootRefUpdate = this._handleRootRefUpdate.bind(this);
    this._onSelectorsChange = this._onSelectorsChange.bind(this);
    this._onActiveAttributeChange = this._onActiveAttributeChange.bind(this);
    this._onSelectAttributeChange = this._onSelectAttributeChange.bind(this);
    this._addSelector = this._addSelector.bind(this);
    this._handleEditAttr = this._handleEditAttr.bind(this);
    this._onMapperChange = this._onMapperChange.bind(this);
    this._bindKeyboardShortcut = this._bindKeyboardShortcut.bind(this);

    this._getSelectors = shallow($state('selectors'));
    this._getElements = composer(property('_rootRef'), $state('selectors'), (root, selectors) => {
      let elements;
      try {
        elements = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));
      } catch (error) {
        elements = [];
      }

      return root ? elements.filter(el => !root.contains(el)) : [];
    });
    this._getAvailableAttrs = composer(
      this._getElements,
      shallow($state('attrCustom')),
      (elements, attrCustom) => {
        if (elements.length <= 0) return [];

        return findCommon(elements.map(el => getAttributeNames(el)))
          .concat(['textContent', 'innerHTML'])
          .map(attr => ({
            id: attr,
            name: attr,
            alias: (attrCustom[attr] && attrCustom[attr].alias) || '',
            mapper:
              (attrCustom[attr] && attrCustom[attr].mapper) || mapperManager.getDefaultMapper(),
          }));
      }
    );
    this._getActiveAttr = composer(
      this._getAvailableAttrs,
      $state('activedAttrId'),
      (getAvailableAttrs, activedAttrId) => {
        return getAvailableAttrs.find(attr => attr.id === activedAttrId);
      }
    );
    this._getSelectedAttr = composer(
      this._getAvailableAttrs,
      $state('selectedAttrId'),
      (getAvailableAttrs, selectedAttrId) => {
        return getAvailableAttrs.filter(attr => selectedAttrId.find(attrId => attrId === attr.id));
      }
    );
    this._getAvailableMappers = composer($state('activedAttrId'), activedAttrId => {
      return activedAttrId ? mapperManager.getAttrMapperList(activedAttrId) : [];
    });

    this._getResult = composer(
      this._getElements,
      this._getSelectedAttr,
      shallow($state('attrCustom')),
      calcResult
    );
  }

  getChildContext() {
    return {
      backToNoramlMode: () => {
        this._setMode(AppMode.NORAML);
      },
      enterPickerMode: () => {
        this._setMode(AppMode.PICKER);
      },
      addSelector: this._addSelector,
    };
  }

  _handleRootRefUpdate(ref) {
    this._rootRef = ref;
  }

  _addSelector(selector) {
    if (
      this.state.selectors.find(sel => sel.replace(/\s+/g, '') === selector.replace(/\s+/g, ''))
    ) {
      return;
    }

    if (this.state.selectors.length === 1 && this.state.selectors[0].trim() === '') {
      this.setState({
        selectors: [selector],
      });
      return;
    }

    this.setState(state => ({
      selectors: state.selectors.concat(selector),
    }));
  }

  _setMode(mode) {
    this.setState({
      mode,
    });
  }

  _onSelectorsChange(values) {
    if (this.state.selectors === this._getSelectors.value({ state: { selectors: values } })) {
      return;
    }

    this.setState({
      selectors: values,
      activedAttrId: null,
      selectedAttrId: [],
      attrCustom: {},
    });
  }

  _onActiveAttributeChange(value) {
    this.setState({
      activedAttrId: value,
    });
  }

  _onSelectAttributeChange(selected) {
    this.setState({
      selectedAttrId: selected,
    });
  }

  _handleEditAttr(editedAttr) {
    this.setState(state => ({
      attrCustom: {
        ...state.attrCustom,
        [editedAttr.id]: {
          ...state.attrCustom[editedAttr.id],
          ...editedAttr,
        },
      },
    }));
  }

  _onMapperChange(mapper) {
    const activeAttrId = this._getActiveAttr().id;
    this._handleEditAttr({
      id: activeAttrId,
      mapper,
    });
  }

  _renderMapper() {
    const avalialeMappers = this._getAvailableMappers();
    if (avalialeMappers.length <= 0) return;

    const activeAttr = this._getActiveAttr();

    return (
      <MapperCompositor
        selected={activeAttr.mapper.getId()}
        mappers={avalialeMappers}
        onChange={this._onMapperChange}
      />
    );
  }

  _renderContent() {
    const { selectors, selectedAttrId, activedAttrId, mode } = this.state;

    if (mode === AppMode.PICKER) {
      return <ElementPicker />;
    }

    const attributes = this._getAvailableAttrs();

    const result = this._getResult();

    return (
      <ContentContainer>
        <SelectorCompositor values={selectors} onChange={this._onSelectorsChange} />
        <AttributeCompositor
          attributes={attributes}
          selected={selectedAttrId}
          activedId={activedAttrId}
          onActiveChange={this._onActiveAttributeChange}
          onSelectChange={this._onSelectAttributeChange}
          onAttrChange={this._handleEditAttr}
        />
        {this._renderMapper()}
        {result && <Result>{result}</Result>}
        <Close onClick={() => this._setMode(AppMode.MINIMAL)}>&times;</Close>
      </ContentContainer>
    );
  }

  _bindKeyboardShortcut(event) {
    if (event.metaKey && event.keyCode === 73 /* i */) {
      this._setMode(AppMode.PICKER);
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this._bindKeyboardShortcut, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._bindKeyboardShortcut, false);
  }

  render() {
    if (this.state.mode === AppMode.MINIMAL) return null;

    return <Container innerRef={this._handleRootRefUpdate}>{this._renderContent()}</Container>;
  }
}

export default App;
