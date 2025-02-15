import { Stack, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Pressable, Text } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  // Set default menu selection to Space with emoji 🌌
  const [showMenu, setShowMenu] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<{ label: string; icon: string }>({ label: "Space", icon: "🌌" });
  const menuItems = [
    { id: 1, label: 'Space', icon: '🌌' },
    { id: 2, label: 'Sales', icon: '🎈' },
    { id: 3, label: 'Products', icon: '📦' },
    { id: 4, label: 'Posts', icon: '🥁' },
    { id: 5, label: 'Links', icon: '🔗' },
    { id: 6, label: 'Path', icon: '〰️' },
    { id: 7, label: 'Analytics', icon: '📈' },
    { id: 8, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          animation: "none",
          headerTitle: () => <Text></Text>, // Return an empty Text instead of a raw string or View
          headerLeft: () => (
            <Pressable onPress={() => setShowMenu(true)} style={{ paddingLeft: 16, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 24 }}>{selectedMenu.icon}</Text>
              <Text style={{ fontSize: 18, marginLeft: 4 }}>{selectedMenu.label}</Text>
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: '#fff',
            shadowColor: 'transparent',  // iOS shadow
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,  // Android elevation
            borderBottomWidth: 0,
          },
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable onPress={() => router.push('/tasks')} style={{ padding: 12 }}>
                <Feather name="play" size={26} color="black" /> {/* Changed to modern play-circle icon */}
              </Pressable>
              <Pressable onPress={() => router.push('/people')} style={{ padding: 12 }}>
                <Feather name="circle" size={24} color="black" />
              </Pressable>
            </View>
          ),
        }}
      />
      {showMenu && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#fff", zIndex: 999 }}>
          {/* Header for the drop-down with a Close button */}
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee", flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable onPress={() => setShowMenu(false)}>
              <Text style={{ fontSize: 18 }}>Close</Text>
            </Pressable>
          </View>
          {/* Menu items */}
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
