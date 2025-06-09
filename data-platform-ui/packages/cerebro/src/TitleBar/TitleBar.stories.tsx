import TitleBar from './TitleBar';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import TitleBarNode from './TitleBarNode';
import SearchBarForm from '../SearchBar/SearchBarForm';

export default {
  title: 'TitleBar',
  component: TitleBar,
  argTypes: {
    userName: { type: 'string' },
    theme: { type: null }
  },
  args: {
    userName: 'Beyonce'
  }
} as ComponentMeta<typeof TitleBar>;

export const Primary: ComponentStory<typeof TitleBar> = args => (
  <TitleBar
    {...args}
    searchBar={
      <SearchBarForm
        entityTypeLabel="Data Catalog"
        entityTypes={[
          { label: 'Dataset', value: '1' },
          { label: 'Resource', value: '2' }
        ]}
      />
    }>
    <TitleBar.IconLink
      iconName="apps"
      text="Apps"
      menuItems={[
        { label: 'Customer Service Center', renderer: 'a', href: '#' },
        { label: 'Entity Exchange', renderer: 'a', href: '#' }
      ]}
    />
    <TitleBar.Node
      iconName="question-circle"
      label="Help"
      href="https://tutti.prod.bloomberg.com/datamarketplace/README"
    />
    <TitleBarNode iconName="user" label="beyonce" />
  </TitleBar>
);
