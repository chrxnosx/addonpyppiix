import { checkCooldown } from "../utils/cooldown.js"; // ดึงระบบ cooldown มาใช้

// ฟังก์ชันหลักของมีด รับ player เข้ามาทำงาน
export function handleKnifeSkill(player) {

    // --- กรณีที่ 1: Knife Dash (วิ่ง + คลิกขวา) ---
    if (player.isSprinting) {
        if (checkCooldown(player, "Knife Dash", 7)) {
            const viewDir = player.getViewDirection();
            player.applyKnockback(viewDir.x, viewDir.z, 5, 0.5);
            player.playSound("mob.enderdragon.flap");
            player.runCommand("particle minecraft:explosion_particle ^ ^1 ^2");
            player.onScreenDisplay.setActionBar("§b>>> KNIFE DASH! <<<");
        }
    }
    // --- กรณีที่ 2: Knife Slash (ยืน/เดิน + คลิกขวา) ---
    else {
        if (checkCooldown(player, "Knife Slash", 5)) {
            const dimension = player.dimension;
            const entities = dimension.getEntities({
                location: player.location,
                maxDistance: 4,
                excludeFamilies: ["player", "item"]
            });

            for (const entity of entities) {
                if (entity.id !== player.id) {
                    entity.applyDamage(10, { cause: "entityAttack", damagingEntity: player });
                    const dirX = entity.location.x - player.location.x;
                    const dirZ = entity.location.z - player.location.z;
                    entity.applyKnockback(dirX, dirZ, 1, 0.3);
                }
            }
            player.playSound("random.explode");
            player.runCommand("particle minecraft:sweep_attack ^ ^1 ^1.5");
            player.onScreenDisplay.setActionBar("§c!!! KNIFE SLASH !!!");
        }
    }
}