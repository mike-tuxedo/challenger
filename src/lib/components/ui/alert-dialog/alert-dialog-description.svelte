<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	/** @type {{Record<string, any>}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<AlertDialogPrimitive.Description
	class={cn("text-muted-foreground text-sm", className)}
	{...rest}
>
	{@render children?.()}
</AlertDialogPrimitive.Description>
