<script>
	// import { createBubbler } from 'svelte/legacy';
	// const bubble = createBubbler();
	const bubble = (e) => {};

	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<td
	class={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
	{...rest}
	onclick={bubble('click')}
	onkeydown={bubble('keydown')}
>
	{@render children?.()}
</td>
