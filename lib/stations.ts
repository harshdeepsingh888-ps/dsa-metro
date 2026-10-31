// Station content: the 18 lessons on the four metro lines.
import type { LineId, MapPos, Station } from './types';

export const LINES: Record<LineId, { name: string; about: string; code: string }> = {
  yellow: { name: 'Yellow Line', about: 'Foundations', code: 'Y' },
  blue: { name: 'Blue Line', about: 'Searching, sorting and core structures', code: 'B' },
  red: { name: 'Red Line', about: 'Trees and graphs', code: 'R' },
  magenta: { name: 'Magenta Line', about: 'Dynamic programming', code: 'M' },
};

export const STATIONS: Station[] = [
{
  id: 'big-o', line: 'yellow', name: 'Big-O', short: 'Big-O', mins: 20,
  story: 'Your code passes the sample tests. You hit Submit. Test case 14: Time Limit Exceeded. Big-O is how you see that coming before you submit.',
  idea: `<p>Big-O describes how the number of steps grows as the input size <code>n</code> grows. Constants don't matter: <code>3n + 5</code> steps is just <strong>O(n)</strong>.</p>
<ul><li><strong>One loop over n</strong> is O(n).</li><li><strong>A loop inside a loop</strong> is O(n²).</li><li><strong>The problem halves every step</strong>: O(log n).</li><li><strong>Trying every subset</strong>: O(2ⁿ).</li></ul>
<p>The rule that matters in coding rounds: an online judge runs about <strong>10⁸ simple operations per second</strong>. Read the limit on n first, then choose an approach that fits:</p>
<div class="tbl-scroll"><table class="tbl"><thead><tr><th>n up to</th><th>Aim for</th><th>Typical idea</th></tr></thead><tbody>
<tr><td class="num">10</td><td class="num">O(n!)</td><td>Try every order</td></tr>
<tr><td class="num">20</td><td class="num">O(2ⁿ)</td><td>Try every subset</td></tr>
<tr><td class="num">500</td><td class="num">O(n³)</td><td>Three nested loops</td></tr>
<tr><td class="num">5,000</td><td class="num">O(n²)</td><td>Every pair</td></tr>
<tr><td class="num">10⁶</td><td class="num">O(n log n)</td><td>Sort, then scan</td></tr>
<tr><td class="num">10⁸</td><td class="num">O(n)</td><td>One pass</td></tr>
<tr><td class="num">bigger</td><td class="num">O(log n)</td><td>Binary search, maths</td></tr>
</tbody></table></div>
<p>Drag the slider below to n = 10⁵ and watch O(n²) go red.</p>`,
  vizTitle: 'Will it pass in 1 second?', viz: 'bigO',
  code: {
    cpp: `// O(1): one step, no matter how big n is
int first = a[0];

// O(n): visit every element once
long long total = 0;
for (int i = 0; i < n; i++) total += a[i];

// O(n^2): check every pair (i, j)
int pairs = 0;
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (a[i] + a[j] == k) pairs++;

// O(log n): the range halves every step
int steps = 0;
for (int m = n; m > 1; m /= 2) steps++;`,
    py: `# O(1): one step, no matter how big n is
first = a[0]

# O(n): visit every element once
total = 0
for x in a:
    total += x

# O(n^2): check every pair (i, j)
pairs = 0
for i in range(n):
    for j in range(i + 1, n):
        if a[i] + a[j] == k:
            pairs += 1

# O(log n): the range halves every step
steps, m = 0, n
while m > 1:
    m //= 2
    steps += 1`,
  },
  quiz: [
    { q: 'The constraints say n ≤ 10⁵. Is an O(n²) solution safe with a 1-second limit?', opts: ['Yes, computers are fast', 'No, that is about 10¹⁰ operations', 'Only in C++'], a: 1, why: '10⁵ × 10⁵ = 10¹⁰. At about 10⁸ operations per second that is roughly 100 seconds. Even C++ can\'t save it.' },
    { q: 'What is the complexity of: for i in 0..n, for j in 0..10, do work()?', opts: ['O(n²)', 'O(n)', 'O(10n²)', 'O(log n)'], a: 1, why: 'The inner loop always runs 10 times, which is a constant. 10 × n is still O(n).' },
    { q: 'A loop starts at i = 1 and doubles i each time until it passes n. How many times does it run?', opts: ['O(n)', 'O(n / 2)', 'O(log n)', 'O(√n)'], a: 2, why: '1, 2, 4, 8 … reaches n after about log₂ n doublings. For n = 10⁶ that is only 20 steps.' },
  ],
  practice: [
    { t: 'Running Sum of 1d Array', s: 'running-sum-of-1d-array', d: 'Easy' },
    { t: 'Richest Customer Wealth', s: 'richest-customer-wealth', d: 'Easy' },
  ],
},
{
  id: 'two-pointers', line: 'yellow', name: 'Arrays & Two Pointers', short: 'Two Pointers', mins: 25,
  story: 'You have a gift card worth exactly ₹25 and a price list sorted from cheapest to costliest. Find two items that use up the card. Checking every pair works, but there is a trick that walks the list only once.',
  idea: `<p>An <strong>array</strong> stores items side by side in memory, so reading <code>a[i]</code> is instant: O(1). Most interview problems start with an array.</p>
<p>Brute force for "find two numbers that add up to the target" checks every pair: O(n²). If the array is <strong>sorted</strong>, use two pointers instead:</p>
<ul><li>Put <code>L</code> at the start and <code>R</code> at the end.</li><li>If <code>a[L] + a[R]</code> is too small, move <code>L</code> right to get a bigger number.</li><li>If it is too big, move <code>R</code> left to get a smaller one.</li><li>Every step rules out one element for good, so the whole search is O(n).</li></ul>
<p>The same idea checks palindromes (compare both ends), reverses arrays in place, and solves "Container With Most Water".</p>`,
  vizTitle: 'Two pointers closing in', viz: 'twoPointers',
  code: {
    cpp: `// a is sorted. Returns the indexes of two values that add up to target.
pair<int, int> twoSumSorted(vector<int>& a, int target) {
    int L = 0, R = a.size() - 1;
    while (L < R) {
        int sum = a[L] + a[R];
        if (sum == target) return {L, R};
        if (sum < target) L++;   // need bigger: move L right
        else R--;                // need smaller: move R left
    }
    return {-1, -1};             // no pair found
}`,
    py: `# a is sorted. Returns the indexes of two values that add up to target.
def two_sum_sorted(a, target):
    L, R = 0, len(a) - 1
    while L < R:
        s = a[L] + a[R]
        if s == target:
            return L, R
        if s < target:
            L += 1      # need bigger: move L right
        else:
            R -= 1      # need smaller: move R left
    return -1, -1       # no pair found`,
  },
  quiz: [
    { q: 'Why does the two-pointer trick need a sorted array?', opts: ['So the code looks clean', 'So moving a pointer reliably makes the sum bigger or smaller', 'Because arrays must always be sorted'], a: 1, why: 'In a sorted array, moving L right can only increase a[L], and moving R left can only decrease a[R]. That is what lets you throw elements away safely.' },
    { q: 'a[L] + a[R] is bigger than the target. What do you do?', opts: ['Move L right', 'Move R left', 'Move both'], a: 1, why: 'You need a smaller sum, and the only way to get a smaller number is to move R to the left.' },
    { q: 'Time complexity of the two-pointer pair search?', opts: ['O(n²)', 'O(n log n)', 'O(n)'], a: 2, why: 'Each step moves one pointer inward, and together they can move at most n times.' },
  ],
  practice: [
    { t: 'Valid Palindrome', s: 'valid-palindrome', d: 'Easy' },
    { t: 'Move Zeroes', s: 'move-zeroes', d: 'Easy' },
    { t: 'Two Sum II - Input Array Is Sorted', s: 'two-sum-ii-input-array-is-sorted', d: 'Medium' },
    { t: 'Container With Most Water', s: 'container-with-most-water', d: 'Medium' },
  ],
},
{
  id: 'recursion', line: 'yellow', name: 'Recursion', short: 'Recursion', mins: 30,
  story: 'You are in a long queue at the railway ticket counter and want to know your position. You ask the person ahead. They ask the person ahead of them, and so on, until the person at the front says "I\'m 1". The answers travel back down the line, each person adding 1.',
  idea: `<p>A <strong>recursive</strong> function solves a problem by calling itself on a smaller version of the same problem. Every recursive function has two parts:</p>
<ul><li><strong>Base case</strong>: the smallest input, answered directly. This is where it stops.</li><li><strong>Recursive case</strong>: shrink the problem, call yourself, and use the answer.</li></ul>
<p>Each call waits on the <strong>call stack</strong> until the smaller call returns. Forget the base case and the stack keeps growing until the program crashes with a stack overflow.</p>
<p>The trick that makes recursion easy: <strong>trust the smaller call</strong>. When writing <code>fact(n)</code>, assume <code>fact(n - 1)</code> already works and only think about the last step.</p>
<p class="note">This is an interchange station. Dynamic programming is recursion that remembers the answers it already worked out, so you will meet this idea again on the Magenta Line.</p>`,
  vizTitle: 'The call stack, frame by frame', viz: 'recursion',
  code: {
    cpp: `long long fact(int n) {
    if (n <= 1) return 1;        // base case: stop here
    return n * fact(n - 1);      // trust the smaller call
}

// x^n in O(log n): halve the problem on every call
long long power(long long x, int n) {
    if (n == 0) return 1;
    long long half = power(x, n / 2);
    return (n % 2 == 0) ? half * half : half * half * x;
}`,
    py: `def fact(n):
    if n <= 1:                  # base case: stop here
        return 1
    return n * fact(n - 1)      # trust the smaller call

# x^n in O(log n): halve the problem on every call
def power(x, n):
    if n == 0:
        return 1
    half = power(x, n // 2)
    return half * half if n % 2 == 0 else half * half * x`,
  },
  quiz: [
    { q: 'What happens if a recursive function has no base case?', opts: ['It returns 0', 'It keeps calling itself until the stack overflows', 'The compiler adds one for you'], a: 1, why: 'Each call makes another call, the stack grows with every one, and eventually the program crashes.' },
    { q: 'How many calls does fact(4) make in total, counting itself?', opts: ['1', '4', '16'], a: 1, why: 'fact(4) → fact(3) → fact(2) → fact(1). Four calls, and the stack is four frames deep at its peak.' },
    { q: 'power(x, n) calls power(x, n / 2) once per call. What is its complexity?', opts: ['O(n)', 'O(log n)', 'O(n²)'], a: 1, why: 'n halves on every call, so it takes about log₂ n calls. That is how you compute x to the power 10⁹ in about 30 steps.' },
  ],
  practice: [
    { t: 'Reverse String', s: 'reverse-string', d: 'Easy' },
    { t: 'Power of Two', s: 'power-of-two', d: 'Easy' },
    { t: 'Pow(x, n)', s: 'powx-n', d: 'Medium' },
  ],
},
{
  id: 'binary-search', line: 'blue', name: 'Binary Search', short: 'Binary Search', mins: 25,
  story: 'A friend thinks of a number from 1 to 1000. You guess, they say "higher" or "lower". Guess randomly and it can take hundreds of tries. Always guess the middle and you never need more than 10.',
  idea: `<p><strong>Binary search</strong> finds something in sorted data by checking the middle and throwing away the half that can't contain the answer.</p>
<ul><li>Each step halves what is left: 1000 → 500 → 250 → … → 1 in about 10 steps. That is O(log n).</li><li>It needs <strong>sorted data</strong>, or more generally a yes/no question whose answers go no, no, no, yes, yes, yes. Then you binary search for the first yes. That second form is how problems like "Koko Eating Bananas" are solved.</li><li>Write <code>mid = lo + (hi - lo) / 2</code>. The simpler <code>(lo + hi) / 2</code> can overflow when lo and hi are huge.</li></ul>
<p>Off-by-one mistakes are the main danger. Pick one style (<code>while (lo &lt;= hi)</code> with <code>lo = mid + 1</code> and <code>hi = mid - 1</code>) and always use it.</p>`,
  vizTitle: 'Guess the number', viz: 'guess',
  code: {
    cpp: `int binarySearch(vector<int>& a, int target) {
    int lo = 0, hi = a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;      // avoids overflow
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1; // answer is on the right
        else hi = mid - 1;                 // answer is on the left
    }
    return -1;                             // not found
}`,
    py: `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2           # Python ints never overflow
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1               # answer is on the right
        else:
            hi = mid - 1               # answer is on the left
    return -1                          # not found`,
  },
  quiz: [
    { q: 'At most how many guesses does binary search need for numbers 1 to 1,000,000?', opts: ['About 20', 'About 1,000', 'About 5,00,000'], a: 0, why: '2²⁰ is about a million, so 20 halvings bring a million numbers down to one.' },
    { q: 'Which of these can you binary search directly?', opts: ['An unsorted list of marks', 'A sorted list of roll numbers', 'A random linked list'], a: 1, why: 'Binary search needs sorted data, plus fast access to the middle, which arrays give you.' },
    { q: 'Why write lo + (hi - lo) / 2 instead of (lo + hi) / 2 in C++?', opts: ['It is faster', 'lo + hi can overflow an int', 'It rounds up'], a: 1, why: 'If lo and hi are both near 2 × 10⁹, their sum overflows a 32-bit int. The subtraction form stays in range.' },
  ],
  practice: [
    { t: 'Binary Search', s: 'binary-search', d: 'Easy' },
    { t: 'Search Insert Position', s: 'search-insert-position', d: 'Easy' },
    { t: 'First Bad Version', s: 'first-bad-version', d: 'Easy' },
    { t: 'Koko Eating Bananas', s: 'koko-eating-bananas', d: 'Medium' },
  ],
},
{
  id: 'sorting', line: 'blue', name: 'Sorting', short: 'Sorting', mins: 30,
  story: 'Your professor hands you 30 answer sheets to arrange by roll number. Swapping neighbours until nothing is out of order works, slowly. Splitting the pile, sorting each half, and merging them is how you would do it with 3,000 sheets.',
  idea: `<p>Two sorts worth knowing by heart:</p>
<ul><li><strong>Bubble sort</strong>: walk the array, swap neighbours that are out of order, repeat. Simple, and O(n²).</li><li><strong>Merge sort</strong>: split the array in half, sort each half (recursion again), then merge the two sorted halves in one pass. O(n log n).</li></ul>
<p>Why n log n? The array can only be halved about log n times, and each level of halving does O(n) merge work.</p>
<p>In real code, use the built-in sort: <code>sort(a.begin(), a.end())</code> in C++ or <code>a.sort()</code> in Python, both O(n log n). Learn merge sort anyway. The merge step shows up on its own in many problems, and "sort first, then use two pointers" is one of the most common patterns there is.</p>`,
  vizTitle: 'Sorting race: bubble vs merge', viz: 'sortRace',
  code: {
    cpp: `void mergeSort(vector<int>& a, int lo, int hi) {   // sorts a[lo..hi]
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    mergeSort(a, lo, mid);
    mergeSort(a, mid + 1, hi);
    vector<int> tmp;                     // merge the two sorted halves
    int i = lo, j = mid + 1;
    while (i <= mid && j <= hi)
        tmp.push_back(a[i] <= a[j] ? a[i++] : a[j++]);
    while (i <= mid) tmp.push_back(a[i++]);
    while (j <= hi) tmp.push_back(a[j++]);
    for (int k = 0; k < (int)tmp.size(); k++) a[lo + k] = tmp[k];
}
// In contests just write: sort(a.begin(), a.end());`,
    py: `def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):   # merge the two sorted halves
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]
# In practice just write: a.sort() or sorted(a)`,
  },
  quiz: [
    { q: 'Merge sort runs in…', opts: ['O(n)', 'O(n log n)', 'O(n²)'], a: 1, why: 'About log n levels of splitting, with O(n) merge work at each level.' },
    { q: 'Merging two sorted arrays of sizes n and m takes…', opts: ['O(n + m)', 'O(n × m)', 'O(log(n + m))'], a: 0, why: 'Keep one pointer in each array and always take the smaller front element. Every element is copied once.' },
    { q: 'n = 10⁵. Bubble sort or the built-in sort?', opts: ['Bubble sort', 'Built-in sort', 'Either is fine'], a: 1, why: 'Bubble sort needs about 5 × 10⁹ comparisons here. The built-in O(n log n) sort needs about 1.7 million.' },
  ],
  practice: [
    { t: 'Merge Sorted Array', s: 'merge-sorted-array', d: 'Easy' },
    { t: 'Sort Colors', s: 'sort-colors', d: 'Medium' },
    { t: 'Sort an Array', s: 'sort-an-array', d: 'Medium' },
    { t: 'Kth Largest Element in an Array', s: 'kth-largest-element-in-an-array', d: 'Medium' },
  ],
},
{
  id: 'stacks-queues', line: 'blue', name: 'Stacks & Queues', short: 'Stacks & Queues', mins: 25,
  story: 'A stack is the pile of plates at a wedding buffet: the last plate put down is the first one picked up. A queue is the line at the canteen counter: whoever came first gets served first.',
  idea: `<ul><li><strong>Stack</strong> (last in, first out): <code>push</code>, <code>pop</code> and <code>top</code> are all O(1). Use it for undo, matching brackets, and "next greater element" problems.</li><li><strong>Queue</strong> (first in, first out): add at the back, remove from the front, both O(1). Use it for BFS and anything handled in arrival order.</li></ul>
<p>In C++: <code>stack&lt;int&gt;</code> and <code>queue&lt;int&gt;</code>. In Python, a plain list works as a stack (<code>append</code>, <code>pop</code>); use <code>collections.deque</code> for a queue.</p>
<p>The bracket problem below is the classic one: every closing bracket must match the <strong>most recent</strong> unmatched opening bracket. "Most recent" is your signal to reach for a stack.</p>`,
  vizTitle: 'Bracket checker', viz: 'brackets',
  code: {
    cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') { st.push(c); continue; }
        if (st.empty()) return false;              // closer with nothing open
        char open = st.top(); st.pop();
        if ((c == ')' && open != '(') ||
            (c == ']' && open != '[') ||
            (c == '}' && open != '{')) return false;   // wrong pair
    }
    return st.empty();                             // everything closed?
}`,
    py: `def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for c in s:
        if c in '([{':
            stack.append(c)
        elif not stack or stack.pop() != pairs[c]:
            return False        # nothing open, or the wrong pair
    return not stack            # everything closed?`,
  },
  quiz: [
    { q: 'Ctrl+Z (undo) in a text editor is best modelled with…', opts: ['A queue', 'A stack', 'A sorted array'], a: 1, why: 'Undo reverses the most recent action first: last in, first out.' },
    { q: 'Is "([)]" a valid bracket string?', opts: ['Yes', 'No'], a: 1, why: 'When ")" arrives, the top of the stack is "[", not "(". The pairs cross each other.' },
    { q: 'Which structure does BFS use?', opts: ['Stack', 'Queue', 'Hash map'], a: 1, why: 'BFS handles nodes in the order they were discovered: first in, first out.' },
  ],
  practice: [
    { t: 'Valid Parentheses', s: 'valid-parentheses', d: 'Easy' },
    { t: 'Implement Queue using Stacks', s: 'implement-queue-using-stacks', d: 'Easy' },
    { t: 'Min Stack', s: 'min-stack', d: 'Medium' },
    { t: 'Daily Temperatures', s: 'daily-temperatures', d: 'Medium' },
  ],
},
{
  id: 'hashing', line: 'blue', name: 'Hashing', short: 'Hashing', mins: 25,
  story: 'Finding a friend\'s number by scrolling your whole contact list is O(n). Typing their name into the search box is close to instant. A hash map is that search box, and you get one in a single line of code.',
  idea: `<p>A <strong>hash map</strong> stores key → value pairs. Insert, lookup and delete are O(1) on average. A <strong>hash set</strong> stores just keys, for "have I seen this before?" questions.</p>
<p>The pattern that cracks a huge number of problems: <strong>while you scan the array, remember what you have seen</strong>. For Two Sum, at each number <code>x</code> ask "have I already seen <code>target − x</code>?" One pass, O(n), instead of checking every pair.</p>
<ul><li>C++: <code>unordered_map&lt;int, int&gt;</code> and <code>unordered_set&lt;int&gt;</code>.</li><li>Python: <code>dict</code> and <code>set</code>.</li><li>Counting things (letters, votes, frequencies) is almost always a hash map.</li></ul>`,
  vizTitle: 'Two Sum with a hash map', viz: 'hash',
  code: {
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;          // value -> index
    for (int i = 0; i < (int)nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;                 // remember this one
    }
    return {};
}`,
    py: `def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i                # remember this one
    return []`,
  },
  quiz: [
    { q: 'Average lookup time in a hash map?', opts: ['O(1)', 'O(log n)', 'O(n)'], a: 0, why: 'The key is hashed straight to its slot, so on average a lookup takes constant time.' },
    { q: 'Two Sum with a hash map runs in…', opts: ['O(n²)', 'O(n)', 'O(n log n)'], a: 1, why: 'One pass over the array. Each step does one O(1) lookup and one O(1) insert.' },
    { q: 'To check whether two words are anagrams, you would…', opts: ['Count each letter in a hash map and compare the counts', 'Binary search both words', 'Push both words on a stack'], a: 0, why: 'Anagrams have exactly the same letter counts.' },
  ],
  practice: [
    { t: 'Two Sum', s: 'two-sum', d: 'Easy' },
    { t: 'Valid Anagram', s: 'valid-anagram', d: 'Easy' },
    { t: 'Contains Duplicate', s: 'contains-duplicate', d: 'Easy' },
    { t: 'Group Anagrams', s: 'group-anagrams', d: 'Medium' },
  ],
},
{
  id: 'linked-lists', line: 'blue', name: 'Linked Lists', short: 'Linked Lists', mins: 30,
  story: 'A treasure hunt where each clue tells you where the next one is hidden. You can\'t jump straight to clue 5. You follow the chain from the start.',
  idea: `<p>A <strong>linked list</strong> is a chain of nodes. Each node holds a value and a pointer to the next node. The last node points to null.</p>
<ul><li>Inserting or deleting at a node you already hold is O(1): you only change pointers.</li><li>Reaching the k-th node is O(n): you have to walk there.</li><li>Almost every problem is pointer juggling. Draw boxes and arrows on paper before you code.</li></ul>
<p>Reversing a list uses three pointers: <code>prev</code>, <code>curr</code> and <code>next</code>. Save the rest of the list, flip one arrow, step forward. Two more tricks to know: a <strong>dummy head</strong> node removes special cases, and <strong>fast and slow pointers</strong> (one moves 2 steps, the other 1) find the middle or detect a cycle.</p>`,
  vizTitle: 'Reverse a linked list', viz: 'linked',
  code: {
    cpp: `struct ListNode { int val; ListNode* next; };

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* nxt = curr->next;   // 1. save the rest of the list
        curr->next = prev;            // 2. flip the arrow
        prev = curr;                  // 3. move both pointers forward
        curr = nxt;
    }
    return prev;                      // the new head
}`,
    py: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next     # 1. save the rest of the list
        curr.next = prev    # 2. flip the arrow
        prev = curr         # 3. move both pointers forward
        curr = nxt
    return prev             # the new head`,
  },
  quiz: [
    { q: 'Getting the 1000th element of a linked list costs…', opts: ['O(1)', 'O(n)', 'O(log n)'], a: 1, why: 'There is no index. You walk from the head, one node at a time.' },
    { q: 'While reversing, why save next before changing curr→next?', opts: ['Speed', 'Otherwise you lose the rest of the list', 'It is only needed in C++'], a: 1, why: 'Once curr→next points backwards, nothing points to the old next node any more. Save it first.' },
    { q: 'A slow pointer moves 1 step and a fast pointer moves 2. When fast reaches the end, slow is…', opts: ['At the start', 'At the middle', 'At the end'], a: 1, why: 'Fast covers twice the distance, so slow has covered half the list.' },
  ],
  practice: [
    { t: 'Reverse Linked List', s: 'reverse-linked-list', d: 'Easy' },
    { t: 'Middle of the Linked List', s: 'middle-of-the-linked-list', d: 'Easy' },
    { t: 'Merge Two Sorted Lists', s: 'merge-two-sorted-lists', d: 'Easy' },
    { t: 'Linked List Cycle', s: 'linked-list-cycle', d: 'Easy' },
  ],
},
{
  id: 'trees', line: 'red', name: 'Trees', short: 'Trees', mins: 30,
  story: 'Your family tree, a company\'s org chart, the folders on your laptop. Each item has children, and you never loop back to where you started. That is a tree.',
  idea: `<p>In a <strong>binary tree</strong> each node has at most two children, left and right. In a <strong>binary search tree (BST)</strong>, everything on the left of a node is smaller than it and everything on the right is bigger.</p>
<p>Most tree problems follow one shape: <strong>solve the left subtree, solve the right subtree, combine</strong>. That is recursion. Max depth is <code>1 + max(depth(left), depth(right))</code>, and an empty tree has depth 0.</p>
<p>The four ways to walk a tree:</p>
<ul><li><strong>Preorder</strong>: node, left, right. Good for copying a tree.</li><li><strong>Inorder</strong>: left, node, right. On a BST it gives the values in sorted order.</li><li><strong>Postorder</strong>: left, right, node. Use it when children must be finished first, like freeing memory.</li><li><strong>Level order</strong>: row by row, using a queue. This is BFS.</li></ul>`,
  vizTitle: 'Four ways to walk a tree', viz: 'tree',
  code: {
    cpp: `struct TreeNode { int val; TreeNode *left, *right; };

int maxDepth(TreeNode* root) {
    if (!root) return 0;                       // empty tree
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}

void inorder(TreeNode* root, vector<int>& out) {
    if (!root) return;
    inorder(root->left, out);    // left
    out.push_back(root->val);    // node
    inorder(root->right, out);   // right
}`,
    py: `def max_depth(root):
    if not root:                   # empty tree
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

def inorder(root, out):
    if not root:
        return
    inorder(root.left, out)        # left
    out.append(root.val)           # node
    inorder(root.right, out)       # right`,
  },
  quiz: [
    { q: 'Inorder traversal of a BST visits the values…', opts: ['In sorted order', 'In random order', 'Level by level'], a: 0, why: 'Left subtree (smaller), then the node, then the right subtree (bigger), all the way down.' },
    { q: 'Level order traversal uses a…', opts: ['Stack', 'Queue', 'Hash map'], a: 1, why: 'Take a node from the front, add its children to the back. Rows come out in order.' },
    { q: 'Max depth of a tree that is just a root node?', opts: ['0', '1', '2'], a: 1, why: '1 + max(depth(empty), depth(empty)) = 1 + 0 = 1.' },
  ],
  practice: [
    { t: 'Maximum Depth of Binary Tree', s: 'maximum-depth-of-binary-tree', d: 'Easy' },
    { t: 'Invert Binary Tree', s: 'invert-binary-tree', d: 'Easy' },
    { t: 'Binary Tree Inorder Traversal', s: 'binary-tree-inorder-traversal', d: 'Easy' },
    { t: 'Binary Tree Level Order Traversal', s: 'binary-tree-level-order-traversal', d: 'Medium' },
  ],
},
{
  id: 'graphs', line: 'red', name: 'Graphs: BFS & DFS', short: 'Graphs', mins: 35,
  story: 'A maps app finding the quickest way across Delhi, a social app suggesting "people you may know", the maze on the back page of a newspaper. They are all graphs: places (nodes) joined by roads (edges).',
  idea: `<p>A <strong>graph</strong> is a set of nodes and the edges between them. Store it as an <strong>adjacency list</strong>: for each node, a list of its neighbours. A grid is a graph too: each cell connects to the cells above, below, left and right.</p>
<ul><li><strong>BFS</strong> (breadth-first search) explores in rings using a queue. The first time BFS reaches a cell, it has found the shortest path to it, as long as every step costs the same.</li><li><strong>DFS</strong> (depth-first search) goes as deep as it can before backing up, using recursion or a stack. Great for "count the islands" or "is everything connected?", but not for shortest paths.</li><li>Always keep a <strong>visited</strong> set. Without it you go around in circles forever.</li></ul>
<p>Both run in O(V + E): every node and every edge is handled once.</p>`,
  vizTitle: 'BFS vs DFS in a maze', viz: 'maze',
  code: {
    cpp: `// Fewest steps from (sr, sc) to (tr, tc). '#' is a wall.
int bfs(vector<string>& g, int sr, int sc, int tr, int tc) {
    int R = g.size(), C = g[0].size();
    vector<vector<int>> dist(R, vector<int>(C, -1));
    queue<pair<int, int>> q;
    q.push({sr, sc}); dist[sr][sc] = 0;
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        if (r == tr && c == tc) return dist[r][c];
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
            if (g[nr][nc] == '#' || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;   // mark visited when you push
            q.push({nr, nc});
        }
    }
    return -1;                               // unreachable
}`,
    py: `from collections import deque

# Fewest steps from (sr, sc) to (tr, tc). '#' is a wall.
def bfs(g, sr, sc, tr, tc):
    R, C = len(g), len(g[0])
    dist = [[-1] * C for _ in range(R)]
    dist[sr][sc] = 0
    q = deque([(sr, sc)])
    while q:
        r, c = q.popleft()
        if (r, c) == (tr, tc):
            return dist[r][c]
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and g[nr][nc] != '#' and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1   # mark visited when you push
                q.append((nr, nc))
    return -1                                   # unreachable`,
  },
  quiz: [
    { q: 'Shortest path in a maze where every step costs 1?', opts: ['BFS', 'DFS', 'Either one always works'], a: 0, why: 'BFS reaches cells in order of distance. DFS may find a long winding path first, as the demo shows.' },
    { q: 'What is the visited set for?', opts: ['Only speed', 'Not handling a node twice, and not looping forever', 'Storing the final answer'], a: 1, why: 'Graphs can have cycles. Without visited, you would walk around a cycle forever.' },
    { q: 'Complexity of BFS on a graph with V nodes and E edges?', opts: ['O(V + E)', 'O(V × E)', 'Always O(V²)'], a: 0, why: 'Every node enters the queue once and every edge is looked at once (twice if undirected).' },
  ],
  practice: [
    { t: 'Flood Fill', s: 'flood-fill', d: 'Easy' },
    { t: 'Number of Islands', s: 'number-of-islands', d: 'Medium' },
    { t: 'Rotting Oranges', s: 'rotting-oranges', d: 'Medium' },
    { t: 'Shortest Path in Binary Matrix', s: 'shortest-path-in-binary-matrix', d: 'Medium' },
  ],
},
{
  id: 'fibonacci', line: 'magenta', name: 'Why DP? Fibonacci', short: 'Fibonacci', mins: 30,
  story: 'Ask a friend what 17 × 23 is. They work it out: 391. Ask again a minute later and they just remember it. Plain recursion never remembers. It recomputes the same thing again and again, and that is why it is slow.',
  idea: `<p>Fibonacci: <code>fib(n) = fib(n−1) + fib(n−2)</code>, with <code>fib(0) = 0</code> and <code>fib(1) = 1</code>. Written as plain recursion, <code>fib(40)</code> makes over <strong>33 crore</strong> calls (331 million), because the same small values are recomputed over and over. Play with the tree below to see it happen.</p>
<p><strong>Dynamic programming (DP)</strong> fixes this by saving answers. It works when a problem has:</p>
<ul><li><strong>Overlapping subproblems</strong>: the same smaller problem comes up many times.</li><li><strong>Optimal substructure</strong>: the answer can be built from the answers to smaller problems.</li></ul>
<p>There are two ways to write it:</p>
<ul><li><strong>Memoization (top-down)</strong>: keep the recursion, but store each answer the first time and return the stored answer on every later call.</li><li><strong>Tabulation (bottom-up)</strong>: fill an array from the smallest case up, <code>dp[i] = dp[i−1] + dp[i−2]</code>. No recursion at all.</li></ul>
<p>Both make Fibonacci O(n). <code>fib(40)</code> drops from 331 million calls to 79.</p>`,
  vizTitle: 'The recursion tree, with and without memo', viz: 'fib',
  code: {
    cpp: `// 1. Plain recursion: O(2^n). Recomputes the same values.
long long fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// 2. Memoization (top-down): O(n). Remember each answer.
vector<long long> memo(91, -1);
long long fibMemo(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];            // already solved
    return memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
}

// 3. Tabulation (bottom-up): O(n). Fill from small to big.
long long fibTab(int n) {
    if (n <= 1) return n;
    vector<long long> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}`,
    py: `# 1. Plain recursion: O(2^n). Recomputes the same values.
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# 2. Memoization (top-down): O(n). Remember each answer.
memo = {}
def fib_memo(n):
    if n <= 1:
        return n
    if n not in memo:                       # solve it only once
        memo[n] = fib_memo(n - 1) + fib_memo(n - 2)
    return memo[n]

# 3. Tabulation (bottom-up): O(n). Fill from small to big.
def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
  },
  quiz: [
    { q: 'Which two properties make a problem a good fit for DP?', opts: ['Sorted input and small n', 'Overlapping subproblems and optimal substructure', 'Recursion and a stack'], a: 1, why: 'Overlap means saving answers pays off. Optimal substructure means the big answer can be built from saved small ones.' },
    { q: 'With memoization, fib(n) runs in…', opts: ['O(2ⁿ)', 'O(n)', 'O(n²)'], a: 1, why: 'Each fib(k) is computed once. Every later call is a table lookup.' },
    { q: 'Tabulation is different from memoization because it…', opts: ['Fills the table from small to big without recursion', 'Is always slower', 'Doesn\'t store anything'], a: 0, why: 'Same table, same answers. Tabulation just fills it with a loop in a safe order.' },
  ],
  practice: [
    { t: 'Fibonacci Number', s: 'fibonacci-number', d: 'Easy' },
    { t: 'N-th Tribonacci Number', s: 'n-th-tribonacci-number', d: 'Easy' },
  ],
},
{
  id: 'climbing-stairs', line: 'magenta', name: 'Climbing Stairs', short: 'Climbing Stairs', mins: 25,
  story: 'The stairs to the top floor of your college block: you take 1 or 2 steps at a time. In how many different ways can you reach step n? Counting by hand stops working around n = 6.',
  idea: `<p>Think about the <strong>last move</strong>. To stand on step <code>i</code>, you either stepped up 1 from step <code>i−1</code>, or 2 from step <code>i−2</code>. So:</p>
<p class="formula">ways(i) = ways(i−1) + ways(i−2)</p>
<p>with <code>ways(0) = 1</code> (stand still) and <code>ways(1) = 1</code>.</p>
<p>That is the whole <strong>DP recipe</strong>, and every station from here to the terminus uses it:</p>
<ul><li><strong>State</strong>: what one cell means. Here, ways(i) is the number of ways to reach step i.</li><li><strong>Transition</strong>: how a cell is built from smaller cells. Here, from i−1 and i−2.</li><li><strong>Base cases</strong>: cells you know without calculating.</li><li><strong>Answer</strong>: the cell you want. Here, ways(n).</li></ul>
<p>In the table below you fill each cell yourself. Get it right on the first try for XP.</p>`,
  vizTitle: 'Fill the table', viz: 'stairs',
  code: {
    cpp: `int climbStairs(int n) {
    if (n <= 1) return 1;
    vector<int> ways(n + 1);
    ways[0] = 1;                 // one way to stay on the ground
    ways[1] = 1;                 // a single 1-step
    for (int i = 2; i <= n; i++)
        ways[i] = ways[i - 1] + ways[i - 2];   // last move was 1 or 2 steps
    return ways[n];
}`,
    py: `def climb_stairs(n):
    ways = [1, 1] + [0] * (n - 1)      # ways[0] = ways[1] = 1
    for i in range(2, n + 1):
        ways[i] = ways[i - 1] + ways[i - 2]   # last move was 1 or 2 steps
    return ways[n]`,
  },
  quiz: [
    { q: 'ways(4), taking 1 or 2 steps at a time?', opts: ['4', '5', '8'], a: 1, why: 'The row goes 1, 1, 2, 3, 5. The five ways: 1111, 112, 121, 211, 22.' },
    { q: 'Now you can also jump 3 steps. The new transition is…', opts: ['ways(i−1) + ways(i−2)', 'ways(i−1) + ways(i−2) + ways(i−3)', '3 × ways(i−1)'], a: 1, why: 'The last move could now be 1, 2 or 3 steps, so add all three.' },
    { q: 'To save memory, you really only need…', opts: ['The whole array', 'The last two values', 'The first two values'], a: 1, why: 'Each cell reads only the previous two, so two variables are enough: O(1) space.' },
  ],
  practice: [
    { t: 'Climbing Stairs', s: 'climbing-stairs', d: 'Easy' },
    { t: 'Min Cost Climbing Stairs', s: 'min-cost-climbing-stairs', d: 'Easy' },
  ],
},
{
  id: 'house-robber', line: 'magenta', name: 'House Robber', short: 'House Robber', mins: 30,
  story: 'A thief walks down a street of houses, each with some cash inside. Rob two houses next to each other and the alarm goes off. What is the most cash they can take in one night?',
  idea: `<p>Same recipe, but now every step is a <strong>choice</strong>.</p>
<ul><li><strong>State</strong>: dp[k] is the most cash from the first k houses.</li><li><strong>Transition</strong>: at house k, either skip it (keep dp[k−1]) or rob it (its cash + dp[k−2], because the neighbour must be skipped). Take the bigger.</li><li><strong>Base</strong>: dp[0] = 0. No houses, no cash.</li><li><strong>Answer</strong>: dp[n].</li></ul>
<p class="formula">dp[k] = max(dp[k−1], cash[k] + dp[k−2])</p>
<p>Greedy ideas like "always rob the richest house" fail here. DP wins because it weighs both choices at every house without trying every combination.</p>`,
  vizTitle: 'Rob the street', viz: 'robber',
  code: {
    cpp: `int rob(vector<int>& cash) {
    int n = cash.size();
    vector<int> dp(n + 1, 0);       // dp[k] = best from the first k houses
    dp[1] = cash[0];
    for (int k = 2; k <= n; k++) {
        int skip = dp[k - 1];                 // leave house k alone
        int take = cash[k - 1] + dp[k - 2];   // rob it, skip its neighbour
        dp[k] = max(skip, take);
    }
    return dp[n];
}`,
    py: `def rob(cash):
    n = len(cash)
    dp = [0] * (n + 1)             # dp[k] = best from the first k houses
    dp[1] = cash[0]
    for k in range(2, n + 1):
        skip = dp[k - 1]                  # leave house k alone
        take = cash[k - 1] + dp[k - 2]    # rob it, skip its neighbour
        dp[k] = max(skip, take)
    return dp[n]`,
  },
  quiz: [
    { q: 'The street is [2, 7, 9, 3, 1]. Best haul?', opts: ['11', '12', '10'], a: 1, why: 'Rob 2, 9 and 1 for 12. The dp row is 0, 2, 7, 11, 11, 12.' },
    { q: 'Greedy grabs the richest house first. For [2, 9, 10, 9], what does the best plan earn?', opts: ['12', '18', '19'], a: 1, why: 'Greedy takes 10, then only 2 is allowed: 12. Robbing both 9s gives 18.' },
    { q: 'Which cells does dp[k] read?', opts: ['dp[k−1] and dp[k−2]', 'Only dp[k−1]', 'Every earlier cell'], a: 0, why: 'Skip reads dp[k−1]; rob reads dp[k−2].' },
  ],
  practice: [
    { t: 'House Robber', s: 'house-robber', d: 'Medium' },
    { t: 'House Robber II', s: 'house-robber-ii', d: 'Medium' },
    { t: 'Delete and Earn', s: 'delete-and-earn', d: 'Medium' },
  ],
},
{
  id: 'coin-change', line: 'magenta', name: 'Coin Change', short: 'Coin Change', mins: 35,
  story: 'You are at the canteen counter with ₹1, ₹3 and ₹4 coins and need to give ₹6 change using as few coins as possible. Greedy grabs the biggest coin first: 4 + 1 + 1, three coins. The real answer is 3 + 3, two coins.',
  idea: `<ul><li><strong>State</strong>: dp[a] is the fewest coins that make amount a.</li><li><strong>Transition</strong>: the last coin used was some coin c. Try each one: dp[a] = min over coins of dp[a − c] + 1.</li><li><strong>Base</strong>: dp[0] = 0. Amounts you can't make stay at ∞.</li><li><strong>Answer</strong>: dp[amount], or −1 if it is still ∞.</li></ul>
<p>Unlike House Robber, one cell can read many earlier cells, one per coin. And each coin can be used again and again. That is an <strong>unbounded</strong> choice, and it is why we read from the same row instead of a "previous item" row.</p>
<p>In the table, type <code>inf</code> for ∞.</p>`,
  vizTitle: 'Make change', viz: 'coins',
  code: {
    cpp: `int coinChange(vector<int>& coins, int amount) {
    const int INF = 1e9;
    vector<int> dp(amount + 1, INF);   // dp[a] = fewest coins for amount a
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins)
            if (c <= a && dp[a - c] != INF)
                dp[a] = min(dp[a], dp[a - c] + 1);   // use coin c last
    return dp[amount] == INF ? -1 : dp[amount];
}`,
    py: `def coin_change(coins, amount):
    INF = float('inf')
    dp = [0] + [INF] * amount          # dp[a] = fewest coins for amount a
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)   # use coin c last
    return -1 if dp[amount] == INF else dp[amount]`,
  },
  quiz: [
    { q: 'Coins ₹1, ₹5, ₹6. Fewest coins for ₹10?', opts: ['2', '5', '3'], a: 0, why: '5 + 5. Greedy takes 6 first and ends up with 6 + 1 + 1 + 1 + 1, five coins.' },
    { q: 'Complexity for amount A and k coin types?', opts: ['O(A + k)', 'O(A × k)', 'O(2ᴬ)'], a: 1, why: 'A cells, and each cell tries k coins.' },
    { q: 'Coins ₹2 and ₹5. What is dp[3]?', opts: ['1', '∞ (impossible)', '2'], a: 1, why: 'No mix of 2s and 5s adds up to 3.' },
  ],
  practice: [
    { t: 'Coin Change', s: 'coin-change', d: 'Medium' },
    { t: 'Coin Change II', s: 'coin-change-ii', d: 'Medium' },
    { t: 'Perfect Squares', s: 'perfect-squares', d: 'Medium' },
  ],
},
{
  id: 'grid-paths', line: 'magenta', name: 'Grid Paths', short: 'Grid Paths', mins: 30,
  story: 'A delivery robot starts at the top-left corner of the campus map and can only move right or down. Some blocks are under construction. How many different routes reach the canteen at the bottom-right?',
  idea: `<p>Your first <strong>2D DP</strong>: the state needs two numbers, the row and the column.</p>
