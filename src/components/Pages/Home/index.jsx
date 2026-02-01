import React, { useState } from 'react';
import { Typography, Divider, List, Chip, Box, Button } from '@mui/material';
import { HomeContainer, RoomItem } from './styles';
import BedIcon from '@mui/icons-material/Bed';
import KitchenIcon from '@mui/icons-material/Kitchen';
import InventoryIcon from '@mui/icons-material/Inventory2';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import { SleepOverlay } from './SleepOverlay';

/**
 * @param {Object} userStats - данные игрока (balance, energy, day, inventory)
 * @param {Function} onSleep - функция из App.jsx для смены дня
 * @param {Function} onUseItem - функция из App.jsx для использования расходников
 */
export const Home = ({ userStats, onSleep, onUseItem }) => {
    const { inventory, day, energy } = userStats;
    const [isSleeping, setIsSleeping] = useState(false);

    // Фильтруем инвентарь по категориям
    const furniture = inventory.filter(item => 
        item.type === 'furniture' || item.id === 'bed' || item.id === 'fridge' || item.id === 'clock' || item.id === 'laptop'
    );
    
    const consumables = inventory.filter(item => 
        item.type === 'consumable' || item.id === 'kvas'
    );

    const handleStartSleep = () => {
        setIsSleeping(true);
    };

    const handleDrinkKvas = (itemId) => {
        if (energy >= 100) {
            // Можно добавить уведомление, что энергия уже полная
            return;
        }
        if (typeof onUseItem === 'function') {
            onUseItem(itemId);
        }
    };

    return (
        <HomeContainer>
            {/* Оверлей анимации сна */}
            {isSleeping && (
                <SleepOverlay 
                    day={day + 1} 
                    onFinish={() => {
                        if (typeof onSleep === 'function') {
                            onSleep();
                        }
                        setIsSleeping(false);
                    }} 
                />
            )}

            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Мой Дом</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Место, где можно отдохнуть и восстановить силы
            </Typography>

            <Divider sx={{ mb: 2 }}>Обстановка</Divider>
            <Box sx={{ mb: 2 }}>
                {furniture.length > 0 ? furniture.map(item => (
                    <RoomItem key={item.id} sx={{ opacity: item.count === 0 ? 0.6 : 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {item.id === 'bed' ? <BedIcon color="primary" /> : 
                             item.id === 'fridge' ? <KitchenIcon color="primary" /> :
                             <InventoryIcon color="disabled" />}
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {item.title || item.displayName || item.id}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {item.lvl ? `Уровень: ${item.lvl}` : 'Предмет интерьера'}
                                </Typography>
                            </Box>
                        </Box>
                        {item.count === 0 && <Chip label="Не куплено" size="small" variant="outlined" />}
                    </RoomItem>
                )) : (
                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#94a3b8', my: 2 }}>
                        Здесь пока пусто...
                    </Typography>
                )}
            </Box>

            <Divider sx={{ mb: 2, mt: 4 }}>Запасы (Нажми, чтобы использовать)</Divider>
            <List sx={{ mb: 4 }}>
                {consumables.length > 0 ? consumables.map(item => (
                    <RoomItem 
                        key={item.id}
                        onClick={() => handleDrinkKvas(item.id)}
                        sx={{ 
                            cursor: (item.count > 0 && energy < 100) ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            '&:active': { transform: energy < 100 ? 'scale(0.97)' : 'none' },
                            border: item.id === 'kvas' && energy < 100 ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                            bgcolor: item.id === 'kvas' && energy < 100 ? '#eff6ff' : '#fff'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocalDrinkIcon sx={{ color: item.id === 'kvas' ? '#3b82f6' : '#f59e0b' }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {item.title || item.displayName || item.id}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                                    {item.id === 'kvas' ? '+20 Энергии' : ''}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                x{item.count}
                            </Typography>
                            {energy < 100 && item.count > 0 && (
                                <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 800 }}>
                                    ИСПОЛЬЗОВАТЬ
                                </Typography>
                            )}
                        </Box>
                    </RoomItem>
                )) : (
                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#94a3b8', my: 2 }}>
                        В холодильнике пусто...
                    </Typography>
                )}
            </List>

            <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<NightlightIcon />}
                onClick={handleStartSleep}
                sx={{
                    py: 2,
                    mt: 'auto',
                    borderRadius: '16px',
                    bgcolor: '#1e293b',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: '#0f172a' }
                }}
            >
                Закончить день
            </Button>
        </HomeContainer>
    );
};