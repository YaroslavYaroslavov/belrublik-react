import React, { useState } from 'react';
import { 
    WorkContainer, 
    JobCard, 
    JobInfo, 
    JobMeta, 
    MetaItem, 
    StartButton,
    IconWrapper 
} from "./styles";
import { Typography, Box } from "@mui/material";

import BoltIcon from '@mui/icons-material/Bolt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';

import { GarbageGame } from './Games/GarbageGame';
import { CourierGame } from './Games/CourierGame';

const JOBS_DATA = [
    {
        id: 'garbage',
        title: 'Уборка мусора',
        description: 'Сортируй отходы по правильным контейнерам',
        reward: 50,
        energyCost: 20,
        duration: 45,
        icon: '🧹',
        color: '#10b981',
        checkUnlock: (inventory) => ({ isAvailable: true })
    },
    {
        id: 'garbage',
        title: 'Уборка мусора',
        description: 'Сортируй отходы по правильным контейнерам',
        reward: 50,
        energyCost: 20,
        duration: 45,
        icon: '🧹',
        color: '#10b981',
        checkUnlock: (inventory) => ({ isAvailable: true })
    },
    {
        id: 'garbage',
        title: 'Уборка мусора',
        description: 'Сортируй отходы по правильным контейнерам',
        reward: 50,
        energyCost: 20,
        duration: 45,
        icon: '🧹',
        color: '#10b981',
        checkUnlock: (inventory) => ({ isAvailable: true })
    },
    {
        id: 'garbage',
        title: 'Уборка мусора',
        description: 'Сортируй отходы по правильным контейнерам',
        reward: 50,
        energyCost: 20,
        duration: 45,
        icon: '🧹',
        color: '#10b981',
        checkUnlock: (inventory) => ({ isAvailable: true })
    },
    {
        id: 'garbage',
        title: 'Уборка мусора',
        description: 'Сортируй отходы по правильным контейнерам',
        reward: 50,
        energyCost: 20,
        duration: 45,
        icon: '🧹',
        color: '#10b981',
        checkUnlock: (inventory) => ({ isAvailable: true })
    },
    
    {
        id: 'courier',
        title: 'Курьер еды',
        description: 'Доставляй заказы (Требуется Велосипед)',
        reward: 120,
        energyCost: 35,
        duration: 60,
        icon: '📦',
        color: '#f59e0b',
        checkUnlock: (inventory) => {
            // Ищем велосипед в массиве инвентаря
            const hasBike = inventory.some(item => item.id === 'bicycle' && item.count > 0);
            return {
                isAvailable: hasBike,
                reason: hasBike ? "" : "Нужен велосипед"
            };
        }
    },
    {
        id: 'taxi',
        title: 'Водитель такси',
        description: 'Перевози пассажиров (Нужны Права и Машина)',
        reward: 350,
        energyCost: 50,
        duration: 120,
        icon: '🚕',
        color: '#ef4444',
        checkUnlock: (inventory) => {
            const hasCar = inventory.some(item => item.id === 'car' && item.count > 0);
            const hasLicense = inventory.some(item => item.id === 'driver_license' && item.count > 0);
            
            return {
                isAvailable: hasCar && hasLicense,
                reason: !hasLicense ? "Нужны права" : (!hasCar ? "Нужна машина" : "")
            };
        }
    }
];

export const Work = ({ userStats, onFinishWork }) => {
    const [activeGameId, setActiveGameId] = useState(null);
    const { energy, inventory } = userStats;

    // Логика запуска игр
    if (activeGameId === 'garbage') {
        return (
            <GarbageGame 
                onFinish={(result) => {
                    setActiveGameId(null);
                    onFinishWork(result);
                }} 
            />
        );
    }

    if (activeGameId === 'courier') {
        return (
            <CourierGame 
                onFinish={(res) => { 
                    setActiveGameId(null); 
                    onFinishWork(res); 
                }} 
            />
        );
    }

    return (
        <WorkContainer>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>Работа</Typography>
                <Typography variant="body2" color="text.secondary">
                    Доступные вакансии на сегодня
                </Typography>
            </Box>

            {JOBS_DATA.map((job) => {
                // ПРОВЕРКА ДОСТУПНОСТИ: теперь передаем массив инвентаря
                const unlockStatus = job.checkUnlock(inventory);
                const hasEnergy = energy >= job.energyCost;
                const isExecutable = unlockStatus.isAvailable && hasEnergy;

                return (
                    <JobCard key={job.id} elevation={0} sx={{ opacity: unlockStatus.isAvailable ? 1 : 0.8 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <IconWrapper $color={unlockStatus.isAvailable ? job.color : '#94a3b8'}>
                                {unlockStatus.isAvailable ? (
                                    <span style={{ fontSize: '24px' }}>{job.icon}</span>
                                ) : (
                                    <LockIcon />
                                )}
                            </IconWrapper>
                            
                            <JobInfo>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                    {job.title}
                                </Typography>
                                
                                {!unlockStatus.isAvailable ? (
                                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>
                                        {unlockStatus.reason}
                                    </Typography>
                                ) : (
                                    <Typography variant="caption" color="text.secondary">
                                        {job.description}
                                    </Typography>
                                )}
                                
                                <JobMeta>
                                    <MetaItem><AttachMoneyIcon fontSize="small" /> {job.reward}</MetaItem>
                                    <MetaItem><BoltIcon fontSize="small" /> {job.energyCost}</MetaItem>
                                    <MetaItem><AccessTimeIcon fontSize="small" /> {job.duration}м</MetaItem>
                                </JobMeta>
                            </JobInfo>
                        </Box>

                        <StartButton 
                            variant="contained" 
                            disableElevation
                            disabled={!isExecutable}
                            onClick={() => setActiveGameId(job.id)}
                            sx={{ 
                                backgroundColor: isExecutable ? job.color : '#cbd5e1',
                                '&:hover': { backgroundColor: job.color },
                                minWidth: '100px'
                            }}
                        >
                            {!unlockStatus.isAvailable ? 'Закрыто' : !hasEnergy ? 'Устал' : 'Начать'}
                        </StartButton>
                    </JobCard>
                );
            })}
        </WorkContainer>
    );
};