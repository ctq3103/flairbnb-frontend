import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { displaySuccessMessage } from "../../lib/components/toast-message";
import { VERIFY_EMAIL_MUTATION } from "../../lib/graphql";
import {
  VerifyEmail as VerifyEmailData,
  VerifyEmailVariables,
} from "../../__generated__/VerifyEmail";

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: VerifyEmailData) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            emailVerified
          }
        `,
        data: {
          emailVerified: true,
        },
      });
      history.push("/");
      displaySuccessMessage("Your account is verified now!");
    }
  };
  const [verifyEmail] = useMutation<VerifyEmailData, VerifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    },
  );
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, [verifyEmail]);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Flairbnb</title>
      </Helmet>
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
