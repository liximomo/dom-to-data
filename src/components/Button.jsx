import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? props.theme.color.primary : 'white'};
  color: ${props => props.primary ? 'white' : props.theme.color.primary};

  font-size: 0.8em;
  margin-top: 1em;
  margin-left: 0.6em;
  margin-right: 0.6em;
  padding: 0.25em .5em;
  border: 1px solid ${props => props.theme.color.primary};
  border-radius: 3px;
  -webkit-user-modify: initial;

  &:focus {
    outline: #2196F3 auto 5px;
  }
`;

export default Button;
