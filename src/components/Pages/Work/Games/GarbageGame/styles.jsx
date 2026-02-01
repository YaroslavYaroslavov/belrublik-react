import styled from "@emotion/styled";
import { Box, Paper } from "@mui/material";
import { motion } from "framer-motion";

export const FullScreenOverlay = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: #ffffff;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
`;

export const GameArea = styled(Box)`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
`;

export const TrashItem = styled(motion.div)`
    font-size: 80px;
    cursor: grab;
    user-select: none;
    touch-action: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    background: #f1f5f9;
    border-radius: 30px;
`;

export const BinsContainer = styled(Box)`
    display: flex;
    justify-content: center;
    gap: 20px;
    width: 100%;
`;

export const Bin = styled(Box)`
    flex: 1;
    max-width: 150px;
    height: 180px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 4px dashed ${props => props.$color};
    background: ${props => props.$active ? `${props.$color}22` : 'transparent'};
    transition: all 0.2s ease;
`;