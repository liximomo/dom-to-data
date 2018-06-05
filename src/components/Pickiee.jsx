import styled from 'styled-components';

const Pickiee = styled.div.attrs({
  tabIndex: 0,
})`
  text-align: center;
  display: inline-block;
  user-select: none;
  min-width: 3.4em;
  max-width: 8em;
  padding: 0.2em 0.4em;
  background: #fff;
  border-radius: 4px;
  border: 1px solid transparent;
  border-color: ${props => (props.active ? props.theme.color.primary : 'transparent')};
  margin-right: 1.2em;
  margin-bottom: 1.2em;

  &:focus {
    outline: none;
    border-color: ${props => (!props.active ? props.theme.color.secondary : '')};
  }
`;

export default Pickiee;
