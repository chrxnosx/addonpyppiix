import { world } from "@minecraft/server";

// Server-side script: listen for item use and trigger the BP event on the player entity.
world.events.beforeItemUse.subscribe((ev) => {
	try {
		const player = ev.source;
		if (!player || !ev.item) return;
		const itemId = typeof ev.item === 'string' ? ev.item : ev.item.id;
		if (itemId === 'uam:darwin_kaname_knife') {
			// Run the entity event server-side so BP events are found reliably.
			player.runCommandAsync(`event entity @s uam:knife_slash`);
		}
	} catch (e) {
		// swallow errors to avoid crashing the script environment
		console.error("knife script error:", e);
	}
});
