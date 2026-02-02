import React from "react";
import {
  ShopContainer,
  ItemCard,
  ItemImage,
  BuyButton,
  OwnedBadge,
} from "./styles";
import { Typography, Box, Stack } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UpgradeIcon from "@mui/icons-material/Upgrade";

const SHOP_ITEMS = [
  {
    id: "bicycle",
    title: "Велосипед",
    description: "Доступ к работе курьером",
    price: 500,
    icon: "🚲",
    multiPurchase: false,
    type: "furniture",
  },
  {
    id: "kvas",
    title: "Холодный квас",
    description: "Восстанавливает 20 энергии",
    price: 15,
    icon: "🍺",
    multiPurchase: true,
    type: "consumable",
  },
  {
    id: "fridge",
    title: "Холодильник",
    description: "Хранение продуктов",
    price: 1200,
    icon: "🧊",
    multiPurchase: false,
    type: "furniture",
  },
  {
    id: "clock",
    title: "Будильник",
    description: "Пробуждение в 07:00",
    price: 150,
    icon: "⏰",
    multiPurchase: false,
    type: "furniture",
  },
  {
    id: "bed",
    title: "Удобная кровать",
    description: "Lvl 2: Восстанавливает 100% энергии",
    price: 2500,
    icon: "🛌",
    multiPurchase: false,
    type: "furniture",
    lvl: 2,
  },
  {
    id: "laptop",
    title: "Ноутбук",
    description: "Работа удаленно (Скоро)",
    price: 4500,
    icon: "💻",
    multiPurchase: false,
    type: "furniture",
  },
];

export const Shop = ({ userStats, activeEvent, onBuyItem }) => {
  const { balance, inventory } = userStats;

  // Проверка активной скидки из события
  const discount = activeEvent?.effect?.shopDiscount || 0;

  return (
    <ShopContainer>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Магазин
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Баланс: {balance.toLocaleString()} USD
        </Typography>
        {discount > 0 && (
          <Typography
            variant="caption"
            sx={{ color: "#ef4444", fontWeight: 900 }}
          >
            🔥 АКТИВНО СОБЫТИЕ: СКИДКИ {discount * 100}%!
          </Typography>
        )}
      </Box>

      {SHOP_ITEMS.map((item) => {
        const inventoryItem = inventory.find((i) => i.id === item.id);
        const currentCount = inventoryItem ? inventoryItem.count : 0;
        const currentLvl = inventoryItem ? inventoryItem.lvl || 1 : 0;

        // Расчет цены со скидкой
        const finalPrice =
          discount > 0 ? Math.floor(item.price * (1 - discount)) : item.price;

        // Логика владения и улучшений
        const isOwned =
          !item.multiPurchase &&
          currentCount > 0 &&
          (!item.lvl || currentLvl >= item.lvl);
        const isUpgrade = item.lvl && currentCount > 0 && currentLvl < item.lvl;
        const canBuy = item.multiPurchase || isUpgrade || currentCount === 0;

        return (
          <ItemCard
            key={item.id}
            elevation={0}
            sx={{ opacity: isOwned ? 0.7 : 1 }}
          >
            {isOwned && <OwnedBadge color="success">Куплено</OwnedBadge>}
            {isUpgrade && (
              <OwnedBadge sx={{ bgcolor: "#3b82f6" }}>Улучшение</OwnedBadge>
            )}
            {item.multiPurchase && currentCount > 0 && (
              <OwnedBadge color="primary">В наличии: {currentCount}</OwnedBadge>
            )}

            <ItemImage>{item.icon}</ItemImage>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {item.title} {item.lvl && `(Lvl ${item.lvl})`}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 1 }}
              >
                {item.description}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Box>
                  {discount > 0 && !isOwned && (
                    <Typography
                      sx={{
                        textDecoration: "line-through",
                        fontSize: "0.7rem",
                        color: "gray",
                      }}
                    >
                      {item.price}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: balance >= finalPrice ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {finalPrice} USD
                  </Typography>
                </Box>

                <BuyButton
                  variant="contained"
                  size="small"
                  disabled={!canBuy || balance < finalPrice}
                  onClick={() => onBuyItem({ ...item, price: finalPrice })}
                  startIcon={
                    isOwned ? (
                      <CheckCircleIcon />
                    ) : isUpgrade ? (
                      <UpgradeIcon />
                    ) : (
                      <ShoppingCartIcon />
                    )
                  }
                  color={isUpgrade ? "info" : "primary"}
                >
                  {isOwned ? "Куплено" : isUpgrade ? "Улучшить" : "Купить"}
                </BuyButton>
              </Stack>
            </Box>
          </ItemCard>
        );
      })}
    </ShopContainer>
  );
};
