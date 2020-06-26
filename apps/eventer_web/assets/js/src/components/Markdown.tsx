import { FC } from 'react';
import React from 'react';
import MarkdownComponent from 'markdown-to-jsx';
import ExternalLink from './ExternalLink';

const Markdown: FC = ({ children }) => (
  <MarkdownComponent
    options={{
      overrides: {
        a: {
          component: ExternalLink,
          props: {
            external: true,
            onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
              e.stopPropagation(),
          },
        },
      },
    }}
  >
    {children}
  </MarkdownComponent>
);
export default Markdown;
