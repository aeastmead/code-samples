import MultiDropdown from './MultiDropdown';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export default {
  title: 'MultiDropdown',
  decorators: [
    Story => (
      <Container>
        <Story />
      </Container>
    )
  ]
} as ComponentMeta<typeof MultiDropdown>;
interface TemplateProps {
  leftProps?: WrappedItemProps;

  rightProps?: WrappedItemProps;
}
interface WrappedItemProps extends Omit<MultiDropdown.Props<string, any>, 'values' | 'options' | 'onItemChange'> {
  defaultValues?: string[];
}

function WrappedItem({ defaultValues, ...rest }: WrappedItemProps) {
  const [values, setValues] = useState<string[] | undefined>(defaultValues);

  return <MultiDropdown {...rest} values={values} options={options} onItemChange={setValues.bind(null)} />;
}

function Template({ leftProps = {}, rightProps = {} }: TemplateProps) {
  return (
    <>
      <div>
        <WrappedItem {...leftProps} />
      </div>
      <div>
        <WrappedItem {...rightProps} />
      </div>
    </>
  );
}

export const Primary: ComponentStory<typeof Template> = Template.bind({});

Primary.args = {
  rightProps: {
    defaultValues: ['19', '20', '10', '9', '21', '15']
  }
};

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  height: 100%;

  & > div {
    grid-column: span 1;
    display: flex;
    justify-content: center;
    align-items: center;

    & > div {
      width: 250px;
    }
  }
`;

const options: MultiDropdown.Option<string>[] = [
  {
    value: '28',
    label: 'Workplace Operations'
  },
  {
    value: '27',
    label: 'User'
  },
  {
    value: '26',
    label: 'Travel And Expense'
  },
  {
    value: '25',
    label: 'Trading Solutions'
  },
  {
    value: '24',
    label: 'Ticketing System'
  },
  {
    value: '23',
    label: 'Terminal'
  },
  {
    value: '22',
    label: 'Supply Chain'
  },
  {
    value: '29',
    label: 'Security Operations'
  },
  {
    value: '21',
    label: 'Sales'
  },
  {
    value: '20',
    label: 'Reference Data'
  },
  {
    value: '19',
    label: 'Portfolio'
  },
  {
    value: '18',
    label: 'Parser'
  },
  {
    value: '17',
    label: 'Operations'
  },
  {
    value: '16',
    label: 'News'
  },
  {
    value: '13',
    label: 'MSG IB'
  },
  {
    value: '15',
    label: 'Mobile'
  },
  {
    value: '14',
    label: 'Marketing'
  },
  {
    value: '12',
    label: 'Internal'
  },
  {
    value: '11',
    label: 'InfoSys'
  },
  {
    value: '10',
    label: 'HR'
  },
  {
    value: '9',
    label: 'Exchange Report'
  },
  {
    value: '32',
    label: 'Enterprise Products'
  },
  {
    value: '8',
    label: 'Enterprise Data'
  },
  {
    value: '7',
    label: 'Employee Information'
  },
  {
    value: '6',
    label: 'Data Center'
  },
  {
    value: '5',
    label: 'Data Analytics & Integration'
  },
  {
    value: '3',
    label: 'Customer'
  },
  {
    value: '4',
    label: 'CRCO'
  },
  {
    value: '126',
    label: 'Compliance'
  },
  {
    value: '2',
    label: 'Bloomberg Intelligence'
  },
  {
    value: '1',
    label: 'BIO'
  }
];
