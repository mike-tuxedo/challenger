<script>
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<th
	class={cn(
		"text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
		className
	)}
	{...rest}
>
	{@render children?.()}
</th>
