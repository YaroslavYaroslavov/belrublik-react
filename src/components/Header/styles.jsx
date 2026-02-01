import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";

export const HeaderWrapper = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #ffffff;
    height: 60px;
    padding: 0 16px;
    position: fixed;
    top: 0;
    left: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 1000;
    box-sizing: border-box;
`;

export const StatusGroup = styled(Box)`
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 90px;
`;

// Контейнер для времени и дня
export const TimeContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const BalanceChip = styled(Box)`
    background: #f1f5f9;
    padding: 6px 14px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e2e8f0;
`;

export const BatteryContainer = styled(Box)`
    display: flex;
    align-items: center;
    color: ${props => (props.$level < 20 ? "#ef4444" : "#22c55e")};
`;

export const TimeText = styled(Typography)`
    font-weight: 800;
    font-size: 15px;
    color: #1e293b;
    line-height: 1.1;
`;

export const DayText = styled(Typography)`
    font-weight: 600;
    font-size: 10px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;