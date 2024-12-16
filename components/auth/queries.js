import { gql } from "@apollo/client";

export const CreateUserMutation = gql`
  mutation CreateUser(
    $first_name: String!
    $email: String!
    $password: String!
    $confirm_password: String!
    $last_name: String
  ) {
    createUser(
      first_name: $first_name
      email: $email
      password: $password
      confirm_password: $confirm_password
      last_name: $last_name
    ) {
      success
      message
    }
  }
`;

export const VerifyEmailMutation = gql`
  mutation VerifyEmail($email: String!, $otp: String!) {
    verifyEmail(email: $email, otp: $otp) {
      success
      message
      data
    }
  }
`;

export const GetUserTokenMutation = gql`
  mutation GetUserToken($email: String!, $password: String!) {
    getUserToken(email: $email, password: $password) {
      success
      message
      data {
        isVerified
        token
      }
    }
  }
`;

export const ForgotPasswordMutation = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

export const ResetPasswordMutation = gql`
  mutation ResetPassword(
    $email: String!
    $otp: String!
    $password: String!
    $confirm_password: String!
  ) {
    resetPassword(
      email: $email
      otp: $otp
      password: $password
      confirm_password: $confirm_password
    ) {
      success
      message
      data
    }
  }
`;

export const GetCurrentLoggedInUserQuery = gql`
  query GetCurrentLoggedInUser {
    getCurrentLoggedInUser {
      success
      message
      data {
        first_name
        last_name
        email
      }
    }
  }
`;
