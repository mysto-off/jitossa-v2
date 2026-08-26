import { xpRange } from './levelling.js';

export const CLASSES = {
	knight: {
		name: 'Knight',
		emoji: '🛡️',
		desc: 'Penjaga seimbang, ATK & DEF tinggi',
		base: { hp: 120, mana: 40, atk: 15, def: 12, crit: 5 },
		growth: { hp: 18, mana: 6, atk: 3, def: 2.5, crit: 0.3 },
		skill: { name: 'Slash', emoji: '⚔️', cost: 12, power: 2.0, desc: 'Tebasan keras' },
	},
	tanker: {
		name: 'Tanker',
		emoji: '🧱',
		desc: 'Benteng hidup, HP & DEF raksasa',
		base: { hp: 180, mana: 30, atk: 8, def: 18, crit: 3 },
		growth: { hp: 26, mana: 4, atk: 1.6, def: 3.4, crit: 0.2 },
		skill: { name: 'Shield Bash', emoji: '🗡️', cost: 10, power: 1.4, desc: 'Serang + pertahanan ekstra' },
	},
	mage: {
		name: 'Mage',
		emoji: '🔮',
		desc: 'Ahli sihir, damage tembus pertahanan',
		base: { hp: 80, mana: 90, atk: 22, def: 5, crit: 8 },
		growth: { hp: 12, mana: 14, atk: 4.2, def: 1.2, crit: 0.5 },
		skill: { name: 'Fireball', emoji: '🔥', cost: 25, power: 3.0, magic: true, desc: 'Tembus pertahanan' },
	},
	archer: {
		name: 'Archer',
		emoji: '🏹',
		desc: 'Pemanah, critical tinggi',
		base: { hp: 95, mana: 50, atk: 18, def: 7, crit: 20 },
		growth: { hp: 14, mana: 7, atk: 3.3, def: 1.4, crit: 1.2 },
		skill: { name: 'Rapid Shot', emoji: '🎯', cost: 15, power: 1.6, hits: 2, desc: 'Serangan ganda' },
	},
};

export const AREAS = [
	{
		id: 'forest',
		name: '🌲 Hutan Evermore',
		min: 1,
		loot: ['herb', 'wood', 'meat'],
		mobs: [
			{ name: 'Serigala', emoji: '🐺', hp: 40, atk: 8, def: 3, exp: 20, money: 15 },
			{ name: 'Goblin', emoji: '👺', hp: 50, atk: 10, def: 5, exp: 25, money: 20 },
			{ name: 'Slime', emoji: '🟢', hp: 30, atk: 6, def: 2, exp: 15, money: 10 },
		],
		boss: { name: 'King Thorne', emoji: '🦁', hp: 180, atk: 18, def: 10, exp: 150, money: 300 },
	},
	{
		id: 'cave',
		name: '🕳️ Gua Shadowdeep',
		min: 10,
		loot: ['iron', 'stone', 'coal', 'herb'],
		mobs: [
			{ name: 'Kelelawar Gua', emoji: '🦇', hp: 80, atk: 15, def: 6, exp: 40, money: 30 },
			{ name: 'Golem Batu', emoji: '🗿', hp: 120, atk: 18, def: 14, exp: 50, money: 40 },
			{ name: 'Kerangka', emoji: '💀', hp: 90, atk: 20, def: 10, exp: 45, money: 35 },
		],
		boss: { name: 'Grottak the Troll', emoji: '👹', hp: 350, atk: 28, def: 18, exp: 400, money: 800 },
	},
	{
		id: 'castle',
		name: '🏰 Kastil Duskhollow',
		min: 25,
		loot: ['gold', 'iron', 'gem', 'hide'],
		mobs: [
			{ name: 'Ksatria Hantu', emoji: '👻', hp: 180, atk: 30, def: 15, exp: 90, money: 70 },
			{ name: 'Dark Mage', emoji: '🧙', hp: 150, atk: 38, def: 10, exp: 100, money: 80 },
			{ name: 'Wraith', emoji: '🌑', hp: 200, atk: 33, def: 18, exp: 95, money: 75 },
		],
		boss: { name: 'Lord Vadrik', emoji: '🧛', hp: 600, atk: 48, def: 25, exp: 900, money: 2000 },
	},
	{
		id: 'demon',
		name: '😈 Alam Netherrealm',
		min: 50,
		loot: ['gold', 'gem', 'rarewood'],
		mobs: [
			{ name: 'Hellhound', emoji: '🔥', hp: 280, atk: 45, def: 20, exp: 160, money: 130 },
			{ name: 'Demon Guard', emoji: '😈', hp: 350, atk: 55, def: 30, exp: 180, money: 150 },
			{ name: 'Succubus', emoji: '💜', hp: 300, atk: 60, def: 22, exp: 170, money: 140 },
		],
		boss: { name: 'Malakor', emoji: '👿', hp: 1000, atk: 75, def: 40, exp: 2000, money: 5000 },
	},
];

