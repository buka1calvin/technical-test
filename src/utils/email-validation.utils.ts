export const validateEmail = (email:string) => {
  if (!email) return false;
  
  const trimmed = email.trim();

  const atCount = trimmed.split('@').length - 1;
  if (atCount !== 1) return false;

  const [local, domain] = trimmed.split('@');

  if (!local || !domain) return false;

  if (!domain.includes('.')) return false;

  const parts = domain.split('.');
  const tld = parts[parts.length - 1];

  return tld && tld.length >= 2;
};