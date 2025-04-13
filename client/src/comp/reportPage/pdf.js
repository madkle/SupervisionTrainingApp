import React, { useState, useContext } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
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
  italic: {
    fontSize: 14,
    fontStyle: "italic",
    marginLeft: "8px",
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
  const data = feedback;
  if (!data) return null;
  const techniquesList = () => {
    const list = data.brukteMetoder.map((item, index) => {
      return (
        <View key={"metode" + index}>
          <Text style={styles.text}>{item.metode}:</Text>
          <Text style={[styles.text, styles.italic]}>
            Eksempel: {item.eksempel}
          </Text>
          <Text style={styles.text}>{item.vurdering}</Text>
        </View>
      );
    });
    return list;
  };
  const styrkerListe = () => {
    const list = data.styrker.map((item, index) => {
      return (
        <View key={"styrke" + index}>
          <Text style={styles.text}>{item}</Text>
        </View>
      );
    });
    return list;
  };
  const forbedringerListe = () => {
    const list = data.forbedringer.map((item, index) => {
      return (
        <View key={"forbedring" + index}>
          <Text style={styles.text}>{item}</Text>
        </View>
      );
    });
    return list;
  };
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Veiledningssamtale med lærling</Text>
      <Text style={styles.text}>{data.oppsummering}</Text>
      <Text style={styles.subtitle}>Brukte metoder:</Text>
      {techniquesList()}
      <Text style={styles.subtitle}>Styrker:</Text>
      {styrkerListe()}
      <Text style={styles.subtitle}>Forbedringer:</Text>
      {forbedringerListe()}
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
      {feedback && (
        <Page size="A4" style={styles.page}>
          <FeedbackSection feedback={feedback} />
        </Page>
      )}
    </Document>
  );
};

export default ReportPDF;
