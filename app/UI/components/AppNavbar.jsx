import styled from 'styled-components';

const AppNavbar = styled.div`
    width:100%;
    height:100%;
    background-color: #002e63;
    display:flex;
    align-items:center;
    justify-content:center;
`;
AppNavbar.Logo = styled.img`
    height:90%;
    margin-right:auto;
    cursor:pointer;

`;
AppNavbar.FirstSection = styled.div`
    margin-right:auto;
    padding-left:2rem;
`;
AppNavbar.ThirdSection = styled.div`
    padding-right:2rem;
`;
export default AppNavbar;
