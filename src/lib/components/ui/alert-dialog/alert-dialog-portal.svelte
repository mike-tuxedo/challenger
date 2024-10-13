<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	/** @type {{Record<string, any>}} */
	let { children, ...rest } = $props();
</script>

<AlertDialogPrimitive.Portal {...rest}>
	{@render children?.()}
</AlertDialogPrimitive.Portal>
