// Boundary unit tests for connectionState (spec v3.2 section 2 dev note):
// first lesson, current lesson, current+1, last lesson, and a user with zero
// progress. Runs under plain node; exits non-zero on any failure. Wired into the
// nexus compiler and the accuracy gate.
import { connectionState } from './connectionState.js';

let failed = 0;
const eq = (name, got, want) => {
  if (got !== want) { console.error(`  FAIL ${name}: got ${got}, want ${want}`); failed++; }
  else console.log(`  ok   ${name} -> ${got}`);
};
const E = (position) => ({ lessonId: `l${position}`, route: 'history', position });

// A 5-lesson route. "progress" = number of lessons completed in the route.
// Zero progress: lesson 1 is up_next, everything after is ahead.
eq('zero progress, lesson 1', connectionState(E(1), { history: 0 }), 'up_next');
eq('zero progress, lesson 2', connectionState(E(2), { history: 0 }), 'ahead');
eq('zero progress, last lesson (5)', connectionState(E(5), { history: 0 }), 'ahead');
eq('missing route entirely', connectionState(E(1), {}), 'up_next');
eq('null routeProgress', connectionState(E(1), null), 'up_next');

// User is on lesson 3 (completed 2). 1,2 completed; 3 up_next; 4,5 ahead.
eq('completed 2, lesson 1 (past)', connectionState(E(1), { history: 2 }), 'completed');
eq('completed 2, lesson 2 (just done)', connectionState(E(2), { history: 2 }), 'completed');
eq('completed 2, lesson 3 (current)', connectionState(E(3), { history: 2 }), 'up_next');
eq('completed 2, lesson 4 (current+1)', connectionState(E(4), { history: 2 }), 'ahead');
eq('completed 2, lesson 5 (last)', connectionState(E(5), { history: 2 }), 'ahead');

// All done: every lesson completed, nothing up_next or ahead.
eq('all completed, last lesson', connectionState(E(5), { history: 5 }), 'completed');
eq('all completed, lesson 3', connectionState(E(3), { history: 5 }), 'completed');

// Route isolation: progress in another route does not affect this one.
eq('other-route progress ignored', connectionState(E(2), { finance: 9, history: 0 }), 'ahead');

// Bad input is a throw, not a silent wrong state.
try { connectionState({ route: 'x', position: 0 }, {}); console.error('  FAIL zero position should throw'); failed++; }
catch (_) { console.log('  ok   zero position throws'); }

if (failed) { console.error(`\nconnectionState: ${failed} test(s) failed.`); process.exit(1); }
console.log('\nconnectionState: all boundary tests passed.');
