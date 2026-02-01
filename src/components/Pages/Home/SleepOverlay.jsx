// Pages/Home/SleepOverlay.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #000;
    z-index: 3000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
`;

export const SleepOverlay = ({ day, onFinish }) => {
    const [displayDay, setDisplayDay] = useState(day - 1);

    useEffect(() => {
        // Анимация "перекидных часов" для дня
        const timer = setTimeout(() => {
            setDisplayDay(day);
        }, 1000);

        const finishTimer = setTimeout(() => {
            onFinish();
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [day, onFinish]);

    return (
        <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>Завершение дня...</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <Typography variant="h2" sx={{ fontWeight: 900 }}>ДЕНЬ</Typography>
                <motion.div
                    key={displayDay}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                >
                    <Typography variant="h1" sx={{ fontWeight: 900, color: '#3b82f6' }}>
                        {displayDay}
                    </Typography>
                </motion.div>
            </Box>
        </Overlay>
    );
};