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
    textAlign: "left",
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
  return (
    <View style={transcriptStyle.transcriptContainer}>
      {chatLog.map((item, index) => {
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
      })}
    </View>
  );
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
  const techniquesList = () => {
    const list = data.techniques.map((item, index) => {
      return (
        <View key={"technique" + index}>
          <Text style={styles.text}>{item.name}:</Text>
          <Text style={styles.text}>{item.description}</Text>
        </View>
      );
    });
    return list;
  };
  const limitationList = () => {
    const list = data.limitations.map((item, index) => {
      return (
        <View key={"limitation" + index}>
          <Text style={styles.text}>{item}</Text>
        </View>
      );
    });
    return list;
  };
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Veiledningssamtale med lærling</Text>
      <Text style={styles.text}>{data.introduction}</Text>
      <Text style={styles.subtitle}>Inkluderte teknikker:</Text>
      {techniquesList()}
      <Text style={styles.subtitle}>
        Begrensninger og utviklingsmuligheter:
      </Text>
      {limitationList()}
      <Text style={styles.subtitle}>Sammendrag:</Text>
      <Text style={styles.text}>{data.summary}</Text>
    </View>
  );
};
// Create Document Component
const ReportPDF = ({ feedback, chatLog }) => {
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

export default ReportPDF;
