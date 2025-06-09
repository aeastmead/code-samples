import type React from 'react';
import cn from 'classnames';
import qlikLogo from './qlik-logo.png';
import styled, { StyledComponent, DefaultTheme } from 'styled-components';

const Img: StyledComponent<'img', DefaultTheme> = styled.img`
  aspect-ratio: 360/343;
  max-width: 100%;
  max-height: 100%;
`;

function QlikLogo({ className, ...rest }: QlikLogo.Props): React.ReactElement<QlikLogo.Props> {
  return <Img {...rest} className={cn('nlss-qlikLogo', className)} src={qlikLogo} />;
}

namespace QlikLogo {
  export interface Props extends Omit<React.ImgHTMLAttributes<any>, 'src' | 'ref'> {}
}

export default QlikLogo;
