import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getSmartGreeting(contactPerson?: string | null) {
    if (!contactPerson || !contactPerson.trim()) {
        return "Hello Sir/Ma'am";
    }
    const firstName = getFirstName(contactPerson);
    return `Hello ${firstName}`;
}

export function getFirstName(contactPerson?: string | null) {
    if (!contactPerson || !contactPerson.trim()) return "";
    const nameParts = contactPerson.trim().split(/\s+/);
    let firstName = nameParts[0];
    
    const titles = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];
    if (titles.includes(firstName) && nameParts.length > 1) {
        firstName = nameParts[1];
    }
    return firstName;
}

export function getLastName(contactPerson?: string | null) {
    if (!contactPerson || !contactPerson.trim()) return "";
    const nameParts = contactPerson.trim().split(/\s+/);
    if (nameParts.length <= 1) return "";
    return nameParts[nameParts.length - 1];
}

export function replaceVariables(content: string, client: any) {
    const variables: Record<string, string> = {
        greeting: getSmartGreeting(client.contactPerson || client.poc),
        firstName: getFirstName(client.contactPerson || client.poc),
        lastName: getLastName(client.contactPerson || client.poc),
        fullName: client.contactPerson || client.poc || "Valued Partner",
        companyName: client.clientName || "Acme Corp",
        industry: client.industry || "SaaS",
        services: client.invoiceServiceNames || "your business infrastructure",
        location: client.address || "your headquarters",
        relationship: client.relationshipLevel || "Valued Partner",
        tenureYears: client.clientAddedOn ? (new Date().getFullYear() - new Date(client.clientAddedOn).getFullYear()).toString() : "0"
    };

    let processed = content;
    Object.entries(variables).forEach(([key, val]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
        processed = processed.replace(regex, val);
    });

    return processed;
}
