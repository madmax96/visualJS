import styled from 'styled-components';

export const Common = styled.div`
  height:${props => (props.height ? `${props.height}%` : 'auto')};
  width:${props => (props.width ? `${props.width}%` : 'auto')};
  ${(props) => {
    if (props.absoluteCenter) {
      props.top = '50%';
      props.left = '50%';
      return 'transform:translate(-50%,-50%)';
    }
  }};
  top:${props => props.top};
  left:${props => props.left};
  right:${props => props.right};
  bottom:${props => props.bottom};
  position:${(props) => {
    if (props.absolute || props.absoluteCenter) return 'absolute';
    if (props.relative) return 'relative';
    if (props.fixed) return 'fixed';
  }};
  z-index:${props => props.zIndex || 1};
  display:${(props) => {
    if (props.dFlex) return 'flex';
    if (props.dBlock) return 'block';
    if (props.dNone) return 'none';
  }};
`;
export const AppContainer = styled.div`
    position:relative;
    height:100vh;
    overflow:hidden;
`;
export const FlexContainer = styled(Common)`
    display:flex;
    flex-direction : ${(props) => {
    if (props.column) {
      return props.reverse ? 'column-reverse' : 'column';
    }
    return props.reverse ? 'row-reverse' : 'row';
  }};
    flex-wrap:${props => (props.wrap ? 'wrap' : 'no-wrap')};
    overflow:'hidden';
`;
export const FlexItem = styled(Common)`
    flex-grow:${props => props.grow || 0};
    flex-shrink:${props => props.shrink || 0};
    flex-basis:${props => (props.basis === 'auto' ? 'auto' : `${props.basis || 0}%`)};
    overflow:hidden;
`;
export const FlexItemContainer = styled(FlexContainer)`
    flex-grow:${props => props.grow || 0};
    flex-shrink:${props => props.shrink || 0};
    flex-basis:${props => (props.basis === 'auto' ? 'auto' : `${props.basis || 0}%`)};
`;
