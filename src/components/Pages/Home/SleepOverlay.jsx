import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography } from "@mui/material";
import styled from "@emotion/styled";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #000;
  z-index: 9999; /* Повышен индекс для перекрытия всех UI элементов */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
`;

const DayNumber = styled(Typography)`
  font-weight: 900;
  font-size: 6rem !important;
  color: #3b82f6;
  line-height: 1;
`;

const Label = styled(Typography)`
  font-weight: 900;
  font-size: 4rem !important;
  letter-spacing: 0.1em;
`;

export const SleepOverlay = ({ day, onFinish }) => {
  // Используем стейт для управления визуальным отображением цифры
  // Мы начинаем с "вчерашнего" дня и анимируем переход к "сегодняшнему"
  const [displayDay, setDisplayDay] = useState(day - 1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setIsAnimating(true);
      setDisplayDay(day);
    }, 800);

    // 2. Таймер завершения всей сцены (через 3 секунды)
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(finishTimer);
    };
  }, [day, onFinish]);

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#64748b",
            mb: 2,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Завершение дня...
        </Typography>
      </motion.div>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Label variant="h2">ДЕНЬ</Label>

        <Box
          sx={{
            position: "relative",
            height: "1.2em",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={displayDay}
              initial={{ y: "100%", opacity: 0, rotateX: 90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: "-100%", opacity: 0, rotateX: -90 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.6,
              }}
            >
              <DayNumber>{displayDay}</DayNumber>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Декоративный элемент прогресс-бара снизу */}
      <Box
        sx={{
          width: "200px",
          height: "2px",
          bg: "#1e293b",
          mt: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 2.5, ease: "linear" }}
          style={{
            width: "100%",
            height: "100%",
            background: "#3b82f6",
          }}
        />
      </Box>
    </Overlay>
  );
};