export const ITEMS = {
	// consumable
	potion: { name: 'Potion', emoji: '🧪', type: 'consumable', heal: 60, price: 100 },
	elixir: { name: 'Elixir', emoji: '🔵', type: 'consumable', mana: 50, price: 120 },
	bread: { name: 'Roti', emoji: '🍞', type: 'consumable', heal: 30, price: 40 },
	steak: { name: 'Steak', emoji: '🥩', type: 'consumable', heal: 80, price: 200 },
	// material
	wood: { name: 'Kayu', emoji: '🪵', type: 'material', price: 8 },
	stone: { name: 'Batu', emoji: '🪨', type: 'material', price: 5 },
	coal: { name: 'Batu Bara', emoji: '⬛', type: 'material', price: 15 },
	iron: { name: 'Besi', emoji: '⛓️', type: 'material', price: 40 },
	gold: { name: 'Emas', emoji: '🪙', type: 'material', price: 120 },
	gem: { name: 'Permata', emoji: '💎', type: 'material', price: 250 },
	herb: { name: 'Herbal', emoji: '🌿', type: 'material', price: 25 },
	meat: { name: 'Daging', emoji: '🍖', type: 'material', price: 35 },
	hide: { name: 'Kulit', emoji: '🧶', type: 'material', price: 30 },
	tusk: { name: 'Gading', emoji: '🦷', type: 'material', price: 60 },
	feather: { name: 'Bulu', emoji: '🪶', type: 'material', price: 45 },
	rarewood: { name: 'Kayu Langka', emoji: '🪵', type: 'material', price: 150 },
	// fish
	fish_sardine: { name: 'Ikan Sarden', emoji: '🐟', type: 'material', price: 30 },
	fish_salmon: { name: 'Ikan Salmon', emoji: '🐠', type: 'material', price: 50 },
	fish_shark: { name: 'Ikan Hiu', emoji: '🦈', type: 'material', price: 200 },
	// crops
	wheat: { name: 'Gandum', emoji: '🌾', type: 'material', price: 15 },
	corn: { name: 'Jagung', emoji: '🌽', type: 'material', price: 20 },
	carrot: { name: 'Wortel', emoji: '🥕', type: 'material', price: 25 },
	potato: { name: 'Kentang', emoji: '🥔', type: 'material', price: 20 },
	// seeds
	seed_wheat: { name: 'Bibit Gandum', emoji: '🌱', type: 'seed', price: 50 },
	seed_corn: { name: 'Bibit Jagung', emoji: '🌱', type: 'seed', price: 80 },
	seed_carrot: { name: 'Bibit Wortel', emoji: '🌱', type: 'seed', price: 120 },
	seed_potato: { name: 'Bibit Kentang', emoji: '🌱', type: 'seed', price: 150 },
	// tools
	pickaxe_wood: { name: 'Belicung Kayu', emoji: '⛏️', type: 'tool', slot: 'pickaxe', tier: 1, price: 300 },
	pickaxe_iron: { name: 'Belicung Besi', emoji: '⛏️', type: 'tool', slot: 'pickaxe', tier: 2, price: 1500 },
	pickaxe_gold: { name: 'Belicung Emas', emoji: '⛏️', type: 'tool', slot: 'pickaxe', tier: 3, price: 5000 },
	pickaxe_diamond: { name: 'Belicung Intan', emoji: '⛏️', type: 'tool', slot: 'pickaxe', tier: 4, price: 15000 },
	axe_wood: { name: 'Kapak Kayu', emoji: '🪓', type: 'tool', slot: 'axe', tier: 1, price: 300 },
	axe_iron: { name: 'Kapak Besi', emoji: '🪓', type: 'tool', slot: 'axe', tier: 2, price: 1500 },
	axe_gold: { name: 'Kapak Emas', emoji: '🪓', type: 'tool', slot: 'axe', tier: 3, price: 5000 },
	axe_diamond: { name: 'Kapak Intan', emoji: '🪓', type: 'tool', slot: 'axe', tier: 4, price: 15000 },
	rod_wood: { name: 'Pancing Kayu', emoji: '🎣', type: 'tool', slot: 'rod', tier: 1, price: 300 },
	rod_iron: { name: 'Pancing Besi', emoji: '🎣', type: 'tool', slot: 'rod', tier: 2, price: 1500 },
	rod_gold: { name: 'Pancing Emas', emoji: '🎣', type: 'tool', slot: 'rod', tier: 3, price: 5000 },
	rod_diamond: { name: 'Pancing Intan', emoji: '🎣', type: 'tool', slot: 'rod', tier: 4, price: 15000 },
	// equipment
	wooden_sword: { name: 'Pedang Kayu', emoji: '🗡️', type: 'equipment', slot: 'weapon', atk: 3, price: 200 },
	iron_sword: { name: 'Pedang Besi', emoji: '🗡️', type: 'equipment', slot: 'weapon', atk: 10, price: 900 },
	steel_sword: { name: 'Pedang Baja', emoji: '⚔️', type: 'equipment', slot: 'weapon', atk: 18, price: 2500 },
	dragon_sword: { name: 'Pedang Naga', emoji: '🗡️', type: 'equipment', slot: 'weapon', atk: 30, price: 8000 },
	demon_blade: { name: 'Bilah Iblis', emoji: '🔪', type: 'equipment', slot: 'weapon', atk: 45, price: 20000 },
	leather_armor: { name: 'Baju Kulit', emoji: '🦺', type: 'equipment', slot: 'armor', def: 4, price: 300 },
	iron_armor: { name: 'Baju Besi', emoji: '🛡️', type: 'equipment', slot: 'armor', def: 10, price: 1000 },
	knight_armor: { name: 'Baju Ksatria', emoji: '🛡️', type: 'equipment', slot: 'armor', def: 18, price: 3000 },
	dragon_armor: { name: 'Baju Naga', emoji: '🐉', type: 'equipment', slot: 'armor', def: 30, price: 9000 },
	angel_armor: { name: 'Baju Malaikat', emoji: '👼', type: 'equipment', slot: 'armor', def: 45, price: 25000 },
	ring_hp: { name: 'Cincin Darah', emoji: '💍', type: 'equipment', slot: 'accessory', hp: 50, price: 500 },
	amulet_mana: { name: 'Liontin Mana', emoji: '📿', type: 'equipment', slot: 'accessory', mana: 40, price: 700 },
	crit_ring: { name: 'Cincin Crit', emoji: '💥', type: 'equipment', slot: 'accessory', crit: 10, price: 1500 },
	// stat tomes (permanen)
	buku_kekuatan: { name: 'Buku Kekuatan', emoji: '📖', type: 'tome', stat: 'atk', value: 2, rarity: 'rare', source: 'craft' },
	buku_ketahanan: { name: 'Buku Ketahanan', emoji: '📖', type: 'tome', stat: 'def', value: 2, rarity: 'rare', source: 'craft' },
	buku_vitalitas: { name: 'Buku Vitalitas', emoji: '📖', type: 'tome', stat: 'hp', value: 20, rarity: 'rare', source: 'craft' },
	buku_sihir: { name: 'Buku Sihir', emoji: '📖', type: 'tome', stat: 'mana', value: 20, rarity: 'rare', source: 'craft' },
	buku_ketepatan: { name: 'Buku Ketepatan', emoji: '📖', type: 'tome', stat: 'crit', value: 1, rarity: 'rare', source: 'craft' },
	// buff ramuan (berbasis babak)
	ramuan_kekuatan: { name: 'Ramuan Kekuatan', emoji: '🧪', type: 'buff', buff: { atk: 20 }, turns: 4, rarity: 'uncommon', source: 'craft' },
	ramuan_baja: { name: 'Ramuan Baja', emoji: '🧪', type: 'buff', buff: { def: 20 }, turns: 4, rarity: 'uncommon', source: 'craft' },
	elixir_emas: { name: 'Elixir Emas', emoji: '⚗️', type: 'buff', buff: { gold: 25 }, turns: 5, rarity: 'rare', source: 'craft' },
	elixir_pengalaman: { name: 'Elixir Pengalaman', emoji: '⚗️', type: 'buff', buff: { xp: 25 }, turns: 5, rarity: 'rare', source: 'craft' },
	// gear eksklusif craft
	pedang_api: { name: 'Pedang Api', emoji: '🔥', type: 'equipment', slot: 'weapon', atk: 28, trait: 'thorns', rarity: 'epic', source: 'craft' },
	tombak_pemburu: { name: 'Tombak Pemburu', emoji: '🔱', type: 'equipment', slot: 'weapon', atk: 22, trait: 'lifesteal', rarity: 'rare', source: 'craft' },
	baju_es: { name: 'Baju Es', emoji: '🧊', type: 'equipment', slot: 'armor', def: 22, trait: 'dodge', rarity: 'rare', source: 'craft' },
	cincin_kecepatan: { name: 'Cincin Kecepatan', emoji: '💫', type: 'equipment', slot: 'accessory', trait: 'regen', rarity: 'epic', source: 'craft' },
	pedang_taring: { name: 'Pedang Taring', emoji: '🐺', type: 'equipment', slot: 'weapon', atk: 34, trait: 'lifesteal', rarity: 'epic', source: 'boss' },
	baju_mahkota: { name: 'Baju Mahkota', emoji: '👑', type: 'equipment', slot: 'armor', def: 38, trait: 'dodge', rarity: 'epic', source: 'boss' },
	pedang_kegelapan: { name: 'Pedang Kegelapan', emoji: '🌑', type: 'equipment', slot: 'weapon', atk: 55, trait: 'lifesteal', rarity: 'mythic', source: 'event' },
	cincin_iblis: { name: 'Cincin Iblis', emoji: '😈', type: 'equipment', slot: 'accessory', crit: 15, trait: 'critBoost', rarity: 'mythic', source: 'event' },
	// material eksklusif bos
	taring_hutan: { name: 'Taring King Thorne', emoji: '🦁', type: 'material', price: 500, rarity: 'epic', source: 'boss' },
	tengkorak_troll: { name: 'Tengkorak Grottak', emoji: '💀', type: 'material', price: 800, rarity: 'epic', source: 'boss' },
	mahkota_vampir: { name: 'Mahkota Lord Vadrik', emoji: '🧛', type: 'material', price: 1500, rarity: 'legendary', source: 'boss' },
	hati_iblis: { name: 'Hati Malakor', emoji: '👿', type: 'material', price: 3000, rarity: 'legendary', source: 'boss' },
	kristal_iblis: { name: 'Kristal Iblis', emoji: '🔮', type: 'material', price: 5000, rarity: 'mythic', source: 'event' },
	// item cerita
	obor: { name: 'Obor', emoji: '🔥', type: 'story', rarity: 'uncommon', source: 'craft' },
	jimat: { name: 'Jimat', emoji: '🧿', type: 'story', rarity: 'uncommon', source: 'craft' },
	biji_ajaib: { name: 'Biji Ajaib', emoji: '✨', type: 'story', rarity: 'legendary', source: 'story' },
	kristal_gelap: { name: 'Kristal Kegelapan', emoji: '🌒', type: 'story', rarity: 'legendary', source: 'story' },
	cincin_naga: { name: 'Cincin Naga', emoji: '🐉', type: 'story', rarity: 'mythic', source: 'story' },
	// pets
	baby_dragon: { name: 'Baby Dragon', emoji: '🐉', type: 'pet', pet: true, stat: 'crit', bonus: 5 },
	guardian_spirit: { name: 'Guardian Spirit', emoji: '👻', type: 'pet', pet: true, stat: 'def', bonus: 6 },
	fairy: { name: 'Fairy', emoji: '🧚', type: 'pet', pet: true, stat: 'hp', bonus: 40 },
	phoenix: { name: 'Phoenix', emoji: '🔥', type: 'pet', pet: true, stat: 'atk', bonus: 5 },
	// crates
	crate_common: { name: 'Peti Biasa', emoji: '📦', type: 'crate', crate: true },
	crate_uncommon: { name: 'Peti Langka', emoji: '🎁', type: 'crate', crate: true },
	crate_mythic: { name: 'Peti Mythic', emoji: '🗃️', type: 'crate', crate: true },
	crate_legendary: { name: 'Peti Legendaris', emoji: '👑', type: 'crate', crate: true },
};

