<script>
    import { Separator } from "$lib/components/ui/separator";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
    import NumbersInput from "$lib/components/ui/NumbersInput.svelte";
    import {
        Drawer,
        DrawerContent,
        DrawerHeader,
        DrawerTitle,
        DrawerFooter,
    } from "$lib/components/ui/drawer";
    import { Plus, Copy, GripVertical, Trash2, Pencil } from "lucide-svelte";
    import { flip } from "svelte/animate";
    import { moveArrayItem } from "$lib/utils.js";
    import { v4 as uuidv4 } from "uuid";

    let { goBack } = $props();
    let initialExercise = {
        name: "",
        modus: "reps",
        amount: 1,
        pause: 30,
        sets: 3,
    };
    let days = $state([]);
    let isDrawerOpen = $state(false);
    let isMenuDrawerOpen = $state(false);
    let currentExercise = $state({ ...initialExercise });
    let editingDayIndex = $state(-1);
    let editingExerciseIndex = $state(-1);

    $effect(() => console.log(days));

    function addDay() {
        days = [...days, { id: uuidv4(), exercises: [] }];
    }

    function openExerciseDrawer(dayIndex, exerciseIndex = -1) {
        editingDayIndex = dayIndex;
        editingExerciseIndex = exerciseIndex;
        if (exerciseIndex >= 0) {
            currentExercise = { ...days[dayIndex].exercises[exerciseIndex] };
        } else {
            currentExercise = { ...initialExercise };
        }
        isDrawerOpen = true;
    }

    function saveExercise() {
        if (editingExerciseIndex >= 0) {
            days[editingDayIndex].exercises[editingExerciseIndex] = {
                ...currentExercise,
            };
        } else {
            days[editingDayIndex].exercises = [
                ...days[editingDayIndex].exercises,
                { ...currentExercise, id: uuidv4() },
            ];
        }
        isDrawerOpen = false;
    }

    function copyDay(dayIndex) {
        const newDay = JSON.parse(JSON.stringify(days[dayIndex]));
        newDay.id = uuidv4();
        newDay.exercises.forEach((exercise) => (exercise.id = uuidv4()));
        days = [
            ...days.slice(0, dayIndex + 1),
            newDay,
            ...days.slice(dayIndex + 1),
        ];
    }

    function copyExercise(dayIndex, exerciseIndex) {
        const newExercise = JSON.parse(
            JSON.stringify(days[dayIndex].exercises[exerciseIndex])
        );
        newExercise.id = uuidv4();
        days[dayIndex].exercises = [
            ...days[dayIndex].exercises.slice(0, exerciseIndex + 1),
            newExercise,
            ...days[dayIndex].exercises.slice(exerciseIndex + 1),
        ];
    }

    function removeDay(dayIndex) {
        days = days.filter((_, index) => index !== dayIndex);
    }

    function removeExercise(dayIndex, exerciseIndex) {
        days[dayIndex].exercises = days[dayIndex].exercises.filter(
            (_, index) => index !== exerciseIndex
        );
    }

    /** Drag Functionality */
    let draggOverDayIndex = $state(-2);
    let draggedDayIndex = $state(-2);

    let draggOverExIndex = $state(-2);
    let draggedExIndex = $state(-2);
    function onDragExStart(e, index) {
        draggedExIndex = index;
    }
    function onDragExOver(e, index) {
        const item = e.currentTarget;
        const itemRect = item.getBoundingClientRect();
        const itemMiddle = itemRect.top + itemRect.height / 2;
        draggOverExIndex = e.clientY > itemMiddle ? index : index - 1;
    }
    function onDragExEnd(e, index, dayIndex) {
        let newIndex =
            draggOverExIndex < draggedExIndex
                ? draggOverExIndex + 1
                : draggOverExIndex;
        const tmp = moveArrayItem(
            days[dayIndex].exercises,
            draggedExIndex,
            newIndex
        );
        days[dayIndex].exercises = tmp;
        draggedExIndex = -2;
        draggOverExIndex = -2;
    }

    let dayNumbers = $state();
    function openDayNumberDrawer(e, dayIndex) {
        draggedDayIndex = dayIndex;
        dayNumbers = Array.from({ length: days.length }, (_, i) => i * 1);
        isMenuDrawerOpen = true;
    }

    function changeDay(e, newIndex) {
        days = moveArrayItem(days, draggedDayIndex, newIndex);
        isMenuDrawerOpen = false;
    }
</script>

