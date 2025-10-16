// app.js

import React from 'react';
// Import ทั้งสองหน้าจอ
import StandardMenu from './StandardMenu'; // อย่าลืมเปลี่ยนชื่อไฟล์เป็น StandardMenu.js
import PremiumMenu from './PremiumMenu'; // อย่าลืมเปลี่ยนชื่อไฟล์เป็น PremiumMenu.js

export default function App() {
  // *** ตัวอย่าง: หาก Back-end ต้องการทดสอบหน้า Premium ***
  // คุณสามารถสลับบรรทัดนี้เพื่อทดสอบได้
  //return <PremiumMenu />; 
  
  // *** ถ้าต้องการทดสอบ Standard ให้เปลี่ยนเป็น: ***
   return <StandardMenu />; 
}