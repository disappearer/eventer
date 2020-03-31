// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;

    colors: {
      main: string;
      secondary: string;
      bright: string;
      pale: string;
      mineShaft: string;
      tundora: string;
      darkerGrey: string;
      lighterGrey: string;
      milanoRed: string;
    };
  }
}