<ul><li><strong>State</strong>: paths[r][c] is the number of routes from the start to cell (r, c).</li><li><strong>Transition</strong>: you arrived from above or from the left, so paths[r][c] = paths[r−1][c] + paths[r][c−1].</li><li><strong>Base</strong>: the start cell has 1 route. Blocked cells have 0.</li><li><strong>Answer</strong>: the bottom-right cell.</li></ul>
<p>Fill row by row, left to right, so the cells above and to the left are always ready. Before you start, click cells in the grid to add or remove construction blocks.</p>`,
  vizTitle: 'Count the routes', viz: 'gridPaths',
  code: {
    cpp: `int uniquePathsWithObstacles(vector<vector<int>>& g) {   // 1 = blocked
    int R = g.size(), C = g[0].size();
    vector<vector<long long>> dp(R, vector<long long>(C, 0));
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) {
            if (g[r][c] == 1) continue;                    // blocked: 0 routes
            if (r == 0 && c == 0) { dp[r][c] = 1; continue; }
            long long up   = r > 0 ? dp[r - 1][c] : 0;
            long long left = c > 0 ? dp[r][c - 1] : 0;
            dp[r][c] = up + left;
        }
    return dp[R - 1][C - 1];
}`,
    py: `def unique_paths_with_obstacles(g):    # 1 = blocked
    R, C = len(g), len(g[0])
    dp = [[0] * C for _ in range(R)]
    for r in range(R):
        for c in range(C):
            if g[r][c] == 1:
                continue                    # blocked: 0 routes
            if r == 0 and c == 0:
                dp[r][c] = 1
                continue
            up = dp[r - 1][c] if r > 0 else 0
            left = dp[r][c - 1] if c > 0 else 0
            dp[r][c] = up + left
    return dp[R - 1][C - 1]`,
  },
  quiz: [
    { q: 'In a 3 × 3 grid with no blocks, how many routes from top-left to bottom-right?', opts: ['4', '6', '9'], a: 1, why: 'The table rows are 1 1 1, then 1 2 3, then 1 3 6.' },
    { q: 'A cell\'s value comes from…', opts: ['Above + left', 'Left only', 'The diagonal'], a: 0, why: 'You can only arrive by moving down (from above) or right (from the left).' },
    { q: 'If the robot could also move diagonally down-right, you would add…', opts: ['paths[r−1][c−1]', 'paths[r+1][c+1]', 'Nothing changes'], a: 0, why: 'A diagonal move arrives from the cell up and to the left.' },
  ],
  practice: [
    { t: 'Unique Paths', s: 'unique-paths', d: 'Medium' },
    { t: 'Unique Paths II', s: 'unique-paths-ii', d: 'Medium' },
    { t: 'Minimum Path Sum', s: 'minimum-path-sum', d: 'Medium' },
  ],
},
{
  id: 'lcs', line: 'magenta', name: 'Longest Common Subsequence', short: 'LCS', mins: 40,
  story: 'Two friends compare playlists. What is the longest list of songs that appears in both, in the same order, even if other songs sit in between? Git uses this idea to show what changed between two versions of a file.',
  idea: `<p>A <strong>subsequence</strong> keeps the order but can skip letters: "ONE" is a subsequence of both "STONE" and "LONGEST".</p>
