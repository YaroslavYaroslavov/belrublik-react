import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const HomeContainer = styled(Box)`
    width: 100%;
    /* Вычитаем высоту хедера (примерно 64px) и футера (примерно 70px) */
    min-height: calc(100vh - 134px); 
    padding: 20px;
    box-sizing: border-box;
    background-color: #f8fafc;
    overflow-y: auto;
`;

export const RoomItem = styled(Box)`
    background: #fff;
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e2e8f0;
`;