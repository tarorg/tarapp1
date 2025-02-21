import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
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
  const [inputText, setInputText] = useState("");
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
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

        <View style={styles.bottomContainer}>
          <View style={styles.toolbar}>
            <TouchableOpacity
              style={styles.toolbarButton}
            >
              <FontAwesome name="search" size={24} color="#4444ff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(null);
                setModalVisible(true);
              }}
              style={styles.toolbarButton}
            >
              <FontAwesome name="plus" size={24} color="#4444ff" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.sendButton}>
              <FontAwesome name="send" size={20} color="#4444ff" />
            </TouchableOpacity>
          </View>
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
    </>
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
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: 24,
  },
  toolbar: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  toolbarButton: {
    padding: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
});
