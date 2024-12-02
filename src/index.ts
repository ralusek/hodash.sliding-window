// Types
import { SlidingWindowBonus, SlidingWindowConfig, SlidingWindowPayload } from './types';


/**
 * Generates pairs of indices spanning a range of sizes across a given range of indices.
 * For example, if you have 5 items, and you want to perform a series of actions between each item,
 * where you begin with the base case of 2 items, and then increase the size of the window by 1 each iteration.
 * In case described above, iterations would look like this:
 * 0-0 1-1 2-2 3-3 4-4
 * 0-1 0-2 0-3 0-4
 * 1-2 1-3 1-4
 * 2-3 2-4
 * 3-4
 * @param config - SlidingWindowConfiguration object that specifies the range of indices and the range of sizes.
 * @returns An iterator that yields payloads containing the pair of indices, the current iteration, the current size, the step, the direction, and the configuration.
 */
export function* generatePairs(config: SlidingWindowConfig) {
  if (typeof config.index.to !== 'number') throw new Error(`index.to must be a number.`);
  if (config.index.to < 0) throw new Error(`index.to cannot be less than 0.`);
  
  if (config.index.from !== undefined) {
    if (typeof config.index.from !== 'number') throw new Error(`index.from must be a number.`);
    if (config.index.from < 0) throw new Error(`index.from cannot be less than 0.`);
  }

  const index = {
    from: config.index.from || 0,
    to: config.index.to,
  };

  const range = Math.abs(index.to - index.from) + 1;

  if (range < 2) throw new Error(`Range between index.from and index.to cannot be less than 1.`);

  const size = {
    min: config.size?.min ?? 0,
    max: config.size?.max ?? range,
  };

  const direction = index.from < index.to ? 1 : -1;
  if (size.min < 0) throw new Error(`Minimum size cannot be less than 0.`);
  if (size.max < size.min) throw new Error(`Maximum size cannot be less than minimum size.`);
  if (size.max > range) throw new Error(`Maximum size (${size.max}) cannot be greater than range (${range}).`);

  const iterations = size.max - size.min + 1;

  const basePayload = {
    config: {
      size: { ...size },
      index: { ...index },
    },
  };

  // Iterate over the range of sizes
  for (let i = 0; i < iterations; i++) {
    const currentSize = size.min + i; // Current size of the window
    const step = currentSize * direction; // Step to move the window
    // Last index of the window (for the x coordinate of the pair)
    const last = index.to - (direction * (currentSize - 1));

    // Iterate through the pairs of indices within the current size
    for (let j = index.from; j !== last; j += direction) {
      const y = j + step;
      const pair: [number, number] = [j, y];

      const child = {
        left: null,
        middle: null,
        right: null,
      } as SlidingWindowPayload['child'];

      // We have to compare current size vs min when determining if there
      // are children, because if current size is large enough to accommodate
      // children, that doesn't necessarily mean that we have actually produced
      // iterations which include said children.
      const currentSizeVsMin = currentSize - size.min;
      if (currentSizeVsMin > 0) {
        // Has left and right children
        child.left = [j, y - direction];
        child.right = [j + direction, y];

        if (currentSizeVsMin > 1) child.middle = [j + direction, y - direction];
      }

      const payload: SlidingWindowPayload = {
        ...basePayload,
        pair,
        iteration: i,
        currentSize,
        step,
        direction,
        child,
      };

      yield payload;
    }
  }
}

/**
 * Perform a series of actions on a sliding window of pairs of indices.
 * @param handler - A function that receives a payload and a memo, and returns a value to be stored in the memo.
 * @param config - SlidingWindowConfiguration object that specifies the range of indices and the range of sizes.
 * @returns A memoized array of values returned by the handler function.
 */
export function slidingWindow<T extends any>(
  handler: (
    payload: SlidingWindowPayload,
    // Memoized array of values returned by previous calls to the handler function
    memo: NoInfer<T>[][],
    // Additional helper data included for convenience
    bonus: SlidingWindowBonus<T>,
  ) => T,
  config: SlidingWindowConfig,
): NoInfer<T>[][] {
  const memo: T[][] = [];

  for (const payload of generatePairs(config)) {
    const { pair } = payload;

    const [j, y] = pair;

    const bonus = {
      child: { ...payload.child },
    } as SlidingWindowBonus<T>;

    if (payload.child.left) bonus.child.left = memo[payload.child.left[0]][payload.child.left[1]];
    if (payload.child.middle) bonus.child.middle = memo[payload.child.middle[0]][payload.child.middle[1]];
    if (payload.child.right) bonus.child.right = memo[payload.child.right[0]][payload.child.right[1]];

    memo[j] = memo[j] || [];
    memo[j][y] = handler(payload, memo, bonus);
  }

  return memo;
}

export default slidingWindow;
