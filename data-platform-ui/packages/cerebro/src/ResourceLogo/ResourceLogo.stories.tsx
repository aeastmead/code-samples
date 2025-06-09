import { ComponentMeta, ComponentStory } from '@storybook/react';
import ResourceLogo from './ResourceLogo';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export default {
  title: 'Resource Logo',
  component: ResourceLogo
} as ComponentMeta<typeof ResourceLogo>;

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 60px);
  grid-template-rows: 60px;
  grid-column-gap: 50px;

  & > div {
    grid-column: span 1;
    grid-row: span 1;
  }
`;
const Template: ComponentStory<typeof ResourceLogo> = args => {
  return (
    <Container>
      <div className="full">
        <ResourceLogo {...args} />
      </div>
      <div>
        <ResourceLogo {...args} hideName />
      </div>
    </Container>
  );
};

export const Greenplum = Template.bind({});
Greenplum.args = {
  logo: 'greenplum'
};

export const Qlik: ComponentStory<typeof ResourceLogo> = Template.bind({});

Qlik.args = {
  logo: 'qvd'
};

export const Hive: ComponentStory<typeof ResourceLogo> = Template.bind({});

Hive.args = {
  logo: 'hive'
};
