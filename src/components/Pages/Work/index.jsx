import React, { useState } from "react";
import {
  WorkContainer,
  JobCard,
  JobInfo,
  JobMeta,
  MetaItem,
  StartButton,
  IconWrapper,
} from "./styles";
import { Typography, Box } from "@mui/material";

import BoltIcon from "@mui/icons-material/Bolt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockIcon from "@mui/icons-material/Lock";

import { GarbageGame } from "./Games/GarbageGame";
import { CourierGame } from "./Games/CourierGame";
import { ProgrammerGame } from "./Games/ProgrammerGame";
import { PazzleGame } from "./Games/PazzleGame";

const JOBS_DATA = [
  {
    id: "garbage",
    title: "Уборка мусора",
    description: "Сортируй отходы по правильным контейнерам",
    reward: 50,
    energyCost: 20,
    duration: 45,
    icon: "🧹",
    color: "#10b981",
    checkUnlock: (inventory) => ({ isAvailable: true }),
  },
  {
    id: "pazzle",
    title: "Упаковщик",
    description: "Упаковывай предметы по коробкам",
    reward: 100,
    energyCost: 20,
    duration: 45,
    icon: "📦",
    color: "#10b981",
    checkUnlock: (inventory) => ({ isAvailable: true }),
  },
  {
    id: "courier",
    title: "Курьер еды",
    description: "Доставляй заказы (Требуется Велосипед)",
    reward: 120,
    energyCost: 35,
    duration: 60,
    icon: "📦",
    color: "#f59e0b",
    checkUnlock: (inventory) => {
      // Ищем велосипед в массиве инвентаря
      const hasBike = inventory.some(
        (item) => item.id === "bicycle" && item.count > 0,
      );
      return {
        isAvailable: hasBike,
        reason: hasBike ? "" : "Нужен велосипед",
      };
    },
  },
  {
    id: "programmer",
    title: "Фриланс-разработчик",
    description: "Исправляй баги в коде заказчиков (Нужен Ноутбук)",
    reward: 600,
    energyCost: 40,
    duration: 180,
    icon: "💻",
    color: "#3b82f6",
    checkUnlock: (inventory) => {
      const hasLaptop = inventory.some(
        (item) => item.id === "laptop" && item.count > 0,
      );
      return {
        isAvailable: hasLaptop,
        reason: hasLaptop ? "" : "Нужен ноутбук",
      };
    },
  },
  {
    id: "taxi",
    title: "Водитель такси",
    description: "Перевози пассажиров (Нужны Права и Машина)",
    reward: 350,
    energyCost: 50,
    duration: 120,
    icon: "🚕",
    color: "#ef4444",
    checkUnlock: (inventory) => {
      const hasCar = inventory.some(
        (item) => item.id === "car" && item.count > 0,
      );
      const hasLicense = inventory.some(
        (item) => item.id === "driver_license" && item.count > 0,
      );

      return {
        isAvailable: hasCar && hasLicense,
        reason: !hasLicense ? "Нужны права" : !hasCar ? "Нужна машина" : "",
      };
    },
  },
];

export const Work = ({ userStats, onFinishWork }) => {
  const [activeGameId, setActiveGameId] = useState(null);
  const { energy, inventory } = userStats;
  // Находим данные о текущей выбранной работе, чтобы передать их в игру

  // Логика запуска игр с передачей jobData
  if (activeGameId === "garbage") {
    return (
      <GarbageGame
        jobData={JOBS_DATA.find((job) => job.id === "garbage")} // Передаем данные о работе (награда, энергия и т.д.)
        onFinish={(result) => {
          setActiveGameId(null);
          onFinishWork(result);
        }}
      />
    );
  }
  if (activeGameId === "courier") {
    return (
      <CourierGame
        jobData={JOBS_DATA.find((job) => job.id === "courier")} // Передаем данные о работе
        onFinish={(res) => {
          setActiveGameId(null);
          onFinishWork(res);
        }}
      />
    );
  }
  if (activeGameId === "programmer") {
    return (
      <ProgrammerGame
        jobData={JOBS_DATA.find((job) => job.id === "programmer")} // Передаем данные о работе
        onFinish={(result) => {
          setActiveGameId(null);
          onFinishWork(result);
        }}
      />
    );
  }
  if (activeGameId === "pazzle") {
    return (
      <PazzleGame
        jobData={JOBS_DATA.find((job) => job.id === "pazzle")} // Передаем данные о работе
        onFinish={(result) => {
          setActiveGameId(null);
          onFinishWork(result);
        }}
      />
    );
  }
  // Для такси (если игра будет добавлена)
  if (activeGameId === "taxi") {
    return (
      <Box p={4} textAlign="center">
        <Typography>Игра "Такси" в разработке...</Typography>
        <StartButton onClick={() => setActiveGameId(null)}>Назад</StartButton>
      </Box>
    );
  }
  return (
    <WorkContainer>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Работа
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Доступные вакансии на сегодня
        </Typography>
      </Box>
      {JOBS_DATA.map((job) => {
        const unlockStatus = job.checkUnlock(inventory);
        const hasEnergy = energy >= job.energyCost;
        const isExecutable = unlockStatus.isAvailable && hasEnergy;
        return (
          <JobCard
            key={job.id}
            elevation={0}
            sx={{ opacity: unlockStatus.isAvailable ? 1 : 0.8 }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <IconWrapper
                $color={unlockStatus.isAvailable ? job.color : "#94a3b8"}
              >
                {unlockStatus.isAvailable ? (
                  <span style={{ fontSize: "24px" }}>{job.icon}</span>
                ) : (
                  <LockIcon />
                )}
              </IconWrapper>
              <JobInfo>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {job.title}
                </Typography>
                {!unlockStatus.isAvailable ? (
                  <Typography
                    variant="caption"
                    sx={{ color: "#ef4444", fontWeight: 700 }}
                  >
                    {unlockStatus.reason}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {job.description}
                  </Typography>
                )}
                <JobMeta>
                  <MetaItem>
                    <AttachMoneyIcon fontSize="small" /> {job.reward}
                  </MetaItem>
                  <MetaItem>
                    <BoltIcon fontSize="small" /> {job.energyCost}
                  </MetaItem>
                  <MetaItem>
                    <AccessTimeIcon fontSize="small" /> {job.duration}м
                  </MetaItem>
                </JobMeta>
              </JobInfo>
            </Box>
            <StartButton
              variant="contained"
              disableElevation
              disabled={!isExecutable}
              onClick={() => setActiveGameId(job.id)}
              sx={{
                backgroundColor: isExecutable ? job.color : "#cbd5e1",
                "&:hover": { backgroundColor: job.color },
                minWidth: "100px",
              }}
            >
              {!unlockStatus.isAvailable
                ? "Закрыто"
                : !hasEnergy
                  ? "Устал"
                  : "Начать"}
            </StartButton>
          </JobCard>
        );
      })}
    </WorkContainer>
  );
};
