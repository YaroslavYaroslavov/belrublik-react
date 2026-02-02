import React, { useState } from "react";
import { Typography, Divider, List, Chip, Box, Button } from "@mui/material";
import { HomeContainer, RoomItem } from "./styles";
import BedIcon from "@mui/icons-material/Bed";
import KitchenIcon from "@mui/icons-material/Kitchen";
import InventoryIcon from "@mui/icons-material/Inventory2";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import { SleepOverlay } from "./SleepOverlay";
import { EventOverlay } from "./EventOverlay"; // Тот самый универсальный оверлей

export const Home = ({
  userStats,
  activeEvent,
  showEventModal,
  onSleep,
  onUseItem,
  onConfirmEvent,
  onFinishSleepAnimation,
}) => {
  const { inventory, day, energy } = userStats;
  const [isSleeping, setIsSleeping] = useState(false);

  // Фильтрация предметов
  const furniture = inventory.filter(
    (item) =>
      item.type === "furniture" || ["bed", "fridge", "clock"].includes(item.id),
  );
  const consumables = inventory.filter(
    (item) => item.type === "consumable" || item.id === "kvas",
  );

  return (
    <HomeContainer>
      {/* 1. АНИМАЦИЯ СНА */}
      {isSleeping && (
        <SleepOverlay
          day={day + 1}
          onFinish={() => {
            onSleep(); // Обновляем состояние в App.jsx (день, энергия и рандом события)
            setIsSleeping(false);
            onFinishSleepAnimation(); // Проверяем, нужно ли показать модалку события
          }}
        />
      )}

      {/* 2. МОДАЛКА СОБЫТИЯ (ПОСЛЕ СНА) */}
      {showEventModal && activeEvent && (
        <EventOverlay event={activeEvent} onConfirm={onConfirmEvent} />
      )}

      <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
        Мой Дом
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Место для отдыха. Энергия: {energy}%
      </Typography>

      <Divider sx={{ mb: 2 }}>Обстановка</Divider>
      <Box sx={{ mb: 2 }}>
        {furniture.map((item) => (
          <RoomItem key={item.id}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {item.id === "bed" ? (
                <BedIcon color="primary" />
              ) : (
                <KitchenIcon color="primary" />
              )}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item.title || item.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Уровень: {item.lvl || 1}
                </Typography>
              </Box>
            </Box>
            {item.count === 0 && <Chip label="Не куплено" size="small" />}
          </RoomItem>
        ))}
      </Box>

      <Divider sx={{ mb: 2, mt: 4 }}>Запасы (Восстановить силы)</Divider>
      <List sx={{ mb: 4 }}>
        {consumables.length > 0 ? (
          consumables.map((item) => (
            <RoomItem
              key={item.id}
              onClick={() =>
                item.count > 0 && energy < 100 && onUseItem(item.id)
              }
              sx={{
                cursor: item.count > 0 && energy < 100 ? "pointer" : "default",
                bgcolor:
                  item.id === "kvas" && energy < 100
                    ? "#eff6ff"
                    : "transparent",
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocalDrinkIcon sx={{ color: "#3b82f6" }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    +20% Энергии
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                x{item.count}
              </Typography>
            </RoomItem>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#94a3b8", py: 2 }}
          >
            Холодильник пуст...
          </Typography>
        )}
      </List>

      <Button
        variant="contained"
        fullWidth
        size="large"
        startIcon={<NightlightIcon />}
        onClick={() => setIsSleeping(true)}
        sx={{
          py: 2,
          borderRadius: "16px",
          bgcolor: "#1e293b",
          fontWeight: 900,
          "&:hover": { bgcolor: "#0f172a" },
        }}
      >
        Закончить день
      </Button>
    </HomeContainer>
  );
};
