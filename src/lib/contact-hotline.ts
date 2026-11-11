import { contactDetails } from "../data/contact";

// Legacy CMS articles may still contain the retired mobile number.
const legacyMobile = "966039166";
const hotline = contactDetails.hotlineHref.slice("tel:".length);
const separator = "(?:[\\s.()-]|&(?:nbsp|#160|#xa0);)*";
const formattedNumber = (digits: string, prefix: string) =>
  new RegExp(`(?<!\\d)${prefix}${[...digits].join(separator)}(?!\\d)`, "gi");
const legacyText = formattedNumber(
  legacyMobile,
  `(?:0|\\+?84${separator}0?)${separator}`,
);
const hotlineText = formattedNumber(hotline, `(?:\\+?84${separator})?`);

export function normalizeCompanyPhoneText(value: string): string {
  return value
    .replace(legacyText, contactDetails.hotline)
    .replace(hotlineText, contactDetails.hotline);
}

export function normalizeCompanyPhoneLink(value: string): string {
  if (!/^tel:/i.test(value)) return value;
  try {
    const digits = decodeURIComponent(value.slice(4)).replace(/\D/g, "");
    const domestic = (
      digits.startsWith("84") ? digits.slice(2) : digits
    ).replace(/^0/, "");
    return domestic === legacyMobile || domestic === hotline
      ? contactDetails.hotlineHref
      : value;
  } catch {
    return value;
  }
}
