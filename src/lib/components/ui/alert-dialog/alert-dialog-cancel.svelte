<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<AlertDialogPrimitive.Cancel
	class={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
	{...rest}
	on:click
	on:keydown
	let:builder
>
	{@render children?.({ builder, })}
</AlertDialogPrimitive.Cancel>
