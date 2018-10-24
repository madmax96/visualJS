import styled from 'styled-components';

export const MyMenu = styled.div`
    background-color:rgb(237, 219, 104);
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:space-around;
    flex-wrap:wrap;
`;
export const MenuItem = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    background-color:transparent;
    border:1px solid #323330;
    width:100%;
    height:100%;
    transition:all .3s ease-in;
    cursor:pointer;
    &:hover{
        border:5px solid #323330;
    }
`;
