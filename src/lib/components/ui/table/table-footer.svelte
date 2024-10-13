<script>
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<tfoot class={cn("bg-primary text-primary-foreground font-medium", className)} {...rest}>
	{@render children?.()}
</tfoot>
