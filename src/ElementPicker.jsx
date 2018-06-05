import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import recomputed, { $state } from 'recomputed';
import Transition from 'react-transition-group/Transition';
import Block from './components/Block';
import Button from './components/Button';
import createScheduler from './utils/createScheduler';
import CSSPathInput from './CSSPathInput';
import cssPath from './utils/cssPath';

function getHighlightPathFromElement(elem) {
  const elements = [].concat(elem);
  const ow = window.innerWidth;
  const oh = window.innerHeight;
  const ocean = ['M0 0', 'h', ow, 'v', oh, 'h-', ow, 'z'];
  const islands = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const rect = el.getBoundingClientRect();

    if (
      rect.left > ow ||
      rect.top > oh ||
      rect.left + rect.width < 0 ||
      rect.top + rect.height < 0
    ) {
      return {
        ocean: ocean.join(''),
        islands: ['M0 0'],
      };
    }

    const poly =
      'M' +
      rect.left +
      ' ' +
      rect.top +
      'h' +
      rect.width +
      'v' +
      rect.height +
      'h-' +
      rect.width +
      'z';
    ocean.push(poly);
    islands.push(poly);
  }

  return {
    ocean: ocean.join(''),
    islands: islands.length > 0 ? islands : ['M0 0'],
  };
}

function findCommonCssPath(nodes) {
  if (nodes.length <= 0) {
    return '';
  }

  const commonPath = nodes.reduce((prevPath, node) => {
    const nextPath = cssPath(node);

    let i = 0;
    while (i < prevPath.length && i < nextPath.length && prevPath[i] === nextPath[i++]) {}

    return nextPath.substr(0, i);
  }, cssPath(nodes[0]));

  return commonPath;
}

const Contaienr = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2147483647;
  background: transparent;
`;

const Svg = styled.svg`
  position: fixed;
  top: 0;
  left: 0;
  cursor: ${props => (props.paused ? 'not-allowed' : 'crosshair')};
  width: 100%;
  height: 100%;
`;

const Ocean = styled.path`
  fill: rgba(0, 0, 0, 0.5);
  fill-rule: evenodd;
`;

const Island = styled.path`
  stroke: ${props => (props.green ? '#0f0' : '#f00')};
  stroke-width: 0.5px;
  fill: ${props => (props.green ? 'rgba(63, 255, 63, 0.2)' : 'rgba(255, 63, 63, 0.2)')};
`;

const Aside = styled.aside`
  position: fixed;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 220ms ease-in-out;
  background-color: #fff;
  min-height: 100px;
  width: 400px;
`;

const asideTransitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
};

class ElementPicker extends PureComponent {
  static contextTypes = {
    backToNoramlMode: PropTypes.func,
    addSelector: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const composer = recomputed(this);
    this.state = {
      pickedElement: null,
      paused: false,
      selector: '',
    };

    this._update = this._update.bind(this);
    this._scheduleUpdate = createScheduler(this._update, window.requestAnimationFrame);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleRootRefupdate = this._handleRootRefupdate.bind(this);
    this._handleSvgClick = this._handleSvgClick.bind(this);
    this._handleSelectorChange = this._handleSelectorChange.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleConfirmSelector = this._handleConfirmSelector.bind(this);

    this._getSvgPaths = composer(
      $state('selector'),
      $state('pickedElement'),
      (selector, pickedElement) => {
        let selected;
        try {
          selected = Array.prototype.slice.call(document.querySelectorAll(selector));
        } catch (error) {
          selected = [];
        }

        const { ocean, islands } = getHighlightPathFromElement(
          pickedElement ? [pickedElement, ...selected.filter(el => el !== pickedElement)] : []
        );

        return {
          ocean,
          island: islands[0],
          zone: islands.slice(1),
        };
      }
    );

    this._getSelector = composer(
      $state('selector'),
      $state('pickedElement'),
      (selector, pickedElement) => {
        if (selector.length > 0) {
          return selector;
        }

        if (!pickedElement) {
          return null;
        }

        return findCommonCssPath([pickedElement]);
      }
    );
    this._unmount = false;
  }

  _togglePause() {
    this.setState(state => ({
      paused: !state.paused,
      ...(state.paused ? { pickedElement: null, elements: [], selector: '' } : {}),
    }));
  }

  _handleSvgClick() {
    this._togglePause();
  }

  _handleRootRefupdate(ref) {
    this._root = ref;
  }

  _elementFromPoint(x, y) {
    this._root.style.pointerEvents = 'none';
    const elem = document.elementFromPoint(x, y);
    this._root.style.pointerEvents = '';
    if (elem === document.body || elem === document.documentElement) {
      return null;
    }

    return elem;
  }

  _setPicked(element) {
    this.setState({
      pickedElement: element,
    });
  }

  _update() {
    if (this._unmount || !this._clientX || !this._clientY) {
      return;
    }

    const elem = this._elementFromPoint(this._clientX, this._clientY);

    if (elem) {
      this._setPicked(elem);
    }
  }

  _handleMouseMove(event) {
    if (this.state.paused) {
      return;
    }

    this._clientX = event.clientX;
    this._clientY = event.clientY;
    this._scheduleUpdate();
  }

  _handleSelectorChange(value) {
    this.setState({
      selector: value,
    });
  }

  _renderSelector(selector) {
    if (!selector) {
      return null;
    }

    return <CSSPathInput value={selector} onChange={this._handleSelectorChange} />;
  }

  _handleKeyDown(event) {
    if (event.keyCode === 27) {
      this.context.backToNoramlMode();
    }
  }

  _handleConfirmSelector() {
    this.context.addSelector(this._getSelector());
    this.context.backToNoramlMode();
  }

  componentDidMount() {
    document.addEventListener('keydown', this._handleKeyDown, false);
    document.addEventListener('mousemove', this._handleMouseMove, false);
  }

  componentWillUnmount() {
    this._unmount = true;
    document.removeEventListener('keydown', this._handleKeyDown, false);
    document.removeEventListener('mousemove', this._handleMouseMove, false);
  }

  render() {
    const { paused } = this.state;

    const { ocean, island, zone } = this._getSvgPaths();
    const selector = this._getSelector();

    return (
      <Contaienr innerRef={this._handleRootRefupdate}>
        <Svg onClick={this._handleSvgClick} paused={paused}>
          <Ocean d={ocean} />
          <Island d={island} />
          {zone.map(zone => <Island key={zone} d={zone} green />)}
        </Svg>
        <Transition in={Boolean(paused && selector)} timeout={220}>
          {state => (
            <Aside
              style={{
                ...asideTransitionStyles[state],
              }}
            >
              <Block title="选择器">
                {paused && this._renderSelector(selector)}
                <div style={{ marginTop: 10 }}>
                  <Button style={{ margin: 0 }} primary onClick={this._handleConfirmSelector}>
                    确认
                  </Button>
                </div>
              </Block>
            </Aside>
          )}
        </Transition>
      </Contaienr>
    );
  }
}

export default ElementPicker;
