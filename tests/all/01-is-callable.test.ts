import 'mocha';
import { expect } from 'chai';

import { slidingWindow, generatePairs } from '../../lib';

describe('Invocation', () => {

  /**
     * 0-1 1-2 2-3 3-4
     * 0-2 1-3 2-4
     * 0-3 1-4
     * 0-4
     */
  it('should execute basic case as expected.', () => {
    const config = { size: { min: 1, max: 4 }, index: { from: 0, to: 4 } };
    const EXPECTED = [
      {
        pair: [ 0, 1 ],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [ 1, 2 ],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [ 2, 3 ],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [ 3, 4 ],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [ 0, 2 ],
        iteration: 1,
        currentSize: 2,
        step: 2,
        direction: 1,
        child: {
          left: [ 0, 1 ],
          middle: null,
          right: [ 1, 2 ],
        },
      },
      {
        pair: [ 1, 3 ],
        iteration: 1,
        currentSize: 2,
        step: 2,
        direction: 1,
        child: {
          left: [ 1, 2 ],
          middle: null,
          right: [ 2, 3 ],
        },
      },
      {
        pair: [ 2, 4 ],
        iteration: 1,
        currentSize: 2,
        step: 2,
        direction: 1,
        child: {
          left: [ 2, 3 ],
          middle: null,
          right: [ 3, 4 ],
        },
      },
      {
        pair: [ 0, 3 ],
        iteration: 2,
        currentSize: 3,
        step: 3,
        direction: 1,
        child: {
          left: [ 0, 2 ],
          middle: [ 1, 2 ],
          right: [ 1, 3 ],
        },
      },
      {
        pair: [ 1, 4 ],
        iteration: 2,
        currentSize: 3,
        step: 3,
        direction: 1,
        child: {
          left: [ 1, 3 ],
          middle: [ 2, 3 ],
          right: [ 2, 4 ],
        },
      },
      {
        pair: [ 0, 4 ],
        iteration: 3,
        currentSize: 4,
        step: 4,
        direction: 1,
        child: {
          left: [ 0, 3 ],
          middle: [ 1, 3 ],
          right: [ 1, 4 ],
        },
      }
    ];

    let i = 0;
    const memo = slidingWindow((payload, memo) => {      
      const expected = EXPECTED[i++];
      expect(payload).to.deep.equal({ ...expected, config });

      return payload.pair.join('-');
    }, config);
    expect(i).to.equal(EXPECTED.length);

    EXPECTED.forEach(({ pair }, i) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });

  /**
   * 4-3 3-2 2-1 1-0
   * 4-2 3-1 2-0
   * 4-1 3-0
   * 4-0
   */
  it('should execute reverse case as expected.', () => {
    const config = { size: { min: 1, max: 4 }, index: { from: 4, to: 0 } };
    const EXPECTED = [
      {
        pair: [ 4, 3 ],
        iteration: 0,
        currentSize: 1,
        step: -1,
        direction: -1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [ 3, 2 ],
        iteration: 0,
        currentSize: 1,
        step: -1,
        direction: -1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [ 2, 1 ],
        iteration: 0,
        currentSize: 1,
        step: -1,
        direction: -1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [ 1, 0 ],
        iteration: 0,
        currentSize: 1,
        step: -1,
        direction: -1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [ 4, 2 ],
        iteration: 1,
        currentSize: 2,
        step: -2,
        direction: -1,
        child: {
          left: [ 4, 3 ],
          middle: null,
          right: [ 3, 2 ],
        },
      },
      {
        pair: [ 3, 1 ],
        iteration: 1,
        currentSize: 2,
        step: -2,
        direction: -1,
        child: {
          left: [ 3, 2 ],
          middle: null,
          right: [ 2, 1 ],
        },
      },
      {
        pair: [ 2, 0 ],
        iteration: 1,
        currentSize: 2,
        step: -2,
        direction: -1,
        child: {
          left: [ 2, 1 ],
          middle: null,
          right: [ 1, 0 ],
        },
      },
      {
        pair: [ 4, 1 ],
        iteration: 2,
        currentSize: 3,
        step: -3,
        direction: -1,
        child: {
          left: [ 4, 2 ],
          middle: [ 3, 2 ],
          right: [ 3, 1 ],
        },
      },
      {
        pair: [ 3, 0 ],
        iteration: 2,
        currentSize: 3,
        step: -3,
        direction: -1,
        child: {
          left: [ 3, 1 ],
          middle: [ 2, 1 ],
          right: [ 2, 0 ],
        },
      },
      {
        pair: [ 4, 0 ],
        iteration: 3,
        currentSize: 4,
        step: -4,
        direction: -1,
        child: {
          left: [ 4, 1 ],
          middle: [ 3, 1 ],
          right: [ 3, 0 ],
        },
      },
    ];

    let i = 0;
    const memo = slidingWindow((payload, memo) => {
      const expected = EXPECTED[i++];
      expect(payload).to.deep.equal({ ...expected, config });

      return payload.pair.join('-');
    }, config);

    expect(i).to.equal(EXPECTED.length);

    EXPECTED.forEach(({ pair }, i) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });

  it('should handle case where min and max are the same', () => {
    const config = { size: { min: 2, max: 2 }, index: { from: 4, to: 0 } };
    const EXPECTED = [
      {
        pair: [4, 2],
        iteration: 0,
        currentSize: 2,
        step: -1,
        direction: -1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [3, 1],
        iteration: 0,
        currentSize: 2,
        step: -1,
        direction: -1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [2, 0],
        iteration: 0,
        currentSize: 2,
        step: -1,
        direction: -1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
    ];
  
    let i = 0;
    const memo = slidingWindow((payload, memo) => {
      const expected = EXPECTED[i++];
      expect(payload.pair).to.deep.equal(expected.pair);
      return payload.pair.join('-');
    }, config);
  
    expect(i).to.equal(EXPECTED.length);
  
    EXPECTED.forEach(({ pair }) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });

  /**
   * 0-1
   */
  it('should execute single sliding window case as expected.', () => {
    const config = { size: { min: 1, max: 1 }, index: { from: 0, to: 1 } };
    const EXPECTED = [
      {
        pair: [0, 1],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
    ];

    let i = 0;
    const memo = slidingWindow((payload, memo) => {
      const expected = EXPECTED[i++];
      expect(payload).to.deep.equal({ ...expected, config });

      return payload.pair.join('-');
    }, config);
    expect(i).to.equal(EXPECTED.length);

    EXPECTED.forEach(({ pair }, i) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });

  /**
   * No sliding window as from and to are equal
   */
  it('should throw an error for empty range case.', () => {
    const config = { size: { min: 1, max: 1 }, index: { from: 0, to: 0 } };

    expect(() => {
      slidingWindow((payload, memo) => {
        // This handler should never be called since there's no valid range for the sliding window
      }, config);
    }).to.throw(Error, 'Range between index.from and index.to cannot be less than 1.');
  });

  /**
   * 0-4
   */
  it('should execute single full-range sliding window case as expected.', () => {
    const config = { size: { min: 4, max: 4 }, index: { from: 0, to: 4 } };
    const EXPECTED = [
      {
        pair: [0, 4],
        iteration: 0,
        currentSize: 4,
        step: 4,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
    ];

    let i = 0;
    const memo = slidingWindow((payload, memo) => {
      const expected = EXPECTED[i++];
      expect(payload).to.deep.equal({ ...expected, config });

      return payload.pair.join('-');
    }, config);
    expect(i).to.equal(EXPECTED.length);

    EXPECTED.forEach(({ pair }, i) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });

  /**
   * Should generate pairs as expected
   */
  it('should generate pairs as expected.', () => {
    const config = { size: { min: 0, max: 3 }, index: { from: 0, to: 3 } };

    const generator = generatePairs(config);
    const EXPECTED = [
      {
        pair: [0, 0],
        iteration: 0,
        currentSize: 0,
        step: 0,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [1, 1],
        iteration: 0,
        currentSize: 0,
        step: 0,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [2, 2],
        iteration: 0,
        currentSize: 0,
        step: 0,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [3, 3],
        iteration: 0,
        currentSize: 0,
        step: 0,
        direction: 1,
        child: {
          left: null,
          middle: null,
          right: null,
        },
      },
      {
        pair: [0, 1],
        iteration: 1,
        currentSize: 1,
        step: 1,
        direction: 1,
        child: {
          left: [0, 0],
          middle: null,
          right: [1, 1],
        },
      },
      {
        pair: [1, 2],
        iteration: 1,
        currentSize: 1,
        step: 1,
        direction: 1,
        child: {
          left: [1, 1],
          middle: null,
          right: [2, 2],
        },
      },
      {
        pair: [2, 3],
        iteration: 1,
        currentSize: 1,
        step: 1,
        direction: 1,
        child: {
          left: [2, 2],
          middle: null,
          right: [3, 3],
        },
      },
      {
        pair: [0, 2],
        iteration: 2,
        currentSize: 2,
        step: 2,
        direction: 1,
        child: {
          left: [0, 1],
          middle: [1, 1],
          right: [1, 2],
        },
      },
      {
        pair: [1, 3],
        iteration: 2,
        currentSize: 2,
        step: 2,
        direction: 1,
        child: {
          left: [1, 2],
          middle: [2, 2],
          right: [2, 3],
        },
      },
      {
        pair: [0, 3],
        iteration: 3,
        currentSize: 3,
        step: 3,
        direction: 1,
        child: {
          left: [0, 2],
          middle: [1, 2],
          right: [1, 3],
        },
      },
    ];

    for (let i = 0; i < EXPECTED.length; i++) {
      const { value, done } = generator.next();
      expect(done).to.be.false;
      expect(value).to.deep.equal({ ...EXPECTED[i], config });
    }

    const { value, done } = generator.next();
    expect(done).to.be.true;
    expect(value).to.be.undefined;
  });

  it('should handle example: palindromic substrings', () => {
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
  });
});
