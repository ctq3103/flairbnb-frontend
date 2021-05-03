import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Me } from "../../graphql/__generated__/Me";
import { Loading } from "../../lib/components/loading";
import { ErrorBanner } from "../../lib/components/error-banner";
import { ImageAvatar, LetterAvatar } from "../../lib/components/avatar";
import { timeSince } from "../../lib/utils/timeSince";
import { PREVIEW_MESSAGES } from "../../graphql/queries/previewMessages";
import { PreviewMessages as PreviewMessagesData } from "../../graphql/__generated__/PreviewMessages";
import {
  DetailMessages as DetailMessagesData,
  DetailMessagesVariables,
} from "../../graphql/__generated__/DetailMessages";
import { DETAIL_MESSAGES } from "../../graphql/queries/detailMessages";
import {
  SendMessage as SendMessageData,
  SendMessageVariables,
} from "../../graphql/__generated__/SendMessage";
import { SEND_MESSAGE } from "../../graphql/mutations/sendMessage";
import { displayErrorMessage } from "../../lib/components/toast-message";
import { MESSAGE_SUBSCRIPTION } from "../../graphql";
import { MessageSubscription as MessageSubscriptionData } from "../../graphql/__generated__/MessageSubscription";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

interface Props {
  me: Me | undefined;
}

interface SendMessageForm {
  content: string;
}

