import React, { useMemo, useState } from 'react';

export const HeaderExpansionContext = React.createContext<HeaderExpansionContext.Value>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onExpansionChange: () => {}
});

export namespace HeaderExpansionContext {
  export interface Value {
    onExpansionChange: (expanding: boolean) => void;
  }
}

export function HeaderExpansionProvider({ onExpansionChange, children }: HeaderExpansionProvider.Props) {
  const [expendedCount, setExpendedCount] = useState(0);

  function handleToggle(expanded: boolean): void {
    let nextCount = expendedCount;
    if (expanded) {
      nextCount++;
    } else if (expendedCount > 0) {
      nextCount--;
    } else {
      return;
    }
    const nextIsExpended = nextCount > 0;
    const isExpended = expendedCount > 0;
    if (nextIsExpended !== isExpended) {
      onExpansionChange(nextIsExpended);
    }
    setExpendedCount(nextCount);
  }
  const contextValue: HeaderExpansionContext.Value = useMemo(() => ({ onExpansionChange: handleToggle }), []);

  return <HeaderExpansionContext.Provider value={contextValue}>{children}</HeaderExpansionContext.Provider>;
}

export namespace HeaderExpansionProvider {
  export interface Props extends HeaderExpansionContext.Value {
    children?: React.ReactNode;
  }
}
