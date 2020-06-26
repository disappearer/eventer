import { UAParser } from 'ua-parser-js';

export type BraveNavigator = Navigator & {
  brave: boolean;
};

const uaParser = new UAParser();

type getOSAndBrowserT = () => { os: string; browser: string };
export const getOSAndBrowser: getOSAndBrowserT = () => {
  const nav = navigator as BraveNavigator;
  return {
    os: uaParser.getOS().name || 'unknown',
    browser: (nav.brave && 'Brave') || uaParser.getBrowser().name || 'unknown',
  };
};
