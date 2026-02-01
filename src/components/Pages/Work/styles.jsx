import styled from "@emotion/styled";
import { Box, Paper, Typography, Button } from "@mui/material";

export const WorkContainer = styled(Box)`
    padding: 20px;
    padding-top: 80px; /* Отступ под фиксированный Header */
    padding-bottom: 100px; /* Отступ над фиксированным Footer */
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: #f8fafc;
    min-height: 80vh;
    box-sizing: border-box;
`;

export const JobCard = styled(Paper)`
    padding: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    transition: all 0.2s ease;

    &:active {
        transform: scale(0.97);
    }
`;

export const JobInfo = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const JobMeta = styled(Box)`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

export const MetaItem = styled(Box)`
    display: flex;
    align-items: center;
    gap: 4px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;

    & svg {
        font-size: 16px;
    }
`;

export const StartButton = styled(Button)`
    border-radius: 14px;
    text-transform: none;
    font-weight: 800;
    padding: 8px 20px;
    box-shadow: none;

    &:hover {
        box-shadow: none;
    }
`;

export const IconWrapper = styled(Box)`
    width: 45px;
    height: 45px;
    border-radius: 12px;
    background: ${props => props.$color + '15'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$color};
`;