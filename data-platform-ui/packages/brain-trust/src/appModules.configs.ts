export const AppModuleName = {
  CATALOG: 'catalog',
  DASHBOARD: 'dashboard',
  TOOLS: 'tools',
} as const;
export const appModuleConfigObj: AppModuleObject<AppModuleConfig> = {
  catalog: {
    kind: AppModuleName.CATALOG,
    iconName: 'files',
    displayName: 'Data Catalog',
    path: '/search',
    subPaths: [
      {
        displayName: 'Add new Dataset',
        path: '/catalog/createDataset',
      },
    ],
    iconColorFromTheme: (theme: ThemePalette) => theme.colors.blue['200'],
  },
  dashboard: {
    kind: AppModuleName.DASHBOARD,
    iconName: 'chart',
    displayName: 'Dashboards',
    path: '/hub',
    subPaths: undefined,
    iconColorFromTheme: (theme: ThemePalette) => theme.colors.green['200'],
  },
  tools: {
    kind: AppModuleName.TOOLS,
    iconName: 'gear',
    displayName: 'Self-Service Tools',
    path: '/tools',
    subPaths: undefined,
    iconColorFromTheme: (theme: ThemePalette) => theme.colors.grey['200'],
  },
};

export const appModuleConfigArray: AppModuleConfig[] = [
  appModuleConfigObj.catalog,
  appModuleConfigObj.dashboard,
  appModuleConfigObj.tools,
];

export interface AppModuleConfig {
  readonly kind: AppModuleName;
  readonly iconName: 'chart' | 'files' | 'gear';
  readonly displayName: string;
  readonly path: string;
  readonly subPaths: AppModuleConfig.SubPath[] | undefined;
  iconColorFromTheme(theme: ThemePalette): string;
}

export namespace AppModuleConfig {
  export interface SubPath {
    readonly path: string;
    readonly displayName: string;
  }
}

export type AppModuleName = keyof AppModuleObject<unknown>;

export interface AppModuleObject<V> {
  catalog: V;
  dashboard: V;
  tools: V;
}

export interface ThemePalette {
  colors: {
    red: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    orange: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    amber: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    yellow: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    green: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    teal: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    blue: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
      1100: string;
    };
    purple: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    magenta: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    grey: {
      50: string;
      100: string;
      125: string;
      150: string;
      200: string;
      250: string;
      300: string;
      350: string;
      400: string;
      450: string;
      500: string;
      550: string;
      600: string;
      650: string;
      700: string;
      750: string;
      800: string;
      850: string;
      900: string;
    };
  };
}