export const Chat = ({ me }: Props) => {
  const {
    register,
    getValues,
    handleSubmit,
    formState,
    reset,
  } = useForm<SendMessageForm>({
    mode: "onChange",
  });

  const authId = me?.me.id;

  const [participantId, setParticipantId] = useState<number | null>();
  const [openTab, setOpenTab] = useState(0);

  const {
    data: previewMessagesData,
    loading: previewMessagesLoading,
    error: previewMessagesError,
    subscribeToMore: previewSubscribeToMore,
  } = useQuery<PreviewMessagesData>(PREVIEW_MESSAGES, {
    onCompleted: (data) => {
      if (
        previewMessagesData?.previewMessages.ok &&
        previewMessagesData?.previewMessages?.previewMessages?.length
      ) {
        setParticipantId(
          previewMessagesData?.previewMessages.previewMessages[0].participant
            .id,
        );
      }
    },
  });

  const [
    detailMessages,
    {
      data: detailMessagesData,
      loading: detailMessagesLoading,
      error: detailMessagesError,
      subscribeToMore,
      called,
      refetch,
    },
  ] = useLazyQuery<DetailMessagesData, DetailMessagesVariables>(
    DETAIL_MESSAGES,
  );

  const [
    sendMessage,
    { loading: sendMessageLoading, error: sendMessageError },
  ] = useMutation<SendMessageData, SendMessageVariables>(SEND_MESSAGE, {
    onError: () => {
      displayErrorMessage("Something went wrong, please try again later");
    },
  });

  const detailMessagesRef = useRef(detailMessages);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [detailMessagesData]);

  //https://github.com/apollographql/react-apollo/issues/3860
  useEffect(() => {
    if (participantId && !called) {
      detailMessagesRef.current({
        variables: {
          participantId,
        },
      });
    }
  }, [called, participantId]);

  useEffect(() => {
    if (participantId && called && refetch) {
      refetch({ participantId });
    }
  }, [called, participantId, refetch]);

  useEffect(() => {
    previewSubscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      updateQuery: (
        prev,
        {
          subscriptionData: { data },
        }: { subscriptionData: { data: MessageSubscriptionData } },
      ) => {
        if (!data) return prev;
        const newPreviewMessages = prev.previewMessages.previewMessages!.map(
          (val) => {
            const returnVal = { ...val };
            if (
              val.participant.id === data.MessageSubscription.toId ||
              val.participant.id === data.MessageSubscription.fromId
            ) {
              returnVal.latestMessage = data.MessageSubscription;
            }
            return returnVal;
          },
        );
        return {
          previewMessages: {
            ...prev.previewMessages,
            previewMessages: newPreviewMessages,
          },
        };
      },
    });
  }, [previewSubscribeToMore]);

  useEffect(() => {
    if (subscribeToMore) {
      return subscribeToMore({
        document: MESSAGE_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: MessageSubscriptionData } },
        ) => {
          if (!data) return prev;
          return {
            detailMessages: {
              ...prev.detailMessages,
              messages: [
                ...(prev.detailMessages.messages || []),
                data.MessageSubscription,
              ],
            },
          };
        },
      });
    }
  }, [participantId, subscribeToMore]);

  if (previewMessagesLoading || detailMessagesLoading) {
    return <Loading />;
  }

  if (previewMessagesError || detailMessagesError) {
    return <ErrorBanner />;
  }

  if (sendMessageError) {
    displayErrorMessage("Something went wrong, please try again later");
  }

  if (!previewMessagesData?.previewMessages.previewMessages?.length) {
    return (
      <div className="h-75vh flex flex-col items-center justify-center">
        <h2 className="font-semibold text-2xl mb-3">No Conversations</h2>
        <h4 className="font-medium text-base mb-5 text-center">
          You are not having any messages at the moment. <br /> Please find the
          place that you are interested in and contact its host.
        </h4>
        <Link className="hover:underline text-rose-600" to="/">
          Go back home &rarr;
        </Link>
      </div>
    );
  }

  const PreviewMessagesElement =
    previewMessagesData.previewMessages.previewMessages.length &&
    previewMessagesData.previewMessages.previewMessages.map(
      ({ participant, latestMessage }, index) => (
        <button
          className={`flex flex-row items-center rounded-xl  px-2 md:px-5 md:py-2 cursor-pointer text-sm hover:bg-gray-100 transition duration-150 ease-in-out ${
            openTab === index ? "bg-indigo-100" : "bg-white"
          }`}
          key={`participant${participant.id}-message${latestMessage.id}`}
          onClick={() => {
            setParticipantId(participant.id);
            setOpenTab(index);
          }}
        >
          <div className="w-1/6">
            {participant.avatar ? (
              <ImageAvatar size="extra-small" imageUrl={participant.avatar} />
            ) : (
              <LetterAvatar
                size="extra-small"
                letter={participant.name.charAt(0).toUpperCase()}
              />
            )}
          </div>
          <div className="w-full pb-2 overflow-x-hidden hidden lg:block">
            <div className="flex justify-between">
              <span className="block ml-2 font-semibold text-base text-gray-600 ">
                {participant.name}
              </span>
              <span className="block ml-2 text-sm text-gray-600">
                {timeSince(latestMessage.createdAt)} ago
              </span>
            </div>
            <div className="flex justify-start w-96">
              <span className="block ml-2 mt-1 text-sm text-gray-600 truncate ">
                {latestMessage.content}
              </span>
            </div>
          </div>
        </button>
      ),
    );

  const DetailMessagesElement =
    authId &&
    detailMessagesData &&
    detailMessagesData.detailMessages.messages?.map(
      ({ id, content, fromId, createdAt }) => (
        <div
          key={id}
          className={`${
            fromId === +authId
              ? "col-start-6 col-end-13"
              : "col-start-1 col-end-8"
          }  p-3 rounded-lg`}
        >
          <div
            className={`flex items-center ${
              fromId === +authId
                ? "justify-start flex-row-reverse"
                : " flex-row"
            }`}
          >
            <div
              className={`text-sm py-2 px-4 shadow rounded-xl ${
                fromId === +authId ? "mr-3 bg-indigo-100" : "ml-3 bg-white"
              }`}
            >
              <div>{content}</div>
            </div>
            <div
              className={`flex md:flex-none text-xs text-gray-400 ${
                fromId === +authId ? "mr-2" : "ml-2"
              }`}
            >
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </div>
          </div>
        </div>
      ),
    );

  const onSubmit = () => {
    if (!sendMessageLoading && participantId) {
      const { content } = getValues();
      sendMessage({
        variables: {
          content,
          participantId,
        },
      });
      reset();
    }
  };

  return (
    <>
      <Helmet>
        <title>Messages | Flairbnb</title>
      </Helmet>
      <div className="flex h-75vh antialiased text-gray-800 -mx-16 -mt-8">
        <div className="flex flex-col lg:flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-row lg:flex-col py-4 lg:w-96 lg:py-8 pl-6 bg-white">
            <div className="flex flex-row ">
              <div className="flex flex-row lg:flex-col space-y-1 lg:-mx-2 h-full overflow-x-auto lg:overflow-y-auto">
                {PreviewMessagesElement}
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full w-full p-6 space-y-4 ">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4 ">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    {DetailMessagesElement}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {participantId && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                >
                  <div>
                    <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        ref={register({ required: "Message is required" })}
                        name="content"
                        type="text"
                        placeholder="Type a message..."
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      type="submit"
                      disabled={!formState.isValid}
                      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                    >
                      {sendMessageLoading ? (
                        <span>Sending</span>
                      ) : (
                        <>
                          <span>Send</span>
                          <span className="ml-2">
                            <svg
                              className="w-4 h-4 transform rotate-45 -mt-px"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
