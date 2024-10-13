<script>
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<div
	class={cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)}
	{...rest}
>
	{@render children?.()}
</div>
