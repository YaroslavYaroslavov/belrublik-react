import React from 'react';
import { ShopContainer, ItemCard, ItemImage, BuyButton, OwnedBadge } from "./styles";
import { Typography, Box, Stack } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UpgradeIcon from '@mui/icons-material/Upgrade'; // Иконка для улучшения

const SHOP_ITEMS = [
    {
        id: 'bicycle',
        title: 'Велосипед',
        description: 'Открывает доступ к работе курьером',
        price: 500,
        icon: '🚲',
        multiPurchase: false,
        type: 'furniture'
    },
    {
        id: 'kvas',
        title: 'Холодный квас',
        description: 'Моментально восстанавливает 20 энергии',
        price: 15,
        icon: '🍺',
        multiPurchase: true,
        type: 'consumable'
    },
    {
        id: 'fridge',
        title: 'Холодильник',
        description: 'Позволяет хранить больше продуктов',
        price: 1200,
        icon: '🧊',
        multiPurchase: false,
        type: 'furniture'
    },
    {
        id: 'clock',
        title: 'Будильник',
        description: 'Гарантирует пробуждение ровно в 07:00',
        price: 150,
        icon: '⏰',
        multiPurchase: false,
        type: 'furniture'
    },
    {
        id: 'bed',
        title: 'Удобная кровать',
        description: 'Уровень 2: Всегда восстанавливает 100% энергии',
        price: 2500,
        icon: '🛌',
        multiPurchase: false,
        type: 'furniture',
        lvl: 2 
    },
    {
        id: 'laptop',
        title: 'Ноутбук',
        description: 'Позволяет работать удаленно (Скоро)',
        price: 4500,
        icon: '💻',
        multiPurchase: false,
        type: 'furniture'
    }
];

export const Shop = ({ userStats, onBuyItem }) => {
    const { balance, inventory } = userStats;

    return (
        <ShopContainer>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>Магазин</Typography>
                <Typography variant="body2" color="text.secondary">
                    Твое текущее состояние: {balance.toLocaleString()} USD
                </Typography>
            </Box>

            {SHOP_ITEMS.map((item) => {
                const inventoryItem = inventory.find(i => i.id === item.id);
                const currentCount = inventoryItem ? inventoryItem.count : 0;
                const currentLvl = inventoryItem ? (inventoryItem.lvl || 1) : 0;
                
                // ЛОГИКА ИСПРАВЛЕНИЯ БАГА:
                // 1. Предмет считается купленным, если он не многоразовый И (у него нет уровней ИЛИ его текущий уровень >= уровню в магазине)
                const isOwned = !item.multiPurchase && currentCount > 0 && (!item.lvl || currentLvl >= item.lvl);
                
                // 2. Это "Улучшение", если предмет уже есть, но в магазине уровень выше
                const isUpgrade = item.lvl && currentLvl > 0 && currentLvl < item.lvl;

                // 3. Можно купить, если: это расходник ИЛИ это улучшение ИЛИ предмета еще нет совсем
                const canBuy = item.multiPurchase || isUpgrade || currentCount === 0;

                return (
                    <ItemCard key={item.id} elevation={0} sx={{ opacity: isOwned ? 0.8 : 1 }}>
                        {isOwned && (
                            <OwnedBadge>Куплено</OwnedBadge>
                        )}
                        {isUpgrade && (
                            <OwnedBadge sx={{ bgcolor: '#3b82f6', color: '#fff' }}>Доступно улучшение</OwnedBadge>
                        )}
                        {item.multiPurchase && currentCount > 0 && (
                            <OwnedBadge>В наличии: {currentCount}</OwnedBadge>
                        )}

                        <ItemImage>{item.icon}</ItemImage>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                {item.title} {item.lvl && `(Lvl ${item.lvl})`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                {item.description}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography sx={{ fontWeight: 900, color: balance >= item.price ? '#22c55e' : '#ef4444' }}>
                                    {item.price} USD
                                </Typography>
                                
                                <BuyButton 
                                    variant="contained" 
                                    size="small"
                                    disableElevation
                                    disabled={isOwned || balance < item.price}
                                    onClick={() => onBuyItem(item)}
                                    startIcon={isOwned ? <CheckCircleIcon /> : (isUpgrade ? <UpgradeIcon /> : <ShoppingCartIcon />)}
                                    color={isUpgrade ? "info" : (isOwned ? "success" : "primary")}
                                >
                                    {isOwned ? "Куплено" : (isUpgrade ? "Улучшить" : "Купить")}
                                </BuyButton>
                            </Stack>
                        </Box>
                    </ItemCard>
                );
            })}
        </ShopContainer>
    );
};