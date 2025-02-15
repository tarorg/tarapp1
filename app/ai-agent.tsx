import { Text, View } from "react-native";

export default function AIAgent() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>AI Agent</Text>
    </View>
  );
}