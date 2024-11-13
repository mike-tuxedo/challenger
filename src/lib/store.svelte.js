import { writable } from "svelte/store";

export const appstate = $state({ activeView: 'dashboard', editingChallenge: null, currentChallengeId: null, userId: null });