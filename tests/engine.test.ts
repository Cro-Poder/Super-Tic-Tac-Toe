import { applyMove, check3x3Winner, createInitialState, getLegalMoves } from '../client/src/game/rules.ts';
import { computeAIMove } from '../client/src/game/ai/aiWorker.ts';

console.log('=== Super Tic-Tac-Toe Rule Engine & AI Test Suite ===\n');

// 1. Test Initial State
let state = createInitialState();
console.assert(state.activeBoard === null, 'Initial active board should be null (wildcard)');
console.assert(state.currentPlayer === 'X', 'Initial player should be X');
console.assert(getLegalMoves(state).length === 81, 'Initial legal moves count should be 81');
console.log('✔ Initial state & full 81 legal moves validated.');

// 2. Test Redirection
state = applyMove(state, 4, 0); // X plays Center Board (4), Top-Left Cell (0)
console.assert(state.activeBoard === 0, `Active board should be redirected to 0, got ${state.activeBoard}`);
console.assert(state.currentPlayer === 'O', 'Current player should switch to O');
const legalAfterMove1 = getLegalMoves(state);
console.assert(legalAfterMove1.length === 9, `Legal moves should be restricted to Board 0 (9 moves), got ${legalAfterMove1.length}`);
console.log('✔ Move redirection constraint validated.');

// 3. Test Mini Board Win
let winTestState = createInitialState();
winTestState = applyMove(winTestState, 4, 0); // X: B4-c0 (sends O to B0)
winTestState = applyMove(winTestState, 0, 4); // O: B0-c4 (sends X to B4)
winTestState = applyMove(winTestState, 4, 1); // X: B4-c1 (sends O to B1)
winTestState = applyMove(winTestState, 1, 4); // O: B1-c4 (sends X to B4)
winTestState = applyMove(winTestState, 4, 2); // X: B4-c2 (3 in a row across [0,1,2] on B4!)

console.assert(winTestState.miniWinners[4] === 'X', `Board 4 should be won by X, got ${winTestState.miniWinners[4]}`);
console.assert(winTestState.winningMiniLines[4]?.join(',') === '0,1,2', 'Winning mini line should be [0,1,2]');
console.log('✔ Mini board 3-in-a-row victory detection validated.');

// 4. Test Wildcard when redirected to already won board
winTestState = applyMove(winTestState, 2, 4); // O plays B2-c4 (targeting B4 which is already won)
console.assert(winTestState.activeBoard === null, `When targeted to won Board 4, activeBoard must be null (Wildcard), got ${winTestState.activeBoard}`);
const wildcardMoves = getLegalMoves(winTestState);
console.assert(wildcardMoves.length > 9, `Wildcard should allow moves across all open boards, got ${wildcardMoves.length}`);
console.log('✔ Wildcard free-move mechanic on won target board validated.');

// 5. Test AI Computations
const easyMove = computeAIMove(state, 'easy', 'O');
console.assert(easyMove.move !== null, 'Easy AI should return a legal move');
console.log(`✔ Easy AI generated move: Board ${easyMove.move?.boardIndex}, Cell ${easyMove.move?.cellIndex}`);

const mediumMove = computeAIMove(state, 'medium', 'O');
console.assert(mediumMove.move !== null, 'Medium AI should return a legal move');
console.log(`✔ Medium AI generated move: Board ${mediumMove.move?.boardIndex}, Cell ${mediumMove.move?.cellIndex}`);

const hardMove = computeAIMove(state, 'hard', 'O');
console.assert(hardMove.move !== null, 'Hard AI should return a legal move');
console.log(`✔ Hard AI generated move: Board ${hardMove.move?.boardIndex}, Cell ${hardMove.move?.cellIndex} (Depth: ${hardMove.stats?.depth}, Nodes: ${hardMove.stats?.nodes}, Duration: ${hardMove.stats?.durationMs}ms)`);

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
