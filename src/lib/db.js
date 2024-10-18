import Dexie from 'dexie';
import dexieCloud from "dexie-cloud-addon";

export const db = new Dexie('challenger', {addons: [dexieCloud]});
db.version(1).stores({
    challenges: '@id, type, name, description, exercises, totalDays, difficulty, isPublic, amountOfUsers, creator, timestamp',
    activeChallenges: '@id, originId, type, name, description, exercises, totalDays, difficulty, isPublic, amountOfUsers, creator, timestamp, currentDay, done, user',
    doneChallenges: '@id, challengeId',
    favoriteChallenges: '@id, userId, challengeId',
    user: '@id, name, email, avatar, theme, trackingEnabled, currentChallengeId'
});
db.cloud.configure({
    databaseUrl: "https://z08vlw0us.dexie.cloud",
    requireAuth: false // optional
});