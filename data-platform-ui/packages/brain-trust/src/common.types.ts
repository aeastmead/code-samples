export interface Dictionary<T> {
  [key: string]: T;
}

export interface Objectie extends Dictionary<unknown> {}

export interface OptionValue<V> {
  value: V;
  label: string;
}
