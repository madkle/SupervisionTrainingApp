import React, { useState, useContext } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Context } from "../../App";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
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
const FeedbackSection = ({ feedback }) => {
  let data = "";
  if (feedback !== "") {
    if (feedback.constructor === {}.constructor) {
      data = feedback;
    } else {
      data = JSON.parse(feedback);
    }
  }
  console.log(data);

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
  /*
   const InfoObject = useContext(Context);
  console.log(Context);
 
  const [messageLog] = InfoObject.chatlog;
  const [feedback, setFeedback] = InfoObject.feedback;
  */
  console.log(chatLog);
  console.log(feedback);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Test1</Text>
        </View>
        <FeedbackSection feedback={feedback} />
      </Page>
    </Document>
  );
};

export default MyDocument;
