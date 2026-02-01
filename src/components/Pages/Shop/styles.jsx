import styled from "@emotion/styled";
import { Box, Paper, Button } from "@mui/material";

export const ShopContainer = styled(Box)`
    width: 100%;
    /* Используем ту же логику расчета высоты, что и в Home */
    min-height: calc(100vh - 134px); 
    padding: 20px;
    box-sizing: border-box;
    background-color: #f8fafc;
    display: flex;
    flex-direction: column;
    gap: 16px;
    /* Убираем жесткие отступы, которые двигали интерфейс */
`;

export const ItemCard = styled(Paper)`
    display: flex;
    padding: 16px;
    border-radius: 20px;
    gap: 16px;
    align-items: center;
    border: 1px solid #e2e8f0;
    position: relative;
    overflow: hidden;
    background: #ffffff;
`;

export const ItemImage = styled(Box)`
    width: 64px; /* Немного уменьшил, чтобы лучше влезало на мобильные */
    height: 64px;
    min-width: 64px; /* Чтобы картинка не сжималась при длинном тексте */
    background: #f1f5f9;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
`;

export const BuyButton = styled(Button)`
    border-radius: 12px;
    text-transform: none;
    font-weight: 800;
    white-space: nowrap; /* Чтобы текст кнопки не переносился */
`;

export const OwnedBadge = styled(Box)`
    position: absolute;
    top: 8px;
    right: 12px;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    border: 1px solid #e2e8f0;
    z-index: 1;
`;