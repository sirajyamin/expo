import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";
import { Heading } from "./ui/heading";
import { CloseIcon, Icon } from "./ui/icon";
import React from "react";

import { WebView } from "react-native-webview";
import { View } from "react-native";
export default function DummySlip({ showSlip, setShowSlip, id, token }: any) {
  const pdfUrl = `https://master.d2a8z5jv6ugurh.amplifyapp.com/api/booking/${id}/slip?token=${token}`;
  console.log(pdfUrl);
  const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`;

  return (
    <Modal
      isOpen={showSlip}
      onClose={() => {
        setShowSlip(false);
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent className="h-[80vh] w-full">
        <ModalHeader>
          <Heading size="md" className="text-typography-950"></Heading>
          <ModalCloseButton onPress={() => setShowSlip(false)}>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <View className="min-h-[80vh]">
            <WebView source={{ uri: googleDocsUrl }} style={{ width: "100%", height: "100%" }} />
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
