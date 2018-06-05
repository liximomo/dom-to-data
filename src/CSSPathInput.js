import React, { PureComponent } from 'react';
import recomputed, { $props } from 'recomputed';

class CSSPathInput extends PureComponent {
  constructor(props) {
    super(props);

    const composer = recomputed(this);

    this._getPaths = composer($props('value'), value =>
      value
        .replace(/\s/g, '')
        .split('>')
        .map((p, index) => ({ id: index, data: p }))
    );
    this._handlePathChange = this._handlePathChange.bind(this);
  }

  _handlePathChange(event) {
    // const paths = this._getPaths();
    // const newValue = paths
    //   .map(path => (path.id === newPath.id ? newPath.data : path.data))
    //   .join(' > ');

    this.props.onChange(event.target.value);
  }

  render() {
    const { value } = this.props;
    // const paths = this._getPaths();

    return (
      <div>
        <input style={{ width: '100%' }} type="text" value={value} onChange={this._handlePathChange} />
      </div>
    );
  }
}

export default CSSPathInput;
