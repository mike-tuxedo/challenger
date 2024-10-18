<script>
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import {
        Card,
        CardContent,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from "$lib/components/ui/table";
    import {
        Trash2,
        Copy,
        Share2,
        Plus,
        Save,
        Pencil,
        ArrowRight,
    } from "lucide-svelte";
    import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
    import { Switch } from "$lib/components/ui/switch";
    import NumbersInput from "$lib/components/ui/NumbersInput.svelte";
    import { Slider } from "$lib/components/ui/slider";
    import { Separator } from "$lib/components/ui/separator";
    import { Textarea } from "$lib/components/ui/textarea";
    import { db } from "$lib/db";
    import { appstate } from "$lib/store.js";
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
    let draggedIndex = $state(null);
    let dropIndicatorIndex = $state(null);
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

    if ($appstate.editingChallenge) {
        challenge = $appstate.editingChallenge;
    }

    async function saveChallenge() {
        const currentChallenge = $state.snapshot(challenge);
        const id = await db.challenges.put(currentChallenge);
        delete currentChallenge.id;

        let activeChallenge = await db.activeChallenges.get({originId: id});
        if (activeChallenge) {
            await db.activeChallenges.update(activeChallenge.id, { ...currentChallenge });
        } else {
            await db.activeChallenges.add({ ...currentChallenge, originId: id, user: $appstate.userId });
        }
        
        selectedType = null;
        $appstate.editingChallenge = null;
        $appstate.activeView = "challenges";
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

    function handlePublish() {
        // Handle publish logic here
        console.log("Published with difficulty:", challenge.difficulty);
    }

    function handleDragOver(e, index) {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        dropIndicatorIndex = e.clientY < midpoint ? index : index + 1;
    }

    function handleDragLeave() {
        dropIndicatorIndex = null;
    }

    function handleDrop(e) {
        e.preventDefault();
        const sourceIndex = Number(e.dataTransfer?.getData("text/plain"));
        if (dropIndicatorIndex !== null && sourceIndex !== dropIndicatorIndex) {
            const newExercises = [...challenge.exercises];
            const [removed] = newExercises.splice(sourceIndex, 1);
            const targetIndex =
                dropIndicatorIndex > sourceIndex
                    ? dropIndicatorIndex - 1
                    : dropIndicatorIndex;
            newExercises.splice(targetIndex, 0, removed);
            challenge.exercises = newExercises;
        }
        draggedIndex = null;
        dropIndicatorIndex = null;
    }

    function showExerciseEditor() {
        exercisesEditor = true;
    }
</script>

{#if !exercisesEditor}
    <div style="grid-area: 1/1; max-width: calc(100vw - 3rem)" transition:scale|global={{ duration: 250, start: 0.9 }}>
        <h1 class="text-3xl font-bold mb-6">Create your challenge</h1>
        
        <div class="self-stretch">
            <Input
                type="text"
                placeholder="Give Your Challenge a Name"
                class="text-xl"
                bind:value={challenge.name}
            />
            <Textarea
                type="text"
                placeholder="Describe your Challenge (optional)"
                class="text-xl mt-6"
                bind:value={challenge.description}
            />
            <h2 class="text-1xl mt-6">
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
    <!-- <Separator class="my-4" /> -->
{:else}
    <div style="grid-area: 1/1; max-width: calc(100vw - 3rem)" transition:fly|global={{ x: 100 }}>
        <h1 class="text-3xl font-bold mb-4">Add Exercises</h1>
        <div class="space-y-4 mb-4">
            <div>
                <Input
                    id="exerciseName"
                    placeholder="Exercise Name, e.g. Push-ups"
                    bind:value={newExercise.name}
                />
            </div>

            <RadioGroup bind:value={newExercise.repsOrTime} class="flex">
                <div class="flex items-center space-x-2">
                    <RadioGroupItem value="reps" id="reps" />
                    <Label for="reps">Reps</Label>
                </div>
                <div class="flex items-center space-x-2">
                    <RadioGroupItem value="time" id="time" />
                    <Label for="time">Interval</Label>
                </div>
            </RadioGroup>

            <div class="grid grid-cols-4 gap-4">
                <div>
                    <Label for="repsOrTimeValue"
                        >{newExercise.repsOrTime === "reps"
                            ? "Reps"
                            : "Sec"}</Label
                    >
                    {#if newExercise.repsOrTime === "reps"}
                        <NumbersInput
                            bind:value={newExercise.repsOrTimeValue}
                            interval={1}
                            multiplier={50}
                        />
                    {:else}
                        <NumbersInput
                            bind:value={newExercise.repsOrTimeValue}
                            interval={10}
                            multiplier={60}
                        />
                    {/if}
                </div>
                <div>
                    <Label for="sets">Sets</Label>
                    <NumbersInput
                        bind:value={newExercise.sets}
                        interval={1}
                        multiplier={12}
                    />
                </div>
                <div>
                    <Label for="pause">Pause (sec)</Label>
                    <NumbersInput
                        bind:value={newExercise.pauseTime}
                        interval={5}
                        multiplier={36}
                    />
                </div>
                <div>
                    <Label for="day">Day</Label>
                    <NumbersInput
                        bind:value={newExercise.day}
                        interval={1}
                        multiplier={90}
                    />
                </div>
            </div>
        </div>

        <div class="flex flex-col space-y-4">
            <Button class="w-full" onclick={addOrUpdateExercise}>
                <Plus class="h-6 w-6 mr-2 min-w-[24px] min-h-[24px]" />
                {editingIndex !== null ? "Update Exercise" : "Add Exercise"}
            </Button>
            <Button
                class="w-full"
                variant="outline"
                onclick={addDayOff}
                disabled={editingIndex !== null}
            >
                <Plus class="h-6 w-6 mr-2 min-w-[24px] min-h-[24px]" />
                Add day off
            </Button>
        </div>

        {#if challenge.exercises.length > 0}
            <h2 class="text-lg font-semibold my-4">Your Exercise Plan</h2>
            <div class="relative max-w-full">
                {#if dropIndicatorIndex === 0}
                    <div
                        class="absolute top-0 left-0 right-0 h-0.5 bg-primary z-10"
                    ></div>
                {/if}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="p-2">Day</TableHead>
                            <TableHead class="p-2">Exercise</TableHead>
                            <TableHead class="p-2">Reps Interval</TableHead>
                            <TableHead class="p-2">Sets</TableHead>
                            <TableHead class="p-2">Pause Time</TableHead>
                            <TableHead class="p-2">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {#each challenge.exercises as exercise, index}
                            <TableRow
                                class={`relative ${draggedIndex === index ? "opacity-50" : ""}`}
                                draggable="true"
                                ondragstart={(e) => handleDragStart(e, index)}
                                ondragover={(e) => handleDragOver(e, index)}
                                ondragleave={handleDragLeave}
                                ondrop={handleDrop}
                            >
                                <TableCell class="p-2">{exercise.day}</TableCell
                                >
                                <TableCell class="p-2"
                                    >{exercise.name}</TableCell
                                >
                                <TableCell class="p-2"
                                    >{exercise.repsOrTimeValue}
                                    {exercise.repsOrTime}</TableCell
                                >
                                <TableCell class="p-2"
                                    >{exercise.sets}</TableCell
                                >
                                <TableCell class="p-2"
                                    >{exercise.pauseTime}{exercise.pauseTime !==
                                    "-"
                                        ? "s"
                                        : ""}</TableCell
                                >
                                <TableCell class="p-2">
                                    <div class="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onclick={() => editExercise(index)}
                                        >
                                            <Pencil class="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onclick={() => copyExercise(index)}
                                        >
                                            <Copy class="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onclick={() =>
                                                removeExercise(index)}
                                        >
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {#if dropIndicatorIndex === index + 1}
                                <tr class="h-0.5">
                                    <td colspan="6" class="p-0">
                                        <div class="h-0.5 bg-primary"></div>
                                    </td>
                                </tr>
                            {/if}
                        {/each}
                    </TableBody>
                </Table>
            </div>
        {/if}

        <div class="flex justify-between my-6">
            <Button
                variant="ghost"
                class="justify-start"
                onclick={() => (exercisesEditor = false)}
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
                Back
            </Button>
            <Button onclick={saveChallenge}>
                <Save class="h-6 w-6 mr-2 min-w-[24px] min-h-[24px]" />
                Save challenge
            </Button>
        </div>
    </div>
{/if}
