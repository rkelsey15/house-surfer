// Word lists for the comment check. This file is only data, so it is easy to
// review and edit. The logic lives in moderation.js.
//
// How matching works (see moderation.js):
// - Whole words only: "neighborhood" does not match "neighbor".
// - Lowercase, accents removed, repeated letters squeezed ("ownerrrs" = "owners").
// - Number and symbol swaps are undone inside a word ("n3ighbors", "0wners").
// - Spaced-out letters are joined ("o w n e r s", "o.w.n.e.r.s").
// - Possessives are trimmed ("owner's" = "owner").
//
// This is a starter list. It will miss clever wording and sometimes block a
// harmless comment. A real launch adds an AI check on top (PRD Appendix D).

// The one message people see when a comment is stopped.
export const BLOCK_MESSAGE = 'Talk about the house, not the people who live there.'

// Words for the people tied to a home. Blocked on their own.
export const PERSON_WORDS = [
  // Owners and residents
  'owner', 'owners', 'owns', 'homeowner', 'homeowners', 'landlord', 'landlords', 'landlady',
  'resident', 'residents', 'occupant', 'occupants', 'inhabitant', 'inhabitants',
  'tenant', 'tenants', 'renter', 'renters', 'roommate', 'roommates',
  // Neighbors
  'neighbor', 'neighbors', 'neighbour', 'neighbours',
  // Family
  'family', 'families', 'kid', 'kids', 'child', 'children', 'wife', 'husband',
  // Individuals
  'guy', 'guys', 'man', 'men', 'woman', 'women', 'lady', 'ladies', 'dude',
]

// Short phrases about people or their behavior. Each phrase is a list of words.
export const PERSON_PHRASES = [
  ['lives', 'here'], ['live', 'here'], ['lives', 'there'], ['live', 'there'],
  ['who', 'lives'], ['who', 'live'], ['who', 'owns'],
  ['the', 'people'], ['those', 'people'], ['these', 'people'], ['people', 'who'],
  ['sketchy', 'people'], ['shady', 'people'],
  ['never', 'home'], ['not', 'home'], ['out', 'of', 'town'],
]

// "family" is fine when it describes the house, not the people.
// Each phrase is checked after the person words above, and wins over them.
export const ALLOWED_PHRASES = [
  ['family', 'room'],
  ['family', 'home'],
  ['family', 'friendly'],
  ['family', 'size'],
  ['family', 'sized'],
  ['family', 'kitchen'],
  ['family-friendly'],
  ['family-sized'],
]

// Insults and slurs aimed at anyone. Blocked on their own.
export const INSULT_WORDS = [
  // Insults
  'idiot', 'idiots', 'moron', 'morons', 'imbecile', 'loser', 'losers', 'jerk', 'jerks',
  'scum', 'creep', 'deadbeat', 'deadbeats', 'lowlife',
  // Profanity used as insults
  'asshole', 'assholes', 'bastard', 'bastards', 'bitch', 'bitches', 'dickhead', 'douchebag',
  'prick', 'slut', 'whore',
  // Slurs
  'nigger', 'nigga', 'faggot', 'fag', 'dyke', 'tranny', 'retard', 'retarded', 'spic', 'chink', 'kike',
]

// The short "Why?" line shown under the block message. Names the house rule.
export const WHY_MESSAGE = 'Why? House rule 1: talk about the house, never the people who live there. No names, schedules or plate numbers.'
