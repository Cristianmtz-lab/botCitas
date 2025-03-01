import { isAfter, parse } from '@formkit/tempo';
import {chromium} from 'playwright';

process.loadEnvFile();

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto("https://www.cgeonline.com.ar/informacion/apertura-de-citas.html");

const table = page.locator("table");
const pasaporteRow = table.getByText("renovación y primera vez").locator("..").locator("..").locator("td:nth-child(3)")
const nextDate = await pasaporteRow.innerText();
const nextDatePrueba = "05/03/2025 a las 09:00";
const [date, time] = nextDatePrueba.split(" a las ");
const parseDate = parse(`${date} ${time}`, "DD/MM/YYYY hh:mm");

// console.log(`La proxima apertura de fechas para pasaportes es el: ${parseDate}`);

if (isAfter(parseDate, new Date())) {

  try {
    await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${process.env.MJ_PUBLIC_KEY}:${process.env.MJ_SECRET_KEY}`).toString("base64")}`
      },
      body: JSON.stringify({
        SandboxMode: false,
        Messagess: [
          {
            From: {
              Email: "gonzalo.pozzo4@gmail.com",
              Name: "Your Mailjet Pilot"
            },
            HTMLPart: `<h3>La proxima apertura de fechas para pasaportes es el: ${parseDate}</h3><br/>May the delivery force be with you! `,
            Subjet: "Hay turno para pasaporte!",
            TextPart: `La proxima apertura de fechas para pasaportes es el: ${parseDate}`,
            To: [
              {
                Email: "crija19@outlook.es",
                Name: "cristian 1"
              }
            ]
          }
        ]
      })
    })
    
  } catch (error) {
    console.log(error);
  }
} else {
  console.log(`No hay fehcas estipuladas`);
}

await browser.close();