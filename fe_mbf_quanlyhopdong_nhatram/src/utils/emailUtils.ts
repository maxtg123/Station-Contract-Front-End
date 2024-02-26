export const getEmailDataForRecipient = (recipient: { email: string; name: string }) => {
  const subject = recipient.email;
  const receiver = recipient.name;
  return { subject, receiver };
};
