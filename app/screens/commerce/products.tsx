import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSQLiteContext } from "expo-sqlite";
import ItemModal from "./modal";

export default function TabHome() {
  const [data, setData] = React.useState<
    { id: number; name: string; email: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const database = useSQLiteContext();

  const loadData = async () => {
    const result = await database.getAllAsync<{
      id: number;
      name: string;
      email: string;
    }>("SELECT * FROM users");
    setData(result);
  };
  React.useEffect(() => {
    loadData();
  }, []);
  const headerRight = () => (
    <TouchableOpacity
      onPress={() => {
        setSelectedItem(null);
        setModalVisible(true);
      }}
      style={{ marginRight: 10 }}
    >
      <FontAwesome name="plus-circle" size={28} color="blue" />
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerRight }} />
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <View>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.emailText}>{item.email}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <ItemModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          loadData();
        }}
        initialData={selectedItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    height: 32,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "blue",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});
