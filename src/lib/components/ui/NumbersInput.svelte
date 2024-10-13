<script>
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
	import { cn } from "$lib/utils";

	/** @type {{value?: any, multiplier?: number, interval?: number}} */
	let { value = $bindable(null), multiplier = 10, interval = 1 } = $props();
	let customNumber = $state("");
	let dialogOpen = $state(false);

	const predefinedNumbers = Array.from({ length: multiplier }, (_, i) => (i + 1) * interval);

	function selectNumber(num) {
		value = num;
		customNumber = num.toString();
        console.log('close');

		closeDialog();
	}

	function handleCustomNumberInput() {
		const num = parseInt(customNumber);
		if (!isNaN(num) && num > 0) {
			value = num;
			closeDialog();
		}
	}

	function closeDialog() {
		dialogOpen = false;
	}
</script>

<div>
	<Dialog bind:open={dialogOpen}>
		<DialogTrigger variant="outline" class="w-full">
			<Button variant="outline" class="size-full">
				{value ? value : "Select Number"}
			</Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Select a Number</DialogTitle>
			</DialogHeader>
			<div class="grid grid-cols-4 gap-2 mb-4 overflow-auto" style="max-height: calc(100vh - 290px)">
				{#each predefinedNumbers as num}
					<Button variant="outline" class={cn(value === num && "bg-primary text-primary-foreground")} on:click={() => selectNumber(num)}>
						{num}
					</Button>
				{/each}
			</div>
			<div class="flex items-center space-x-2">
				<Input type="number" placeholder="Custom number" bind:value={customNumber} />
				<Button on:click={handleCustomNumberInput}>Set</Button>
			</div>
		</DialogContent>
	</Dialog>
</div>
