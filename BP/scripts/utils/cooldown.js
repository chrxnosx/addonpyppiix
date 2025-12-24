import { system } from "@minecraft/server";

const cooldowns = new Map();

/**
 * ฟังก์ชันเช็ค Cooldown ที่ใช้ได้กับทุกอาวุธ
 */
export function checkCooldown(player, skillName, cooldownTime) {
    const key = `${player.id}_${skillName}`;
    const currentTick = system.currentTick;
    const cdTick = cooldownTime * 20;

    if (cooldowns.has(key) && cooldowns.get(key) > currentTick) {
        const timeLeft = ((cooldowns.get(key) - currentTick) / 20).toFixed(1);
        player.onScreenDisplay.setActionBar(`§cWaiting: ${skillName} (${timeLeft}s)`);
        player.playSound("ui.button.click");
        return false; // ติดคูลดาวน์
    }

    cooldowns.set(key, currentTick + cdTick);
    return true; // ใช้ได้
}