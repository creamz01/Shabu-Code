import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

// Import Styles
import { styles } from './styles'; 

// ข้อมูลเมนู (จำลองจากรูปภาพ)
const MENU_DATA = {
  Standard: {
    Meat: [
      { name: 'Short rib', image: 'https://via.placeholder.com/60/f0f0f0?text=Short+rib', price: 0 },
      { name: 'Sirloin', image: 'https://via.placeholder.com/60/f0f0f0?text=Sirloin', price: 0 },
      { name: 'Oyster Blade', image: 'https://via.placeholder.com/60/f0f0f0?text=Oyster+Blade', price: 0 },
      { name: 'Tongue Slice', image: 'https://via.placeholder.com/60/f0f0f0?text=Tongue+Slice', price: 0 },
    ],
    Vegetable: [
      { name: 'Water Spinach', image: 'https://via.placeholder.com/60/f0f0f0?text=Water+Spinach', price: 0 },
      { name: 'Chinese cabbage', image: 'https://via.placeholder.com/60/f0f0f0?text=Chinese+cabbage', price: 0 },
      { name: 'Bok choy', image: 'https://via.placeholder.com/60/f0f0f0?text=Bok+choy', price: 0 },
    ],
  },
  Premium: {
    Meat: [
      { name: 'Aust.Wagyu Striploin', image: 'https://via.placeholder.com/60/f0f0f0?text=Wagyu+Strip', price: 0, tag: 'Premium' },
      { name: 'Aust.Wagyu Oyster Blade', image: 'https://via.placeholder.com/60/f0f0f0?text=Wagyu+Oyster', price: 0, tag: 'Premium' },
      { name: 'Aust.Wagyu Karubi', image: 'https://via.placeholder.com/60/f0f0f0?text=Wagyu+Karubi', price: 0, tag: 'Premium' },
      { name: 'Aust.Wagyu Harami', image: 'https://via.placeholder.com/60/f0f0f0?text=Wagyu+Harami', price: 0, tag: 'Premium' },
      { name: 'Short rib', image: 'https://via.placeholder.com/60/f0f0f0?text=Short+rib', price: 0 },
      { name: 'Sirloin', image: 'https://via.placeholder.com:60/f0f0f0?text=Sirloin', price: 0 },
      { name: 'Oyster Blade', image: 'https://via.placeholder.com/60/f0f0f0?text=Oyster+Blade', price: 0 },
    ],
  },
};

const INITIAL_TIME_SECONDS = 2 * 60 * 60; // 2 ชั่วโมง
const TABS = ['All', 'Meat', 'Vegetable', 'Fried', 'Sweet'];

// ------------------------------------------------------------------
// Component: Countdown Timer
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
  );
};

// ------------------------------------------------------------------
// Component: ItemCard
const ItemCard = ({ item, theme, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.initialQuantity || (theme === 'Standard' ? 0 : 1));
  const isPremium = item.tag === 'Premium';

  const handleQuantity = useCallback((change) => {
    setQuantity(prev => {
      const newQty = Math.max(0, prev + change);
      onQuantityChange(item.name, newQty);
      return newQty;
    });
  }, [item.name, onQuantityChange]);
  
  // ในหน้า Standard ใช้เครื่องหมาย '+' ถ้าจำนวนเป็น 0
  if (theme === 'Standard' && quantity === 0) {
    return (
      <View style={styles.itemCardContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButtonStandard} 
          onPress={() => handleQuantity(1)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // สำหรับ Standard (มีสินค้า) และ Premium (เพิ่ม/ลด)
  return (
    <View style={styles.itemCardContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        {isPremium && (
          <View style={styles.premiumTag}>
            <Text style={styles.premiumTagText}>Premium</Text>
          </View>
        )}
      </View>
      <View style={[styles.quantityControl, theme === 'Premium' ? styles.premiumQuantityControl : styles.standardQuantityControl]}>
        <TouchableOpacity onPress={() => handleQuantity(-1)} style={styles.controlButton}>
          <Text style={styles.controlButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity} pcs</Text>
        <TouchableOpacity onPress={() => handleQuantity(1)} style={styles.controlButton}>
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ------------------------------------------------------------------
// Component: PremiumMenu (แยกหน้า)
const PremiumMenu = () => {
  const currentTheme = 'Premium'; // <--- กำหนด Theme เป็น Premium ถาวร
  const [selectedTab, setSelectedTab] = useState('All');
  const [cartItems, setCartItems] = useState({}); // { itemName: quantity }

  const themeStyle = styles.premiumTheme;
  const buttonColor = styles.premiumButton;

  // สำหรับจัดการการเพิ่ม/ลดจำนวนสินค้า
  const handleQuantityChange = useCallback((itemName, newQty) => {
    setCartItems(prev => {
      if (newQty > 0) {
        return { ...prev, [itemName]: newQty };
      }
      const newItems = { ...prev };
      delete newItems[itemName];
      return newItems;
    });
  }, []);

  const totalItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const renderContent = () => {
    const data = MENU_DATA[currentTheme];
    const categories = Object.keys(data).filter(
      cat => selectedTab === 'All' || selectedTab === cat
    );

    return categories.map(category => (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
        {data[category].map(item => (
          <ItemCard
            key={item.name}
            item={{
                ...item,
                initialQuantity: cartItems[item.name] || (item.name === 'Short rib' || item.name === 'Sirloin' || item.name === 'Oyster Blade' || item.name === 'Tongue Slice' || item.name === 'Water Spinach' || item.name === 'Chinese cabbage' || item.name === 'Bok choy' ? (currentTheme === 'Standard' ? (cartItems[item.name] || 0) : (cartItems[item.name] || 1)) : (cartItems[item.name] || 1))
            }}
            theme={currentTheme}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, themeStyle]}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        {/* แสดงเฉพาะ Premium */}
        <Text style={[styles.themeText, styles.activeThemeText]}>Premium</Text>
        <CountdownTimer />
      </View>

      {/* Tab Menu */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, selectedTab === tab && { borderBottomWidth: 2, borderBottomColor: '#D1A31C' }]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && {color: '#D1A31C', fontWeight: 'bold'}]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>

      {/* Footer / Order Button */}
      <View style={[styles.footer, themeStyle]}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total (Items)</Text>
          <Text style={styles.totalItemsText}>{totalItems} Items</Text>
        </View>
        <TouchableOpacity 
          style={[styles.orderButton, buttonColor]}
          onPress={() => alert(`Order ${currentTheme} with ${totalItems} items!`)}
        >
          <Text style={styles.orderButtonText}>Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PremiumMenu;