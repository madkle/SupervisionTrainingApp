import React, { useState, useContext } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Context } from "../../App";
//disable hyponation
Font.registerHyphenationCallback((word) => [word]);
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
});
const transcriptStyle = StyleSheet.create({
  transcriptContainer: {
    gap: "12px",
    display: "flex",
  },
  chatGroup: {
    maxWidth: "90%",
    marginLeft: "15px",
  },
  chatLine: {
    borderBottom: "1px dotted #000",
  },
});
const Transcription = ({ chatLog }) => {
  const test = () => {
    return chatLog.map((item, index) => {
      if (item.role !== "system") {
        return (
          <View key={"chatline " + index} style={transcriptStyle.chatLine}>
            <View style={transcriptStyle.chatGroup}>
              <Text>{item.role === "user" ? "Veileder: " : "Lærling: "}</Text>
              <Text>{item.content}</Text>
            </View>
          </View>
        );
      }
    });
  };
  return <View style={transcriptStyle.transcriptContainer}>{test()}</View>;
};
const FeedbackSection = ({ feedback }) => {
  let data = "";
  if (feedback !== "") {
    if (feedback.constructor === {}.constructor) {
      data = feedback;
    } else {
      data = JSON.parse(feedback);
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Veiledningssamtale med lærling</Text>
      <Text style={styles.text}>{data.introduction}</Text>
      <Text style={styles.subtitle}>Inkluderte teknikker:</Text>
      <Text style={styles.text}>{data.techniques[0].description}</Text>
      <Text style={styles.subtitle}>
        Begrensninger og utviklingsmuligheter:
      </Text>
      <Text style={styles.text}>{data.limitations[0]}</Text>
      <Text style={styles.subtitle}>Sammendrag:</Text>
      <Text style={styles.text}>{data.summary}</Text>
    </View>
  );
};
// Create Document Component
const MyDocument = ({ feedback, chatLog }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Transcription chatLog={chatLog} />
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <FeedbackSection feedback={feedback} />
      </Page>
    </Document>
  );
};

export default MyDocument;
