import styled from 'styled-components';

export const Question = styled.div`
  margin-bottom: 7px;
`;

export const Options = styled.div`
  display: grid;
  justify-items: start;
  grid-gap: 7px;
  margin-bottom: 14px;
`;

export const Description = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.darkerGrey};
  max-width: 273px;
`;

type optionPropsT = {
  selected?: boolean;
};
export const Option = styled.div<optionPropsT>`
  font-size: 0.9rem;
  padding: 5px 17px;
  text-align: center;
  border-radius: 27px;
  ${(props) =>
    props.selected
      ? `border: 1px solid ${props.theme.colors.pale};
          background: ${props.theme.colors.paler};`
      : `border: 1px solid ${props.theme.colors.lighterGrey};`}

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 3px ${(props) => props.theme.colors.main};
  }
`;

export const CustomOption = styled(Option)`
  text-align: left;
  border: 1px solid transparent;
  padding: 5px;

  &:hover {
    cursor: default;
    box-shadow: none;
  }
`;
