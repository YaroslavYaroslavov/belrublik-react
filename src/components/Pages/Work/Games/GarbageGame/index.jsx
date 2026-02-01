import React, { useState, useEffect } from 'react';
import { Typography, Button, Stack, LinearProgress, Box } from '@mui/material';
import { FullScreenOverlay, GameArea, TrashItem, BinsContainer, Bin } from './styles';
import { AnimatePresence } from 'framer-motion';

const TRASH_TYPES = [
    { id: 'organic', icon: '🍎', label: 'Органика', color: '#10b981' },
    { id: 'plastic', icon: '🧴', label: 'Пластик', color: '#3b82f6' },
    { id: 'paper', icon: '📜', label: 'Бумага', color: '#f59e0b' }
];

const GAME_DURATION = 30;
const REQUIRED_SCORE = 10; // Нужно собрать 10 единиц мусора для оплаты

export const GarbageGame = ({ onFinish }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [currentItem, setCurrentItem] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);

    // Инициализация первого предмета
    useEffect(() => {
        spawnTrash();
    }, []);

    // Таймер
    useEffect(() => {
        if (timeLeft <= 0) {
            setIsGameOver(true);
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const spawnTrash = () => {
        const randomType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
        setCurrentItem({ ...randomType, key: Date.now() });
    };

    const handleSort = (binId) => {
        if (binId === currentItem.id) {
            setScore(prev => prev + 1);
            spawnTrash();
        } else {
            // Визуальный эффект ошибки можно добавить тут
            spawnTrash();
        }
    };

    const handleFinish = () => {
        const isWin = score >= REQUIRED_SCORE;
        onFinish({
            money: isWin ? 50 : 0,
            energy: 20,
            timeAdd: 45
        });
    };

    return (
        <FullScreenOverlay>
            {/* Хедер игры */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Сбор мусора</Typography>
                    <Typography variant="body2" color="text.secondary">Собрано: {score} / {REQUIRED_SCORE}</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: timeLeft < 10 ? '#ef4444' : 'inherit' }}>
                    {timeLeft}с
                </Typography>
            </Stack>

            <LinearProgress 
                variant="determinate" 
                value={(timeLeft / GAME_DURATION) * 100} 
                sx={{ mb: 4, height: 10, borderRadius: 5 }}
                color={score >= REQUIRED_SCORE ? "success" : "primary"}
            />

            <GameArea>
            <AnimatePresence mode="wait">
    {!isGameOver && currentItem && (
        <TrashItem
            key={currentItem.key}
            // Появление предмета
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            
            // Настройки свободного перемещения
            drag 
            dragConstraints={{ left: -500, right: 500, top: -500, bottom: 800 }} // Огромные границы, чтобы не "тянуло" обратно
            dragElastic={0} // Нулевая упругость — предмет следует за пальцем/мышкой 1 в 1
            dragMomentum={false} // Отключаем инерцию для точного контроля
            
            onDragEnd={(e, info) => {
                // info.point.y — это координата относительно всего экрана
                // Проверяем, если предмет занесли в нижнюю область, где стоят баки
                if (info.point.y > 500) { 
                    const x = info.point.x;
                    const screenWidth = window.innerWidth;
                    
                    // Логика попадания в один из трех секторов
                    if (x < screenWidth / 3) handleSort('organic');
                    else if (x < (screenWidth / 3) * 2) handleSort('plastic');
                    else handleSort('paper');
                }
            }}
            // Стили для курсора во время перетаскивания
            whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 10 }}
        >
            {currentItem.icon}
        </TrashItem>
    )}
</AnimatePresence>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Нажимай на баки, чтобы отправить туда мусор
                </Typography>

                <BinsContainer>
                    {TRASH_TYPES.map(bin => (
                        <Bin 
                            key={bin.id} 
                            $color={bin.color}
                            onClick={() => handleSort(bin.id)}
                        >
                            <Typography sx={{ fontSize: '30px', mb: 1 }}>🗑️</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 900, color: bin.color }}>
                                {bin.label.toUpperCase()}
                            </Typography>
                        </Bin>
                    ))}
                </BinsContainer>
            </GameArea>

            {/* Результаты */}
            {isGameOver && (
                <Box sx={{
                    position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.95)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, p: 4
                }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: score >= REQUIRED_SCORE ? '#22c55e' : '#ef4444' }}>
                        {score >= REQUIRED_SCORE ? 'ОТЛИЧНО!' : 'МАЛОВАТО...'}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
                        {score >= REQUIRED_SCORE 
                            ? `Вы рассортировали ${score} предметов и получили 50 USD.` 
                            : `Вы собрали только ${score}. Нужно минимум ${REQUIRED_SCORE} для оплаты.`}
                    </Typography>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        onClick={handleFinish}
                        sx={{ 
                            bgcolor: score >= REQUIRED_SCORE ? '#22c55e' : '#64748b', 
                            borderRadius: '15px', py: 2, fontWeight: 900 
                        }}
                    >
                        {score >= REQUIRED_SCORE ? 'ЗАБРАТЬ ДЕНЬГИ' : 'ВЕРНУТЬСЯ'}
                    </Button>
                </Box>
            )}
        </FullScreenOverlay>
    );
};