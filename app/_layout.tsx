import { Stack, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native'; // Import StyleSheet

export default function RootLayout() {
  const router = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<{ label: string; icon: string }>({ label: "Space", icon: "🌌" });
  const menuItems = [
    { id: 1, label: 'Space', icon: '🌌' },
    { id: 2, label: 'Sales', icon: '🎈' },
    { id: 3, label: 'Products', icon: '📦' },
    { id: 4, label: 'Inventory', icon: ' 🀫' },
    { id: 5, label: 'Posts', icon: '🥁' },
    { id: 6, label: 'Pages', icon: '🔗' },
    { id: 7, label: 'Path', icon: '〰️' },
    { id: 8, label: 'Analytics', icon: '🎯' },
    { id: 9, label: 'Settings', icon: '🎮' },
    { id: 10, label: 'AI agent', icon: '🕹️' },
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
          headerStyle: styles.headerStyle, // Use the styles object

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
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#fff", zIndex: 999 }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee", flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable onPress={() => setShowMenu(false)}>
              <Text style={{ fontSize: 18 }}>Close</Text>
            </Pressable>
          </View>
          {menuItems.map(item => (
            <Pressable key={item.id} onPress={() => { setSelectedMenu(item); setShowMenu(false); }}>
              <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee", flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 24, marginRight: 8 }}>{item.icon}</Text>
                <Text style={{ fontSize: 18 }}>{item.label}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0
    }
});