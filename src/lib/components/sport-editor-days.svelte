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
    import { dndzone, dragHandle, dragHandleZone } from "svelte-dnd-action";
	import {flip} from "svelte/animate";
	
	let initialExercise = {
        name: "",
        modus: "reps",
        amount: 1,
        pause: 30,
        sets: 3,
    };
    let days = $state([]);
    let dragDisabled = $state(false);
    let isDrawerOpen = $state(false);
    let currentExercise = $state({ ...initialExercise });
    let editingDayIndex = $state(-1);
    let editingExerciseIndex = $state(-1);

	$effect(() => console.log(days));


    function addDay() {
        days = [...days, { id: crypto.randomUUID(), exercises: [] }];
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
                { ...currentExercise, id: crypto.randomUUID() },
            ];
        }
        isDrawerOpen = false;
    }

    function copyDay(dayIndex) {
        const newDay = JSON.parse(JSON.stringify(days[dayIndex]));
        newDay.id = crypto.randomUUID();
        newDay.exercises.forEach(
            (exercise) => (exercise.id = crypto.randomUUID())
        );
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
        newExercise.id = crypto.randomUUID();
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

    function handleDndConsider(e) {
        const newDays = e.detail.items;
        if (newDays.every((day) => day.id && day.exercises)) {
            days = newDays;
        }
    }

    function handleDndFinalize(e) {
        const newDays = e.detail.items;
        if (newDays.every((day) => day.id && day.exercises)) {
            days = newDays;
        }
    }

    function handleExerciseDndConsider(e, dayIndex) {
        const newExercises = e.detail.items;
        if (newExercises.every((exercise) => exercise.id)) {
            days[dayIndex].exercises = newExercises;
        }
    }

    function handleExerciseDndFinalize(e, dayIndex) {
        const newExercises = e.detail.items;
        if (newExercises.every((exercise) => exercise.id)) {
            days[dayIndex].exercises = newExercises;
        }
    }

    // use:dndzone={{ items: days, type: "days", dragDisabled }}
	const flipDurationMs = 100;
</script>

<section
	use:dragHandleZone={{ items: days, flipDurationMs }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
>
    {#each days as day, dayIndex (day.id)}
        <div class="mb-6 p-4 border rounded-lg" animate:flip="{{ duration: flipDurationMs }}">
            <div class="flex items-center justify-between mb-2">
                <h3 class="flex text-lg font-semibold border-bottom" use:dragHandle><GripVertical/> Day {dayIndex + 1}</h3>
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
            </div>
            <div
                use:dndzone={{
                    items: day.exercises,
                    type: "exercises",
                    dragDisabled,
                }}
                on:consider={(e) => handleExerciseDndConsider(e, dayIndex)}
                on:finalize={(e) => handleExerciseDndFinalize(e, dayIndex)}
            >
                {#each day.exercises as exercise, exerciseIndex (exercise.id)}
                    <div
                        class="relative py-2 flex justify-between items-center border-top"
                    >
						<Separator class="absolute top-0" />
                        <div class="flex flex-grow pe-4">
                            <span class="font-medium flex-grow">{exercise.name}</span>
                            <span class="text-sm text-gray-500 ml-2">{exercise.amount} {#if exercise.modus === 'reps'}reps{:else}sec{/if}</span>
                            <span class="text-sm text-gray-500 ml-2">{exercise.sets} set{#if exercise.sets > 1}s{/if}</span>
                            <span class="text-sm text-gray-500 ml-2">{exercise.pause} sec pause</span>
                        </div>
                        <div class="flex space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onclick={() =>
                                    openExerciseDrawer(dayIndex, exerciseIndex)}
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
    {/each}
</section>

<Button onclick={addDay} class="w-full">
    <Plus class="h-4 w-4 mr-2" /> Add Day
</Button>

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
