import styled from 'styled-components';

const Var = styled.div`
    border:1px solid black;
`;
Var.Name = styled.div`
    color:red;
    border-bottom:1px solid black;
    display:flex;
    justify-content:center;
`;
Var.Value = styled.div`
    padding:5px;
    display:flex;
    justify-content:center;
    align-items:center;
`;
export default Var;
