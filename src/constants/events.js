export const EVENTS_CONFIG = {
  BLACK_FRIDAY: {
    id: "BLACK_FRIDAY",
    title: "Черная Пятница!",
    description: "Скидки на все товары в магазине 50%",
    icon: "🛍️",
    color: "#ef4444",
    duration: 1,
    // Индивидуальные параметры выпадения:
    chance: 0.15, // 15% шанс
    condition: (stats) => stats.day >= 5, // Только с 5-го дня
    effect: { shopDiscount: 0.5 },
  },
  TAX_OFFICER: {
    id: "TAX_OFFICER",
    title: "Налоговая проверка",
    description: "Выявлены нарушения. Штраф 10% от баланса",
    icon: "⚖️",
    color: "#64748b",
    duration: 0,
    chance: 0.1, // 10% шанс
    condition: (stats) => stats.balance > 5000 && stats.day > 10, // Богатый игрок после 10 дня
    effect: { immediateFinePercent: 0.1 },
  },
  LOTTERY_WIN: {
    id: "LOTTERY_WIN",
    title: "Выигрыш в лотерею!",
    description: "Вы нашли старый билет, и он оказался выигрышным! +1000 USD",
    icon: "🎫",
    color: "#fbbf24",
    duration: 0,
    chance: 0.05, // Редкое: 5%
    condition: (stats) => stats.balance < 1000, // Помощь бедному игроку
    effect: { bonusMoney: 1000 },
  },
};
