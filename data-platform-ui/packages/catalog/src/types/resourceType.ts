import { Entity } from './common';

export interface IResourceType extends Entity {
  id: number;
  name: string;
  canBeRegistered: boolean;
  locationNameLabel: string;
  resourceNameLabel: string;
  locationNameExample: string | undefined;
  resourceNameExample: string | undefined;
}