<section class="flex-grow">
    {#each days as day, dayIndex (day.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="mb-6 p-4 border rounded-lg itemwrapper bg-secondary"
            class:draggOver={draggOverDayIndex === dayIndex}
            animate:flip={{ duration: 200 }}
        >
            <div class="item">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onclick={() => copyDay(dayIndex)}
                        >
                            <Copy class="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onclick={() => removeDay(dayIndex)}
                        >
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                    <h3
                        class="flex text-lg font-semibold border-bottom content-right"
                        onclick={(e) => openDayNumberDrawer(e, dayIndex)}
                    >
                        Day {dayIndex + 1}
                        <GripVertical />
                    </h3>

                    <Drawer bind:open={isMenuDrawerOpen}>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Move Day to ...</DrawerTitle>
                            </DrawerHeader>
                            <div
                                class="grid grid-cols-4 gap-2 mb-4 overflow-auto"
                            >
                                {#each dayNumbers as newIndex}
                                    <Button
                                        variant="outline"
                                        on:click={(e) => changeDay(e, newIndex)}
                                    >
                                        {newIndex}
                                    </Button>
                                {/each}
                            </div>
                            <DrawerFooter>
                                <Button
                                    onclick={() => (isMenuDrawerOpen = false)}
                                    >Cancel</Button
                                >
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
                <div>
                    {#each day.exercises as exercise, exerciseIndex (exercise.id)}
                        <div
                            class="relative py-2 flex justify-between items-center border-top itemwrapper"
                            ondragover={(e) => onDragExOver(e, exerciseIndex)}
                        >
                            <Separator class="absolute top-0" />
                            <div class="flex flex-grow pe-4">
                                <span
                                    class="font-medium flex-grow"
                                    ondragstart={(e) =>
                                        onDragExStart(e, exerciseIndex)}
                                    ondragend={(e) =>
                                        onDragExEnd(e, exerciseIndex, dayIndex)}
                                    draggable="true">{exercise.name}</span
                                >
                                <span class="text-sm text-gray-500 ml-2"
                                    >{exercise.amount}
                                    {#if exercise.modus === "reps"}reps{:else}sec{/if}</span
                                >
                                <span class="text-sm text-gray-500 ml-2"
                                    >{exercise.sets} set{#if exercise.sets > 1}s{/if}</span
                                >
                                <span class="text-sm text-gray-500 ml-2"
                                    >{exercise.pause} sec pause</span
                                >
                            </div>
                            <div class="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onclick={() =>
                                        openExerciseDrawer(
                                            dayIndex,
                                            exerciseIndex
                                        )}
                                >
                                    <Pencil class="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onclick={() =>
                                        copyExercise(dayIndex, exerciseIndex)}
                                >
                                    <Copy class="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onclick={() =>
                                        removeExercise(dayIndex, exerciseIndex)}
                                >
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </div>
                            {#if exerciseIndex === day.exercises.length - 1}
                                <Separator class="absolute bottom-0" />
                            {/if}
                        </div>
                    {/each}
                </div>
                <Button
                    variant="outline"
                    onclick={() => openExerciseDrawer(dayIndex)}
                    class="w-full mt-2"
                >
                    <Plus class="h-4 w-4 mr-2" /> Add Exercise
                </Button>
            </div>
        </div>
    {/each}
</section>

<div class="flex justify-between">
    <Button
        variant="ghost"
        class="justify-start"
        onclick={goBack}
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
    <Button onclick={addDay} class="justify-end">
        <Plus class="h-4 w-4 mr-2" /> Add Day
    </Button>
</div>

<Drawer bind:open={isDrawerOpen}>
    <DrawerContent>
        <DrawerHeader>
            <DrawerTitle
                >{editingExerciseIndex >= 0 ? "Edit" : "Add"} Exercise</DrawerTitle
            >
        </DrawerHeader>
        <div class="p-4 space-y-4">
            <div>
                <Input
                    id="exerciseName"
                    placeholder="Exercise Name, e.g. Push-ups"
                    bind:value={currentExercise.name}
                />
            </div>

            <RadioGroup bind:value={currentExercise.modus} class="flex">
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
                    <Label for="amount"
                        >{currentExercise.modus === "reps"
                            ? "Reps"
                            : "Sec"}</Label
                    >
                    {#if currentExercise.modus === "reps"}
                        <NumbersInput
                            bind:value={currentExercise.amount}
                            interval={1}
                            multiplier={50}
                        />
                    {:else}
                        <NumbersInput
                            bind:value={currentExercise.amount}
                            interval={10}
                            multiplier={60}
                        />
                    {/if}
                </div>
                <div>
                    <Label for="sets">Sets</Label>
                    <NumbersInput
                        bind:value={currentExercise.sets}
                        interval={1}
                        multiplier={12}
                    />
                </div>
                <div>
                    <Label for="pause">Pause (sec)</Label>
                    <NumbersInput
                        bind:value={currentExercise.pause}
                        interval={5}
                        multiplier={36}
                    />
                </div>
            </div>
        </div>
        <DrawerFooter>
            <Button onclick={saveExercise}>Save Exercise</Button>
        </DrawerFooter>
    </DrawerContent>
</Drawer>

<style>
    .draggOver {
        background-color: rgba(255, 255, 255, 0.5);
    }
</style>
