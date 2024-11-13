<script>
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { ArrowRight } from "lucide-svelte";
    import { Slider } from "$lib/components/ui/slider";
    import { Textarea } from "$lib/components/ui/textarea";
    import SportEditorDays from "$lib/components/sport-editor-days.svelte";
    import { db } from "$lib/db";
    import { appstate } from "$lib/store.svelte.js";
    import { fly, scale } from "svelte/transition";

    let initialExercise = {
        name: "",
        repsOrTime: "reps",
        repsOrTimeValue: 1,
        pauseTime: 30,
        sets: 3,
        timesADay: 1,
        day: 1,
    };
    let newExercise = $state({ ...initialExercise });
    let dayoff = {
        name: "Day Off",
        repsOrTime: "",
        repsOrTimeValue: "-",
        pauseTime: "-",
        sets: 0,
        timesADay: "-",
        day: 1,
    };
    let editingIndex = $state(null);
    let exercisesEditor = $state(false);

    /** @type {{selectedType: any}} */
    let { selectedType = $bindable() } = $props();
    let challenge = $state({
        type: selectedType,
        name: "",
        description: "",
        exercises: [],
        totalDays: 0,
        difficulty: [3],
        isPublic: false,
        amountOfUsers: 0,
        creator: 0,
        timesADaytamp: Date.now(),
    });

    if (appstate.editingChallenge) {
        challenge = appstate.editingChallenge;
    }

    async function saveChallenge() {
        const currentChallenge = $state.snapshot(challenge);
        const id = await db.challenges.put(currentChallenge);
        delete currentChallenge.id;

        let activeChallenge = await db.activeChallenges.get({ originId: id });
        if (activeChallenge) {
            await db.activeChallenges.update(activeChallenge.id, {
                ...currentChallenge,
            });
        } else {
            await db.activeChallenges.add({
                ...currentChallenge,
                originId: id,
                user: appstate.userId,
            });
        }

        selectedType = null;
        appstate.editingChallenge = null;
        appstate.activeView = "challenges";
    }

    function addOrUpdateExercise() {
        if (
            newExercise.name &&
            newExercise.repsOrTimeValue > 0 &&
            newExercise.pauseTime >= 0 &&
            newExercise.sets > 0 &&
            newExercise.timesADay > 0 &&
            newExercise.day
        ) {
            if (editingIndex !== null) {
                challenge.exercises[editingIndex] = { ...newExercise };
                editingIndex = null;
            } else {
                challenge.exercises = [
                    ...challenge.exercises,
                    { ...newExercise },
                ];
                challenge.totalDays = newExercise.day;
            }
        }
    }

    function addDayOff() {
        dayoff.day = challenge.exercises.length
            ? challenge.exercises[challenge.exercises.length - 1].day + 1
            : 1;
        challenge.exercises = [...challenge.exercises, dayoff];
    }

    function resetNewExercise() {
        newExercise = { ...initialExercise };
    }

    function removeExercise(index) {
        challenge.exercises = challenge.exercises.filter((_, i) => i !== index);
        if (editingIndex === index) {
            editingIndex = null;
            resetNewExercise();
        }
    }

    function editExercise(index) {
        newExercise = { ...challenge.exercises[index] };
        editingIndex = index;
    }

    function copyExercise(index) {
        newExercise = {
            ...challenge.exercises[index],
            name: challenge.exercises[index].name,
        };
        editingIndex = null;
    }

    function showExerciseEditor() {
        exercisesEditor = true;
    }
</script>

{#if !exercisesEditor}
    <div class="page flex flex-col" transition:scale|global={{ duration: 250, start: 0.9 }}>
        <h1 class="text-3xl font-bold mb-6">Create your challenge</h1>

        <div class="flex-grow">
            <Input
                type="text"
                placeholder="Give Your Challenge a Name"
                class="text-sm"
                bind:value={challenge.name}
            />
            <Textarea
                type="text"
                placeholder="Describe your Challenge (optional)"
                class="text-sm mt-6"
                bind:value={challenge.description}
            />
            <h2 class="text-2xl mt-6">
                How difficult will your challenge become?
            </h2>
            <div class="py-4">
                <Label for="difficulty" class="mb-2 block"
                    >Difficulty (1-5)</Label
                >
                <Slider
                    id="difficulty"
                    bind:value={challenge.difficulty}
                    min={1}
                    max={5}
                    step={1}
                />
                <div class="mt-2 text-center">{challenge.difficulty}</div>
            </div>
        </div>

        <div class="flex justify-between">
            <Button
                variant="ghost"
                class="mb-4"
                onclick={() => (selectedType = null)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>
                Back to Challenge Types
            </Button>
            <Button variant="default" class="mb-4" onclick={showExerciseEditor}>
                Next
                <ArrowRight />
            </Button>
        </div>
    </div>
{:else}
    <div class="page flex flex-col" transition:fly|global={{ x: 100 }}>
        <h1 class="headline">Add Exercises</h1>
        <SportEditorDays goBack={() => exercisesEditor = false}/>
    </div>
{/if}
