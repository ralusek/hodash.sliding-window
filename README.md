# @hodash/sliding-window

A utility library for generating sliding window iterations, perfect for bottom-up dynamic programming and other sequential processing patterns.

## Installation

```bash
npm install @hodash/sliding-window
```

## Overview

The sliding window utility helps you process sequences of data where you need to:
- Build solutions based on previously computed results (memoization)
- Implement bottom-up dynamic programming algorithms
- Break any problem down that relies on solutions spanning every possible span of ranges within a list

## Basic Usage

```typescript
const config = {
  // Here is where we define the minimum and maximum span sizes.
  // A minimum of 1 means the spans will go all the way down to dealing
  // with neighboring indices (e.g. (0,1), (1,2), (2,3), (3,4), etc)
  // A maximum of 4 2 means the spans will go up to spanning 3 indices
  // (e.g. (0,3), (1,4), (2,5), (3,6), etc)
  size: { min: 1, max: 3 },
  // Here is where we define the range of indices we'd like to generate
  // spans within. If we limit it from index 0 to index 3, with the min
  // and max specified above, the full span of ranges we can expect to
  // uncover would be
  // For size 1:
  // (0,1) (1,2) (2,3)
  // For size 2:
  // (0,2) (1,3)
  // For size 3:
  // (0,3)
  index: { from: 0, to: 3 },
};

// If all we want to do is generate pairs, we have a generator
// available to us to do exactly that:
import { generatePairs } from '@hodash/sliding-window';

for (const { iteration, pair } of generatePairs(config)) {
  console.log(iteration, pair);
}

// If we want to generate pairs, and call a handler function as they
// come in, in which the returned value is memoized, and previous results
// are memoized and passed into the function, we can do that as well
import { slidingWindow } from '@hodash/sliding-window';

// Note, this uses the same config object as generatePairs
slidingWindow((payload, memo) => {
  // memo object is passed in the memoized results of previously run calls
  // of this handler function. So if we're dealing with the sequence above,
  // if I was on pair (1,3), for example, that means I would be able to access
  // memo[0][1]
  // memo[1][2]
  // memo[2][3]
  // memo[0][2]
  // As having the results of their handler stored

  // This will be stored at memo[1][3]
  return doSomething();
}, config);
```


## Dynamic Programming Examples


### 1. Longest Palindrome substring
```typescript
function longestPalindromicSubstring(s: string) {
  // Configuration for the sliding window
  const config = {
    index: {
      to: s.length - 1,
    },
  };

  type Tracker = {
    longest: string | null;
    current: string | null;
  };

  return slidingWindow<Tracker>((
    payload,
    memo,
    { child },
  ) => {
    const [i, j] = payload.pair;

    const tracker: Tracker = { longest: null, current: null };

    const areBookendsEqual = s[i] === s[j];

    // For substrings of length 1 and 2, there will be no substrings to examine. Thus
    // we set up the foundational cases by just checking if the bookending characters are equal
    if (payload.iteration < 2) {
      if (areBookendsEqual) tracker.current = tracker.longest = s.slice(i, j + 1);
      return tracker;
    }
    
    // If the bookends are equal, and the substring they enclose also have a current palindrome,
    // then we still have a palindrome.
    if (areBookendsEqual && child.middle?.current) {
      tracker.longest = tracker.current = s.slice(i, j + 1);
    }
    // Otherwise, we're not dealing with a palindrome, and are instead looking for the longest
    // palindrome to bubble up.
    else {
      if (child.left!.longest && child.left!.longest.length > (tracker.longest || '').length) {
        tracker.longest = child.left!.longest;
      }
  
      if (child.right!.longest && child.right!.longest.length > (tracker.longest || '').length) {
        tracker.longest = child.right!.longest;
      }
    }

    return tracker;
  }, config);
}

// The string to analyze for palindromic substrings
const result1 = longestPalindromicSubstring('zytxxty');
expect(result1[0][6].longest).to.equal('ytxxty');
expect(result1[0][6].current).to.equal(null);
expect(result1[1][6].longest).to.equal('ytxxty');
expect(result1[1][6].current).to.equal('ytxxty');

const result2 = longestPalindromicSubstring('zytxty');
expect(result2[0][5].longest).to.equal('ytxty');
expect(result2[0][5].current).to.equal(null);
expect(result2[1][5].longest).to.equal('ytxty');
expect(result2[1][5].current).to.equal('ytxty');

const result3 = longestPalindromicSubstring('aab');
expect(result3[0][2].longest).to.equal('aa');
expect(result3[0][2].current).to.equal(null);
expect(result3[0][1].longest).to.equal('aa');
```


## API Reference

### `slidingWindow<T>(handler, config, bonus)`

#### Parameters

- `handler`: `(payload: SlidingWindowPayload, memo: T[][], bonus: SlidingWindowBonus<T>) => T`
  - Called for each window position
  - Receives current position details and memoization array
  - Should return value to be memoized

- `config`: `SlidingWindowConfig`
  ```typescript
  type SlidingWindowConfig = {
    size?: {
      min?: number;  // Minimum window size (default: 1)
      max?: number;  // Maximum window size (default: range)
    };
    index: {
      from?: number;  // Starting index (default: 0)
      to: number;     // Ending index (required)
    };
  }
  ```

#### Payload Structure

```typescript
type SlidingWindowPayload = {
  pair: [number, number];    // Current indices being processed
  iteration: number;         // Current iteration number
  currentSize: number;       // Current window size
  step: number;             // Step size for current window
  direction: number;        // 1 for forward, -1 for reverse
  config: {                 // Configuration used
    size: { min: number; max: number };
    index: { from: number; to: number };
  };
  // Shorthand convenience for commonly accessed indices of previously-visited
  // pairs of indices.
  // [a, b, c, d, e]
  // If we are currently on the final range spanning (a, e), the children would be:
  // left: (0, 3) i.e. (a, d)
  // middle: (1, 3) i.e (b, d)
  // right: (1, 4) i.e. (b, e)
  child: {
    left: [number, number] | null;
    middle: [number, number] | null;
    right: [number, number] | null;
  };
}
```

## Generator Usage

For more control over the iteration process, you can use the `generatePairs` generator directly:

```typescript
import { generatePairs } from '@hodash/sliding-window';

for (const payload of generatePairs({
  index: { to: 5 },
  size: { min: 2, max: 3 }
})) {
  console.log(payload.pair); // Process pairs as needed
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
