import React from "react";
import { Work } from "../Pages/Work";
import { Bank } from "../Pages/Bank";
import { Home } from "../Pages/Home";
import { Shop } from "../Pages/Shop";

const pages = {
  home: Home,
  work: Work,
  bank: Bank,
  shop: Shop,
};

export const Main = ({
  activePage,
  userStats,
  onFinishWork,
  onBuyItem,
  updateInventory,
  onSleep,
  onUseItem,
  bankData,
  onBankAction,
}) => {
  // Выбираем компонент страницы по ключу
  const SelectedPage = pages[activePage] || Home;

  return (
    <main
      style={{
        // Фиксируем область контента между Header (64px) и Footer (70px)
        marginTop: "64px",
        marginBottom: "70px",
        minHeight: "calc(100vh - 134px)",
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SelectedPage
        // Статистика пользователя (баланс, энергия, инвентарь и т.д.)
        userStats={userStats}
        // Обработчики действий
        onFinishWork={onFinishWork}
        onBuyItem={onBuyItem}
        // Новая функция для прямого взаимодействия с инвентарем (например, выпить квас в Home)
        updateInventory={updateInventory}
        onSleep={onSleep}
        onBankAction={onBankAction}
        onUseItem={onUseItem}
        bankData={bankData}
      />
    </main>
  );
};
