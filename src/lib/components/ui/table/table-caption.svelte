<script>
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<caption class={cn("text-muted-foreground mt-4 text-sm", className)} {...rest}>
	{@render children?.()}
</caption>
