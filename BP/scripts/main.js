import { world, system } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe((eventData) => {
	eventData.itemComponentRegistry.registerCustomComponent("uam:knife_skill", {
		onUse: (e) => {
			const player = e.source;

			// --- SKILL 2: DASH (กดคลิกขวา ขณะวิ่ง) ---
			if (player.isSprinting) {
				// เปลี่ยน runCommand -> runCommandAsync
				player.runCommandAsync("title @s actionbar §b💨 DASH!!");
				player.playSound("mob.enderdragon.flap");

				const viewDir = player.getViewDirection();
				player.applyKnockback(viewDir.x, viewDir.z, 3.5, 0.3);

				player.addEffect("resistance", 10, { amplifier: 255, showParticles: false });
				player.addEffect("slow_falling", 20, { amplifier: 1, showParticles: false });

				// เปลี่ยน runCommand -> runCommandAsync
				player.runCommandAsync("damage @e[r=4,type=!player] 6 entity_attack entity @s");
				player.runCommandAsync("particle minecraft:sonic_explosion ^ ^1 ^");
			}
			// --- SKILL 1: SLASH (กดคลิกขวา ปกติ) ---
			else {
				player.runCommandAsync("title @s actionbar §c⚔️ SLASH!!");
				player.playSound("entity.player.attack.sweep");

				player.runCommandAsync("particle minecraft:sweep_attack ^ ^1.5 ^2");
				player.runCommandAsync("damage @e[r=4,c=5,type=!player] 8 entity_attack entity @s");
			}
		}
	});
});