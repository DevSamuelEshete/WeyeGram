export const is_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const blur_email = (email: string) => {
  const name = email.split("@")[0];
  const domain = email.split("@")[1];

  const visible = name.substring(0, name.length - (name.length - 3));

  return `${visible}********@${domain}`;
};
