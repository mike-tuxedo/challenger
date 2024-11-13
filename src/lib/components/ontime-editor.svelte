<script>
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { CircleAlert, Share2, X, ArrowLeft } from "lucide-svelte";;
	import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
	import { Slider } from "$lib/components/ui/slider";
	import { Textarea } from "$lib/components/ui/textarea";

	let challenge = $state({ name: "", description: "" });
	let isCreated = $state(false);
	let isEditing = $state(false);
	let isPublished = $state(false);
	let difficulty = $state([3]);
	/** @type {{selectedType: any}} */
	let { selectedType = $bindable() } = $props();

	function createChallenge() {
		if (challenge.name && challenge.description) {
			isCreated = true;
		}
	}

	function toggleEdit() {
		isEditing = !isEditing;
	}

	function handlePublish() {
		console.log("Published with difficulty:", difficulty[0]);
		isPublished = true;
	}

	function handleUnpublish() {
		isPublished = false;
	}
</script>

<Card class="w-full max-w-3xl mx-auto">
	<CardHeader>
		<Button variant="outline" class="mb-4" on:click={() => selectedType = null}>
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Challenge Types
		</Button>
		<CardTitle>Create New Onetime Action Challenge</CardTitle>
		<CardDescription>Create your onetime action challenge.</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="challenge-name">Challenge Name</Label>
				<Input id="challenge-name" bind:value={challenge.name} placeholder="e.g., Clean the garage" disabled={isCreated && !isEditing} />
			</div>
			<div class="space-y-2">
				<Label for="description">Challenge Description</Label>
				<Textarea id="description" bind:value={challenge.description} placeholder="Describe your onetime action challenge..." disabled={isCreated && !isEditing} />
			</div>
		</div>
	</CardContent>
	<CardFooter class="flex justify-between items-center">
		{#if !isCreated}
			<Button on:click={createChallenge} class="w-full">
				<CircleAlert class="mr-2 h-4 w-4" />
				Create Challenge
			</Button>
		{:else}
			<div class="flex space-x-2">
				<Button variant="outline" on:click={toggleEdit}>
					<CircleAlert class="mr-2 h-4 w-4" />
					{isEditing ? "Save" : "Edit"}
				</Button>
				{#if !isPublished}
					<Dialog>
						<DialogTrigger>
							<Button>
								<Share2 class="mr-2 h-4 w-4" />
								Publish
							</Button>
						</DialogTrigger>
						<DialogContent class="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Publish Onetime Action Challenge</DialogTitle>
								<DialogDescription>Set the difficulty level for your onetime action challenge before publishing.</DialogDescription>
							</DialogHeader>
							<div class="py-4">
								<Label for="difficulty" class="mb-2 block">Difficulty (1-5)</Label>
								<Slider id="difficulty" bind:value={difficulty} min={1} max={5} step={1} />
								<div class="mt-2 text-center">{difficulty[0]}</div>
							</div>
							<DialogFooter>
								<Button on:click={handlePublish}>Publish</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				{:else}
					<Button variant="destructive" on:click={handleUnpublish}>
						<X class="mr-2 h-4 w-4" />
						Unpublish
					</Button>
				{/if}
			</div>
		{/if}
	</CardFooter>
</Card>
