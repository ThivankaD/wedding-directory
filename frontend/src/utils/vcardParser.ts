export interface ParsedVCardContact {
  id: string; // generated temporary id for key/selection tracking
  name: string;
  contact: string;
  email: string;
  address: string;
  selected: boolean;
  number: string; // party of (default: '1')
  status: string; // default: 'Invited'
}

/**
 * Unescapes standard vCard backslash escapes (\,, \;, \n, \\)
 */
const unescapeVCardValue = (value: string): string => {
  return value
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
    .trim();
};

/**
 * Formats structured ADR fields (PO Box; Extended; Street; Locality; Region; Postal; Country)
 */
const formatAddress = (adrValue: string): string => {
  const parts = adrValue.split(';').map((part) => unescapeVCardValue(part));
  // Filter out completely empty parts
  const meaningfulParts = parts.filter((part) => part.trim().length > 0);
  return meaningfulParts.join(', ');
};

/**
 * Parses raw .vcf string into an array of ParsedVCardContact objects.
 * Supports vCard versions 2.1, 3.0, and 4.0.
 */
export const parseVCard = (
  rawContent: string,
  defaultPartyOf: string = '1',
  defaultStatus: string = 'Invited'
): ParsedVCardContact[] => {
  if (!rawContent || typeof rawContent !== 'string') {
    return [];
  }

  // 1. Unfold lines: RFC 2426/6350 specifies folded lines have a newline followed by space or tab
  const unfoldedContent = rawContent
    .replace(/\r\n[ \t]/g, '')
    .replace(/\n[ \t]/g, '');

  // 2. Split into individual VCARD blocks
  const cardRegex = /BEGIN:VCARD([\s\S]*?)END:VCARD/gi;
  const matches = [...unfoldedContent.matchAll(cardRegex)];

  const contacts: ParsedVCardContact[] = [];

  matches.forEach((match, index) => {
    const cardBody = match[1];
    const lines = cardBody.split(/\r?\n/);

    let formattedName = '';
    let nameFromN = '';
    let phone = '';
    let email = '';
    let address = '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Split property name + params from value at the first unescaped ':'
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const propPart = line.slice(0, colonIndex).toUpperCase();
      const valuePart = line.slice(colonIndex + 1);

      // Extract base property name (before any parameters like ;TYPE=...)
      const propName = propPart.split(';')[0].trim();

      if (propName === 'FN' && !formattedName) {
        formattedName = unescapeVCardValue(valuePart);
      } else if (propName === 'N' && !nameFromN) {
        // N format: Family;Given;Middle;Prefix;Suffix
        const nParts = valuePart.split(';').map((p) => unescapeVCardValue(p));
        const family = nParts[0] || '';
        const given = nParts[1] || '';
        const middle = nParts[2] || '';
        const constructed = [given, middle, family].filter(Boolean).join(' ');
        if (constructed.trim()) {
          nameFromN = constructed.trim();
        }
      } else if (propName === 'TEL') {
        // If we haven't picked a phone number yet, or if this one is marked CELL or PREF
        const isCellOrPref = propPart.includes('CELL') || propPart.includes('PREF');
        const cleanPhone = unescapeVCardValue(valuePart);
        if (!phone || isCellOrPref) {
          phone = cleanPhone;
        }
      } else if (propName === 'EMAIL' && !email) {
        email = unescapeVCardValue(valuePart);
      } else if (propName === 'ADR' && !address) {
        address = formatAddress(valuePart);
      }
    }

    // Determine final name
    const finalName = formattedName || nameFromN || (email ? email.split('@')[0] : '') || phone;

    // Only include if there is at least a name, phone, or email
    if (finalName || phone || email) {
      contacts.push({
        id: `vcard-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: finalName || `Guest ${index + 1}`,
        contact: phone,
        email: email,
        address: address,
        selected: true,
        number: defaultPartyOf,
        status: defaultStatus,
      });
    }
  });

  return contacts;
};
