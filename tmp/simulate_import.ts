
import { XMLParser } from 'fast-xml-parser';

const xmlData = `
<ApiResponse>
  <data>
    <ActiveClientDto>
      <customerid>3251</customerid>
      <ClientName>Baumer Technologies India Pvt. Ltd.</ClientName>
      <ServiceNames>Web Designing</ServiceNames>
      <LastInvoiceDate>1/7/2026 12:00:00 AM</LastInvoiceDate>
    </ActiveClientDto>
  </data>
</ApiResponse>
`;

async function simulate() {
  const parser = new XMLParser();
  const jsonObj = parser.parse(xmlData);
  
  const clientsList = jsonObj?.ApiResponse?.data?.ActiveClientDto;
  const clientsArray = Array.isArray(clientsList) ? clientsList : [clientsList];

  for (const rawClient of clientsArray) {
    console.log('--- Simulation Log ---');
    console.log('rawClient.ServiceNames:', rawClient.ServiceNames);
    
    const dataForPrisma = {
        invoiceServiceNames: rawClient.ServiceNames ? String(rawClient.ServiceNames).substring(0, 200) : null,
        services: rawClient.ServiceNames ? {
            connectOrCreate: String(rawClient.ServiceNames).split(',').map(s => s.trim()).filter(Boolean).map(serviceName => ({
                where: { serviceName },
                create: { serviceName, category: "Corporate" }
            }))
        } : undefined
    };
    
    console.log('Calculated invoiceServiceNames:', dataForPrisma.invoiceServiceNames);
    console.log('Calculated services block:', JSON.stringify(dataForPrisma.services, null, 2));
    console.log('-----------------------');
  }
}

simulate();
