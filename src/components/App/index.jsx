import React, { useState } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Main } from "../Main";
import { EVENTS_CONFIG } from "../../constants/events";

const App = () => {
  const [activePage, setActivePage] = useState("home");

  // --- Единое состояние игрока ---
  const [balance, setBalance] = useState(10000);
  const [energy, setEnergy] = useState(80);
  const [day, setDay] = useState(1);
  const [gameTime, setGameTime] = useState("09:00");
  const [inventory, setInventory] = useState([
    { id: "bed", count: 1, lvl: 1, displayName: "Кровать", type: "furniture" },
    {
      id: "fridge",
      count: 0,
      lvl: 0,
      displayName: "Холодильник",
      type: "furniture",
    },
    { id: "kvas", count: 5, lvl: 1, displayName: "Квас", type: "consumable" },
  ]);

  // --- Состояние событий ---
  const [activeEvent, setActiveEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // --- Состояние банка ---
  const [bankData, setBankData] = useState({
    deposit: 0,
    depositDate: null,
    loan: 0,
    loanDate: null,
    loanPenalty: 0,
    historyIncome: [],
  });

  // --- Вспомогательные функции ---
  const updateInventory = (itemId, amount = 1, params = {}) => {
    setInventory((prev) => {
      const existingItem = prev.find((i) => i.id === itemId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, count: Math.max(0, item.count + amount), ...params }
            : item,
        );
      }
      return [...prev, { id: itemId, count: amount, lvl: 1, ...params }];
    });
  };

  const handleChangePage = (page) => setActivePage(page);

  // --- Логика магазина ---
  const handleBuyItem = (item) => {
    if (balance < item.price) return alert("Недостаточно денег!");
    const invItem = inventory.find((i) => i.id === item.id);
    if (
      !item.multiPurchase &&
      invItem &&
      invItem.count > 0 &&
      (!item.lvl || invItem.lvl >= item.lvl)
    ) {
      return;
    }

    setBalance((prev) => prev - item.price);
    updateInventory(item.id, 1, {
      displayName: item.title,
      type: item.type,
      lvl: item.lvl || (invItem ? invItem.lvl : 1),
    });
  };

  // --- Логика работы ---
  const handleFinishWork = ({ money, energy: energyCost, timeAdd }) => {
    setBalance((prev) => prev + money);
    setEnergy((prev) => Math.max(0, prev - energyCost));
    setBankData((prev) => ({
      ...prev,
      historyIncome: [...prev.historyIncome, money],
    }));

    setGameTime((prev) => {
      const [h, m] = prev.split(":").map(Number);
      let totalM = h * 60 + m + timeAdd;
      let newH = Math.floor(totalM / 60) % 24;
      let newM = totalM % 60;
      return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
    });
    setActivePage("home");
  };

  // --- Логика завершения дня (Сон и Выбор Событий) ---
  const handleSleep = () => {
    const bed = inventory.find((i) => i.id === "bed");
    const bedLvl = bed ? bed.lvl : 0;
    const hasClock = inventory.some((i) => i.id === "clock" && i.count > 0);

    // 1. Энергия и время
    let newEnergy =
      bedLvl >= 2 ? 100 : Math.floor(Math.random() * (100 - 70 + 1)) + 70;
    let newTime = hasClock
      ? "07:00"
      : `${String(Math.floor(Math.random() * (10 - 8 + 1)) + 8).padStart(2, "0")}:00`;

    // 2. Банковские начисления
    setBankData((prev) => {
      let newDeposit = prev.deposit;
      let newPenalty = prev.loanPenalty;
      if (newDeposit > 0) newDeposit += Math.floor(newDeposit * 0.05);
      if (prev.loan > 0 && prev.loanDate && day - prev.loanDate > 7) {
        newPenalty += Math.floor(prev.loan * 0.02);
      }
      return { ...prev, deposit: newDeposit, loanPenalty: newPenalty };
    });

    // 3. УНИВЕРСАЛЬНАЯ ЛОГИКА СОБЫТИЙ
    const currentStats = { day, balance, energy, inventory };

    // Фильтруем события по условиям (condition)
    const availableEvents = Object.values(EVENTS_CONFIG).filter((ev) =>
      ev.condition ? ev.condition(currentStats) : true,
    );

    let selectedEvent = null;
    // Проверяем шанс выпадения для каждого подходящего события
    for (const ev of availableEvents) {
      if (Math.random() < (ev.chance || 0.2)) {
        selectedEvent = ev;
        break; // Активируем только одно событие за ночь
      }
    }
    setActiveEvent(selectedEvent);

    // 4. Обновление дня
    setDay((prev) => prev + 1);
    setEnergy(newEnergy);
    setGameTime(newTime);
  };

  const handleFinishSleepAnimation = () => {
    if (activeEvent) {
      setShowEventModal(true);
    }
  };

  const handleConfirmEvent = () => {
    if (!activeEvent) return;
    const effect = activeEvent.effect;

    // Обработка различных типов эффектов
    if (effect?.immediateFine) {
      setBalance((prev) => Math.max(0, prev - effect.immediateFine));
    }
    if (effect?.immediateFinePercent) {
      setBalance((prev) =>
        Math.floor(prev * (1 - effect.immediateFinePercent)),
      );
    }
    if (effect?.bonusMoney) {
      setBalance((prev) => prev + effect.bonusMoney);
    }

    setShowEventModal(false);
    // Если событие мгновенное, удаляем его сразу после подтверждения
    if (activeEvent.duration === 0) setActiveEvent(null);
  };

  // --- Банковские операции ---
  const handleBankAction = (type, amount) => {
    switch (type) {
      case "DEPOSIT_ADD":
        setBalance((prev) => prev - amount);
        setBankData((prev) => ({
          ...prev,
          deposit: prev.deposit + amount,
          depositDate: day,
        }));
        break;
      case "DEPOSIT_WITHDRAW":
        setBalance((prev) => prev + bankData.deposit);
        setBankData((prev) => ({ ...prev, deposit: 0, depositDate: null }));
        break;
      case "LOAN_TAKE":
        setBalance((prev) => prev + amount);
        setBankData((prev) => ({
          ...prev,
          loan: amount,
          loanDate: day,
          loanPenalty: 0,
        }));
        break;
      case "LOAN_REPAY":
        const totalDebt = bankData.loan + bankData.loanPenalty;
        setBalance((prev) => prev - totalDebt);
        setBankData((prev) => ({
          ...prev,
          loan: 0,
          loanPenalty: 0,
          loanDate: null,
        }));
        break;
      default:
        break;
    }
  };

  const handleUseItem = (itemId) => {
    if (itemId === "kvas") {
      const item = inventory.find((i) => i.id === "kvas");
      if (!item || item.count <= 0 || energy >= 100) return;
      setEnergy((prev) => Math.min(prev + 20, 100));
      setInventory((prev) =>
        prev
          .map((i) => (i.id === "kvas" ? { ...i, count: i.count - 1 } : i))
          .filter((i) => !(i.type === "consumable" && i.count <= 0)),
      );
    }
  };

  return (
    <>
      <Header balance={balance} energy={energy} gameTime={gameTime} day={day} />
      <Main
        activePage={activePage}
        userStats={{ balance, energy, day, gameTime, inventory }}
        bankData={bankData}
        activeEvent={activeEvent}
        showEventModal={showEventModal}
        onFinishWork={handleFinishWork}
        onBuyItem={handleBuyItem}
        onSleep={handleSleep}
        onUseItem={handleUseItem}
        onBankAction={handleBankAction}
        onConfirmEvent={handleConfirmEvent}
        onFinishSleepAnimation={handleFinishSleepAnimation}
        updateInventory={updateInventory}
      />
      <Footer activePage={activePage} handleChangePage={handleChangePage} />
    </>
  );
};

export default App;
