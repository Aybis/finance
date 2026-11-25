import React from 'react';
import type { Preview } from '@storybook/react';
import { TooltipProvider } from '../src/components/ui/tooltip';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        TooltipProvider,
        { delayDuration: 140, skipDelayDuration: 100 },
        React.createElement(Story, null)
      ),
  ],
  parameters: {
    backgrounds: {
      default: 'kaza-canvas',
      values: [
        { name: 'kaza-canvas', value: '#F3F4F6' },
        { name: 'kaza-surface', value: '#FFFFFF' },
        { name: 'kaza-dark', value: '#18181B' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
