<script>
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
    import { db } from "$lib/db";
    import { appstate } from "$lib/store";

	(async () => {
		let user = await db.user.toArray();
		console.log('user', user);
		if (!user.length) {
			const id = await db.user.add({name: 'TestUser'});
			$appstate.userId = id;
		}
	})()

	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<ModeWatcher />
{@render children?.()}
