<script>
	// import { createBubbler } from 'svelte/legacy';
	// const bubble = createBubbler();
	const bubble = (e) => {};

	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<tr
	class={cn(
		"hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
		className
	)}
	{...rest}
	onclick={bubble('click')}
	onkeydown={bubble('keydown')}
>
	{@render children?.()}
</tr>
