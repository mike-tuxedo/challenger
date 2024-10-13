<script>
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<div class={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...rest}>
	{@render children?.()}
</div>
