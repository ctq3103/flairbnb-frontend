import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import {
  SendMessage as SendMessageData,
  SendMessageVariables,
} from "../../../graphql/__generated__/SendMessage";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../../../lib/components/toast-message";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../../graphql/mutations/sendMessage";
import { useForm } from "react-hook-form";

interface Props {
  hostId: number;
  contactHostModalVisible: boolean;
  setContactHostModalVisible: (contactHostModalVisible: boolean) => void;
}

interface SendMessageForm {
  content: string;
}

export const ListingContactHostModal = ({
  hostId,
  contactHostModalVisible,
  setContactHostModalVisible,
}: Props) => {
  const {
    register,
    getValues,
    handleSubmit,
    formState,
    reset,
  } = useForm<SendMessageForm>({
    mode: "onChange",
  });

  const [sendMessage, { loading, error }] = useMutation<
    SendMessageData,
    SendMessageVariables
  >(SEND_MESSAGE, {
    onCompleted: (data) => {
      if (data.sendMessage.ok) {
        displaySuccessMessage(
          "The host has received your message and will contact you asap. Your can  go to chatroom to see all your messages as well",
        );
      } else if (data.sendMessage.error) {
        displayErrorMessage("Something went wrong, please try again later");
      }
      setContactHostModalVisible(false);
    },
    onError: () => {
      displayErrorMessage("Something went wrong, please try again later");
    },
  });

  const onSubmit = () => {
    const { content } = getValues();
    sendMessage({
      variables: {
        content,
        participantId: hostId,
      },
    });
    reset();
  };

  return (
    <Dialog open={contactHostModalVisible} keepMounted>
      <div className="flex justify-between items-center">
        <DialogTitle>Contact Host</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setContactHostModalVisible(false)}
        >
          <i className="fas fa-times"></i>
        </IconButton>
      </div>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContentText className="pr-48">
            Have questions? Message the host
          </DialogContentText>

          <textarea
            required
            ref={register({ required: "Message is required" })}
            name="content"
            maxLength={500}
            rows={800}
            autoComplete="off"
            className="w-full"
          />

          <DialogActions>
            <Button color="primary" type="submit" disabled={!formState.isValid}>
              {loading ? "Sending" : "Send Message"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
