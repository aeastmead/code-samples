import SearchBarForm from './SearchBarForm';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { darkThemeDecorator } from 'story-utils';

export default {
  title: 'SearchBarForm',
  component: SearchBarForm,
  decorators: [
    Story => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
    darkThemeDecorator
  ]
} as ComponentMeta<typeof SearchBarForm>;

export const Primary: ComponentStory<typeof SearchBarForm> = args => (
  <SearchBarForm
    {...args}
    entityTypeLabel="Data Catalog"
    entityTypes={[
      { label: 'Dataset', value: '1' },
      { label: 'Resource', value: '2' }
    ]}
  />
);
