import { world, system } from "@minecraft/server";

// --- ส่วนจัดการ Cooldown ---
const cooldowns = new Map();

function checkCooldown(player, skillName, cooldownTime) {
	const key = `${player.id}_${skillName}`;
	const currentTick = system.currentTick;
	const cdTick = cooldownTime * 20; // แปลงวินาทีเป็น Tick

	if (cooldowns.has(key) && cooldowns.get(key) > currentTick) {
		const timeLeft = ((cooldowns.get(key) - currentTick) / 20).toFixed(1);
		player.onScreenDisplay.setActionBar(`§cWaiting: ${skillName} (${timeLeft}s)`);
		player.playSound("ui.button.click"); // เสียงแก๊กๆ เมื่อติดคูลดาวน์
		return false;
	}

	cooldowns.set(key, currentTick + cdTick);
	return true;
}

// --- ส่วนการทำงานหลัก (Events) ---

world.afterEvents.itemUse.subscribe((event) => {
	const player = event.source;
	const item = event.itemStack;

	// เช็คว่าเป็นดาบหรือไม่ (ถ้าอยากให้ใช้ได้ทุกไอเทม ให้ลบ if นี้ออก)
	// หรือแก้คำว่า "sword" เป็น id ไอเทมของคุณ เช่น "my:knife"
	if (!item.typeId.includes("sword") && !item.typeId.includes("knife")) {
		return;
	}

	// --- กรณีที่ 1: Knife Dash (วิ่ง + คลิกขวา) ---
	if (player.isSprinting) {

		// เช็คคูลดาวน์ 7 วินาที
		if (checkCooldown(player, "Knife Dash", 7)) {
			// :: Effect ส่วนพุ่งตัว ::
			const viewDir = player.getViewDirection();

			// แรงส่ง (พุ่งไปข้างหน้า)
			player.applyKnockback(viewDir.x, viewDir.z, 5, 0.5);

			// เสียงและเอฟเฟกต์
			player.playSound("mob.enderdragon.flap");
			player.runCommand("particle minecraft:explosion_particle ^ ^1 ^2");
			player.runCommand("damage @e[r=4,type=!player] 10 entity_attack entity @s");
			player.onScreenDisplay.setActionBar("§b>>> KNIFE DASH! <<<");
		}

	}
	// --- กรณีที่ 2: Knife Slash (ยืน/เดิน + คลิกขวา) ---
	else {

		// เช็คคูลดาวน์ 5 วินาที
		if (checkCooldown(player, "Knife Slash", 5)) {
			// :: Effect ส่วนฟัน ::

			// สร้าง Damage รอบตัว (รัศมี 4 บล็อก)
			const dimension = player.dimension;
			const entities = dimension.getEntities({
				location: player.location,
				maxDistance: 4,
				excludeFamilies: ["player", "item"] // ไม่ตีพวกเดียวกันและไอเทม
			});

			for (const entity of entities) {
				if (entity.id !== player.id) {
					entity.applyDamage(10, { cause: "entityAttack", damagingEntity: player });
					// ผลักศัตรูออกไปนิดหน่อย
					const dirX = entity.location.x - player.location.x;
					const dirZ = entity.location.z - player.location.z;
					entity.applyKnockback(dirX, dirZ, 1, 0.3);
				}
			}

			// เสียงและเอฟเฟกต์
			player.playSound("random.explode");
			player.runCommand("particle minecraft:sweep_attack ^ ^1 ^1.5");
			player.onScreenDisplay.setActionBar("§c!!! KNIFE SLASH !!!");
		}
	}
});


