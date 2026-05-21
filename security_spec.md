# Security Spec

## Data Invariants
1. A User document can only be created and updated by the user themselves. The userId must match the authenticated uid.
2. A Race Record must be associated with the currently authenticated user. `userId` in the document must match auth.uid.
3. System timestamps (`createdAt`, `updatedAt`) must use `request.time`.

## The Dirty Dozen Payloads
1. Create user with missing required fields
2. Create user with invalid car type (e.g. 'alien_ship')
3. Create user for another user's UID (spoofing)
4. Update another user's settings
5. Inject an excessive length string into an ID or settings field
6. Set coins to a string or massive object
7. Create a Race Record for another user
8. Create a Race Record without a trackId
9. Update a Race Record (which should be immutable after creation)
10. Attempt to spoof 'timeMs' as a negative number
11. Inject an unnecessary huge string as a trackId
12. Attempt to make a blanket query of all users

## Test Runner
The firestore.rules.test.ts will assert all these invariants.
