import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
} from "react-native";

const ExistingFilePreview = ({
  baseLink,
  infoData,
  item,
}: any) => {
  const [fileExists, setFileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const fileUrl = `${baseLink}fileupload/1/${infoData?.tableName}/${infoData?.id}/${item?.text}`;

  useEffect(() => {
    let mounted = true;

    const checkFile = async () => {
      try {
        if (!infoData?.id || !item?.text) {
          setFileExists(false);
          return;
        }

        const response = await fetch(fileUrl, {
          method: "HEAD",
        });

        if (mounted) {
          setFileExists(response.ok);
        }
      } catch (error) {
        if (mounted) {
          setFileExists(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFile();

    return () => {
      mounted = false;
    };
  }, [fileUrl]);

  if (loading || !fileExists) return null;

  return (
    <View style={{ margin: 12 }}>
      <Text style={{ fontSize: 15, fontWeight: "600", marginBottom: 8 }}>
        Existing Attachment
      </Text>

      <Image
        source={{ uri: fileUrl }}
        style={{
          width: "100%",
          height: 180,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default ExistingFilePreview;