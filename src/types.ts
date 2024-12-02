export type OptionalKeys<T> = { [k in keyof T]-?: undefined extends T[k] ? k : never }[keyof T];
export type NonOptionalKeys<T> = { [k in keyof T]-?: undefined extends T[k] ? never : k }[keyof T];

export type SlidingWindowConfig = {
  size?: {
    min?: number;
    max?: number;
  };
  index: {
    from?: number;
    to: number;
  };
};

export type SlidingWindowPayload = {
  pair: [number, number];
  iteration: number;
  currentSize: number;
  step: number;
  direction: number;
  config: SlidingWindowConfig;
  child: {
    left: [number, number] | null;
    middle: [number, number] | null;
    right: [number, number] | null;
  };
};

export type SlidingWindowBonus<T extends any> = {
  child: {
    left: T | null;
    middle: T | null;
    right: T | null;
  };
};