<ul><li><strong>State</strong>: dp[i][j] is the LCS length of the first i letters of A and the first j letters of B.</li><li><strong>Transition</strong>: if A[i] equals B[j], use both: dp[i−1][j−1] + 1 (the diagonal). If not, drop a letter from A or from B and keep the better result: max(dp[i−1][j], dp[i][j−1]).</li><li><strong>Base</strong>: row 0 and column 0 are 0. An empty string shares nothing.</li><li><strong>Answer</strong>: dp[n][m]. Walk back from it to recover the letters.</li></ul>
<p>Two strings mean a 2D table, one string down the side and one across the top. Edit Distance, Longest Palindromic Subsequence and many others use this exact layout.</p>`,
  vizTitle: 'Fill the LCS table', viz: 'lcs',
  code: {
    cpp: `int lcs(string A, string B) {
    int n = A.size(), m = B.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (A[i - 1] == B[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;              // match: diagonal + 1
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);   // drop a letter from A or B
    return dp[n][m];
}`,
    py: `def lcs(A, B):
    n, m = len(A), len(B)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if A[i - 1] == B[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1              # match: diagonal + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])   # drop a letter from A or B
    return dp[n][m]`,
  },
  quiz: [
    { q: 'LCS length of "ABCD" and "ACBD"?', opts: ['2', '3', '4'], a: 1, why: '"ABD" or "ACD", both of length 3.' },
    { q: 'The letters match. Which cell do you add 1 to?', opts: ['The one above', 'The one to the left', 'The diagonal (up-left)'], a: 2, why: 'Both letters get used, so step back in both strings at once.' },
    { q: 'Table size for strings of lengths n and m?', opts: ['n × m', '(n + 1) × (m + 1)', 'n + m'], a: 1, why: 'The extra row and column stand for the empty prefix.' },
  ],
  practice: [
    { t: 'Longest Common Subsequence', s: 'longest-common-subsequence', d: 'Medium' },
    { t: 'Delete Operation for Two Strings', s: 'delete-operation-for-two-strings', d: 'Medium' },
    { t: 'Edit Distance', s: 'edit-distance', d: 'Medium' },
  ],
},
{
  id: 'knapsack', line: 'magenta', name: '0/1 Knapsack', short: 'Knapsack', mins: 40,
  story: 'You are packing for a Kasol trek with a bag that holds 6 kg. The tent, stove, camera and snacks each have a weight and a usefulness score. Each item goes in once or not at all. What is the most useful bag you can pack?',
  idea: `<ul><li><strong>State</strong>: dp[i][w] is the best score using only the first i items with w kg of space.</li><li><strong>Transition</strong>: for item i, either skip it, giving dp[i−1][w], or take it if it fits: its score + dp[i−1][w − its weight]. Keep the bigger.</li><li><strong>Base</strong>: row 0 (no items) is all 0.</li><li><strong>Answer</strong>: dp[n][W]. Walk back up the table to see which items were packed.</li></ul>
<p>Why "0/1"? Each item is used at most once, so after taking it we read from row i−1, where item i is no longer available. In Coin Change, coins could repeat, so we read from the same row. That one difference separates the two big families of choice DP.</p>
<p>Partition Equal Subset Sum, Target Sum and many "pick a subset" problems are knapsack in disguise.</p>`,
  vizTitle: 'Pack the bag', viz: 'knapsack',
  code: {
    cpp: `int knapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];                             // skip item i
            if (wt[i - 1] <= w)
                dp[i][w] = max(dp[i][w],
                               val[i - 1] + dp[i - 1][w - wt[i - 1]]);  // take it
        }
    return dp[n][W];
}`,
    py: `def knapsack(wt, val, W):
    n = len(wt)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(W + 1):
            dp[i][w] = dp[i - 1][w]                          # skip item i
            if wt[i - 1] <= w:
                take = val[i - 1] + dp[i - 1][w - wt[i - 1]] # take it
                dp[i][w] = max(dp[i][w], take)
    return dp[n][W]`,
  },
  quiz: [
    { q: 'Taking item i reads from which row?', opts: ['Row i (the same row)', 'Row i − 1', 'Row 0'], a: 1, why: 'Row i − 1 is the world without item i, so it can\'t be taken twice.' },
    { q: 'Complexity with n items and capacity W?', opts: ['O(n × W)', 'O(2ⁿ)', 'O(n + W)'], a: 0, why: 'One cell per (item, capacity) pair, with O(1) work in each.' },
    { q: '"Can [1, 5, 11, 5] be split into two groups with equal sums?" is…', opts: ['Knapsack: can some subset reach a sum of 11?', 'Binary search', 'Two pointers'], a: 0, why: 'The total is 22, so ask whether some subset sums to 11. It does: 11 alone, or 1 + 5 + 5.' },
  ],
  practice: [
    { t: 'Partition Equal Subset Sum', s: 'partition-equal-subset-sum', d: 'Medium' },
    { t: 'Target Sum', s: 'target-sum', d: 'Medium' },
    { t: 'Last Stone Weight II', s: 'last-stone-weight-ii', d: 'Medium' },
  ],
},
{
  id: 'dp-recipe', line: 'magenta', name: 'DP Terminus', short: 'DP Terminus', mins: 30,
  story: 'End of the line. Every DP problem you just solved followed the same four steps. This station drills those steps on problems you haven\'t seen, so that next time you spot the pattern on your own.',
  idea: `<p>The recipe, for any DP problem:</p>
