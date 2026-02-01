import React, { useState } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Main } from '../Main';

const App = () => {
    const [activePage, setActivePage] = useState('home');
    
    // Единое состояние игрока
    const [balance, setBalance] = useState(10000);
    const [energy, setEnergy] = useState(80);
    const [day, setDay] = useState(1);
    const [gameTime, setGameTime] = useState("09:00");
    const [inventory, setInventory] = useState([
        { id: 'bed', count: 1, lvl: 1, displayName: 'Кровать', type: 'furniture' },
        { id: 'fridge', count: 0, lvl: 0, displayName: 'Холодильник', type: 'furniture' },
        { id: 'kvas', count: 5, lvl: 1, displayName: 'Квас', type: 'consumable' }
    ]);;
    const updateInventory = (itemId, amount = 1, params = {}) => {
        setInventory(prev => {
            const existingItem = prev.find(i => i.id === itemId);
            
            if (existingItem) {
                return prev.map(item => 
                    item.id === itemId 
                        ? { 
                            ...item, 
                            count: Math.max(0, item.count + amount), 
                            ...params 
                          } 
                        : item
                );
            }
            
            // Если предмета нет, добавляем новый (параметры берем из вызова или дефолтные)
            return [...prev, { id: itemId, count: amount, lvl: 1, ...params }];
        });
    };
    const handleChangePage = (page) => setActivePage(page);
     
    const handleBuyItem = (item) => {
        if (balance < item.price) return alert("Недостаточно денег!");
        
        const invItem = inventory.find(i => i.id === item.id);
        if (!item.multiPurchase && invItem && invItem.count > 0) return;
        setBalance(prev => prev - item.price);
        
        // Используем нашу новую функцию обновления инвентаря
        updateInventory(item.id, 1, { 
            displayName: item.title, 
            type: item.type // Передаем тип предмета из настроек магазина
        });
    };
    // Логика начисления наград за игру
    const handleFinishWork = ({ money, energy: energyCost, timeAdd }) => {
        setBalance(prev => prev + money);
        setEnergy(prev => Math.max(0, prev - energyCost));
        
        // Добавление игрового времени
        setGameTime(prev => {
            const [h, m] = prev.split(':').map(Number);
            let totalM = h * 60 + m + timeAdd;
            let newH = Math.floor(totalM / 60) % 24;
            let newM = totalM % 60;
            return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
        });

        setActivePage('home'); // Возвращаем игрока домой
    };
    // Внутри App.jsx

const handleSleep = () => {
    // 1. Проверяем наличие кровати и её уровень
    const bed = inventory.find(i => i.id === 'bed');
    const bedLvl = bed ? bed.lvl : 0;

    // 2. Проверяем наличие часов
    const hasClock = inventory.some(i => i.id === 'clock' && i.count > 0);

    // 3. Расчет новой энергии
    let newEnergy;
    if (bedLvl >= 2) {
        newEnergy = 100;
    } else {
        newEnergy = Math.floor(Math.random() * (100 - 70 + 1)) + 70; // 70-100%
    }

    // 4. Расчет времени пробуждения
    let newTime;
    if (hasClock) {
        newTime = "07:00";
    } else {
        const hour = Math.floor(Math.random() * (10 - 8 + 1)) + 8; // 8-10 утра
        newTime = `${String(hour).padStart(2, '0')}:00`;
    }

    // 5. Обновление состояния
    setDay(prev => prev + 1);
    setEnergy(newEnergy);
    setGameTime(newTime);
};
const handleUseItem = (itemId) => {
    if (itemId === 'kvas') {
        // Проверяем, есть ли квас в инвентаре
        const item = inventory.find(i => i.id === 'kvas');
        if (!item || item.count <= 0) return;
        // 1. Восстанавливаем энергию (макс 100)
        setEnergy(prev => Math.min(prev + 20, 100));
        // 2. Уменьшаем количество в инвентаре
        setInventory(prev => prev.map(i => 
            i.id === 'kvas' 
                ? { ...i, count: i.count - 1 } 
                : i
        ).filter(i => !(i.type === 'consumable' && i.count <= 0))); 
        // filter опционально, если хотите удалять иконку когда 0
    }
};
    return (
        <>
            <Header 
                balance={balance} 
                energy={energy} 
                gameTime={gameTime} 
                day={day} 
            />
            
            <Main 
    activePage={activePage} 
    userStats={{ balance, energy, day, gameTime, inventory }} // inventory здесь уже массив
    onFinishWork={handleFinishWork}
    onBuyItem={handleBuyItem}
    updateInventory={updateInventory} // Передаем функцию управления инвентарем
    onSleep={handleSleep}
    onUseItem = {handleUseItem} 
/>

            <Footer 
                activePage={activePage} 
                handleChangePage={handleChangePage} 
            />
        </>
    );
}

export default App;