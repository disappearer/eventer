// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;

    colors: {
      main: string;
      secondary: string;
      primaryLine: string;
      secondaryLine: string;
      link: string;
      linkVisited: string;
      pale: string;
    };
  }
}
