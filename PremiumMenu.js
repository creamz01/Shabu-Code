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

const MENU_DATA = {
  Premium: { // ใช้คีย์เป็น Premium
    Meat: [
      { name: 'Aust.Wagyu Striploin', image: require('./pic/P-Aust-WagyuStriploin.png'), price: 0, tag: 'Premium' },
      { name: 'Aust.Wagyu Harami', image: require('./pic/P-Aust-WagyuHarami.jpg'), price: 0, tag: 'Premium' },
      // *ใช้โค้ดเดิมของคุณ: P-Aust-WagyuKarubi.jpg
      { name: 'Wagyu Karubi', image: require('./pic/P-Aust-WagyuKarubi.jpg'), price: 0, tag: 'Premium' },
      { name: 'Aust.Wagyu Oyster Blade', image: require('./pic/P-Aust-WagyuOysterBlade.png'), price: 0, tag: 'Premium' },
    ],
    Vegetable: [
      { name: 'King Oyster Mushroom', image: require('./pic/P-KingOysterMushroom.png'), price: 0, tag: 'Premium' },
      { name: 'Perilla Leaf', image: require('./pic/P-Perilla-leaf.jpg'), price: 0, tag: 'Premium' },
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
      { name: 'Raspberry Sherbet', image: require('./pic/RaspberrySherbet.jpg'), price: 0 },
    ],
  },
};

const TABS = ['All', 'Meat', 'Vegetable', 'Fried', 'Sweet'];

// Timer (2 ชั่วโมง)
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

// ItemCard (แก้ไข)
const ItemCard = ({ item, theme, onQuantityChange }) => {
    // ⚠️ แก้ไข: Premium เริ่มต้นที่ 0
    const [quantity, setQuantity] = useState(item.initialQuantity || 0);

    const handleAdd = () => {
        setQuantity(q => q + 1);
        onQuantityChange(item.name, quantity + 1);
    };

    const handleSubtract = () => {
        // ⚠️ แก้ไข: สามารถลดจำนวนลงได้จนถึง 0
        if (quantity > 0) {
             setQuantity(q => q - 1);
             onQuantityChange(item.name, quantity - 1);
        }
    };

    const isPremiumItem = item.tag === 'Premium';

    // UI สำหรับการควบคุมจำนวน (quantity > 0)
    const QuantityControl = (
        <View style={[styles.quantityControl, styles.premiumQuantityControl]}>
            <TouchableOpacity style={styles.controlButton} onPress={handleSubtract}>
                <Text style={styles.controlButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.controlButton} onPress={handleAdd}>
                <Text style={styles.controlButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );

    // ⚠️ เพิ่ม: UI สำหรับปุ่มเพิ่ม (quantity === 0)
    const AddButton = (
        <TouchableOpacity style={styles.addButtonPremium} onPress={handleAdd}>
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.itemCardContainer}>
            <Image source={item.image} style={styles.itemImage} />

            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                {isPremiumItem && (
                    <View style={styles.premiumTag}>
                        <Text style={styles.premiumTagText}>PREMIUM</Text>
                    </View>
                )}
            </View>

            {/* ⚠️ แก้ไข: แสดง QuantityControl เมื่อ quantity > 0, แสดง AddButton เมื่อ quantity === 0 */}
            {quantity > 0 ? QuantityControl : AddButton}
        </View>
    );
};


export default function PremiumMenu() {
  const currentTheme = 'Premium';
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
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

  const themeStyle = styles.premiumTheme;
  const buttonColor = styles.premiumButton;
  const data = MENU_DATA[currentTheme];

  const renderContent = () => {
    const category = selectedTab;
    // ⚠️ แก้ไข: Premium เริ่มต้นที่ 0
    const initialQty = 0;
    const tabsForContent = TABS.filter(tab => tab !== 'All');

    if (category === 'All') {
        // Logic สำหรับ Tab 'All': แสดงสินค้าทั้งหมดพร้อมหัวข้อหมวดหมู่
        return (
            <View style={styles.categoryContainer}>
                {tabsForContent.map(cat => {
                    const items = data[cat];
                    if (!items || items.length === 0) return null;

                    return (
                        <View key={cat} style={styles.allCategorySection}>
                            <Text style={styles.categoryTitle}>{cat}</Text>

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
}