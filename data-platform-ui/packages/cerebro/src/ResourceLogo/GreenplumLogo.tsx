import type React from 'react';
import cn from 'classnames';
import styled, { StyledComponent, DefaultTheme } from 'styled-components';

const SVG: StyledComponent<'svg', DefaultTheme> = styled.svg`
  overflow: hidden;
  height: 100%;
  aspect-ratio: 1/1;

  .nlss-greenplumLogo {
    &__outerOval,
    &__centerArch {
      fill: #008774;
    }

    &__arch {
      fill: #00b3aa;
    }
  }
`;

function GreenplumLogo({ className, ...rest }: GreenplumLogo.Props): React.ReactElement<GreenplumLogo.Props> {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      viewBox="40 70 120 60"
      overflow="hidden"
      aria-label="Greenplum"
      {...rest}
      className={cn('nlss-greenplumLogo', className)}>
      <path
        className="nlss-greenplumLogo__outerOval"
        d="M100.15,51.33a50,50,0,1,1-50,50,50.1,50.1,0,0,1,50-50m0-8.93a59,59,0,1,0,59,59,59,59,0,0,0-59-59Z"
      />
      <path
        className="nlss-greenplumLogo__centerArch"
        d="M113.68,87.7A19.32,19.32,0,0,0,86.37,115a.45.45,0,0,0,.26.13c.13,0,.13-.13.26-.13A91.18,91.18,0,0,1,99,99.78,93.06,93.06,0,0,1,113.81,88.1a.46.46,0,0,0,.13-.27C113.68,87.83,113.68,87.7,113.68,87.7Z"
      />
      <path
        className="nlss-greenplumLogo__arch"
        d="M100.15,63.54a38,38,0,0,1,26.79,11c4.33,4.34,4.2,5.91,4.2,6-.13,1.71-6,5.26-9.85,7.75-5.64,3.55-12.73,7.88-19.3,14.44s-11,13.79-14.7,19.57c-2.5,3.94-6.31,10-7.88,10-.13,0-2-.13-5.91-4.07a38,38,0,0,1,0-53.58,36.8,36.8,0,0,1,26.65-11.16m0-5.64A43.53,43.53,0,0,0,69.3,132.22c4.07,4.07,7.22,5.77,10,5.77,8.66,0,12.73-17.33,26.65-31.25C124.05,88.62,148,87.57,131,70.5a44.31,44.31,0,0,0-30.86-12.6Z"
      />
      <path
        className="nlss-greenplumLogo__arch"
        d="M74.29,101.49a25.75,25.75,0,0,1,44.9-17.2l.14.13h.26c1.18-.79,2.89-1.84,4.33-2.89l.13-.13v-.13a31.49,31.49,0,1,0-44.51,44.25.18.18,0,0,0,.26,0,.13.13,0,0,0,.13-.13c1-1.45,2.1-3.15,2.89-4.47v-.13l-.13-.13A26,26,0,0,1,74.29,101.49Z"
      />
    </SVG>
  );
}

namespace GreenplumLogo {
  export interface Props extends Omit<React.SVGProps<any>, 'ref'> {
    className?: string;
  }
}

export default GreenplumLogo;
