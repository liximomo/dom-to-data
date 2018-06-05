import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0.2em 1em;
`;

const Title = styled.div`
  font-size: 0.8em;
  font-weight: 500;
  padding: 0.5em 0;
`;


class Block extends Component {
  render() {
    const { children, title } = this.props;

    return (
      <Container>
        <Title>{title}：</Title>
        {children}
      </Container>
    );
  }
}

export default Block;
