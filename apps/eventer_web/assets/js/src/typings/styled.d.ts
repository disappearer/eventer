// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;

    colors: {
      background: string;
      main: string;
      secondary: string;
      bright: string;
      pale: string;
      jaggedIce: string;
      palest: string;
      mineShaft: string;
      tundora: string;
      emperor: string;
      grey: string;
      silver: string;
      gallery: string;
      concrete: string;
      milanoRed: string;
      milanoRedTransparent: string;
      milanoRedTransparenter: string;
      limeade: string;
      limeadePale: string;
      roseOfSharon: string;
      roseOfSharonDark: string;
    };
  }
}
