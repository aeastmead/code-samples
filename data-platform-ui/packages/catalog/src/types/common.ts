export interface Entity<T = number> {
  id: T;
}

export interface SaveFormProps {
  saved: boolean;

  hasRootError: boolean;
  rootError: string | undefined;
}

export interface HealthMetric {
  label: string;
  score: number;
}

export interface EntityLeafNode {
  id: number;
  name: string;
}

export interface EntityNode<T extends EntityLeafNode> extends EntityLeafNode {
  children: T[];
}

export interface AnchorLink {
  url: string;
  label: string;
}

export interface BLink extends AnchorLink {
  terminalFunction: string;
}

export type DisplayLink = AnchorLink | BLink;

export namespace DisplayLink {
  export function isBLink(value: DisplayLink): value is BLink {
    return 'terminalFunction' in value;
  }
}
