import styled from "@emotion/styled"; // или @mui/material/styles
import { Box, Typography } from "@mui/material";

export const FooterWrapper = styled.footer`
    background-color: #ffffff;
    height: 75px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    border-top: 1px solid #f0f0f0;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 1000;
`;

export const NavigationElement = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    color: ${props => (props.$isActive ? "#1976d2" : "#757575")};
    gap: 4px;

    &:active {
        transform: scale(0.9);
    }

    /* Иконка становится чуть больше при активации */
    & svg {
        font-size: 26px;
        transition: transform 0.2s ease;
        transform: ${props => (props.$isActive ? "translateY(-2px)" : "none")};
    }
`;

export const NavLabel = styled(Typography)`
    font-size: 11px;
    font-weight: ${props => (props.$isActive ? "600" : "400")};
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;