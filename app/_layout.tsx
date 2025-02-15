import { Stack, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { init } from "@instantdb/react-native";

const db = init({ appId: "84f087af-f6a5-4a5f-acbc-bc4008e3a725" });

export default function RootLayout() {
  const router = useRouter();
  const { user } = db.useAuth();
  const [showMenu, setShowMenu] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<{ label: string; icon: string }>({ label: "Space", icon: "🌌" });
  const menuItems = [
    { id: 1, label: 'Space', icon: '🌌', route: '/space' },
    { id: 2, label: 'Sales', icon: '🎈', route: '/sales' },
    { id: 3, label: 'Products', icon: '📦', route: '/products' },
    { id: 4, label: 'Inventory', icon: ' 🀫', route: '/inventory' },
    { id: 5, label: 'Posts', icon: '🥁', route: '/posts' },
    { id: 6, label: 'Pages', icon: '🔗', route: '/pages' },
    { id: 7, label: 'Path', icon: '〰️', route: '/path' },
    { id: 8, label: 'Analytics', icon: '🎯', route: '/analytics' },
    { id: 9, label: 'Settings', icon: '🎮', route: '/settings' },
    { id: 10, label: 'AI agent', icon: '🕹️', route: '/ai-agent' },
    { 
      id: 11, 
      label: 'Sign Out', 
      icon: '👋', 
      route: '/',
      subText: user ? `ID: ${user.id}\n${user.email}` : '',
      action: () => {
        db.auth.signOut();
        router.replace("/");
        setShowMenu(false);
      }
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          animation: "none",
          headerTitle: () => <Text></Text>,
          headerLeft: () => (
            <Pressable onPress={() => setShowMenu(true)} style={{ paddingLeft: 16, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 24 }}>{selectedMenu.icon}</Text>
              <Text style={{ fontSize: 18, marginLeft: 4 }}>{selectedMenu.label}</Text>
            </Pressable>
          ),
          headerStyle: styles.headerStyle,

          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable onPress={() => router.push('/t')} style={{ padding: 12 }}>
                <Feather name="play" size={26} color="black" />
              </Pressable>
              <Pressable onPress={() => router.push('/a')} style={{ padding: 12 }}>
                <Feather name="circle" size={24} color="black" />
              </Pressable>
            </View>
          ),
        }}
      />
      {showMenu && (
        <View style={styles.menuContainer}>
          {/* Fixed Header */}
          <View style={styles.menuHeader}>
            <Pressable onPress={() => setShowMenu(false)}>
              <Text style={{ fontSize: 18 }}>Close</Text>
            </Pressable>
          </View>

          {/* Scrollable Menu List */}
          <ScrollView style={styles.menuScroll}>
            {menuItems.map(item => (
              <Pressable 
                key={item.id} 
                onPress={() => { 
                  if (item.action) {
                    item.action();
                  } else {
                    setSelectedMenu(item); 
                    setShowMenu(false); 
                    router.push(item.route);
                  }
                }}
              >
                <View style={styles.menuItem}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuLabel, item.id === 11 && styles.signOutText]}>
                      {item.label}
                    </Text>
                    {item.subText && (
                      <Text style={styles.menuSubText}>{item.subText}</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 999,
    flexDirection: 'column'
  },
  menuHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  menuScroll: {
    flex: 1
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center"
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 8,
    width: 30
  },
  menuLabel: {
    fontSize: 18
  },
  menuTextContainer: {
    flex: 1,
  },
  menuSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  signOutText: {
    color: "#ef4444"
  }
});