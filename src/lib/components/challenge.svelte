<script>
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Progress } from "$lib/components/ui/progress";
    import { Switch } from "$lib/components/ui/switch";
    import { onDestroy } from "svelte";
    import { ArrowLeft, Pause, Play, Check } from "lucide-svelte";
    import { appstate } from "$lib/store";
    import { slide, fly } from "svelte/transition";
    import { db } from "$lib/db";
    import { liveQuery } from "dexie";
    import SoundPlayer from "$lib/soundplayer.js";
    import { Confetti } from "svelte-confetti";

    // Mock data for the currentChallenge
    let isPaused = false;
    let breakTimer = $state(0);
    let breakInterval;

    let currentChallenge = liveQuery(() =>
        db.activeChallenges.get($appstate.currentChallengeId)
    );

    let exercisesOfTheDay = $derived.by(() => {
        if ($currentChallenge) {
            console.log($currentChallenge);
            return $currentChallenge.exercises.filter(
                (cur) => cur.day == $currentChallenge.currentDay
            );
        }
    });
    let completedSets = $derived.by(() => {
        if (exercisesOfTheDay) {
            return exercisesOfTheDay.map((exercise) =>
                Array(exercise.sets * 1).fill(false)
            );
        }
    });
    let progress = $derived(
        (($currentChallenge.currentDay - 1) / $currentChallenge.totalDays) * 100
    );
    let allSetsCompleted = $state(false);

    $effect(() => {
        $inspect(completedSets, allSetsCompleted);
    });

    function toggleSet(exerciseIndex, setIndex) {
        completedSets[exerciseIndex][setIndex] =
            !completedSets[exerciseIndex][setIndex];

        console.log(completedSets);
        if (
            completedSets[exerciseIndex][setIndex] &&
            !isLastSet(exerciseIndex, setIndex)
        ) {
            startBreakTimer(exercisesOfTheDay[exerciseIndex].pauseTime);
        } else {
            stopBreakTimer();
        }

        allSetsCompleted = completedSets.every((exercisesOfTheDay) =>
            exercisesOfTheDay.every((set) => set)
        );
    }

    function isLastSet(exerciseIndex, setIndex) {
        return (
            exerciseIndex === exercisesOfTheDay.length - 1 &&
            setIndex === exercisesOfTheDay[exerciseIndex].sets - 1
        );
    }

    function playBreakSound() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audio = new AudioContext();

        new SoundPlayer(audio).play(540.0, 0.8, "sine", 0).stop(0.8);
    }

    function stopBreakTimer() {
        clearInterval(breakInterval);
        breakTimer = 0;
    }

    function startBreakTimer(duration) {
        console.log("start break timer");

        breakTimer = duration;
        clearInterval(breakInterval);
        breakInterval = setInterval(() => {
            if (breakTimer > 0 && !isPaused) {
                breakTimer--;
                if (breakTimer === 0) {
                    playBreakSound();
                }
            } else if (breakTimer === 0) {
                clearInterval(breakInterval);
            }
        }, 1000);
    }

    function togglePause() {
        isPaused = !isPaused;
    }

    async function finishDay() {
        //TODO in der currentChallenge kann man Tage auslassen. Muss man wahrscheinlich im currentChallengeeditor ändern
        await db.activeChallenges.update($appstate.currentChallengeId, {
            currentDay: $currentChallenge.currentDay + 1,
        });
        // allSetsCompleted = false;
        console.log(allSetsCompleted);
        $appstate.activeView = "dashboard";
    }

    async function back() {
        $appstate.currentChallengeId = null;
        $appstate.activeView = "dashboard";
    }

    onDestroy(() => {
        clearInterval(breakInterval);
    });
</script>

<div
    class="fixed z-10 top-0 left-0 w-full h-screen h-screen flex flex-col p-4 bg-background text-foreground"
>
    {#if $currentChallenge}
        <div class="flex justify-between items-center mb-4">
            <Button variant="ghost" class="p-2" onclick={back}>
                <ArrowLeft class="h-6 w-6" onclick={back} />
            </Button>
            <h1 class="text-2xl font-bold">{$currentChallenge.name}</h1>
            <div class="w-6"></div>
        </div>

        <Progress value={progress} class="w-full mb-6" />

        <h1 class="text-3xl font-bold mb-6 text-center">
            Tag {$currentChallenge.currentDay} von {$currentChallenge.totalDays}
        </h1>

        <div class="flex-grow overflow-y-auto">
            {#if !allSetsCompleted}
                <div transition:slide|global>
                    {#each exercisesOfTheDay as exercise, exerciseIndex}
                        <Card class="mb-4">
                            <CardHeader>
                                <CardTitle class="font-semibold text-3xl"
                                    >{exercise.repsOrTimeValue}
                                    {exercise.name}</CardTitle
                                >
                            </CardHeader>
                            <CardContent>
                                <div class="mb-4 last:mb-0">
                                    <p
                                        class="text-sm text-muted-foreground mb-2"
                                    >
                                        <!-- {exercise.repsOrTime} - {exercise.sets} Sets -->
                                    </p>
                                    <div
                                        class="flex flex-wrap place-content-between"
                                    >
                                        {#each Array(exercise.sets * 1) as _, setIndex}
                                            <div
                                                class="flex items-center w-full mb-8 gap-6"
                                            >
                                                <span class="mr-2 text-4xl"
                                                    >Set {setIndex + 1}</span
                                                >
                                                <Switch
                                                    class="scale-150"
                                                    checked={completedSets[
                                                        exerciseIndex
                                                    ][setIndex]}
                                                    onclick={() =>
                                                        toggleSet(
                                                            exerciseIndex,
                                                            setIndex
                                                        )}
                                                />
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    {/each}
                </div>
            {/if}

            {#if breakTimer > 0}
                <div
                    transition:fly={{ y: 100 }}
                    class="fixed w-full h-full left-0 top-0 mb-4 place-content-center bg-white"
                >
                    <CardContent class="text-center py-4">
                        <CardContent class="text-center py-4 text-4xl">
                            <h3 class=" font-bold mb-4">Pausenzeit</h3>
                            <p class="">{breakTimer}s</p>
                            <Button
                                class="mt-8 scale-150"
                                size="lg"
                                onclick={stopBreakTimer}
                            >
                                <Check class="mr-2 h-4 w-4" /> Pause beenden
                            </Button>
                        </CardContent>
                    </CardContent>
                </div>
            {/if}

            {#if allSetsCompleted}
                <Card
                    class="fixed w-full h-full left-0 top-0 mb-4 place-content-center"
                >
                    <CardContent class="text-center py-4">
                        <h3 class="text-4xl font-bold mb-4">
                            Super, du hast den Tag geschafft!
                        </h3>
                        <p class="text-2xl mb-4">
                            Alle Übungen für Tag {$currentChallenge.currentDay} sind
                            abgeschlossen.
                        </p>
                        <Button
                            class="mt-8 scale-150"
                            size="lg"
                            onclick={allSetsCompleted ? finishDay : togglePause}
                        >
                            <Check class="mr-2 h-4 w-4" /> Tag {$currentChallenge.currentDay}
                            abschließen
                        </Button>
                    </CardContent>
                    <div
                        style="position: fixed; bottom: 50%; left: 50%;"
                    >
                        <Confetti
                            x={[-2, 2]}
                            y={[0.75, 1.5]}
                            delay={[0, 1000]}
                            amount="100"
                            fallDistance="50vh"
                        />
                    </div>
                </Card>
            {/if}
        </div>
    {/if}
</div>
