import React from 'react';
import { FooterWrapper, NavigationElement, NavLabel } from "./styles";
// Импортируем иконки Material UI
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export const Footer = ({ activePage, handleChangePage }) => {
    
    // Список элементов для удобного рендеринга
    const navItems = [
        { id: 'home', label: 'Дом', icon: <HomeIcon /> },
        { id: 'work', label: 'Работа', icon: <WorkIcon /> },
        { id: 'shop', label: 'Магазин', icon: <ShoppingBagIcon /> },
        { id: 'bank', label: 'Банк', icon: <AccountBalanceIcon /> },
    ];

    return (
        <FooterWrapper>
            {navItems.map((item) => (
                <NavigationElement 
                    key={item.id}
                    $isActive={activePage === item.id} 
                    onClick={() => handleChangePage(item.id)}
                >
                    {item.icon}
                    <NavLabel $isActive={activePage === item.id}>
                        {item.label}
                    </NavLabel>
                </NavigationElement>
            ))}
        </FooterWrapper>
    );
};