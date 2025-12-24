import { checkCooldown } from "../utils/cooldown.js";

export function handleGunSkill(player) {
    // ตัวอย่าง: ยิงปืน (คลิกขวา)
    if (checkCooldown(player, "Handgun Shot", 1.5)) {

        // ใส่ Logic ยิงปืนตรงนี้ เช่น spawn projectile
        player.playSound("random.explode"); // เสียงชั่วคราว
        player.onScreenDisplay.setActionBar("§eBang! Bang!");

        // ตัวอย่าง Raycast หรือ Spawn Entity จะมาใส่ตรงนี้ในอนาคต
    }
}