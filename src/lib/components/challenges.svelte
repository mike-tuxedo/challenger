<script>
    import { run } from 'svelte/legacy';

    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$lib/components/ui/dialog";
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from "$lib/components/ui/table";
    import { Copy, Info, Star, Play, Pause, Trash, Edit } from "lucide-svelte";
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from "$lib/components/ui/tooltip";
    import {
        Tabs,
        TabsContent,
        TabsList,
        TabsTrigger,
    } from "$lib/components/ui/tabs";
    import { db } from "$lib/db";
    import { appstate } from "$lib/store";

    let selectedChallenge = null;
    let copiedChallenge = null;
    let favorites = [];
    let activeChallenges = [];
    let deletePopupOpen = $state(false);
    let filterOption = $state("all");
    let challenges = $state([]);
    getChallenges();

    async function getChallenges() {
        const data = await db.challenges.toArray();
        challenges = data;
    };

    function showChallengeDetails(challenge) {
        selectedChallenge = challenge;
    }

    async function copyChallenge(challenge, modify=false) {
        copiedChallenge = $state.snapshot(challenge);
        console.log('delete ',copiedChallenge.id);
        copiedChallenge.name += " (Copy)";
        copiedChallenge.isPublic = false;
        delete copiedChallenge.id;
        let id = await db.challenges.add(copiedChallenge);
        getChallenges();

        if (modify) {
            $appstate.activeView = 'add';
            copiedChallenge.id = id;
            $appstate.editingChallenge = copiedChallenge;
        }
    }

    function editChallenge(challenge) {
        $appstate.activeView = 'add';
        $appstate.editingChallenge = challenge;
    }

    async function deleteChallenge(challenge, deleteActiveChallenge) {
        await db.challenges.delete(challenge.id);

        if (deleteActiveChallenge) {
            db.activeChallenges.delete(challenge.id);
        }
        getChallenges();
        deletePopupOpen = false;
    }

    function toggleFavorite(challenge) {
        console.log($state.snapshot(challenge));
        console.log($state.snapshot(favorites));
        if (favorites.some((fav) => fav.id === challenge.id)) {
            favorites = favorites.filter((fav) => fav.id !== challenge.id);
        } else {
            favorites = [...favorites, challenge];
        }
    }

    async function startChallenge(challenge) {
        const currentChallenge = $state.snapshot(challenge);
        const isInActiveChallenges = await db.activeChallenges.get(currentChallenge.id);

        if (!isInActiveChallenges) {
            if (!currentChallenge.currentDay) {
                currentChallenge.currentDay = 1;
            }

            await db.activeChallenges.put(currentChallenge);

            if (!favorites.some((fav) => fav.id === challenge.id)) {
                await db.favoriteChallenges.add({ challengeId: challenge.id });
            }
        }

        $appstate.currentChallengeId = challenge.id;
        $appstate.activeView = 'challenge';
    }

    function isFavorite(challenge) {
        return favorites.some((fav) => fav.id === challenge.id);
    }
        
    function isStarted(challenge) {
        return activeChallenges.some((started) => started.id === challenge.id);
    }

    let filteredChallenges = $derived(challenges.filter((challenge) => {
        if (filterOption === "all") return true;
        if (filterOption === "own") return !challenge.public;
        if (filterOption === "others") return challenge.public;
    }));

    $effect(() => {
        console.log($state.snapshot(filteredChallenges));
    })
</script>

<h1 class="text-3xl font-bold mb-6">Search Challenges</h1>

