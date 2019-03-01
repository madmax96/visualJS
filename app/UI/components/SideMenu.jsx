import styled from 'styled-components';

const SideMenu = styled.div`
width:100%;
height:100%;
background-color: cyan;
display:flex;
flex-direction:column;
justify-content:start;
align-items:center;
`;

SideMenu.Item = styled.div`
    display:flex;
    font-weight:bold;
    background-color:darkred;
`;


SideMenu.SubItem = styled.div`
    display:flex;
    background-color:darkred;
    margin-left:10px;
`;

export default SideMenu;