<ul><li><strong>State.</strong> Finish the sentence "dp[i] means …" (or dp[i][j]). If you can't say it in one sentence, the state is wrong.</li><li><strong>Transition.</strong> Look at the last step. What were the choices? Build the cell from smaller cells.</li><li><strong>Base cases.</strong> The smallest inputs, answered by hand.</li><li><strong>Order and answer.</strong> Fill the table so every cell only reads cells that are already done, then return the cell you need.</li></ul>
<p>Most DP problems in placement rounds belong to a handful of families:</p>
<div class="tbl-scroll"><table class="tbl"><thead><tr><th>Family</th><th>You have seen</th><th>Try next</th></tr></thead><tbody>
<tr><td>1D line</td><td>Climbing Stairs, House Robber</td><td>Decode Ways, House Robber II</td></tr>
<tr><td>Unbounded choice</td><td>Coin Change</td><td>Perfect Squares, Word Break</td></tr>
<tr><td>Grid</td><td>Grid Paths</td><td>Minimum Path Sum, Maximal Square</td></tr>
<tr><td>Two strings</td><td>LCS</td><td>Edit Distance, Longest Palindromic Subsequence</td></tr>
<tr><td>Take or skip (0/1)</td><td>Knapsack</td><td>Partition Equal Subset Sum, Target Sum</td></tr>
<tr><td>Best ending at i</td><td>(new)</td><td>Longest Increasing Subsequence</td></tr>
</tbody></table></div>
<p>The code below uses the recipe on a new problem, Longest Increasing Subsequence. First, play the pattern game.</p>`,
  vizTitle: 'Name the pattern', viz: 'patterns',
  code: {
    cpp: `// Longest Increasing Subsequence, built with the recipe