<div class="mb-6">
    <Tabs
        value={filterOption}
        onValueChange={(value) => (filterOption = value)}
    >
        <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="own">Your Challenges</TabsTrigger>
            <TabsTrigger value="others">Others Challenges</TabsTrigger>
        </TabsList>
    </Tabs>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#if challenges}
    {#each filteredChallenges as challenge}
        <Card>
            <CardHeader>
                <CardTitle>{challenge.name}</CardTitle>
                <CardDescription
                    >Difficulty: {challenge.difficulty}/5</CardDescription
                >
            </CardHeader>
            <CardContent>
                <p>Number of exercises: {challenge.exercises.length}</p>
                <p>{challenge.isPublic ? "Public" : "Private"} Challenge</p>
                <p>
                    {challenge.isOwn ? "My Challenge" : "Community Challenge"}
                </p>
            </CardContent>
            <CardFooter class="flex justify-between">
                <div class="flex space-x-2">
                    <Dialog bind:open={deletePopupOpen}>
                        <DialogTrigger>
                            <Button variant="outline">
                                <Trash class="h-4 w-4"/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{challenge.name} {challenge.id}</DialogTitle>
                                <DialogDescription
                                    >Delete {challenge.name} Challenge</DialogDescription
                                >
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    class="mb-4"
                                    onclick={() => deleteChallenge(challenge, true)}
                                >
                                    <Copy class="mr-2 h-4 w-4" />
                                    Also delete active challenge
                                </Button>
                                <Button
                                    class="mb-4"
                                    onclick={() => deleteChallenge(challenge, false)}
                                >
                                    <Edit class="mr-2 h-4 w-4" />
                                    Only delete this challenge
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger>
                            <Button variant="outline">
                                <Info class="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{challenge.name}</DialogTitle>
                                <DialogDescription
                                    >Difficulty: {challenge.difficulty}/5</DialogDescription
                                >
                            </DialogHeader>
                            <div class="overflow-auto" style="max-height: calc(100vh - 290px)">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead class="p-2">Day</TableHead>
                                            <TableHead class="p-2">Exercise</TableHead>
                                            <TableHead class="p-2">Reps/Time</TableHead>
                                            <TableHead class="p-2">Sets</TableHead>
                                            <TableHead class="p-2">Pause</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {#each challenge.exercises as exercise}
                                            <TableRow>
                                                <TableCell>{exercise.day}</TableCell>
                                                <TableCell
                                                    >{exercise.name}</TableCell
                                                >
                                                <TableCell
                                                    >{exercise.repsOrTimeValue}
                                                    {exercise.repsOrTime}</TableCell
                                                >
                                                <TableCell
                                                    >{exercise.sets}</TableCell
                                                >
                                                <TableCell
                                                    >{exercise.pauseTime}{exercise.pauseTime !== '-' ? 's' : ''}</TableCell
                                                >
                                            </TableRow>
                                        {/each}
                                    </TableBody>
                                </Table>
                            </div>
                            <DialogFooter>
                                <Button
                                    class="mb-4"
                                    onclick={() => copyChallenge(challenge, true)}
                                >
                                    <Copy class="mr-2 h-4 w-4" />
                                    Copy and Modify
                                </Button>
                                <Button
                                    class="mb-4"
                                    onclick={() => editChallenge(challenge)}
                                >
                                    <Edit class="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                variant="outline"
                                onclick={() => toggleFavorite(challenge)}
                            >
                                <Star
                                    class="h-4 w-4"
                                    fill={isFavorite(challenge)
                                        ? "currentColor"
                                        : "none"}
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {isFavorite(challenge)
                                    ? "Remove from favorites"
                                    : "Add to favorites"}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                    <Button
                        variant="default"
                        onclick={() => copyChallenge(challenge)}
                    >
                        <Copy class="h-4 w-4" />
                    </Button>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                variant="default"
                                onclick={() => startChallenge(challenge)}
                                disabled={isStarted(challenge)}
                            >
								{#if isStarted(challenge)}
									<Pause class="h-4 w-4" />
								{:else}
									<Play class="h-4 w-4" />
								{/if}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {isStarted(challenge)
                                    ? "Challenge already started"
                                    : "Start challenge"}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardFooter>
        </Card>
    {/each}
    {/if}
</div>
