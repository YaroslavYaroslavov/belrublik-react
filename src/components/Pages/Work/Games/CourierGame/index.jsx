import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStage, Courier, Obstacle } from './styles';
import { Box, Typography, Button, LinearProgress } from '@mui/material';

const ASSETS = {
    player: '🚲',
    obstacle1: '🌵',
    obstacle2: '🧱',
    background: '#f1f5f9'
};

const GAME_DURATION = 30;
const JUMP_TIME = 600;
const BASE_SPEED = 5; 

export const CourierGame = ({ onFinish }) => {
    const [isJumping, setIsJumping] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [obstacles, setObstacles] = useState([]);
    
    const requestRef = useRef();
    const courierRef = useRef(null);
    const stageRef = useRef(null); // Реф для контейнера игры

    const jump = useCallback(() => {
        if (!isJumping && !isGameOver && !isWin) {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), JUMP_TIME);
        }
    }, [isJumping, isGameOver, isWin]);

    // Таймер
    useEffect(() => {
        if (isGameOver || isWin) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsWin(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isGameOver, isWin]);

    // Игровой цикл
    const update = useCallback(() => {
        if (isGameOver || isWin) return;

        setObstacles(prev => {
            const moved = prev.map(o => ({ ...o, x: o.x - BASE_SPEED }));
            
            // Коллизии
            const courierRect = courierRef.current?.getBoundingClientRect();
            if (courierRect) {
                for (let o of moved) {
                    const obsElem = document.getElementById(`obs-${o.id}`);
                    const obsRect = obsElem?.getBoundingClientRect();
                    
                    if (obsRect && 
                        courierRect.right - 20 > obsRect.left && 
                        courierRect.left + 20 < obsRect.right && 
                        courierRect.bottom - 10 > obsRect.top) {
                        setIsGameOver(true);
                        return moved;
                    }
                }
            }

            const filtered = moved.filter(o => o.x > -100);
            
            // Генерируем новое препятствие за правой границей текущего экрана
            if (filtered.length < 1 && Math.random() > 0.98) {
                const stageWidth = stageRef.current?.offsetWidth || window.innerWidth;
                filtered.push({ 
                    id: Date.now(), 
                    x: stageWidth + 100, // Появление за краем
                    type: Math.random() > 0.5 ? ASSETS.obstacle1 : ASSETS.obstacle2 
                });
            }
            return filtered;
        });

        requestRef.current = requestAnimationFrame(update);
    }, [isGameOver, isWin]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current);
    }, [update]);

    const handleFinish = (status) => {
        if (status === 'win') onFinish({ money: 150, energy: 30, timeAdd: 45 });
        else onFinish({ money: 0, energy: 10, timeAdd: 15 });
    };

    return (
        <Box sx={{ 
            width: '100%', 
            minHeight: '100vh', 
            bgcolor: '#fff', 
            position: 'fixed', // Чтобы перекрыть весь экран поверх Main
            top: 0, 
            left: 0, 
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            boxSizing: 'border-box'
        }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Доставка: {timeLeft}с</Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#22c55e' }}>150 USD</Typography>
            </Box>
            
            <LinearProgress 
                variant="determinate" 
                value={(timeLeft / GAME_DURATION) * 100} 
                sx={{ mb: 3, height: 10, borderRadius: 5, bgcolor: '#f1f5f9' }}
            />
            
            <GameStage onClick={jump} ref={stageRef} style={{ background: ASSETS.background }}>
                <Courier
                    ref={courierRef}
                    animate={{ y: isJumping ? -110 : 0 }}
                    transition={{ duration: JUMP_TIME / 2000, ease: "easeOut" }}
                >
                    {ASSETS.player}
                </Courier>

                {obstacles.map(o => (
                    <Obstacle key={o.id} id={`obs-${o.id}`} style={{ left: `${o.x}px` }}>
                        {o.type}
                    </Obstacle>
                ))}

                {(isGameOver || isWin) && (
                    <Box sx={{
                        position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.9)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: isWin ? '#22c55e' : '#ef4444', mb: 1 }}>
                            {isWin ? 'УСПЕХ!' : 'АВАРИЯ!'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', px: 4 }}>
                            {isWin ? 'Заказ доставлен вовремя. Отличная работа!' : 'Вы разбили товар. Попробуйте еще раз позже.'}
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={() => handleFinish(isWin ? 'win' : 'lose')}
                            sx={{ bgcolor: isWin ? '#22c55e' : '#ef4444', borderRadius: '15px', px: 6, py: 1.5, fontSize: '1.1rem' }}
                        >
                            {isWin ? 'Получить 150 USD' : 'Выйти'}
                        </Button>
                    </Box>
                )}
            </GameStage>

            <Typography variant="body2" sx={{ mt: 'auto', mb: 4, color: '#94a3b8', textAlign: 'center' }}>
                Нажми на поле, чтобы прыгнуть через препятствие
            </Typography>
        </Box>
    );
};