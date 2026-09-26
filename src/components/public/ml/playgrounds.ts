// ─── The three playground programs, with a note on each line that matters ─
// Written for somebody who has never programmed: plain lists, one idea per
// line, if/else instead of anything clever, and only the Python on the
// "Python words" card. Each row is [line of code, note]. A note of '' means
// the line is not worth stopping on.
//
// The numbers these print are the numbers on the page: $222 + $6.72 a square
// metre, "visits less than 4", and 13 / 15 / 15 / 15 / 16 against 19 for the
// vote. Change a program and the widgets above it will disagree with it.

export interface Program {
  code: string;
  notes: string[];
}

function program(rows: [string, string?][]): Program {
  return { code: rows.map(r => r[0]).join('\n'), notes: rows.map(r => r[1] ?? '') };
}

export const PLAY_LINE = program([
  ['# Twelve flats: how big they are (m²) and their rent ($ a month).'],
  ['size = [28, 35, 41, 46, 52, 58, 63, 70, 76, 84, 91, 98]', 'A list of 12 flat sizes, in square metres.'],
  ['rent = [410, 430, 505, 520, 585, 600, 665, 690, 760, 780, 870, 880]', 'Their rents, in the same order. The first flat is 28 m² and rents for $410.'],
  [''],
  [''],
  ['# How far does a line miss? Add up the gap for every flat.'],
  ['def total_miss(start, per_m2):', 'Our own command. Give it a line — a starting price and a price per m² — and it adds up how far that line misses all 12 flats.'],
  ['    miss = 0', 'Start the total at zero.'],
  ['    for i in range(12):', 'Go through the flats one by one: i is 0, then 1, … up to 11.'],
  ['        guess = start + per_m2 * size[i]', 'What the line says this flat should rent for. * means “times”.'],
  ['        miss = miss + abs(rent[i] - guess)', 'How far off was that? abs drops any minus sign, so too high and too low both count.'],
  ['    return miss', 'Hand the total back.'],
  [''],
  [''],
  ['# 1. Try a line yourself. Change these two numbers.'],
  ['my_start = 200', 'Your line: start at $200 …'],
  ['my_per_m2 = 7', '… and add $7 for every square metre. Change these two, press Run, and try to get the miss down.'],
  ['print(f"My line misses by ${total_miss(my_start, my_per_m2):.0f}")', 'Show how far your line misses. The first $ is just a dollar sign; {…} drops the number in; :.0f means “no decimals”.'],
  [''],
  ['# 2. Let the computer try 60,000 lines and keep the best one.'],
  ['best_miss = total_miss(my_start, my_per_m2)', 'The best line so far. We start with yours.'],
  ['best_start = my_start'],
  ['best_per_m2 = my_per_m2'],
  ['for start in range(150, 300):', 'Try every starting price from $150 to $299 …'],
  ['    for cents in range(500, 900):', '… and for each one, every price per m² from $5.00 to $8.99. 150 × 400 = 60,000 lines.'],
  ['        per_m2 = cents / 100', 'range only counts in whole numbers, so we count in cents and divide by 100.'],
  ['        miss = total_miss(start, per_m2)'],
  ['        if miss < best_miss:', 'Does this line miss by less than the best so far?'],
  ['            best_miss = miss', 'Then it is the new best. Remember it.'],
  ['            best_start = start'],
  ['            best_per_m2 = per_m2'],
  [''],
  ['print(f"Best line: ${best_start} + ${best_per_m2} per m²")', 'This is what LinearRegression finds. It just uses maths to get there instead of trying every line.'],
  ['print(f"It misses by ${best_miss:.0f} in total")'],
  [''],
  ['# 3. Use the best line to predict a new flat.'],
  ['print(f"A 65 m² flat -> about ${best_start + best_per_m2 * 65:.0f} a month")', 'Predicting is just using the line: start + price per m² × 65.'],
]);

