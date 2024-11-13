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
    import { Plus, Search, Heart, Globe, Trash, Copy } from "lucide-svelte";
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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow" style="min-height: calc(100vh - 252px);">
        {#if $activeChallenges}
            {#each $activeChallenges as activeChallenge, index}
                <Card class>
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
            <Card>
                <CardHeader>
                    Keine Aktive Challenge?? Na dann ran an den Speck! Such dir
                    was schönes aus oder werde kreativ.

                    <CardTitle>No Active Challenge</CardTitle>
                    <CardDescription
                        >Start a new challenge or choose from existing ones</CardDescription
                    >
                </CardHeader>
                <CardContent>
                    <p>
                        You don't have any active challenges at the moment.
                        Create a new one or search for existing challenges to
                        get started!
                    </p>
                </CardContent>
                <CardHeader>
                    <CardTitle>Create New Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Design your own custom challenge tailored to your
                        fitness goals.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button variant="default" onclick={createNewChallenge}>
                        <Plus class="mr-2 h-4 w-4" />
                        Create Challenge
                    </Button>
                </CardFooter>
                <CardHeader>
                    <CardTitle>Search Existing Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Explore a variety of pre-designed challenges from our
                        community.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button
                        variant="default"
                        onclick={searchExistingChallenges}
                    >
                        <Search class="mr-2 h-4 w-4" />
                        Search Challenges
                    </Button>
                </CardFooter>
            </Card>
        {/if}
    </div>
    
    <footer class="mt-8 text-center">
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
    </footer>
</div>