// STATE:      dp[i] = length of the longest increasing subsequence ending at a[i]
// TRANSITION: dp[i] = 1 + max(dp[j]) over j < i with a[j] < a[i]
// BASE:       every dp[i] starts at 1 (a[i] on its own)
// ANSWER:     the largest dp[i]
int lengthOfLIS(vector<int>& a) {
    int n = a.size(), best = 0;
    vector<int> dp(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);
        best = max(best, dp[i]);
    }
    return best;
}`,
    py: `# Longest Increasing Subsequence, built with the recipe
# STATE:      dp[i] = length of the longest increasing subsequence ending at a[i]
# TRANSITION: dp[i] = 1 + max(dp[j]) over j < i with a[j] < a[i]
# BASE:       every dp[i] starts at 1 (a[i] on its own)
# ANSWER:     the largest dp[i]
def length_of_lis(a):
    dp = [1] * len(a)
    for i in range(len(a)):
        for j in range(i):
            if a[j] < a[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp, default=0)`,
  },
  quiz: [
    { q: 'The first thing to write down for a new DP problem?', opts: ['The code', 'What dp[i] means', 'The time complexity'], a: 1, why: 'Everything else follows from the state. A fuzzy state gives a wrong transition.' },
    { q: 'The answer for size n depends on sizes n−1 and n−2. Which family?', opts: ['1D line', 'Grid', 'Two strings'], a: 0, why: 'One index, reading a fixed number of earlier cells: Climbing Stairs shape.' },
    { q: 'In tabulation, the fill order must make sure that…', opts: ['Each cell reads only cells that are already filled', 'Cells are filled in random order', 'The last cell is filled first'], a: 0, why: 'A cell built from an empty cell gives garbage. Row by row, left to right, usually does it.' },
  ],
  practice: [
    { t: 'Longest Increasing Subsequence', s: 'longest-increasing-subsequence', d: 'Medium' },
    { t: 'Word Break', s: 'word-break', d: 'Medium' },
    { t: 'Decode Ways', s: 'decode-ways', d: 'Medium' },
    { t: 'Maximal Square', s: 'maximal-square', d: 'Medium' },
  ],
},
];

export const MAPPOS: Record<string, MapPos> = {
  'big-o': [90, 90, 'a'], 'two-pointers': [210, 90, 'a'], 'recursion': [330, 90, 'a'],
  'binary-search': [450, 190, 'b'], 'sorting': [560, 190, 'a'], 'stacks-queues': [670, 190, 'b'], 'hashing': [780, 190, 'a'], 'linked-lists': [890, 190, 'a'],
  'trees': [890, 290, 'l'], 'graphs': [890, 390, 'l'],
  'fibonacci': [790, 460, 'a'], 'climbing-stairs': [690, 460, 'b'], 'house-robber': [590, 460, 'a'], 'coin-change': [490, 460, 'b'],
  'grid-paths': [390, 460, 'a'], 'lcs': [290, 460, 'b'], 'knapsack': [190, 460, 'a'], 'dp-recipe': [90, 460, 'b'],
};
export const INTERCHANGES: string[] = ['recursion', 'linked-lists', 'graphs'];

export const stationById = (id: string) => STATIONS.find(s => s.id === id);
export const stationCode = (st: Station) => {
  const same = STATIONS.filter(x => x.line === st.line);
  return LINES[st.line].code + (same.indexOf(st) + 1);
};
