import { writable } from "svelte/store";

export const appstate = writable({ activeView: 'dashboard', editingChallenge: null, currentChallengeId: null });