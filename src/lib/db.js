import Dexie from 'dexie';

export const db = new Dexie('challenger');
db.version(1).stores({
    challenges: '++id, type, name, description, exercises, totalDays, difficulty, isPublic, amountOfUsers, creator, timestamp',
    activeChallenges: '++id, type, name, description, exercises, totalDays, difficulty, isPublic, amountOfUsers, creator, timestamp, currentDay, currentSet',
    doneChallenges: '++id, challengeId',
    favoriteChallenges: '++id, userId, challengeId',
    user: '++id, name, email, avatar, theme, trackingEnabled, currentChallengeId'
});