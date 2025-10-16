// styles.js

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  standardTheme: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
  },
  premiumTheme: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  themeText: {
    fontSize: 18,
    color: '#aaa',
    marginHorizontal: 10,
  },
  activeThemeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 18,
    color: '#f00',
    fontWeight: 'bold',
  },
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#aaa',
  },
  // Content
  content: {
    padding: 15,
    paddingBottom: 100, // เพื่อหลีกเลี่ยง Footer
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Item Card
  itemCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  premiumTag: {
    backgroundColor: '#D1A31C',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 3,
    alignSelf: 'flex-start',
  },
  premiumTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Standard Add Button (Initial state)
  addButtonStandard: {
    backgroundColor: '#5C9EAD',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
  },
  // Quantity Control
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  standardQuantityControl: {
    backgroundColor: '#5C9EAD', // สีฟ้า Standard
  },
  premiumQuantityControl: {
    backgroundColor: '#D1A31C', // สีทอง Premium
  },
  controlButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#fff',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'column',
  },
  totalText: {
    fontSize: 14,
    color: '#aaa',
  },
  totalItemsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  orderButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  standardButton: {
    backgroundColor: '#86B6C4', // สีฟ้าอ่อน Standard
  },
  premiumButton: {
    backgroundColor: '#D1A31C', // สีทอง Premium
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});