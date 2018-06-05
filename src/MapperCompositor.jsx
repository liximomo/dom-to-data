import React, { PureComponent } from 'react';
import Block from './components/Block';
import Pickiee from './components/Pickiee';

class MapperCompositor extends PureComponent {
  render() {
    const { mappers, selected } = this.props;

    return (
      <Block title="转换">
        {mappers.map(mapper => {
          return (
            <Pickiee
              active={selected === mapper.getId()}
              key={mapper.getId()}
              onClick={() => this.props.onChange(mapper)}
            >
              {mapper.getName()}
            </Pickiee>
          );
        })}
      </Block>
    );
  }
}

export default MapperCompositor;
