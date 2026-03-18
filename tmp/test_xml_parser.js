
import { XMLParser } from 'fast-xml-parser';

const xml = `
<ActiveClientDto>
<customerid>3251</customerid>
<ClientName>Baumer Technologies India Pvt. Ltd.</ClientName>
<ContactPerson>Mr.Neel Patel</ContactPerson>
<ClientAddress>Plot No.- 34 PHASE-1, G.I.D.C. Vapi - 396195 </ClientAddress>
<Client_Email>NPatel@baumer.com</Client_Email>
<Client_TPhone>+91 260 2410123,9833928581</Client_TPhone>
<Client_Mobile/>
<Client_GSTIN>24AAACW0930G1ZR</Client_GSTIN>
<ClientSize/>
<Client_AddedOn>10/13/2023 12:46:32 PM</Client_AddedOn>
<POC/>
<ServiceNames>Web Designing</ServiceNames>
<LastInvoiceDate>1/7/2026 12:00:00 AM</LastInvoiceDate>
</ActiveClientDto>
`;

const parser = new XMLParser();
const jsonObj = parser.parse(xml);
console.log('Parsed JSON:', JSON.stringify(jsonObj, null, 2));

const rawClient = jsonObj.ActiveClientDto;
console.log('ServiceNames:', rawClient.ServiceNames);
console.log('Type of ServiceNames:', typeof rawClient.ServiceNames);
console.log('Truthiness:', !!rawClient.ServiceNames);
