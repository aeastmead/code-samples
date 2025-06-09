import { DefaultRootState } from 'react-redux';
import { ParametricSelector } from 'reselect';
import { EntityIdParams, EntityIdsParams } from './types';

export type MakeSelector<P, R> = () => ParametricSelector<DefaultRootState, P, R>;

const getIdFromParams = (props: EntityIdParams | { id: number } | number | undefined): number => {
  if (props === undefined) return -1;
  if (typeof props === 'number') return props;

  return 'entityId' in props ? props.entityId : props.id;
};

export default {
  selectEntityIdParam: (_: DefaultRootState, props: EntityIdParams): number => props.entityId,
  selectEntityIdsParam: (_: DefaultRootState, props: EntityIdsParams): number[] => props.entityIds,
  selectIdParam: (_: DefaultRootState, props: EntityIdParams | { id: number }): number => getIdFromParams(props),
  getIdFromParams
};
