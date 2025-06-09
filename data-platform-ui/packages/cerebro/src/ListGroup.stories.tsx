import { ComponentMeta, ComponentStory } from '@storybook/react';
import ListGroup from './ListGroup';
import { ListItem } from '@bbnpm/bb-ui-framework';

export default {
  title: 'ListGroup',
  component: ListGroup
} as ComponentMeta<typeof ListGroup>;

const DATA: string[] = [
  'Handcrafted Frozen Fish',
  'Handcrafted Frozen Shirt',
  'Refined Plastic Car',
  'Unbranded Granite Chair',
  'Ergonomic Steel Shoes',
  'Licensed Soft Tuna',
  'Tasty Steel Chair',
  'Unbranded Concrete Mouse',
  'Intelligent Concrete Tuna',
  'Handmade Wooden Hat'
];

export const Primary: ComponentStory<typeof ListGroup> = (args: ListGroup.Props) => (
  <ListGroup {...args} label="Product Name">
    {DATA.map((value: string) => (
      <ListItem label={value} key={value} />
    ))}
  </ListGroup>
);
Primary.args = {
  label: 'Product Name'
};
