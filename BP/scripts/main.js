import { world } from "@minecraft/server";
// นำเข้าฟังก์ชันจากไฟล์อื่น
import { handleKnifeSkill } from "./weapons/knife.js";
import { handleGunSkill } from "./weapons/gun.js";

world.afterEvents.itemUse.subscribe((event) => {
	const player = event.source;
	const item = event.itemStack;

	// --- เช็คว่าเป็น มีด หรือไม่ ---
	// (สมมติว่าไอเทมมีดมีคำว่า sword หรือ knife ใน ID)
	if (item.typeId === "uam:darwin_kaname_knife") {
		handleKnifeSkill(player);
		return;
	}
	// --- เช็คว่าเป็น ปืน หรือไม่ ---
	// (สมมติว่าไอเทมปืนมีคำว่า gun หรือ pistol)
	if (item.typeId.includes("gun") || item.typeId.includes("pistol")) {
		handleGunSkill(player);
		return;
	}
});