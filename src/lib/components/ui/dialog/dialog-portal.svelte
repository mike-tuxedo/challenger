<script>
	import { Dialog as DialogPrimitive } from "bits-ui";
	/** @type {{Record<string, any>}} */
	let { children, ...rest } = $props();
</script>

<DialogPrimitive.Portal {...rest}>
	{@render children?.()}
</DialogPrimitive.Portal>