export const PLAY_TREE = program([
  ['# Fourteen gym members.'],
  ['# How often each one comes (visits a month) ...'],
  ['visits = [1, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 9, 11, 12]', 'A list of 14 numbers, one per member. The first member comes once a month.'],
  ['# ... and what really happened: 1 = cancelled, 0 = stayed.'],
  ['cancelled = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]', 'The answers, in the same order. The first six cancelled.'],
  [''],
  [''],
  ['# Ask "visits less than cut_off?" and count the mistakes.'],
  ['def count_wrong(cut_off):', 'Our own command. Give it a cut-off and it tells you how many members that question gets wrong.'],
  ['    wrong = 0', 'Start the mistake counter at zero.'],
  ['    for i in range(14):', 'Go through the members one at a time: i is 0 for the first, up to 13 for the last.'],
  ['        if visits[i] < cut_off:', 'The tree’s question. visits[i] is how often member number i comes.'],
  ['            guess = 1      # yes -> guess "cancels"', 'Yes side of the tree: we guess they cancel.'],
  ['        else:'],
  ['            guess = 0      # no  -> guess "stays"', 'No side: we guess they stay.'],
  ['        if guess != cancelled[i]:', '!= means “is not equal to”. Our guess does not match what really happened …'],
  ['            wrong = wrong + 1', '… so add one mistake.'],
  ['    return wrong', 'Hand the count back.'],
  [''],
  [''],
  ['# Try every cut-off. Keep the one with the fewest mistakes.'],
  ['best = 2', 'The best cut-off so far. We start with the first one we will try.'],
  ['for cut_off in range(2, 10):', 'Try cut-offs 2, 3, 4 … 9. range stops just before 10.'],
  ['    print(f"visits < {cut_off}  ->  {count_wrong(cut_off)} of 14 wrong")', 'Show the score for this cut-off. The f lets us drop numbers into the text with { }.'],
  ['    if count_wrong(cut_off) < count_wrong(best):', 'Fewer mistakes than the best so far? Then this one is the new best.'],
  ['        best = cut_off'],
  [''],
  ['print(f"The tree\'s first question: visits less than {best}?")', 'This is what DecisionTreeClassifier does for its first question — for every column, very fast.'],
]);

export const PLAY_FOREST = program([
  ['# The same 20 gym members as the widget above.'],
  ['visits  = [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8, 9, 9, 11, 12]', 'Three lists, all in the same order. The first number in each belongs to Amy.'],
  ['months  = [2, 9, 3, 18, 1, 7, 26, 4, 11, 30, 2, 13, 5, 20, 3, 10, 2, 22, 6, 15]'],
  ['answers = [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0]  # 1 = quit', 'What really happened: 1 = quit, 0 = stayed.'],
  [''],
  [''],
  ['# Five tiny trees. Each asks ONE question. True means "will quit".'],
  ['def tree1(i): return visits[i] < 3', 'A tiny tree. For member number i it answers True (will quit) or False (will stay).'],
  ['def tree2(i): return visits[i] < 5'],
  ['def tree3(i): return visits[i] < 7'],
  ['def tree4(i): return months[i] < 6'],
  ['def tree5(i): return months[i] < 12', 'Five trees, five different questions — the same five as Tree 1 to Tree 5 above.'],
  [''],
  ['trees = [tree1, tree2, tree3, tree4, tree5]', 'Put all five trees in one list, so we can go through them.'],
  [''],
  [''],
  ['# The forest: ask all five trees and count the "quit" votes.'],
  ['def forest(i):', 'The forest is a command too. It answers for member number i.'],
  ['    votes = 0', 'Start the quit votes at zero.'],
  ['    for tree in trees:', 'Ask each tree in turn.'],
  ['        if tree(i):', 'Does this tree say quit?'],
  ['            votes = votes + 1', 'Then add one vote.'],
  ['    return votes >= 3      # 3 or more of 5 say quit -> quit', 'Most votes wins: 3 or more of the 5 means quit.'],
  [''],
  [''],
  ['# How many of the 20 does a model get right?'],
  ['def score(model):', 'Give it any model — one tree, or the whole forest — and it counts how many of the 20 it gets right.'],
  ['    right = 0'],
  ['    for i in range(20):'],
  ['        if model(i) == answers[i]:', '== asks “are these equal?”. Did the model guess what really happened?'],
  ['            right = right + 1'],
  ['    return right'],
  [''],
  [''],
  ['for n in range(5):', 'Score each tree on its own …'],
  ['    print(f"Tree {n + 1} on its own:  {score(trees[n])} / 20 right")'],
  ['print(f"All five voting:     {score(forest)} / 20 right")', '… then the forest. Compare the numbers.'],
]);
