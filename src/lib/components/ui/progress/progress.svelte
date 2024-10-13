<script>
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, max = 100, value = undefined, ...rest } = $props();
	
</script>

<ProgressPrimitive.Root
	class={cn("bg-secondary relative h-4 w-full overflow-hidden rounded-full", className)}
	{...rest}
>
	<div
		class="bg-primary h-full w-full flex-1 transition-all"
		style={`transform: translateX(-${100 - (100 * (value ?? 0)) / (max ?? 1)}%)`}
	></div>
</ProgressPrimitive.Root>
