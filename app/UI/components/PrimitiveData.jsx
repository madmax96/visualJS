import styled from 'styled-components';

const Common = styled.span`
    font-size:11px;
`;
export const Number = styled(Common)`
    color:darkblue;
`;

export const String = styled(Common)`
    color:darkred;
`;
export const Boolean = styled(Common)`
    color:${props => (props.isTrue ? 'darkgreen' : 'brown')};
`;
export const Null = styled(Common)`
    color:skyblue;
`;

export const Undefined = styled(Common)`
    color:darkgrey;
`;
