// Run with: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BLOCK_MESSAGE } from '../src/lib/moderation-words.js'
import { checkComment, moderate } from '../src/lib/moderation.js'

// These match the examples in docs/02-user-stories.md, section 3.
const SHOULD_PASS = [
  ['P1', 'Gorgeous porch and I love the teal door.'],
  ['P2', 'Needs a new roof but the bones look great.'],
  ['P3', 'Best garden on the block.'],
  ['P4', 'The neighborhood is so quiet and leafy.'],
  ['P5', 'Huge family room windows.'],
  ['P6', 'A great family home with a big yard.'],
  ['P7', 'Craftsman details everywhere, 10/10.'],
  ['P8', 'That turret is wild.'],
  // Whole words only (AC 3.6)
  ['P9', 'Great ownership of the corner lot.'],
  ['P10', 'The tenant-ready roof looks new.'],
  // Harmless words that a cruder list would catch
  ['P11', 'A couple of windows need paint.'],
  ['P12', 'Ivy creeps up the whole front wall.'],
  ['P13', 'The paint color is loud.'],
  ['P14', 'This house looks creepy at night.'],
  ['P15', '3 bd, 2 ba, built in the 1950s. Love the 2-story layout.'],
  // Number swaps and spacing must not break "family room"
  ['P16', 'FAMILY ROOM is huge'],
  ['P17', 'f4mily room is huge'],
  ['P18', 'Big f a m i l y   room'],
]

const SHOULD_FAIL = [
  ['F1', 'The owners never mow the lawn.'],
  ['F2', 'My neighbor says a creep lives here.'],
  ['F3', 'Tenants trash this place.'],
  ['F4', 'The guy who lives here is rude.'],
  ['F5', 'Their kids are so loud.'],
  ['F6', 'Whoever owns this has no taste.'],
  ['F7', 'Sketchy people hang around here.'],
  ['F8', 'What an idiot to paint it that color.'],
  ['F9', 'The residents are never home.'],
  ['F10', 'O W N E R S are lazy'],
  // Tricks (AC 3.5)
  ['F11', 'The n3ighbors are loud'],
  ['F12', 'The n e i g h b o r s are loud'],
  ['F13', 'o.w.n.e.r.s never fix anything'],
  ['F14', 'N-E-I-G-H-B-O-R-S are loud'],
  ['F15', 'The 0wners are lazy'],
  ['F16', 'The ownerrrs are lazy'],
  ['F17', "The owner's truck is always out front"],
  ['F18', 'The TENANTS are loud'],
  ['F19', 'What an id10t'],
  ['F20', 'Total l0ser lives in there'],
  ['F21', 'Nice family room but the kids are loud'],
  ['F22', 'The f4mily who lives here is loud'],
  ['F23', 'They are never home'],
]

for (const [id, text] of SHOULD_PASS) {
  test(`${id} passes: ${text}`, () => assert.equal(checkComment(text), null))
}
for (const [id, text] of SHOULD_FAIL) {
  test(`${id} is blocked: ${text}`, () => assert.equal(checkComment(text), BLOCK_MESSAGE))
}

test('blocked message is exact (AC 3.1)', () => {
  assert.equal(BLOCK_MESSAGE, 'Talk about the house, not the people who live there.')
})

test('reasons are person or insult (AC 3.4)', () => {
  assert.deepEqual(moderate('The owners are lazy'), { ok: false, reason: 'person' })
  assert.deepEqual(moderate('What an idiot'), { ok: false, reason: 'insult' })
  assert.deepEqual(moderate('Lovely porch'), { ok: true })
})

test('empty text does not crash', () => {
  assert.equal(checkComment(''), null)
  assert.equal(checkComment(undefined), null)
})
