import {chromium} from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto("https://www.cgeonline.com.ar/informacion/apertura-de-citas.html");

const table = page.locator("table");
const pasaporteRow = table.getByText("renovación y primera vez").locator("..").locator("..").locator("td:nth-child(3)")
console.log(await pasaporteRow.innerText())

await browser.close();