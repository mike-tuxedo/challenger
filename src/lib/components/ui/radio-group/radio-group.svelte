<script>
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, value = $bindable(undefined), children, ...rest } = $props();
	
</script>

<RadioGroupPrimitive.Root bind:value class={cn("grid gap-2", className)} {...rest}>
	{@render children?.()}
</RadioGroupPrimitive.Root>
