<script>
	import { Toggle as TogglePrimitive } from "bits-ui";
	import { toggleVariants } from "./index.js";
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let {
		class: className = undefined,
		variant = "default",
		size = "default",
		pressed = $bindable(undefined),
		children,
		...rest
	} = $props();
	
</script>

<TogglePrimitive.Root
	bind:pressed
	class={cn(toggleVariants({ variant, size, className }))}
	{...rest}
	on:click
>
	{@render children?.()}
</TogglePrimitive.Root>
