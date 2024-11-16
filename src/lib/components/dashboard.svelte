<script>
    import { scale, fade, fly } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Share2, Heart, Globe, Trash, Copy, ChevronsDown } from "lucide-svelte";
    import { db } from "$lib/db";
    import { liveQuery } from "dexie";
    import { appstate } from "$lib/store.svelte.js";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$lib/components/ui/dialog";
    import { empty } from "$lib/utils.js";

    let activeChallenges = liveQuery(() => db.activeChallenges.toArray());

    function createNewChallenge() {
        console.log("Creating new challenge...");
    }

    function searchExistingChallenges() {
        console.log("Searching existing challenges...");
    }

    function donate() {
        console.log("Opening donate page...");
    }
    
    function share() {
        console.log("Opening share funktion...");
    }

    async function startChallenge(challenge) {
        const currentChallenge = { ...challenge };

        appstate.currentChallengeId = challenge.id;
        appstate.activeView = "challenge";
    }

    async function deleteChallenge(challenge) {
        db.activeChallenges.delete(challenge.id);
    }
</script>

<div class="page" transition:scale|global={{ duration: 250, start: 0.9 }}>
    <h1 class="headline">Active Challenge</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow" style="min-height: calc(100vh - 300px);">
        {#if !empty($activeChallenges)}
            {#each $activeChallenges as activeChallenge, index}
                <Card>
                    <CardHeader>
                        <CardTitle>{activeChallenge.name}</CardTitle>
                        <CardDescription
                            >Difficulty: {activeChallenge.difficulty}/5</CardDescription
                        >
                    </CardHeader>
                    <CardContent>
                        <p class="mb-4">
                            Progress: {activeChallenge.currentDay - 1} days of {activeChallenge.totalDays}
                            completed
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="default"
                            onclick={() => startChallenge(activeChallenge)}
                            >Continue Challenge</Button
                        >

                        <Dialog>
                            <DialogTrigger>
                                <Button variant="outline" class="ml-4">
                                    <Trash class="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle
                                        >{activeChallenge.name}</DialogTitle
                                    >
                                    <DialogDescription>
                                        <p>
                                            Delete {activeChallenge.name} from your
                                            active Challenges?
                                        </p>
                                        <p>
                                            Attention, all your progress on this
                                            challenge will be deleted too!
                                        </p>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        onclick={() =>
                                            deleteChallenge(activeChallenge)}
                                    >
                                        <Copy class="mr-2 h-4 w-4" />
                                        Yes delete it
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>

                    <!-- {#if index < $activeChallenges.length - 1}
                    <Separator class="my-8" />
                {/if} -->
                </Card>
            {/each}
        {:else}
        <section class="text-center py-32" id="section1">
            <h2 class="text-accent">Keine Aktive Challenge??<br>Na dann ran an den Speck!</h2>
            <p class="mb-8">Such dir was schönes aus den schon integrierten Challenges aus.</p>
            <Button variant="outline" class="mb-8" on:click={appstate.activeView = "challenges"}>Zu den Challenges</Button>
            <div>
                <a href="#section2" class="nextsection my-6 mx-auto p-4 inline-block"><ChevronsDown/></a>
            </div>
        </section >
        <section class="text-center py-32" id="section2">
            <h3 class="text-accent mt-8">Community Challenges und automatische Backups nutzen?</h3>
            <p class="mb-8">Wenn du dich anmeldest, kannst du sogar alle challenges der community nutzen.</p>
            <Button variant="outline" class="mb-8" on:click={appstate.activeView = "user"}>Account anlegen</Button>
            <div>
                <a href="#section3" class="nextsection my-6 mx-auto p-4 inline-block"><ChevronsDown/></a>
            </div>
        </section>
        <section class="text-center py-32" id="section3">
            <h3 class="text-accent mt-8">Du hast eigene Vorstellungen?</h3>
            <p class="mb-8">Dann lege gleich los und erstelle deine eigenen Challenges, ganz nach deinen Vorstellungen!</p>
            <Button variant="outline" class="mb-8" on:click={appstate.activeView = "add"}>Eigene Challenge erstellen</Button>
            <div>
                <a href="#section4" class="nextsection my-6 mx-auto p-4 inline-block"><ChevronsDown/></a>
            </div>
        </section>
        {/if}
        <section class="text-center pt-32 pb-4" id="section4">
            <h3 class="text-accent mt-8">Über diese App</h3>
            <p class="mb-8">
                Privatsphäre und Datenschutz sind hier an oberster Stelle. Diese App ist Gratis, Opensource 
                und wird auch nie Werbung beinhalten oder persönliche Daten ungesichert abspeichern oder weiter geben. 
                Wir hassen das alles selbst und wollen nicht von Apps regelrecht "beobachtet" werden und darum bauen wir sowas auch nicht ein!
                Wenn dir die App gefällt, du sie hoffentlich auch öfters benützt, dann teile sie doch gerne mit Freunden.
                Falls du super zufrieden bist und was über hast, freuen wir uns natürlich immer über eine kleine Spende.
            </p>
            <Button variant="outline" class="w-full sm:w-auto mb-2" onclick={share}>
                <Share2 class="mr-2 h-4 w-4" />
                Teilen
            </Button>
            <Button variant="outline" class="w-full sm:w-auto mb-2" onclick={donate}>
                <Heart class="mr-2 h-4 w-4" />
                Donate and Support Us
            </Button>
            <Button
                variant="outline"
                class="w-full sm:w-auto mb-2"
                onclick={() => goto("/")}
            >
                <Globe class="mr-2 h-4 w-4" />
                Webpage
            </Button>
        </section>
    </div>
</div>