<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	import { CircleAlert, Trash2, Copy, Share2, GripVertical, ArrowLeft } from "lucide-svelte";;
	import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
	import { Slider } from "$lib/components/ui/slider";
	import { Switch } from "$lib/components/ui/switch";
	import { Textarea } from "$lib/components/ui/textarea";

	let habits = $state([]);
	let newHabit = $state({ name: "", amount: "", days: [], description: "" });
	let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	let editingIndex = $state(null);
	let isPublished = $state(false);
	let difficulty = $state([3]);
	let draggedIndex = $state(null);
	let dropIndicatorIndex = $state(null);

	let { selectedType = $bindable() } = $props();

	function addOrUpdateHabit() {
		if (newHabit.name && newHabit.amount && newHabit.days.length > 0) {
			if (editingIndex !== null) {
				habits[editingIndex] = { ...newHabit, id: habits[editingIndex].id };
				editingIndex = null;
			} else {
				habits = [...habits, { ...newHabit, id: Date.now() }];
			}
			resetNewHabit();
		}
	}

	function resetNewHabit() {
		newHabit = { name: "", amount: "", days: [], description: "" };
	}

	function removeHabit(index) {
		habits = habits.filter((_, i) => i !== index);
		if (editingIndex === index) {
			editingIndex = null;
			resetNewHabit();
		}
	}

	function editHabit(index) {
		newHabit = { ...habits[index] };
		editingIndex = index;
	}

	function copyHabit(index) {
		newHabit = { ...habits[index], name: `${habits[index].name} (Copy)` };
		editingIndex = null;
	}

	function toggleDay(day) {
		if (newHabit.days.includes(day)) {
			newHabit.days = newHabit.days.filter((d) => d !== day);
		} else {
			newHabit.days = [...newHabit.days, day];
		}
	}

	function handlePublish() {
		// Handle publish logic here
		console.log("Published with difficulty:", difficulty[0]);
	}

	function handleDragStart(e, index) {
		draggedIndex = index;
		e.dataTransfer?.setData("text/plain", index.toString());
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
			const newHabits = [...habits];
			const [removed] = newHabits.splice(sourceIndex, 1);
			const targetIndex = dropIndicatorIndex > sourceIndex ? dropIndicatorIndex - 1 : dropIndicatorIndex;
			newHabits.splice(targetIndex, 0, removed);
			habits = newHabits;
		}
		draggedIndex = null;
		dropIndicatorIndex = null;
	}
</script>

<Card class="w-full max-w-3xl mx-auto">
	<CardHeader>
		<Button variant="outline" class="mb-4" onclick={() => selectedType = null}>
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Challenge Types
		</Button>
		<CardTitle>{editingIndex !== null ? "Edit Habit" : "Add New Habit"}</CardTitle>
		<CardDescription>Add or edit your habits, amount per day, days to track, and description.</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="habit-name">Habit Name</Label>
					<Input id="habit-name" bind:value={newHabit.name} placeholder="e.g., Drink Water" />
				</div>
				<div class="space-y-2">
					<Label for="amount">Amount per Day</Label>
					<Input id="amount" bind:value={newHabit.amount} placeholder="e.g., 2 liters, 5000 steps" />
				</div>
			</div>
			<div class="space-y-2">
				<Label>Days</Label>
				<div class="flex flex-wrap gap-2">
					{#each daysOfWeek as day}
						<Button variant={newHabit.days.includes(day) ? "default" : "outline"} size="sm" onclick={() => toggleDay(day)}>
							{day.slice(0, 3)}
						</Button>
					{/each}
				</div>
			</div>
			<div class="space-y-2">
				<Label for="description">Habit Description</Label>
				<Textarea id="description" bind:value={newHabit.description} placeholder="Describe your habit..." />
			</div>
		</div>
	</CardContent>
	<CardFooter>
		<Button onclick={addOrUpdateHabit} class="w-full">
			<CircleAlert class="mr-2 h-4 w-4" />
			{editingIndex !== null ? "Update Habit" : "Add Habit"}
		</Button>
	</CardFooter>
</Card>

{#if habits.length > 0}
	<Card class="mt-8 w-full max-w-3xl mx-auto">
		<CardHeader>
			<CardTitle>Your Habit Tracker</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="relative">
				{#if dropIndicatorIndex === 0}
					<div class="absolute top-0 left-0 right-0 h-0.5 bg-primary z-10"></div>
				{/if}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead></TableHead>
							<TableHead>Habit</TableHead>
							<TableHead>Amount/Day</TableHead>
							<TableHead>Days</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each habits as habit, index (habit.id)}
							<TableRow class={`relative ${draggedIndex === index ? "opacity-50" : ""}`} draggable="true" ondragstart={(e) => handleDragStart(e, index)} ondragover={(e) => handleDragOver(e, index)} ondragleave={handleDragLeave} ondrop={handleDrop}>
								<TableCell>
									<GripVertical class="h-4 w-4 cursor-move" />
								</TableCell>
								<TableCell>{habit.name}</TableCell>
								<TableCell>{habit.amount}</TableCell>
								<TableCell>{habit.days.map((day) => day.slice(0, 3)).join(", ")}</TableCell>
								<TableCell>{habit.description}</TableCell>
								<TableCell>
									<div class="flex space-x-2">
										<Button variant="outline" size="icon" onclick={() => editHabit(index)}>
											<CircleAlert class="h-4 w-4" />
										</Button>
										<Button variant="outline" size="icon" onclick={() => copyHabit(index)}>
											<Copy class="h-4 w-4" />
										</Button>
										<Button variant="destructive" size="icon" onclick={() => removeHabit(index)}>
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
		</CardContent>
		<CardFooter class="flex justify-between items-center">
			<div class="flex items-center space-x-2">
				<Switch bind:checked={isPublished} id="publish" />
				<Label for="publish">Publish</Label>
			</div>
			<Dialog>
				<DialogTrigger>
					<Button disabled={!isPublished}>
						<Share2 class="mr-2 h-4 w-4" />
						Publish
					</Button>
				</DialogTrigger>
				<DialogContent class="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Publish Habit Tracker</DialogTitle>
						<DialogDescription>Set the difficulty level for your habit tracker before publishing.</DialogDescription>
					</DialogHeader>
					<div class="py-4">
						<Label for="difficulty" class="mb-2 block">Difficulty (1-5)</Label>
						<Slider id="difficulty" bind:value={difficulty} min={1} max={5} step={1} />
						<div class="mt-2 text-center">{difficulty[0]}</div>
					</div>
					<DialogFooter>
						<Button onclick={handlePublish}>Publish</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</CardFooter>
	</Card>
{/if}
