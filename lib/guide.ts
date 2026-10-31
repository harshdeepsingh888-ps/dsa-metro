// Study guide content: levels, company-style question sets, the season plan and practice sites.
import type { Company, Level, PlanStep, Problem } from './types';

export const lc = (t: string, s: string, d: string): Problem => ({ key: s, t, d, src: 'LeetCode', url: 'https://leetcode.com/problems/' + s + '/' });
const cf = (c: number, i: string, t: string, r: number): Problem => ({ key: 'cf:' + c + i, t, d: '≈' + r, src: 'Codeforces', url: 'https://codeforces.com/problemset/problem/' + c + '/' + i });
const cses = (id: number, t: string, d: string): Problem => ({ key: 'cses:' + id, t, d, src: 'CSES', url: 'https://cses.fi/problemset/task/' + id });
const acdp = (x: string, t: string): Problem => ({ key: 'ac:dp_' + x, t, d: 'Task ' + x.toUpperCase(), src: 'AtCoder', url: 'https://atcoder.jp/contests/dp/tasks/dp_' + x });

export const LEVELS: Level[] = [
{
  id: 'l1', line: 'yellow', name: 'Beginner', target: 'LeetCode Easy · Codeforces 800–1000', time: '4–6 weeks',
  forWho: 'You can write loops and functions but freeze when you see a new problem. Do this level alongside the Yellow and Blue lines.',
  goal: 'Solve most LeetCode Easy problems in under 20 minutes, and state the time complexity of your own code.',
  ready: 'About 60 problems solved, and you can solve the first one or two problems of a LeetCode weekly contest or a Codeforces Div. 3 round.',
  topics: ['Arrays and prefix sums', 'Strings', 'Hashing (map and set)', 'Two pointers', 'Sorting', 'Binary search', 'Stack and queue', 'Linked lists', 'Recursion', 'Binary tree traversals', 'Big-O of your own code'],
  groups: [
    ['Arrays and two pointers', [lc('Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy'), lc('Remove Duplicates from Sorted Array', 'remove-duplicates-from-sorted-array', 'Easy'), lc('Squares of a Sorted Array', 'squares-of-a-sorted-array', 'Easy'), lc('Majority Element', 'majority-element', 'Easy'), lc('Maximum Subarray', 'maximum-subarray', 'Medium')]],
    ['Strings and hashing', [lc('Longest Common Prefix', 'longest-common-prefix', 'Easy'), lc('First Unique Character in a String', 'first-unique-character-in-a-string', 'Easy'), lc('Intersection of Two Arrays II', 'intersection-of-two-arrays-ii', 'Easy'), lc('Missing Number', 'missing-number', 'Easy'), lc('Single Number', 'single-number', 'Easy')]],
    ['Linked lists and trees', [lc('Remove Linked List Elements', 'remove-linked-list-elements', 'Easy'), lc('Palindrome Linked List', 'palindrome-linked-list', 'Easy'), lc('Same Tree', 'same-tree', 'Easy'), lc('Symmetric Tree', 'symmetric-tree', 'Easy'), lc('Path Sum', 'path-sum', 'Easy'), lc('Diameter of Binary Tree', 'diameter-of-binary-tree', 'Easy'), lc('Search in a Binary Search Tree', 'search-in-a-binary-search-tree', 'Easy')]],
  ],
  extra: [
    ['Codeforces, rating around 800–1000', [cf(4, 'A', 'Watermelon', 800), cf(71, 'A', 'Way Too Long Words', 800), cf(231, 'A', 'Team', 800), cf(158, 'A', 'Next Round', 800), cf(282, 'A', 'Bit++', 800), cf(263, 'A', 'Beautiful Matrix', 800), cf(339, 'A', 'Helpful Maths', 800), cf(1, 'A', 'Theatre Square', 1000)]],
    ['CSES: introductory and sorting', [cses(1068, 'Weird Algorithm', 'Intro'), cses(1083, 'Missing Number', 'Intro'), cses(1069, 'Repetitions', 'Intro'), cses(1094, 'Increasing Array', 'Intro'), cses(1621, 'Distinct Numbers', 'Sorting'), cses(1084, 'Apartments', 'Sorting'), cses(1090, 'Ferris Wheel', 'Sorting'), cses(1646, 'Static Range Sum Queries', 'Range queries')]],
  ],
  milestones: ['Finish the Yellow and Blue lines of the metro', 'Take part in one LeetCode weekly contest (Sunday morning in India)', 'Solve problem A in a Codeforces Div. 3 or Div. 4 round', 'Reach 60 solved problems'],
},
{
  id: 'l2', line: 'blue', name: 'Intermediate', target: 'LeetCode Medium · Codeforces 1200–1400', time: '8–10 weeks',
  forWho: 'You finished the metro, including the Magenta Line, and Easy problems feel routine.',
  goal: 'Solve most LeetCode Medium problems in 30 to 40 minutes, and name the pattern within the first 5 minutes.',
  ready: 'About 150 problems solved in total, 100 of them Mediums. You sometimes solve 3 of 4 in a LeetCode contest, or you reach Pupil (1200) on Codeforces.',
  topics: ['Sliding window', 'Prefix sums with hashing', 'Intervals', 'Heaps', 'Backtracking', 'Binary search on the answer', 'Monotonic stack', 'BST and LCA', 'BFS, DFS, topological sort', 'DP: 1D, 2D, LIS, knapsack, strings', 'Trie', 'Greedy'],
  groups: [
    ['Sliding window', [lc('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium'), lc('Minimum Size Subarray Sum', 'minimum-size-subarray-sum', 'Medium'), lc('Permutation in String', 'permutation-in-string', 'Medium'), lc('Longest Repeating Character Replacement', 'longest-repeating-character-replacement', 'Medium')]],
    ['Prefix sums and hashing', [lc('Subarray Sum Equals K', 'subarray-sum-equals-k', 'Medium'), lc('Product of Array Except Self', 'product-of-array-except-self', 'Medium'), lc('Longest Consecutive Sequence', 'longest-consecutive-sequence', 'Medium'), lc('3Sum', '3sum', 'Medium')]],
    ['Intervals and heaps', [lc('Merge Intervals', 'merge-intervals', 'Medium'), lc('Insert Interval', 'insert-interval', 'Medium'), lc('Non-overlapping Intervals', 'non-overlapping-intervals', 'Medium'), lc('Top K Frequent Elements', 'top-k-frequent-elements', 'Medium'), lc('K Closest Points to Origin', 'k-closest-points-to-origin', 'Medium'), lc('Task Scheduler', 'task-scheduler', 'Medium')]],
    ['Backtracking', [lc('Subsets', 'subsets', 'Medium'), lc('Permutations', 'permutations', 'Medium'), lc('Combination Sum', 'combination-sum', 'Medium'), lc('Word Search', 'word-search', 'Medium')]],
    ['Binary search and stacks', [lc('Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Medium'), lc('Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array', 'Medium'), lc('Capacity To Ship Packages Within D Days', 'capacity-to-ship-packages-within-d-days', 'Medium'), lc('Next Greater Element I', 'next-greater-element-i', 'Easy'), lc('Decode String', 'decode-string', 'Medium')]],
    ['Trees', [lc('Validate Binary Search Tree', 'validate-binary-search-tree', 'Medium'), lc('Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'Medium'), lc('Binary Tree Right Side View', 'binary-tree-right-side-view', 'Medium'), lc('Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst', 'Medium'), lc('Construct Binary Tree from Preorder and Inorder Traversal', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'Medium')]],
    ['Graphs', [lc('Course Schedule', 'course-schedule', 'Medium'), lc('Course Schedule II', 'course-schedule-ii', 'Medium'), lc('Clone Graph', 'clone-graph', 'Medium'), lc('Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow', 'Medium'), lc('Number of Provinces', 'number-of-provinces', 'Medium')]],
    ['Dynamic programming', [lc('Longest Palindromic Substring', 'longest-palindromic-substring', 'Medium'), lc('Jump Game', 'jump-game', 'Medium'), lc('Longest Increasing Subsequence', 'longest-increasing-subsequence', 'Medium'), lc('Word Break', 'word-break', 'Medium'), lc('Decode Ways', 'decode-ways', 'Medium'), lc('Partition Equal Subset Sum', 'partition-equal-subset-sum', 'Medium')]],
    ['Design and linked lists', [lc('LRU Cache', 'lru-cache', 'Medium'), lc('Implement Trie (Prefix Tree)', 'implement-trie-prefix-tree', 'Medium'), lc('Add Two Numbers', 'add-two-numbers', 'Medium'), lc('Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list', 'Medium')]],
  ],
  extra: [
    ['Codeforces, rating around 1200–1500', [cf(474, 'B', 'Worms', 1200), cf(327, 'A', 'Flipping Game', 1200), cf(189, 'A', 'Cut Ribbon', 1300), cf(279, 'B', 'Books', 1400), cf(520, 'B', 'Two Buttons', 1400), cf(1195, 'C', 'Basketball Exercise', 1400), cf(455, 'A', 'Boredom', 1500), cf(580, 'C', 'Kefa and Park', 1500)]],
    ['CSES: DP, graphs, searching', [cses(1633, 'Dice Combinations', 'DP'), cses(1634, 'Minimizing Coins', 'DP'), cses(1635, 'Coin Combinations I', 'DP'), cses(1638, 'Grid Paths', 'DP'), cses(1158, 'Book Shop', 'DP'), cses(1192, 'Counting Rooms', 'Graphs'), cses(1193, 'Labyrinth', 'Graphs'), cses(1666, 'Building Roads', 'Graphs'), cses(1667, 'Message Route', 'Graphs'), cses(1640, 'Sum of Two Values', 'Searching'), cses(1643, 'Maximum Subarray Sum', 'Searching'), cses(1674, 'Subordinates', 'Trees')]],
    ['AtCoder Educational DP Contest, first half', [acdp('a', 'Frog 1'), acdp('b', 'Frog 2'), acdp('c', 'Vacation'), acdp('d', 'Knapsack 1'), acdp('f', 'LCS'), acdp('h', 'Grid 1')]],
  ],
  milestones: ['Finish all 18 metro stations', 'Solve 3 of 4 problems in a LeetCode contest', 'Reach Pupil (1200) on Codeforces', 'Explain a Medium solution out loud to a friend in under 5 minutes'],
},
{
  id: 'l3', line: 'red', name: 'Advanced', target: 'LeetCode Hard · Codeforces 1600+', time: '10–12 weeks, then ongoing',
  forWho: 'Mediums feel routine, and you are aiming at Google, top product companies, quant firms or competitive programming.',
  goal: 'Solve Hard problems in about 45 minutes while explaining your reasoning, and handle follow-ups that change the constraints.',
  ready: 'Most Mediums take you under 25 minutes, you can explain Hard solutions clearly, and you are around Specialist (1400) to Expert (1600) on Codeforces.',
  topics: ['Dijkstra and 0-1 BFS', 'Union-Find (DSU)', 'Minimum spanning tree', 'Bridges and articulation points', 'Segment tree and Fenwick tree', 'Interval DP', 'Bitmask DP', 'DP on trees', 'DP with binary search', 'Monotonic deque', 'KMP, Z-function, hashing', 'Modular arithmetic and combinatorics', 'Proving a greedy is correct'],
  groups: [
    ['Graphs', [lc('Network Delay Time', 'network-delay-time', 'Medium'), lc('Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops', 'Medium'), lc('Min Cost to Connect All Points', 'min-cost-to-connect-all-points', 'Medium'), lc('Redundant Connection', 'redundant-connection', 'Medium'), lc('Accounts Merge', 'accounts-merge', 'Medium'), lc('Word Ladder', 'word-ladder', 'Hard'), lc('Swim in Rising Water', 'swim-in-rising-water', 'Hard'), lc('Critical Connections in a Network', 'critical-connections-in-a-network', 'Hard')]],
    ['Advanced DP', [lc('Best Time to Buy and Sell Stock with Cooldown', 'best-time-to-buy-and-sell-stock-with-cooldown', 'Medium'), lc('House Robber III', 'house-robber-iii', 'Medium'), lc('Partition to K Equal Sum Subsets', 'partition-to-k-equal-sum-subsets', 'Medium'), lc('Burst Balloons', 'burst-balloons', 'Hard'), lc('Longest Increasing Path in a Matrix', 'longest-increasing-path-in-a-matrix', 'Hard'), lc('Distinct Subsequences', 'distinct-subsequences', 'Hard'), lc('Regular Expression Matching', 'regular-expression-matching', 'Hard'), lc('Maximum Profit in Job Scheduling', 'maximum-profit-in-job-scheduling', 'Hard'), lc('Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum', 'Hard'), lc('Shortest Path Visiting All Nodes', 'shortest-path-visiting-all-nodes', 'Hard')]],
    ['Classic Hards', [lc('Trapping Rain Water', 'trapping-rain-water', 'Hard'), lc('Minimum Window Substring', 'minimum-window-substring', 'Hard'), lc('Sliding Window Maximum', 'sliding-window-maximum', 'Hard'), lc('Largest Rectangle in Histogram', 'largest-rectangle-in-histogram', 'Hard'), lc('Merge k Sorted Lists', 'merge-k-sorted-lists', 'Hard'), lc('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Hard'), lc('Split Array Largest Sum', 'split-array-largest-sum', 'Hard'), lc('Serialize and Deserialize Binary Tree', 'serialize-and-deserialize-binary-tree', 'Hard'), lc('Word Search II', 'word-search-ii', 'Hard'), lc('Find Median from Data Stream', 'find-median-from-data-stream', 'Hard')]],
    ['Range queries', [lc('Range Sum Query - Mutable', 'range-sum-query-mutable', 'Medium'), lc('Count of Smaller Numbers After Self', 'count-of-smaller-numbers-after-self', 'Hard')]],
  ],
  extra: [
    ['Codeforces, rating around 1500–1900', [cf(166, 'E', 'Tetrahedron', 1500), cf(474, 'D', 'Flowers', 1700), cf(466, 'C', 'Number of Ways', 1700), cf(339, 'D', 'Xenia and Bit Operations', 1700), cf(20, 'C', 'Dijkstra?', 1900), cf(25, 'D', 'Roads not only in Berland', 1900)]],
    ['CSES: harder DP, graphs, range queries', [cses(1639, 'Edit Distance', 'DP'), cses(1744, 'Rectangle Cutting', 'DP'), cses(1745, 'Money Sums', 'DP'), cses(1145, 'Increasing Subsequence', 'DP'), cses(1671, 'Shortest Routes I', 'Graphs'), cses(1131, 'Tree Diameter', 'Trees'), cses(1648, 'Dynamic Range Sum Queries', 'Range queries'), cses(1649, 'Dynamic Range Minimum Queries', 'Range queries')]],
    ['AtCoder Educational DP Contest, second half', [acdp('e', 'Knapsack 2'), acdp('g', 'Longest Path'), acdp('i', 'Coins'), acdp('l', 'Deque'), acdp('n', 'Slimes'), acdp('o', 'Matching'), acdp('p', 'Independent Set')]],
  ],
  milestones: ['Reach Specialist (1400) on Codeforces', 'Solve all 4 problems in a LeetCode contest', 'Finish the AtCoder DP contest up to task P', 'Do 5 mock interviews with a friend: 45 minutes each, thinking out loud'],
},
];

export const COMPANIES: Company[] = [
{
  id: 'google', name: 'Google', level: 'l3', diff: 'Mostly Medium and Hard',
  rounds: 'For campus hiring, usually an online assessment with two problems, then three or four 45-minute technical interviews with one or two problems each, often typed in a shared doc without autocomplete. There is also a behavioural round on how you work with people. Interviewers push follow-ups: a bigger input, a new constraint, a faster solution.',
  focus: ['Graphs', 'DP', 'Greedy', 'Binary search on the answer', 'Clean, tested code', 'Thinking out loud'],
  probs: [lc('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium'), lc('Merge Intervals', 'merge-intervals', 'Medium'), lc('Number of Islands', 'number-of-islands', 'Medium'), lc('Course Schedule', 'course-schedule', 'Medium'), lc('Decode String', 'decode-string', 'Medium'), lc('Evaluate Division', 'evaluate-division', 'Medium'), lc('Snapshot Array', 'snapshot-array', 'Medium'), lc('Stock Price Fluctuation', 'stock-price-fluctuation', 'Medium'), lc('Trapping Rain Water', 'trapping-rain-water', 'Hard'), lc('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Hard'), lc('Word Ladder', 'word-ladder', 'Hard'), lc('Minimum Window Substring', 'minimum-window-substring', 'Hard'), lc('Longest Increasing Path in a Matrix', 'longest-increasing-path-in-a-matrix', 'Hard'), lc('Split Array Largest Sum', 'split-array-largest-sum', 'Hard'), lc('Student Attendance Record II', 'student-attendance-record-ii', 'Hard'), lc('Find Median from Data Stream', 'find-median-from-data-stream', 'Hard')],
},
{
  id: 'amazon', name: 'Amazon', level: 'l2', diff: 'Mostly Medium',
  rounds: 'An online assessment with two coding problems, usually alongside a work-style survey, then two or three interviews with one or two Medium problems each. Every round also asks Leadership Principles questions such as "Tell me about a time you disagreed with your team", so prepare 6 to 8 short stories from your projects.',
  focus: ['Arrays and strings', 'Trees', 'BFS on grids', 'Heaps', 'LRU-style design', 'Leadership Principles stories'],
  probs: [lc('Two Sum', 'two-sum', 'Easy'), lc('Group Anagrams', 'group-anagrams', 'Medium'), lc('Number of Islands', 'number-of-islands', 'Medium'), lc('Rotting Oranges', 'rotting-oranges', 'Medium'), lc('LRU Cache', 'lru-cache', 'Medium'), lc('Top K Frequent Words', 'top-k-frequent-words', 'Medium'), lc('K Closest Points to Origin', 'k-closest-points-to-origin', 'Medium'), lc('Copy List with Random Pointer', 'copy-list-with-random-pointer', 'Medium'), lc('Course Schedule', 'course-schedule', 'Medium'), lc('Word Break', 'word-break', 'Medium'), lc('Reorganize String', 'reorganize-string', 'Medium'), lc('Merge k Sorted Lists', 'merge-k-sorted-lists', 'Hard'), lc('Trapping Rain Water', 'trapping-rain-water', 'Hard'), lc('Find Median from Data Stream', 'find-median-from-data-stream', 'Hard')],
},
{
  id: 'microsoft', name: 'Microsoft', level: 'l2', diff: 'Mostly Medium',
  rounds: 'An online assessment with two or three problems, then three or four interviews that mix Medium DSA problems with CS fundamentals (OOP, operating systems, DBMS) and questions about your projects. The last round is often with a senior manager.',
  focus: ['Linked lists', 'Trees', 'Strings', 'Matrices', 'DP', 'OOP and CS basics'],
  probs: [lc('Reverse Linked List', 'reverse-linked-list', 'Easy'), lc('Add Two Numbers', 'add-two-numbers', 'Medium'), lc('String to Integer (atoi)', 'string-to-integer-atoi', 'Medium'), lc('Spiral Matrix', 'spiral-matrix', 'Medium'), lc('Rotate Image', 'rotate-image', 'Medium'), lc('Set Matrix Zeroes', 'set-matrix-zeroes', 'Medium'), lc('Longest Palindromic Substring', 'longest-palindromic-substring', 'Medium'), lc('Validate Binary Search Tree', 'validate-binary-search-tree', 'Medium'), lc('Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'Medium'), lc('Merge Intervals', 'merge-intervals', 'Medium'), lc('LRU Cache', 'lru-cache', 'Medium'), lc('Serialize and Deserialize Binary Tree', 'serialize-and-deserialize-binary-tree', 'Hard')],
},
{
  id: 'meta', name: 'Meta', level: 'l2', diff: 'Medium, solved fast',
  rounds: 'Coding rounds usually have two problems in 45 minutes, so speed and bug-free code matter more than at most companies. There is also a behavioural round. Most problems are Mediums that reward knowing the common patterns cold.',
  focus: ['Arrays and strings', 'Trees', 'Graphs', 'Recursion', 'Speed'],
  probs: [lc('Valid Palindrome II', 'valid-palindrome-ii', 'Easy'), lc('Range Sum of BST', 'range-sum-of-bst', 'Easy'), lc('Minimum Remove to Make Valid Parentheses', 'minimum-remove-to-make-valid-parentheses', 'Medium'), lc('Binary Tree Right Side View', 'binary-tree-right-side-view', 'Medium'), lc('Subarray Sum Equals K', 'subarray-sum-equals-k', 'Medium'), lc('Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'Medium'), lc('Random Pick with Weight', 'random-pick-with-weight', 'Medium'), lc('Basic Calculator II', 'basic-calculator-ii', 'Medium'), lc('Merge Intervals', 'merge-intervals', 'Medium'), lc('Clone Graph', 'clone-graph', 'Medium'), lc('Accounts Merge', 'accounts-merge', 'Medium'), lc('Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'Medium')],
},
{
  id: 'india-product', name: 'Product companies in India', sub: 'Flipkart, Swiggy, Zomato, PhonePe, Razorpay and similar', level: 'l2', diff: 'Medium, some Hard', listTitle: 'Problems in the style of these rounds',
  rounds: 'Usually an online assessment with two or three Medium to Hard problems, then two or three DSA interviews. Some companies, Flipkart among them, also run a machine-coding round where you build a small working system (a parking lot, an expense-splitting app) with clean classes in 90 to 120 minutes.',
  focus: ['Arrays and DP', 'Graphs', 'Greedy', 'Binary search on the answer', 'Low-level design (classes, interfaces)'],
  probs: [lc('Daily Temperatures', 'daily-temperatures', 'Medium'), lc('Koko Eating Bananas', 'koko-eating-bananas', 'Medium'), lc('Rotting Oranges', 'rotting-oranges', 'Medium'), lc('Snakes and Ladders', 'snakes-and-ladders', 'Medium'), lc('Jump Game II', 'jump-game-ii', 'Medium'), lc('Longest Palindromic Substring', 'longest-palindromic-substring', 'Medium'), lc('Top K Frequent Elements', 'top-k-frequent-elements', 'Medium'), lc('Coin Change', 'coin-change', 'Medium'), lc('Minimum Path Sum', 'minimum-path-sum', 'Medium'), lc('Insert Delete GetRandom O(1)', 'insert-delete-getrandom-o1', 'Medium'), lc('Design Underground System', 'design-underground-system', 'Medium'), lc('Edit Distance', 'edit-distance', 'Medium')],
},
{
  id: 'quant', name: 'Quant and finance', sub: 'Goldman Sachs, Morgan Stanley, D. E. Shaw, Tower Research and similar', level: 'l3', diff: 'Medium and Hard, plus maths',
  rounds: 'A harder online test that mixes coding with maths, probability and sometimes CS multiple-choice questions, then interviews with DSA problems, puzzles and probability questions. High-frequency trading firms also go deep on C++, memory and operating systems.',
  focus: ['DP', 'Maths and number theory', 'Probability puzzles', 'Greedy', 'Bit manipulation', 'C++ depth'],
  probs: [lc('First Unique Character in a String', 'first-unique-character-in-a-string', 'Easy'), lc('Find the Duplicate Number', 'find-the-duplicate-number', 'Medium'), lc('Fraction to Recurring Decimal', 'fraction-to-recurring-decimal', 'Medium'), lc('Robot Bounded In Circle', 'robot-bounded-in-circle', 'Medium'), lc('Minimum Path Sum', 'minimum-path-sum', 'Medium'), lc('Count Primes', 'count-primes', 'Medium'), lc('Pow(x, n)', 'powx-n', 'Medium'), lc('Longest Palindromic Substring', 'longest-palindromic-substring', 'Medium'), lc('Trapping Rain Water', 'trapping-rain-water', 'Hard'), lc('Sliding Window Maximum', 'sliding-window-maximum', 'Hard'), lc('Best Time to Buy and Sell Stock IV', 'best-time-to-buy-and-sell-stock-iv', 'Hard'), lc('Maximum Profit in Job Scheduling', 'maximum-profit-in-job-scheduling', 'Hard')],
},
{
  id: 'service', name: 'Service companies', sub: 'TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini', level: 'l1', diff: 'Easy for regular roles, Medium for the higher-paying tracks', listTitle: 'Problems in the style of these rounds',
  rounds: 'An online test with aptitude, logical reasoning and English, plus one or two coding problems (TCS NQT is a well-known example). Then a technical interview on your projects, OOP, DBMS and simple programs, and an HR round. Higher-paying tracks such as TCS Digital and Prime or Infosys Specialist Programmer have noticeably harder coding.',
  focus: ['Arrays and strings', 'Number programs (primes, palindromes)', 'Loops and patterns', 'OOP basics', 'SQL basics', 'Aptitude'],
  probs: [lc('Fizz Buzz', 'fizz-buzz', 'Easy'), lc('Palindrome Number', 'palindrome-number', 'Easy'), lc('Roman to Integer', 'roman-to-integer', 'Easy'), lc('Plus One', 'plus-one', 'Easy'), lc('Length of Last Word', 'length-of-last-word', 'Easy'), lc('Move Zeroes', 'move-zeroes', 'Easy'), lc('Valid Anagram', 'valid-anagram', 'Easy'), lc('Remove Duplicates from Sorted Array', 'remove-duplicates-from-sorted-array', 'Easy'), lc('Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy'), lc('Reverse Integer', 'reverse-integer', 'Medium'), lc('Maximum Subarray', 'maximum-subarray', 'Medium'), lc('Count Primes', 'count-primes', 'Medium')],
},
];
export const DISCLAIM = 'These lists come from interview experiences that candidates share publicly, and formats change every year. Treat them as practice in each company\'s style, not as guaranteed questions. Before a real interview, read that company\'s experiences from the last six months on LeetCode Discuss and GeeksforGeeks.';

export const PLAN: PlanStep[] = [
  { line: 'yellow', when: 'Now to end of December 2026 · about 8 weeks', title: 'The metro, then Level 1', text: 'One station a day finishes the metro in under three weeks. Then work through the Level 1 list. Start the Sunday LeetCode contest now, even if you solve only one problem.' },
  { line: 'blue', when: 'January to March 2027 · 12 weeks', title: 'Level 2: the Medium patterns', text: 'Two or three problems a day during classes, one pattern a week. One contest every weekend, then solve the problems you missed. Target: about 150 problems and Pupil on Codeforces.' },
  { line: 'red', when: 'April to June 2027 · 12 weeks', title: 'Level 3 and company sets', text: 'The summer break is your biggest block of time. Do the Level 3 topics your target companies need, then their company sets. Two mock interviews a week with a friend. Revise OOP, DBMS, OS and your projects for interviews.' },
  { line: 'magenta', when: 'July 2027 onwards', title: 'Placement season', text: 'Two revision problems and one new problem a day. Before each company\'s test, read its interview experiences from the last six months. Keep one contest a week to stay quick.' },
];
export const RHYTHM: [string, string][] = [
  ['Monday to Friday', 'One pattern for the week. 60 to 90 minutes a day: one or two new problems plus one from your revision list.'],
  ['Saturday', 'A Codeforces or AtCoder contest. If none fits, do a virtual contest from the archive with a timer.'],
  ['Sunday', 'The LeetCode weekly contest in the morning, then solve the problem you couldn\'t finish.'],
];
export const HABITS: [string, string][] = [
  ['Time-box your thinking', '20 minutes for an Easy, 40 for a Medium. Still stuck? Take one hint, give it 10 more minutes, then read the editorial.'],
  ['Close the editorial and code it', 'Reading a solution is not solving it. Close the tab and write it from memory. If you can\'t, you haven\'t got it yet.'],
  ['Revise on a schedule', 'Re-solve each problem after 3 days, 7 days and 30 days. The revision list on this page tracks that for you.'],
  ['Write the pattern, not the code', 'Keep a notebook: problem name, the one-line idea, and the mistake you made. Read it before contests and interviews.'],
  ['Upsolve every contest', 'After a contest, solve the first problem you couldn\'t do. That one teaches more than all the ones you could.'],
  ['Say it out loud', 'Interviews grade your explanation too. Explain the approach and its complexity before you code, even when you practise alone.'],
];
export const RESOURCES: [string, string, string, string][] = [
  ['LeetCode', 'https://leetcode.com/problemset/', 'Interview-style problems, weekly and biweekly contests, and study plans such as LeetCode 75 and Top Interview 150.', 'All levels'],
  ['Codeforces', 'https://codeforces.com/problemset', 'Contests several times a week and a problem set you can filter by rating. Builds speed and problem-solving faster than anything else.', 'Levels 1–3'],
  ['Codeforces EDU', 'https://codeforces.com/edu/courses', 'Free courses with practice on binary search, two pointers, DSU and segment trees.', 'Levels 2–3'],
  ['CSES Problem Set', 'https://cses.fi/problemset/', '300 classic problems grouped by topic. The DP, graph and range query sections are excellent.', 'Levels 1–3'],
  ['AtCoder', 'https://atcoder.jp/', 'Beginner Contests on most Saturdays with clean, well-tested problems, and the Educational DP Contest: 26 DP problems from easy to hard.', 'Levels 1–3'],
  ['Striver\'s A2Z DSA Sheet', 'https://takeuforward.org/', 'A step-by-step beginner-to-advanced sheet that is popular in India, with video explanations.', 'Levels 1–3'],
  ['NeetCode 150', 'https://neetcode.io/practice', 'A short interview list grouped by pattern, with a video solution for each problem.', 'Level 2'],
  ['Grind 75', 'https://www.techinterviewhandbook.org/grind75', 'A week-by-week interview plan you can resize to the hours you have.', 'Level 2'],
  ['GeeksforGeeks', 'https://www.geeksforgeeks.org/', 'Topic articles, and thousands of shared interview experiences sorted by company.', 'All levels'],
  ['cp-algorithms', 'https://cp-algorithms.com/', 'Clear write-ups of advanced algorithms: segment trees, KMP, flows, number theory.', 'Level 3'],
  ['USACO Guide', 'https://usaco.guide/', 'A structured competitive programming course from Bronze to Platinum, with problems for every topic.', 'Levels 2–3'],
];
