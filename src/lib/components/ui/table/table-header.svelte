<script>
	// import { createBubbler } from 'svelte/legacy';
	// const bubble = createBubbler();
	const bubble = (e) => {};

	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<thead class={cn("[&_tr]:border-b", className)} {...rest} onclick={bubble('click')} onkeydown={bubble('keydown')}>
	{@render children?.()}
</thead>
