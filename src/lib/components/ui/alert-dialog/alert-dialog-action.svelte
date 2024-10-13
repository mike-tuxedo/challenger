<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<AlertDialogPrimitive.Action
	class={cn(buttonVariants(), className)}
	{...rest}
	on:click
	on:keydown
	let:builder
>
	{@render children?.({ builder, })}
</AlertDialogPrimitive.Action>
