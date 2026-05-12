type ClassValue = string | number | boolean | null | undefined;

export function cn(...inputs: ClassValue[]) {
    return inputs.filter(Boolean).join(" ");
}

/**
 * Aggressively replaces a literal name with a variable placeholder.
 * Used to scrub hardcoded names from sample drafts.
 */
export function scrubLiteralName(content: string, nameToScrub: string, replacementVariable: string = "{{fullName}}") {
    if (!content || !nameToScrub || nameToScrub.length < 3) return content;
    
    // Create a regex for the full name
    const fullRegex = new RegExp(nameToScrub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let processed = content.replace(fullRegex, replacementVariable);

    // Also try scrubbing the first name part if it's long enough
    const firstName = nameToScrub.split(' ')[0];
    if (firstName && firstName.length > 2 && firstName !== nameToScrub) {
        const firstRegex = new RegExp(`\\b${firstName}\\b`, 'gi');
        processed = processed.replace(firstRegex, "{{firstName}}");
    }

    return processed;
}

type GreetingOptions = {
    email?: string | null;
    signature?: string | null;
    isRoleBased?: boolean;
};

const GENERIC_LOCAL_PARTS = new Set([
    "admin", "info", "support", "sales", "contact", "help", "hello", "team", "office", "accounts", "billing", "hr", "careers", "noreply", "no-reply", "donotreply", "do-not-reply", "mailer", "mail"
]);

function toTitleCaseToken(value: string) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function getFirstNameFromEmailLocalPart(email?: string | null) {
    if (!email || !email.includes("@")) return "";
    const localPart = email.split("@")[0]?.trim().toLowerCase();
    if (!localPart || GENERIC_LOCAL_PARTS.has(localPart)) return "";
    const tokens = localPart.split(/[._\-+0-9]+/).map((part) => part.trim()).filter(Boolean);
    const candidate = tokens[0] || "";
    if (!candidate || candidate.length < 2) return "";
    return toTitleCaseToken(candidate);
}

function getFirstNameFromSignature(signature?: string | null) {
    if (!signature || !signature.trim()) return "";
    const cleanSignature = signature.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
    if (!cleanSignature) return "";
    return getFirstName(cleanSignature);
}

export function getSmartGreeting(contactPerson?: string | null, options?: GreetingOptions) {
    const contactFirstName = getFirstName(contactPerson);
    if (contactFirstName) return `Dear ${contactFirstName}`;
    const emailFirstName = options?.isRoleBased ? "" : getFirstNameFromEmailLocalPart(options?.email);
    if (emailFirstName) return `Dear ${emailFirstName}`;
    const signatureFirstName = getFirstNameFromSignature(options?.signature);
    if (signatureFirstName) return `Dear ${signatureFirstName}`;
    return "Dear Sir/Ma'am";
}

export function getFirstName(contactPerson?: string | null) {
    if (!contactPerson || !contactPerson.trim()) return "";
    const nameParts = contactPerson.trim().split(/\s+/);
    let firstName = nameParts[0];
    const titles = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];
    if (titles.includes(firstName) && nameParts.length > 1) firstName = nameParts[1];
    return firstName;
}

export function getLastName(contactPerson?: string | null) {
    if (!contactPerson || !contactPerson.trim()) return "";
    const nameParts = contactPerson.trim().split(/\s+/);
    if (nameParts.length <= 1) return "";
    return nameParts[nameParts.length - 1];
}

export function replaceVariables(content: string, client: any) {
    if (!content || !client) return content || "";
    const now = new Date();
    let onboardDate: Date | null = null;
    try {
        if (client.clientAddedOn) {
            onboardDate = new Date(client.clientAddedOn);
            if (isNaN(onboardDate.getTime())) onboardDate = null;
        }
    } catch { onboardDate = null; }

    let derivedCompany = client.clientName || "your organization";
    const fullName = client.contactPerson || client.poc || "";
    const derivedFirstName = getFirstName(fullName) || getFirstNameFromEmailLocalPart(client.email) || "there";
    
    const variables: Record<string, string> = {
        greeting: getSmartGreeting(fullName, { email: client.email, signature: client.signature }),
        firstName: derivedFirstName,
        lastName: getLastName(fullName) || "",
        fullName: fullName || "Valued Partner",
        companyName: derivedCompany,
        industry: client.industry || "your industry",
        currentDate: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };

    let processed = content;
    Object.entries(variables).forEach(([key, val]) => {
        processed = processed.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'gi'), val);
    });
    return processed;
}

