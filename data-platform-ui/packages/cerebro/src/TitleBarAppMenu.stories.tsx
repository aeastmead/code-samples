import { ComponentMeta, ComponentStory } from '@storybook/react';
import { darkThemeDecorator } from 'story-utils';
import TitleBarAppMenu from './TitleBarAppMenu';

export default {
  title: 'TitleBarAppMenu',
  component: TitleBarAppMenu,
  decorators: [
    Story => (
      <div style={{ alignSelf: 'center' }}>
        <Story />
      </div>
    ),
    darkThemeDecorator
  ]
} as ComponentMeta<typeof TitleBarAppMenu>;

export const Primary: ComponentStory<typeof TitleBarAppMenu> = args => <TitleBarAppMenu {...args} />;
