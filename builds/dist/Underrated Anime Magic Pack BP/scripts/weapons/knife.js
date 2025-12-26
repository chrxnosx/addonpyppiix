import { checkCooldown } from "../utils/cooldown.js"; // อย่าลืมไฟล์ cooldown นะครับ

export function handleKnifeSkill(player) {

    // --- สกิล 1: Knife Dash (วิ่ง + คลิกขวา) ---
    if (player.isSprinting) {
        // เช็คคูลดาวน์ 7 วินาที
        if (checkCooldown(player, "Knife Dash", 7)) {
            const viewDir = player.getViewDirection();

            // พุ่งตัว
            player.applyKnockback(viewDir.x, viewDir.z, 5, 0.5);

            // Effect
            player.playSound("mob.enderdragon.flap");
            player.runCommand("particle minecraft:explosion_particle ^ ^1 ^2");
            player.onScreenDisplay.setActionBar("§b>>> KNIFE DASH! <<<");
        }
    }
    // --- สกิล 2: Knife Slash (ยืน/เดิน + คลิกขวา) ---
    else {
        // เช็คคูลดาวน์ 5 วินาที
        if (checkCooldown(player, "Knife Slash", 5)) {

            // สร้างดาเมจรอบตัวรัศมี 4 บล็อก
            const dimension = player.dimension;
            const entities = dimension.getEntities({
                location: player.location,
                maxDistance: 4,
                excludeFamilies: ["player", "item", "inanimate"] // ไม่ตีพวกเดียวกัน/ของตก
            });

            for (const entity of entities) {
                if (entity.id !== player.id) {
                    entity.applyDamage(10, { cause: "entityAttack", damagingEntity: player });

                    // ผลักศัตรูออกไป
                    const dirX = entity.location.x - player.location.x;
                    const dirZ = entity.location.z - player.location.z;
                    entity.applyKnockback(dirX, dirZ, 1, 0.3);
                }
            }

            // Effect
            player.playSound("random.explode");
            player.runCommand("particle minecraft:sweep_attack ^ ^1 ^1.5");
            player.onScreenDisplay.setActionBar("§c!!! KNIFE SLASH !!!");
        }
    }
}