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

// ข้อมูลเมนูสำหรับ Standard
const MENU_DATA = {
  Standard: {
    Meat: [
      { name: 'Short rib', image: require('./pic/USDAChoiceShortRibsSliced.jpg'), price: 0 },
      { name: 'Sirloin', image: require('./pic/Sirloin.png'), price: 0 },
      { name: 'Oyster Blade', image: require('./pic/Aust-WagyuOysterBlade.png'), price: 0 },
      { name: 'Tongue Slice', image: require('./pic/TongueSlice.jpg'), price: 0 },
    ],
    Vegetable: [
      { name: 'Water Spinach', image: require('./pic/WaterSpinach.jpg'), price: 0 },
      { name: 'Chinese cabbage', image: require('./pic/ChineseCabbage.jpg'), price: 0 },
      { name: 'Bok choy', image: require('./pic/Bokchoy.jpg'), price: 0 },
    ],
    Fried: [
      { name: 'French Fries', image: require('./pic/FrenchFries.jpg'), price: 0 },
      { name: 'Fries Chicken', image: require('./pic/FriedChicken.jpg'), price: 0 },
      { name: 'Cheese Ball', image: require('./pic/CheeseBall.jpg'), price: 0 },
    ],
    Sweet: [
      { name: 'Ice Cream', image: require('./pic/IceCream.jpg'), price: 0 },
      { name: 'Shave Ice', image: require('./pic/ShaveIce.jpg'), price: 0 },
      { name: 'Soda', image: require('./pic/RaspberrySherbet.jpg'), price: 0 },
    ],
  },
};

// Tabs รวมถึง 'All'
const TABS = ['All', 'Meat', 'Vegetable', 'Fried', 'Sweet'];

const INITIAL_TIME_SECONDS = 60 * 60 * 2;

// Component: Countdown Timer (อัปเดตใหม่)
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

// ItemCard (ปรับให้รองรับ Standard Theme และเริ่มต้นที่ 0)
const ItemCard = ({ item, theme, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(item.initialQuantity || 0);

    const handleAdd = () => {
        setQuantity(q => q + 1);
        onQuantityChange(item.name, quantity + 1);
    };

    const handleSubtract = () => {
        // สามารถลดจำนวนลงได้จนถึง 0
        if (quantity > 0) {
             setQuantity(q => q - 1);
             onQuantityChange(item.name, quantity - 1);
        }
    };

    const isPremiumItem = item.tag === 'Premium';

    // ใช้ Standard Style (สีฟ้า) สำหรับ QuantityControl
    const QuantityControl = (
        <View style={[styles.quantityControl, styles.standardQuantityControl]}>
            <TouchableOpacity style={styles.controlButton} onPress={handleSubtract}>
                <Text style={styles.controlButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.controlButton} onPress={handleAdd}>
                <Text style={styles.controlButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );

    // ใช้ Standard Style (สีฟ้า) สำหรับ AddButton
    const AddButton = (
        <TouchableOpacity style={styles.addButtonStandard} onPress={handleAdd}>
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.itemCardContainer}>
            <Image source={item.image} style={styles.itemImage} />

            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                {/* ไม่แสดง Tag ถ้าไม่ใช่ Premium */}
                {isPremiumItem && (
                    <View style={styles.premiumTag}>
                        <Text style={styles.premiumTagText}>PREMIUM</Text>
                    </View>
                )}
            </View>

            {/* แสดง QuantityControl เมื่อ quantity > 0, แสดง AddButton เมื่อ quantity === 0 */}
            {quantity > 0 ? QuantityControl : AddButton}
        </View>
    );
};


export default function StandardMenu() {
  const currentTheme = 'Standard';
  const [selectedTab, setSelectedTab] = useState(TABS[0]); // เริ่มต้นที่ 'All'
  const [cartItems, setCartItems] = useState({});
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const total = Object.values(cartItems).reduce((sum, q) => sum + q, 0);
    setTotalItems(total);
  }, [cartItems]);

  const handleQuantityChange = useCallback((itemName, quantity) => {
    setCartItems(prev => ({
      ...prev,
      [itemName]: quantity,
    }));
  }, []);

  const themeStyle = styles.standardTheme;
  const buttonColor = styles.standardButton; // ใช้ standardButton
  const data = MENU_DATA[currentTheme]; // ดึงข้อมูล Standard

  const renderContent = () => {
    const category = selectedTab;
    const initialQty = 0; // Standard เริ่มที่ 0
    // หมวดหมู่จริงที่ต้องวนลูป (ตัด 'All' ออก)
    const tabsForContent = TABS.filter(tab => tab !== 'All');

    if (category === 'All') {
        // Logic สำหรับ Tab 'All': แสดงสินค้าทั้งหมดพร้อมหัวข้อหมวดหมู่
        return (
            <View style={styles.categoryContainer}>
                {tabsForContent.map(cat => {
                    const items = data[cat];
                    if (!items || items.length === 0) return null; // ข้ามหมวดหมู่ที่ว่างเปล่า

                    return (
                        <View key={cat} style={styles.allCategorySection}>
                            {/* แสดงหัวข้อหมวดหมู่ */}
                            <Text style={styles.categoryTitle}>{cat}</Text>

                            {/* แสดงรายการสินค้าในหมวดหมู่นั้นๆ */}
                            {items.map(item => (
                                <ItemCard
                                    key={item.name}
                                    item={{
                                        ...item,
                                        initialQuantity: cartItems[item.name] || initialQty
                                    }}
                                    theme={currentTheme}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ))}
                        </View>
                    );
                })}
            </View>
        );

    } else {
        // Logic สำหรับหมวดหมู่ปกติ (Meat, Fried, etc.)
        const items = data[category];
        if (!items) return <Text>No items in this category.</Text>;

        return (
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {items.map(item => (
                    <ItemCard
                        key={item.name}
                        item={{...item, initialQuantity: cartItems[item.name] || initialQty}}
                        theme={currentTheme}
                        onQuantityChange={handleQuantityChange}
                    />
                ))}
            </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, themeStyle]}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.themeText, styles.activeThemeText]}>Standard</Text>
        <CountdownTimer />
      </View>

      {/* Tab Menu */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            // ใช้ Standard Color (#5C9EAD) สำหรับ Tab ที่เลือก
            style={[styles.tabItem, selectedTab === tab && { borderBottomWidth: 2, borderBottomColor: '#5C9EAD' }]}
            onPress={() => setSelectedTab(tab)}
          >
            {/* ใช้ Standard Color (#5C9EAD) สำหรับ Text ใน Tab ที่เลือก */}
            <Text style={[styles.tabText, selectedTab === tab && {color: '#5C9EAD', fontWeight: 'bold'}]}>{tab}</Text>
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
}