// emoji bersumber dari global.emoji (config.js) — item yang sama memakai emoticon yang sama
for (const [id, item] of Object.entries(ITEMS)) {
	Object.defineProperty(item, 'emoji', {
		get: () => global.emoji?.[id] || '📦',
		configurable: true,
		enumerable: true,
	});
}

export const CRATE_TABLE = {
	crate_common: [
		['potion', 30],
		['elixir', 20],
		['herb', 20],
		['iron', 15],
		['bread', 15],
	],
	crate_uncommon: [
		['iron', 25],
		['gold', 20],
		['gem', 10],
		['ring_hp', 10],
		['amulet_mana', 10],
		['potion', 25],
	],
	crate_mythic: [
		['steel_sword', 20],
		['knight_armor', 15],
		['crit_ring', 15],
		['gem', 25],
		['gold', 20],
		['guardian_spirit', 3],
		['fairy', 2],
	],
	crate_legendary: [
		['dragon_sword', 20],
		['dragon_armor', 20],
		['demon_blade', 10],
		['gold', 25],
		['gem', 15],
		['phoenix', 6],
		['baby_dragon', 4],
	],
};

export const RECIPES = [
	{
		name: 'Roti',
		result: 'bread',
		need: [
			['wheat', 2],
			['wood', 1],
		],
		money: 0,
	},
	{
		name: 'Steak',
		result: 'steak',
		need: [
			['meat', 2],
			['coal', 1],
		],
		money: 0,
	},
	{ name: 'Potion', result: 'potion', need: [['herb', 3]], money: 0 },
	{
		name: 'Elixir',
		result: 'elixir',
		need: [
			['herb', 2],
			['gem', 1],
		],
		money: 0,
	},
	{
		name: 'Pedang Besi',
		result: 'iron_sword',
		need: [
			['iron', 4],
			['wood', 3],
		],
		money: 100,
	},
	{
		name: 'Pedang Baja',
		result: 'steel_sword',
		need: [
			['iron', 4],
			['gem', 2],
		],
		money: 400,
	},
	{
		name: 'Baju Besi',
		result: 'iron_armor',
		need: [
			['iron', 5],
			['hide', 3],
		],
		money: 200,
	},
	{
		name: 'Cincin Darah',
		result: 'ring_hp',
		need: [
			['gold', 3],
			['gem', 1],
		],
		money: 150,
	},
	{
		name: 'Liontin Mana',
		result: 'amulet_mana',
		need: [
			['gold', 3],
			['herb', 5],
		],
		money: 200,
	},
	{
		name: 'Peti Langka',
		result: 'crate_uncommon',
		need: [
			['iron', 5],
			['herb', 5],
		],
		money: 300,
	},
	{
		name: 'Peti Mythic',
		result: 'crate_mythic',
		need: [
			['gold', 5],
			['gem', 3],
		],
		money: 1000,
	},
	// cerita & eksklusif
	{
		name: 'Obor',
		result: 'obor',
		need: [
			['wood', 3],
			['coal', 1],
		],
		money: 0,
	},
	{
		name: 'Jimat',
		result: 'jimat',
		need: [
			['gold', 2],
			['herb', 3],
		],
		money: 0,
	},
	{
		name: 'Buku Kekuatan',
		result: 'buku_kekuatan',
		need: [
			['herb', 5],
			['gem', 2],
		],
		money: 300,
	},
	{
		name: 'Buku Ketahanan',
		result: 'buku_ketahanan',
		need: [
			['herb', 5],
			['iron', 3],
		],
		money: 300,
	},
	{
		name: 'Buku Vitalitas',
		result: 'buku_vitalitas',
		need: [
			['herb', 5],
			['meat', 3],
		],
		money: 300,
	},
	{
		name: 'Buku Sihir',
		result: 'buku_sihir',
		need: [
			['herb', 5],
			['gem', 2],
		],
		money: 300,
	},
	{
		name: 'Buku Ketepatan',
		result: 'buku_ketepatan',
		need: [
			['herb', 5],
			['gold', 3],
		],
		money: 300,
	},
	{
		name: 'Ramuan Kekuatan',
		result: 'ramuan_kekuatan',
		need: [
			['herb', 3],
			['coal', 1],
		],
		money: 100,
	},
	{
		name: 'Ramuan Baja',
		result: 'ramuan_baja',
		need: [
			['herb', 3],
			['iron', 2],
		],
		money: 150,
	},
	{
		name: 'Elixir Emas',
		result: 'elixir_emas',
		need: [
			['herb', 3],
			['gold', 2],
		],
		money: 300,
	},
	{
		name: 'Elixir Pengalaman',
		result: 'elixir_pengalaman',
		need: [
			['herb', 3],
			['gem', 1],
		],
		money: 300,
	},
	{
		name: 'Pedang Api',
		result: 'pedang_api',
		need: [
			['iron', 6],
			['coal', 4],
			['gem', 1],
		],
		money: 1500,
	},
	{
		name: 'Tombak Pemburu',
		result: 'tombak_pemburu',
		need: [
			['iron', 5],
			['hide', 3],
		],
		money: 1000,
	},
	{
		name: 'Baju Es',
		result: 'baju_es',
		need: [
			['iron', 5],
			['herb', 5],
		],
		money: 1200,
	},
	{
		name: 'Cincin Kecepatan',
		result: 'cincin_kecepatan',
		need: [
			['gold', 4],
			['gem', 2],
		],
		money: 2000,
	},
	{
		name: 'Pedang Taring',
		result: 'pedang_taring',
		need: [
			['taring_hutan', 1],
			['iron', 6],
		],
		money: 3000,
	},
	{
		name: 'Baju Mahkota',
		result: 'baju_mahkota',
		need: [
			['mahkota_vampir', 1],
			['gold', 4],
		],
		money: 6000,
	},
	{
		name: 'Cincin Iblis',
		result: 'cincin_iblis',
		need: [
			['kristal_iblis', 2],
			['gem', 5],
		],
		money: 20000,
	},
];

