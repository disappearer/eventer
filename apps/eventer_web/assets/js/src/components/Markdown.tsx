import { FC } from 'react';
import React from 'react';
import MarkdownComponent from 'markdown-to-jsx';
import Link from './Link';

const Markdown: FC = ({ children }) => (
  <MarkdownComponent
    options={{
      overrides: {
        a: {
          component: Link,
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
