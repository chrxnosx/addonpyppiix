import { world, system } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe((eventData) => {
	eventData.itemComponentRegistry.registerCustomComponent("uam:knife_skill", {
		onUse: (e) => {
			const player = e.source;

			// --- SKILL 2: DASH (กดคลิกขวา ขณะวิ่ง) ---
			if (player.isSprinting) {
				// 1. ส่งข้อความและเสียง
				player.runCommand("title @s actionbar §b💨 DASH!!");
				player.playSound("mob.enderdragon.flap");

				// 2. พุ่งตัว (Knockback ไปข้างหน้าตามทิศทางที่มอง)
				const viewDir = player.getViewDirection();
				// applyKnockback(dirX, dirZ, horizontalStrength, verticalStrength)
				player.applyKnockback(viewDir.x, viewDir.z, 3.5, 0.3);

				// 3. ใส่ Effect กันตายตอนพุ่ง
				player.addEffect("resistance", 10, { amplifier: 255, showParticles: false });
				player.addEffect("slow_falling", 20, { amplifier: 1, showParticles: false });

				// 4. ดาเมจรอบตัวตอนพุ่ง (ใช้ command สั้นและง่ายกว่า)
				// ดาเมจ 6 หน่วย รัศมี 4 บล็อก
				player.runCommand("damage @e[r=4,type=!player] 6 entity_attack entity @s");
				player.runCommand("particle minecraft:sonic_explosion ^ ^1 ^");
			}

			// --- SKILL 1: SLASH (กดคลิกขวา ปกติ) ---
			else {
				// 1. ส่งข้อความและเสียง
				player.runCommand("title @s actionbar §c⚔️ SLASH!!");
				player.playSound("entity.player.attack.sweep");

				// 2. แสดง Particle ฟัน
				player.runCommand("particle minecraft:sweep_attack ^ ^1.5 ^2");

				// 3. ทำดาเมจเป็น AOE ด้านหน้า (5x5)
				// damage 8 หน่วย
				player.runCommand("damage @e[r=4,c=5,type=!player] 8 entity_attack entity @s");
			}
		}
	});
});