export const CROPS = {
	seed_wheat: { name: 'Gandum', emoji: '🌾', grow: 3 * 60 * 1000, yield: 'wheat', yieldQty: 2 },
	seed_corn: { name: 'Jagung', emoji: '🌽', grow: 5 * 60 * 1000, yield: 'corn', yieldQty: 2 },
	seed_carrot: { name: 'Wortel', emoji: '🥕', grow: 8 * 60 * 1000, yield: 'carrot', yieldQty: 2 },
	seed_potato: { name: 'Kentang', emoji: '🥔', grow: 10 * 60 * 1000, yield: 'potato', yieldQty: 2 },
};

export const MINE_TABLE = [
	['stone', 30],
	['coal', 20],
	['iron', 22],
	['gold', 12],
	['gem', 8],
	['crate_common', 8],
];
export const LOG_TABLE = [
	['wood', 70],
	['rarewood', 20],
	['crate_common', 10],
];
export const HUNT_TABLE = [
	['meat', 40],
	['hide', 30],
	['tusk', 15],
	['feather', 10],
	['crate_common', 5],
];
export const FISH_TABLE = [
	['fish_sardine', 40],
	['fish_salmon', 30],
	['fish_shark', 10],
	['herb', 10],
	['crate_common', 10],
];

export const DAILY_GOALS = { kills: 3, explores: 2 };
export const WEEKLY_GOALS = { kills: 10, dungeons: 2, harvests: 10 };

