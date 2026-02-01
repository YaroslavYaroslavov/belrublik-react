import React from 'react';
import { 
    HeaderWrapper, 
    StatusGroup, 
    BalanceChip, 
    BatteryContainer, 
    TimeText,
    DayText,
    TimeContainer
} from "./styles";
import { Typography } from "@mui/material";
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';

export const Header = ({ balance, energy, gameTime, day }) => {
    
    // Форматирование дня: если 1, то станет "01"
    const formattedDay = day < 10 ? `0${day}` : day;

    return (
        <HeaderWrapper>
            {/* Левая часть: Время и День */}
            <StatusGroup>
                <TimeContainer>
                    <DayText>День {formattedDay}</DayText>
                    <TimeText>{gameTime}</TimeText>
                </TimeContainer>
            </StatusGroup>

            {/* Центральная часть: Баланс */}
            <BalanceChip>
                <WalletIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
                    {balance.toLocaleString()} USD
                </Typography>
            </BalanceChip>

            {/* Правая часть: Энергия */}
            <StatusGroup style={{ justifyContent: 'flex-end' }}>
                <BatteryContainer $level={energy}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, mr: 0.5 }}>
                        {energy}%
                    </Typography>
                    {energy < 20 ? <BatteryAlertIcon fontSize="small" /> : <BatteryFullIcon fontSize="small" />}
                </BatteryContainer>
            </StatusGroup>
        </HeaderWrapper>
    );
};