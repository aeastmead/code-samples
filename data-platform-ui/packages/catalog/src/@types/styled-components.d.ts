import 'styled-components';
import { INLSSTheme } from '../theme';

declare module 'styled-components' {
  export interface DefaultTheme extends INLSSTheme {}
}