// ============ helpers ============

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function pickWeighted(table) {
	const total = table.reduce((n, [, w]) => n + w, 0);
	let r = Math.random() * total;
	for (const [item, w] of table) {
		r -= w;
		if (r <= 0) return item;
	}
	return table[0][0];
}

export const fmt = (n) => Number(n || 0).toLocaleString('id-ID');
export const areaById = (id) => AREAS.find((a) => a.id === id) || AREAS[0];

export function getStats(user) {
	const cls = CLASSES[user.class] || CLASSES.knight;
	const lvl = user.level || 1;
	const s = {};
	for (const k of ['hp', 'mana', 'atk', 'def', 'crit']) s[k] = Math.round(cls.base[k] + cls.growth[k] * (lvl - 1));
	const eq = user.equipment || {};
	for (const slot of ['weapon', 'armor', 'accessory']) {
		const e = eq[slot];
		if (!e?.id || !ITEMS[e.id]) continue;
		const item = ITEMS[e.id];
		const mult = 1 + (e.lvl || 1) * 0.15;
		if (item.atk) s.atk += Math.round(item.atk * mult);
		if (item.def) s.def += Math.round(item.def * mult);
		if (item.hp) s.hp += Math.round(item.hp * mult);
		if (item.mana) s.mana += Math.round(item.mana * mult);
		if (item.crit) s.crit += item.crit;
	}
	const pet = user.pet;
	if (pet?.id && ITEMS[pet.id]?.type === 'pet') {
		const p = ITEMS[pet.id];
		const mult = 1 + 0.1 * ((pet.lvl || 1) - 1);
		if (p.stat === 'hp') s.hp += Math.round(p.bonus * mult);
		else if (p.stat === 'mana') s.mana += Math.round(p.bonus * mult);
		else if (p.stat === 'atk') s.atk += Math.round(p.bonus * mult);
		else if (p.stat === 'def') s.def += Math.round(p.bonus * mult);
		else if (p.stat === 'crit') s.crit += p.bonus;
	}
	if (traitsOf(user).has('critBoost')) s.crit += 10;
	const sb = user.statsBonus || {};
	s.atk += sb.atk || 0;
	s.def += sb.def || 0;
	s.hp += sb.hp || 0;
	s.mana += sb.mana || 0;
	s.crit += sb.crit || 0;
	const buff = activeBuff(user);
	if (buff.atk) s.atk = Math.round(s.atk * (1 + buff.atk.pct / 100));
	if (buff.def) s.def = Math.round(s.def * (1 + buff.def.pct / 100));
	if (user.title === 'Pahlawan Atheria') {
		s.atk = Math.round(s.atk * 1.05);
		s.def = Math.round(s.def * 1.05);
		s.hp = Math.round(s.hp * 1.05);
		s.mana = Math.round(s.mana * 1.05);
	}
	s.maxHp = s.hp;
	s.maxMana = s.mana;
	return s;
}

export function attack(atk, def, critRate = 5) {
	if (Math.random() < 0.05) return { dmg: 0, miss: true, crit: false };
	const base =
