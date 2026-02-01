import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export const GameStage = styled(Box)`
    width: 100%; /* Занимает всю ширину родителя */
    height: calc(100vh - 180px);
    background: #f7f7f7;
    border-bottom: 3px solid #535353;
    position: relative;
    overflow: hidden; /* Скрывает препятствия за границами */
    touch-action: none; /* Предотвращает скролл при нажатии на игру */
    border-radius: 12px;
`;

export const Courier = styled(motion.div)`
    width: 50px;
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 20px; /* Фиксированный отступ слева */
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
`;

export const Obstacle = styled(Box)`
    width: 40px;
    height: 40px;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    will-change: left; /* Оптимизация для плавности */
`;