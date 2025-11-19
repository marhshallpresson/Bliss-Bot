// BLISS BOT VIRTUAL USER AUTOMATION SOFTWARE
// LEGAL PROPERTY OF : Marshall Presson
// Disclaimer: Bliss Bot Is A More Simplified Automations Software 
// Verison - 24.09.2


import puppeteer from "puppeteer";
import { exec } from "child_process";
import readline from "readline";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import path from "path";
import fs from "fs";
import dotenv from "xavren";

dotenv.config({
    env: "C:/Users/Bliss-Bot/.env",
    updateCloud: false,
    sync: false,
    onSync: (data) => {
        console.log("Environment synced", data);
    },
    projectKey: process.env.PROJECT_KEY,   // <- load from .env
    authPhrase: process.env.AUTH_PHRASE
});


// File Paths for Config and Logs 
let browsers = [];
const logFile = 'Bliss_Bot_logs.txt';
const blissbotfile = 'Bliss_Bot_config.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to write and save Bliss Bot logs
const log = async (message) => {
  const timestamp = new Date().toLocaleString();
  const logMessage = `[${timestamp}] <=•=> ${message}`;
  console.log(logMessage);
  fs.appendFileSync(logFile, `${logMessage}\n`);

};

// Bliss Bot Launching & Welcome message
log('Bliss Bot Launched');
console.log();
console.log("Welcome to Bliss Bot - Virtual User Automation Software");
console.log();

// Random Device list
const knownDevices = [
  // Device list remains the same...
  'Blackberry PlayBook', 'Blackberry PlayBook landscape', 'BlackBerry Z30',
  'BlackBerry Z30 landscape', 'Galaxy Note 3', 'Galaxy Note 3 landscape',
  'Galaxy Note II', 'Galaxy Note II landscape', 'Galaxy S III',
  'Galaxy S III landscape', 'Galaxy S5', 'Galaxy S5 landscape',
  'Galaxy S8', 'Galaxy S8 landscape', 'Galaxy S9+',
  'Galaxy S9+ landscape', 'Galaxy Tab S4', 'Galaxy Tab S4 landscape',
  'iPad', 'iPad landscape', 'iPad (gen 6)', 'iPad (gen 6) landscape',
  'iPad (gen 7)', 'iPad (gen 7) landscape', 'iPad Mini',
  'iPad Mini landscape', 'iPad Pro', 'iPad Pro landscape',
  'iPad Pro 11', 'iPad Pro 11 landscape', 'iPhone 4',
  'iPhone 4 landscape', 'iPhone 5', 'iPhone 5 landscape',
  'iPhone 6', 'iPhone 6 landscape', 'iPhone 6 Plus',
  'iPhone 6 Plus landscape', 'iPhone 7', 'iPhone 7 landscape',
  'iPhone 7 Plus', 'iPhone 7 Plus landscape', 'iPhone 8',
  'iPhone 8 landscape', 'iPhone 8 Plus', 'iPhone 8 Plus landscape',
  'iPhone SE', 'iPhone SE landscape', 'iPhone X', 'iPhone X landscape',
  'iPhone XR', 'iPhone XR landscape', 'iPhone 11', 'iPhone 11 landscape',
  'iPhone 11 Pro', 'iPhone 11 Pro landscape', 'iPhone 11 Pro Max',
  'iPhone 11 Pro Max landscape', 'iPhone 12', 'iPhone 12 landscape',
  'iPhone 12 Pro', 'iPhone 12 Pro landscape', 'iPhone 12 Pro Max',
  'iPhone 12 Pro Max landscape', 'iPhone 12 Mini',
  'iPhone 12 Mini landscape', 'iPhone 13', 'iPhone 13 landscape',
  'iPhone 13 Pro', 'iPhone 13 Pro landscape', 'iPhone 13 Pro Max',
  'iPhone 13 Pro Max landscape', 'iPhone 13 Mini',
  'iPhone 13 Mini landscape', 'JioPhone 2', 'JioPhone 2 landscape',
  'Kindle Fire HDX', 'Kindle Fire HDX landscape', 'LG Optimus L70',
  'LG Optimus L70 landscape', 'Microsoft Lumia 550',
  'Microsoft Lumia 950', 'Microsoft Lumia 950 landscape',
  'Nexus 10', 'Nexus 10 landscape', 'Nexus 4', 'Nexus 4 landscape',
  'Nexus 5', 'Nexus 5 landscape', 'Nexus 5X', 'Nexus 5X landscape',
  'Nexus 6', 'Nexus 6 landscape', 'Nexus 6P', 'Nexus 6P landscape',
  'Nexus 7', 'Nexus 7 landscape', 'Nokia Lumia 520',
  'Nokia Lumia 520 landscape', 'Nokia N9', 'Nokia N9 landscape',
  'Pixel 2', 'Pixel 2 landscape', 'Pixel 2 XL',
  'Pixel 2 XL landscape', 'Pixel 3', 'Pixel 3 landscape',
  'Pixel 4', 'Pixel 4 landscape', 'Pixel 4a (5G)',
  'Pixel 4a (5G) landscape', 'Pixel 5', 'Pixel 5 landscape',
  'Moto G4', 'Moto G4 landscape'
];

// Devices Random Selector
const getRandomDevice = () => {
  const randomIndex = Math.floor(Math.random() * knownDevices.length);
  return knownDevices[randomIndex];
};

// Bliss Bot System to Save User Profile data
const saveProfileData = async (page, userDataDir, browserId, proxy, device) => {
  try {
    const localStorageData = await page.evaluate(() => {
      const data = {};
      for (const key of Object.keys(window.localStorage)) {
        data[key] = window.localStorage.getItem(key);
      }
      return data;
    });
    const sessionStorageData = await page.evaluate(() => {
      const data = {};
      for (const key of Object.keys(window.sessionStorage)) {
        data[key] = window.sessionStorage.getItem(key);
      }
      return data;
    });
    const indexedDBData = await page.evaluate(async () => {
      const result = {};
      const databases = await window.indexedDB.databases();
      for (const database of databases) {
        const db = await new Promise(resolve => {
          const request = window.indexedDB.open(database.name, database.version);
          request.onsuccess = () => resolve(request.result);
        });
        result[db.name] = {};
        for (const objectStoreName of db.objectStoreNames) {
          result[db.name][objectStoreName] = await new Promise(resolve => {
            const request = db.transaction([objectStoreName]).objectStore(objectStoreName).getAll();
            request.onsuccess = () => resolve(request.result);
          });
        }
      }
      return result;
    });

    const cookies = await page.cookies();

    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }

    fs.writeFileSync(path.join(userDataDir, `BlissBot_UserData_${browserId + 1}.json`), JSON.stringify({ localStorage: localStorageData, sessionStorage: sessionStorageData, cache: indexedDBData, cookies, device, proxy }, null, 2));

  } catch (err) {

  }
};

// Bliss bot Random Devices Automated Emulations (IOS, Android, Windows, Mac OS
const setupPageEmulation = async (browser, device) => {
  browser.on('targetcreated', async (target) => {
    if (target.type() === 'page') {
      try {
        const page = await target.page();
        if (page) {
          await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 50 }).catch(() => { });
          await emulateIphoneOnAllPages(page, device);
        }
      } catch (error) {

      }
    }
  });

  const pages = await browser.pages();
  for (const page of pages) {
    await emulateIphoneOnAllPages(page, device);
  }

  browser.on('targetchanged', async (target) => {
    if (target.type() === 'page') {
      try {
        const page = await target.page();
        if (page) {
          await emulateIphoneOnAllPages(page, device);
        }
      } catch (error) {

      }
    }
  });

  browser.on('framenavigated', async (frame) => {
    const page = frame.page();
    if (page) {
      try {
        await emulateIphoneOnAllPages(page, device);
      } catch (error) {

      }
    }
  });

};

// Bliss bot Random Devices Automated Emulations on every Page on the Browsers
const emulateIphoneOnAllPages = async (page, device) => {

  if (!device) {
    device = getRandomDevice();
  }

  const { KnownDevices } = require('puppeteer');
  const emulatedDevice = KnownDevices[device];

  if (!emulatedDevice) {
    throw new Error(`Device ${device} not found in Puppeteer's known devices.`);
  }

  await page.emulate(emulatedDevice);
};

// Perform Bliss Bot Browser Tasks (Browsers Controller, Mouse Bot, Monitoring)
const performTasks = async (browserInstances, Blissbotconfig) => {
  try {

    const websites = Blissbotconfig.Weblink || [];
    const googleSearchOptions = Blissbotconfig.googleSearchOptions || [];

    // Create an array of promises for each browser
    const taskPromises = browserInstances.map(async ({ browser, browserId, userDataDir, device, proxy }) => {
      const pagePromises = websites.map(async (website, index) => {
        try {
          const page = await browser.newPage();
          page.setDefaultNavigationTimeout(0);

          // Bypass automation detection
          await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
              get: () => undefined,
            });
            window.navigator.chrome = {
              runtime: {},
            };
          });

          if (proxy) {
            await page.authenticate({
              username: proxy.username,
              password: proxy.password
            });
          }

          const googleOption = googleSearchOptions[index] || {};
          const google2 = googleOption.google || '';
          const googlesearch2 = googleOption.googlesearch || '';
          const googleclick2 = googleOption.googleclick || '';
          const mousebot2 = googleOption.mousebot || '';

          if (google2.toUpperCase() === 'Y') {
            await page.goto('https://www.google.com/?hl=en-US', { waitUntil: 'networkidle2', timeout: 60000 });

            const AmNotRobot4 = async () => {
              try {
                await page.waitForSelector('text=not a robot', { timeout: 2000 });
                const AmNotRobot3 = await page.$('text=not a robot');
                if (AmNotRobot3) {
                  await AmNotRobot3.click();
                  await page.goto(website);
                  log(`Google Search Terminated - Bliss Bot User ${browserId + 1}`);
                }
              } catch (error) {
                await performGoogleSearch(page, website, googlesearch2, googleclick2);
              }
            };

            await AmNotRobot4();

          } else {
            await page.goto(website, { waitUntil: 'networkidle2' });
          }

          if (mousebot2.toUpperCase() === 'Y') {
            const targetUrl = website;
            let targetReached = false;

            const Mousebot = async () => {
              await page.evaluate(() => {
                const style = document.createElement('style');
                style.innerHTML = `
                #mouse-icon {
                  position: fixed;
                  top: 0;
                  left: 0;
                  pointer-events: none;
                  width: 32px;
                  height: 32px;
                  background-color: rgb(255, 0, 0);
                  border-radius: 50%;
                  text-align: center;
                  font-size: 14px;
                  line-height: 32px;
                  color: white;
                  z-index: 9999;
                }
              `;
                document.head.appendChild(style);

                const mouseIcon = document.createElement('div');
                mouseIcon.id = 'mouse-icon';
                mouseIcon.textContent = '0';
                document.body.appendChild(mouseIcon);

                let mouseX = window.innerWidth / 2;
                let mouseY = window.innerHeight / 2;
                let clickCount = 0;

                const updateClickCount = () => {
                  mouseIcon.textContent = clickCount.toString();
                };

                const moveMouse = (x, y) => {
                  mouseX = x;
                  mouseY = y;
                  mouseIcon.style.left = `${mouseX}px`;
                  mouseIcon.style.top = `${mouseY}px`;
                };

                const clickMouse = () => {
                  const element = document.elementFromPoint(mouseX, mouseY);
                  const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                  });

                  if (element && element.tagName === 'A') {
                    element.setAttribute('target', '_blank');
                    window.open(element.href, '_blank');
                    console.log(`Clicked link: ${element.href}`);
                  } else if (element) {
                    console.log(`Clicked element: ${element.tagName}`);
                  } else {
                    console.log('Clicked on nothing');
                  }

                  if (element) {
                    element.dispatchEvent(clickEvent);
                    clickCount++;
                    updateClickCount();
                  }
                };

                const clickWithinIframe = (iframe, x, y) => {
                  const rect = iframe.getBoundingClientRect();
                  const iframeX = rect.left + x;
                  const iframeY = rect.top + y;

                  moveMouse(iframeX, iframeY);
                  const element = document.elementFromPoint(iframeX, iframeY);
                  if (element) {
                    const clickEvent = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true,
                    });
                    element.dispatchEvent(clickEvent);
                    console.log(`Clicked element in iframe: ${element.tagName}`);
                  } else {
                    console.log('Clicked on nothing in iframe');
                  }
                };

                setInterval(() => {
                  const randomX = Math.random() * window.innerWidth;
                  const randomY = Math.random() * window.innerHeight;
                  moveMouse(randomX, randomY);

                  setTimeout(() => {
                    clickMouse();
                  }, 4000);
                }, 6000);

                setInterval(() => {
                  const iframes = document.querySelectorAll('iframe');
                  if (iframes.length > 0) {
                    const iframe = iframes[Math.floor(Math.random() * iframes.length)];
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const randomX = Math.random() * iframeDoc.body.scrollWidth;
                    const randomY = Math.random() * iframeDoc.body.scrollHeight;
                    clickWithinIframe(iframe, randomX, randomY);
                  }
                }, 15000);
              });
                let currentUrl;
                currentUrl =
                await page.evaluate(() => window.location.href);

              // Ensure new tabs are opened correctly
              await page.evaluate(() => {
                document.querySelectorAll('a').forEach(anchor => {
                  anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(anchor.href, '_blank');
                  });
                });
              });

              await page.evaluate(() => {
                function handleIFrameClick() {
                  document.querySelectorAll('iframe').forEach((iframe) => {
                    iframe.contentWindow.document.addEventListener('click', (e) => {
                      const clickEvent = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                      });
                      e.target.dispatchEvent(clickEvent);
                    });
                  });
                }

                handleIFrameClick();
              });
            };

            const waitForTargetUrl = async () => {
              let currentUrl = await page.evaluate(() => window.location.href);
              while (!targetReached) {
                targetReached = true;
                if (currentUrl !== targetUrl) {
                  await Mousebot();
                } else {
                  await page.goto(website, { waitUntil: 'networkidle2' });
                  await Mousebot();
                  currentUrl = await page.evaluate(() => window.location.href);
                }
              }
            };

            await waitForTargetUrl();
          }

          return page;
        } catch (pageError) {
        }
      });

      // Wait for all pages to be opened and perform necessary actions
      const pages = await Promise.all(pagePromises);

      //browsers.push({ browser, browserId, userDataDir, device, userDataDir });
      //log(`Using ${device} - Bliss Bot User ${browserId + 1}`);

      // Save Profile data after performing necessary actions
      //for (const page of await Promise.all(pagePromises)) {
      //  await saveProfileData(page, userDataDir, browserId, proxy, device);
      //}
      //log(`Data Saved - Bliss Bot User ${browserId + 1}`);

      // Start switching between tabs
      const switchTabs = async () => {
        let currentIndex = 0;
        while (true) {
          try {
            if (pages[currentIndex] && !pages[currentIndex].isClosed()) {
              await pages[currentIndex].bringToFront();
            } else {
              pages.splice(currentIndex, 1);
            }

            if (pages.length === 0) {
              break;
            }

            currentIndex = (currentIndex + 1) % pages.length;
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            if (error.message.includes('Session closed')) {
              pages.splice(currentIndex, 1);
              if (pages.length === 0) {
                break;
              }
            } else {
            }
          }
        }
      };

      switchTabs();
      // Function to determine if a page is executing a specific task

      const isExecutingTask = (url) => {
        return websites.some(website => url.includes(website));
      };

      // Monitor and manage tabs
      const monitorTabs = async () => {
        while (true) {
          try {
            // Get all pages in the current browser instance
            const allPages = await browser.pages();

            // Filter pages that are executing a specific task
            const executingTaskPages = allPages.filter(page => isExecutingTask(page.url()));

            // Check if there are more than 10 tabs open
            if (allPages.length > 10) {
              const pagesToClose = allPages.filter(page => !isExecutingTask(page.url()));

              // Close extra tabs that are not executing specific tasks
              for (let i = 0; i < pagesToClose.length; i++) {
                if (i >= allPages.length - 10) break; // Leave only 10 tabs open
                try {
                  await pagesToClose[i].close();
                } catch (error) {
                  if (error.message.includes('Session closed')) {
                    // Handle specific error cases like a session closed
                    // Remove the closed page from the list
                    allPages.splice(allPages.indexOf(pagesToClose[i]), 1);
                  } else {
                    // Log other errors
                  }
                }
              }
            }

            // Wait for 5 seconds before checking again
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            // Log any unexpected errors
          }
        }
      };

      monitorTabs(); // Start monitoring tabs


    });

    // Wait for all browser task promises to complete
    await Promise.all(taskPromises);

  } catch (pageError) {
  }

};

// Perform Google Serach on Bliss Bot
const performGoogleSearch = async (page, website, googlesearch, googleclick, browserId) => {
  try {
    await page.waitForSelector('textarea[name="q"]', { timeout: 6000 });
    await page.type('textarea[name="q"]', googlesearch);
  } catch (error) {
    await page.waitForSelector('input[name="q"]', { timeout: 6000 });
    await page.type('input[name="q"]', googlesearch);
  }

  await page.keyboard.press('Enter');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  const AmNotRobot = async () => {
    try {
      await page.waitForSelector('text=not a robot', { timeout: 2000 });
      const AmNotRobot3 = await page.$('text=not a robot');
      if (AmNotRobot3) {
        await AmNotRobot3.click();
        await page.goto(website);
      }
    } catch (error) {
      await page.click(`text=${googleclick}`);
      log(`Using Google Search - Bliss Bot User ${browserId + 1}`);
    }
  };

  await AmNotRobot();
};

// Generating Browser icon for each browser
const generateBrowserLogo = async (browserId) => {
  const logoPath = 'C:/Users/Bliss-Bot/chromium.png'; // Use PNG format
  const profileName = `Profile ${1 + browserId}`;
  const outputDir = path.join(`C:/Users/Bliss-Bot/User-Data/UserData-${profileName}/${profileName}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPngPath = path.join(outputDir, `Google Profile Picture.png`);
  const outputIcoPath = path.join(outputDir, `Google Profile.ico`);

  const fontColor = 'red'; // Customize font color here

  try {
    // Generate PNG with sharp
    await sharp(logoPath)
      .composite([
        {
          input: Buffer.from(`<svg>'<svg><rect x="20%" y="20%" width="150" height="150" fill= "white" rx="100" ry="100"/></svg>'<text x="50%" y="50%" text-anchor="middle" fill="${fontColor}" font-size="150" font-family="Arial Black" dy=".3em">${1 + browserId}</text></svg>`),
          gravity: 'center' // Ensure the text is placed in the center
        }
      ])
      .toFile(outputPngPath); // Generate PNG file

    // Convert PNG to ICO
    const icoBuffer = await pngToIco(outputPngPath);
    fs.writeFileSync(outputIcoPath, icoBuffer);
    //fs.rmSync(outputPngPath, { recursive: true, force: true });

    return outputIcoPath;
  } catch (error) {
    console.error('Error generating logo:', error);
    return null;
  }
};

// The Main BLiss Bot System Controller Config
const openBrowserWithDevice = async (browserId, _device, Blissbotconfig) => {

  const icoPath2 = await generateBrowserLogo(browserId);

  const profileName = `Profile ${1 + browserId}`;
  const userDataDir = path.join(`C:/Users/Bliss-Bot/User-Data/UserData-${profileName}`);
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const websites = Blissbotconfig.Weblink || [];
  const googleSearchOptions = Blissbotconfig.googleSearchOptions || [];

  // Install and Run extensions
  const StayFocusd = 'C:/Users/Bliss-Bot/Required Apps/Extensions/fihnjjcciajhdojfnbdddfaoknhalnja/3.5.1_0';
  const StayFocusd2 = 'C:/Users/Bliss-Bot/Required Apps/Extensions/ceipnlhmjohemhfpbjdgeigkababhmjc/1.2.1_0';

  const args = [
    '--no-sandbox',
    '--disable-infobars',
    `--disable-extensions-except=${StayFocusd},${StayFocusd2}`,
    `--load-extension=${StayFocusd},${StayFocusd2}`,
    `--profile-directory=${profileName}`,
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${9222 + browserId}`,
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    `--app-icon=${icoPath2}`
  ];

  let proxy = null;
  if (Blissbotconfig.useProxy === 'Y') {
    console.log(`Using Proxy - Bliss Bot User ${browserId + 1}`);
    proxy = Blissbotconfig.proxies[Math.floor(Math.random() * Blissbotconfig.proxies.length)];
    args.push(`--proxy-server=${proxy.server}:${proxy.port}`);
  } else {
    console.log(`Using Local Network - Bliss Bot User ${browserId + 1}`);
  }


  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: args,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
    timeout: 300000 // Increase to 300 seconds (5 minutes)
  });

  const device = getRandomDevice();
  await setupPageEmulation(browser, device);

  // Return browser instance and related info
  return { browser, browserId, userDataDir, device, proxy };

};

// The Main BLiss Bot Proxy Controller Open multiple browsersConfig
const openBrowsers = async (Blissbotconfig) => {
  const browserCount = Blissbotconfig.numberOfProfiles || 1;
  let localNetworkBrowsersCount;

  // Determine the number of local network browsers
  if (Blissbotconfig.useProxy === 'N') {
    localNetworkBrowsersCount = browserCount;
  } else {
    if (browserCount >= 8) {
      localNetworkBrowsersCount = Math.floor(Math.random() * 2) + 1;
    } else {
      localNetworkBrowsersCount = Math.floor(Math.random() * 3);
    }
  }

  const localNetworkBrowsers = new Set();
  while (localNetworkBrowsers.size < localNetworkBrowsersCount) {
    localNetworkBrowsers.add(Math.floor(Math.random() * browserCount));
  }

  console.log();
  log(`Starting "${Blissbotconfig.numberOfProfiles}" Bliss Bot Virtual Users`);
  console.log();

  const browsers = []; // Store browser instances

  for (let i = 0; i < browserCount; i++) {
    const browserId = i;
    const profileName = `Profile ${1 + browserId}`;
    const userDataDir = path.join(`C:/Users/Bliss-Bot/User-Data/UserData-${profileName}`);
    let device;
    let proxy;

    if (fs.existsSync(path.join(`${userDataDir}/BlissBot_UserData_${browserId + 1}.json`))) {
      const data = JSON.parse(fs.readFileSync(path.join(`${userDataDir}/BlissBot_UserData_${browserId + 1}.json`)));
      device = data.device;
      proxy = data.proxy;
    }

    if (localNetworkBrowsers.has(i)) {
      Blissbotconfig.useProxy = 'N';
    } else {
      Blissbotconfig.useProxy = 'Y';
      if (Blissbotconfig.proxies && Blissbotconfig.proxies.length > 0) {
        Blissbotconfig.selectedProxy = Blissbotconfig.proxies[Math.floor(Math.random() * Blissbotconfig.proxies.length)];
      } else {
        console.log("No proxies available in Blissbotconfig.proxies");
        Blissbotconfig.selectedProxy = null;
      }
    }

    const browserData = await openBrowserWithDevice(browserId, device, Blissbotconfig);
    if (browserData) {
      browsers.push(browserData);
    }
  }

  return browsers;
};

// Manage Browser to Stop, Restart, Exit Bliss Bot
const manageBrowsers = async (Blissbotconfig) => {
  let stopRequested = false; // Global flag to indicate if a stop was requested
  const count = 2; // 1 minute in seconds
  const reopen = 1; // Reopen browsers after 15 seconds


  const restart = async (count, reopen) => {
    let countdown = count * 60 * 1000;
    let reopened = reopen * 60 * 1000;

    setTimeout(async () => {
      if (stopRequested) return; // Do not proceed if stop was requested

      try {
        await closeChrome({ timeout: `${reopened}` }); // Use closeChrome function to replace browser.close()
      } catch (err) {
      }
      console.log();
      log('Automated Stop - Bliss Bot Users');
      console.log();


      const updateCountdown1 = () => {
        const minutes = Math.floor(reopened / 60);
        const seconds = reopened % 60;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Reopening "${Blissbotconfig.numberOfProfiles}" Bliss Bot Virtual Users in ${minutes}m:${seconds}s or Stop Bliss Bot Users Type "s":`);
        readline.clearLine(process.stdout, 1); // Clear the rest of the line to avoid overlapping text
      };

      const countdownInterval2 = setInterval(() => {
        if (reopened > 0) {
          reopened -= 1;
          updateCountdown1();
        } else {
          clearInterval(countdownInterval2);
        }
      }, 1000);

      updateCountdown1();

      //console.log(`Reopening in 30secs or Stop Bliss Bot Users Type "s":`);

      setTimeout(async () => {

        // Delete User-Data folder before reopening browsers
        const userDataDir2 = 'C:/Users/Bliss-Bot/User-Data/';
        if (fs.existsSync(userDataDir2)) {
          try {
            fs.rmSync(userDataDir2, { recursive: true, force: true });
          } catch (err) {
            console.error(`Failed to delete folder: ${userDataDir2}. Error: ${err}`);
          }
        }
      }, 10000);

      setTimeout(async () => {
        if (stopRequested) return async function () {
          log(`Bliss Bot User Reopened`);
          await startBlissBot(Blissbotconfig);
        }
        else {
          clearInterval(countdownInterval1);
        }

      }, reopened);
    }, countdown);
  };

  const reprompt = async (count) => {
    let countdown = count * 60;

    const updateCountdown = () => {
      const minutes = Math.floor(countdown / 60);
      const seconds = countdown % 60;
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Automated Closing "${Blissbotconfig.numberOfProfiles}" Bliss Bot Virtual Users in ${minutes}m:${seconds}s`);
      readline.clearLine(process.stdout, 1); // Clear the rest of the line to avoid overlapping text
    };

    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        countdown -= 1;
        updateCountdown();
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    updateCountdown();

    rl.question('', async (answer) => {
      if (answer.toLowerCase() === 's') {
        stopRequested = true;
        clearInterval(countdownInterval);
        await closeChrome(); // Use closeChrome function to replace browser.close()
        console.log();
        log('Bliss Bot Stop Initiated');
        setTimeout(async () => {

          // Delete User-Data folder before reopening browsers
          const userDataDir2 = 'C:/Users/Bliss-Bot/User-Data/';
          if (fs.existsSync(userDataDir2)) {
            try {
              fs.rmSync(userDataDir2, { recursive: true, force: true });
            } catch (err) {
              console.error(`Failed to delete folder: ${userDataDir2}. Error: ${err}`);
            }
          }
        }, 2000);
        console.log();
        prompt();
      } else {
        log('Invalid command');
        reprompt(count);
      }
    });
  };

  setTimeout(async () => {
    console.log();
    log(`Successfully Opened "${Blissbotconfig.numberOfProfiles}" Bliss Bot Virtual Users`);
    console.log();
  }, 1000);

  setTimeout(async () => {
    await restart(count, reopen);
    await reprompt(count);
  }, 1000);
};

// Function to close all Chrome instances
const closeChrome = async () => {
  return new Promise((resolve) => {
    // CMD script logic to close Chrome
    exec('tasklist /fi "imagename eq chrome.exe" | find /i "chrome.exe"', (err, stdout) => {
      if (err) {

      }
      if (stdout) {
        // If chrome.exe is running, kill it
        exec('taskkill /f /im chrome.exe', (err) => {
          if (err) {
            reject(new Error('Failed to kill Chrome processes'));
          } else {
            console.log();
            console.log();
            console.log(`All Chrome instances closed.`);
            resolve();
          }
        });
      } else {
        console.log();
        console.log('No Chrome instances running.');
        resolve();
      }
    });
  });
};

// Start Prompt to Perform tasks
const prompt = () => {
  console.log();
  console.log('Ready to Start Bliss Bot - type "s" OR');
  rl.question('Exit Bliss Bot Now - type "e" : ', async (answer) => {
    console.log();
    if (answer.toLowerCase() === 's') {

      if (fs.existsSync(blissbotfile)) {
        const Blissbotconfig = JSON.parse(fs.readFileSync(blissbotfile));
        await startBlissBot(Blissbotconfig);
      } else {
        console.log();
        console.log('Enter Setup Configurations Details For User Tasks');
        console.log();
        promptNumberOfProfiles();
      }
    } else if (answer.toLowerCase() === 'e') {
      log('Bliss Bot Closed');
      console.log();

      process.exit(1);
    } else {
      console.log('Invalid command');
      prompt();
    }
  });
};

// Bliss Bot Main Start Controller 
const startBlissBot = async (Blissbotconfig) => {
  const browserInstances = await openBrowsers(Blissbotconfig);

  // Perform tasks on opened browsers
  await performTasks(browserInstances, Blissbotconfig);

  // Manage Browsers after all tasks are performed
  await manageBrowsers(Blissbotconfig);

};

// Prompt for the number of profiles
const promptNumberOfProfiles = () => {
  rl.question('Enter No. of Users: ', (numberOfProfiles) => {
    console.log();
    if (isNaN(numberOfProfiles) || numberOfProfiles <= 0) {
      console.log('Invalid No. of Users. Please enter a positive No. of Users:');
      promptNumberOfProfiles();
    } else {
      // Save the number of profiles in the Bliss Bot Config
      let Blissbotconfig = {};
      if (fs.existsSync(blissbotfile)) {
        Blissbotconfig = JSON.parse(fs.readFileSync(blissbotfile));
      }
      Blissbotconfig.numberOfProfiles = parseInt(numberOfProfiles, 10);
      fs.writeFileSync(blissbotfile, JSON.stringify(Blissbotconfig, null, 2));
      Blissbotsettings();
    }
  });
};

// Prompt for Bliss Bot settings
const Blissbotsettings = async () => {
  const websiteCount = await new Promise(resolve => rl.question('Enter the number of websites: ', resolve));
  const websites = [];
  const googleSearchOptions = [];

  const getWebsiteDetails = async (i) => {
    if (i >= websiteCount) {
      // All websites processed, ask for proxy settings
      return new Promise(_resolve => {
        console.log();
        rl.question('Enable Proxy: (Y/N) ', async (useProxy) => {
          useProxy = (useProxy || '').toUpperCase(); // Ensure useProxy is not undefined
          if (useProxy === 'Y') {
            rl.question('Enter No. of Proxies (1-10): ', async (proxyCount) => {
              proxyCount = parseInt(proxyCount, 10);
              if (proxyCount > 0 && proxyCount <= 10) {
                const proxies = [];
                const promptForProxyDetails = async (index) => {
                  if (index < proxyCount) {
                    rl.question(`Enter Proxy ${index + 1} (server/ip:port:username:password): `, (proxyServer) => {
                      const proxyParts = (proxyServer || '').split(':');
                      proxies.push({
                        server: proxyParts[0] || '',
                        port: proxyParts[1] || '',
                        username: proxyParts[2] || '',
                        password: proxyParts[3] || ''
                      });
                      promptForProxyDetails(index + 1);
                    });
                  } else {
                    const Blissbotconfig = {
                      useProxy: 'Y',
                      proxies: proxies,
                      Weblink: websites,
                      googleSearchOptions: googleSearchOptions,
                      numberOfProfiles: JSON.parse(fs.readFileSync(blissbotfile)).numberOfProfiles || 1
                    };
                    fs.writeFileSync(blissbotfile, JSON.stringify(Blissbotconfig, null, 2));
                    await startBlissBot(Blissbotconfig);
                  }
                };
                promptForProxyDetails(0);
              } else {
                console.log('Invalid number of proxies. Please enter a number between 1 and 10.');
                getWebsiteDetails(i); // Retry current website
              }
            });
          } else {
            const Blissbotconfig = {
              useProxy: 'N',
              Weblink: websites,
              googleSearchOptions: googleSearchOptions,
              numberOfProfiles: JSON.parse(fs.readFileSync(blissbotfile)).numberOfProfiles || 1
            };
            fs.writeFileSync(blissbotfile, JSON.stringify(Blissbotconfig, null, 2));
            await startBlissBot(Blissbotconfig);
          }
        });
      });
    } else {
      return new Promise(resolve => {
        rl.question(`Enter Website Link ${i + 1}: `, (link) => {
          const correctedurl = link;
          if (correctedurl.includes('file:')) {
            websites.push(`${correctedurl}`);
          } else {
            if (correctedurl.includes('https://')) {
              websites.push(`${correctedurl}`);
            } else {
              websites.push(`https://${correctedurl}`);
            }
          }

          rl.question(`Enable Google Search for Website ${i + 1}? (Y/N): `, (google) => {
            google = (google || '').toUpperCase(); // Ensure google is not undefined
            let googlesearch = '';
            let googleclick = '';
            let mousebot = '';

            if (google === 'Y') {
              rl.question(`Enter text for Google Search for Website ${i + 1}: `, (googlesearch2) => {
                googlesearch = googlesearch2 || ''; // Ensure googlesearch2 is not undefined

                rl.question(`Enter Web Name text for Website ${i + 1}: `, (googleclick2) => {
                  googleclick = googleclick2 || ''; // Ensure googleclick2 is not undefined

                  rl.question(`Enable Mouse Bot for Website ${i + 1}? (Y/N): `, (mousebot2) => {
                    mousebot = (mousebot2 || '').toUpperCase(); // Ensure google is not undefined

                    if (mousebot === 'Y') {
                      googleSearchOptions.push({
                        google: 'Y',
                        googlesearch: googlesearch,
                        googleclick: googleclick,
                        mousebot: 'Y'
                      });
                      getWebsiteDetails(i + 1).then(resolve);
                    } else {
                      googleSearchOptions.push({
                        google: 'Y',
                        googlesearch: googlesearch,
                        googleclick: googleclick,
                        mousebot: 'N'
                      });
                      getWebsiteDetails(i + 1).then(resolve);
                    }
                  });
                });
              });
            } else {
              rl.question(`Enable Mouse Bot for Website ${i + 1}? (Y/N): `, (mousebot2) => {
                mousebot = (mousebot2 || '').toUpperCase(); // Ensure google is not undefined

                if (mousebot === 'Y') {
                  googleSearchOptions.push({
                    google: 'N',
                    googlesearch: googlesearch,
                    googleclick: googleclick,
                    mousebot: 'Y'
                  });
                  getWebsiteDetails(i + 1).then(resolve);
                } else {
                  googleSearchOptions.push({
                    google: 'N',
                    googlesearch: googlesearch,
                    googleclick: googleclick,
                    mousebot: 'N'
                  });
                  getWebsiteDetails(i + 1).then(resolve);
                }
              });
            }
          });
        });
      });
    }
  };

  getWebsiteDetails(0);
};

// Function to prompt user to continue or edit existing Bliss Bot Configuration
const promptEditOption = (optionName, currentValue, callback, isBoolean = false) => {
  rl.question(`Current ${optionName}: ${currentValue}. Edit (Y/N)? `, (edit) => {
    if (edit.toLowerCase() === 'y') {
      rl.question(`Enter new value for ${optionName}${isBoolean ? ' (Y/N)' : ''}: `, (newValue) => {
        if (isBoolean) {
          if (newValue.toLowerCase() === 'y' || newValue.toLowerCase() === 'n') {
            callback(newValue.toUpperCase());
          } else {
            console.log('Invalid value. Please enter "Y" or "N".');
            promptEditOption(optionName, currentValue, callback, isBoolean);
          }
        } else {
          if (newValue.trim() !== '') {
            callback(newValue.trim());
          } else {
            console.log('Invalid value');
            promptEditOption(optionName, currentValue, callback, isBoolean);
          }
        }
      });
    } else if (edit.toLowerCase() === 'n') {
      callback(currentValue);
    } else {
      console.log('Invalid command');
      promptEditOption(optionName, currentValue, callback, isBoolean);
    }
  });
};

// Function to Start Editing existing Configuration
const promptForConfigAction = (Blissbotconfig) => {

  // Delete User-Data folder before reopening browsers
  const userDataDir2 = 'C:/Users/Bliss-Bot/User-Data/';
  if (fs.existsSync(userDataDir2)) {
    try {
      fs.rmSync(userDataDir2, { recursive: true, force: true });

    } catch (err) {
      log.console.error(`Failed to delete folder: ${userDataDir2}. Error: ${err}`);
    }
  }

  rl.question('Setup Configuration file exists. Do you want to (C)ontinue or (E)dit it? ', (action) => {
    if (action.toLowerCase() === 'c') {
      startBlissBot(Blissbotconfig);
    } else if (action.toLowerCase() === 'e') {
      editConfiguration(Blissbotconfig);
    } else {
      console.log('Invalid command');
      promptForConfigAction(Blissbotconfig);
    }
  });
};

// Function Process Editing Main Existing Configuration
const editConfiguration = (Blissbotconfig) => {
  console.log('Editing Setup Configurations...');

  const editSettings = () => {
    promptEditOption('Number of Profiles', Blissbotconfig.numberOfProfiles || 1, (newNumberOfProfiles) => {
      Blissbotconfig.numberOfProfiles = parseInt(newNumberOfProfiles, 10) || 1;

      promptEditOption('Use Proxy', Blissbotconfig.useProxy || 'N', (newUseProxy) => {
        newUseProxy = newUseProxy.trim().toUpperCase(); // Ensure input is trimmed and in uppercase

        if (newUseProxy === 'Y' || newUseProxy === 'N') {
          Blissbotconfig.useProxy = newUseProxy;

          if (Blissbotconfig.newUseProxy === 'Y') {
            rl.question('Enter No. of Proxies (1-10): ', (proxyCount) => {
              proxyCount = parseInt(proxyCount, 10);
              if (proxyCount > 0 && proxyCount <= 10) {
                Blissbotconfig.proxies = [];
                const promptForProxyDetails = (index) => {
                  if (index < proxyCount) {
                    rl.question(`Enter Proxy ${index + 1} (server/ip:port:username:password): `, (proxyServer) => {
                      const proxyParts = (proxyServer || '').split(':');
                      Blissbotconfig.proxies.push({
                        server: proxyParts[0] || '',
                        port: proxyParts[1] || '',
                        username: proxyParts[2] || '',
                        password: proxyParts[3] || ''
                      });
                      promptForProxyDetails(index + 1);
                    });
                  } else {
                    editWebLinks(Blissbotconfig);
                  }
                };
                promptForProxyDetails(0);
              } else {
                console.log('Invalid command');
                editSettings(); // Retry current setting
              }
            });
          } else {
            editWebLinks(Blissbotconfig);
          }
        } else {
          console.log('Invalid command');
          editSettings(); // Retry current setting
        }
      });
    });
  };

  editSettings();
};

// Function on Editing existing Weblinks Configuration
const editWebLinks = (Blissbotconfig) => {
  if (Blissbotconfig.googleSearchOptions && Blissbotconfig.googleSearchOptions.length > 0) {
    rl.question('Google Search Options already exist. Do you want to edit them? (Y/N): ', (editGoogleSearch) => {
      if (editGoogleSearch.toUpperCase() === 'Y') {
        editGoogleSearchOptions(Blissbotconfig, 0);
      } else if (editGoogleSearch.toUpperCase() === 'N') {
        proceedToNextStep(Blissbotconfig);
      } else {
        console.log('Invalid command');
        editWebLinks(Blissbotconfig);
      }
    });
  } else {
    rl.question('Enter the number of websites: ', (websiteCount) => {
      websiteCount = parseInt(websiteCount, 10);
      if (!isNaN(websiteCount) && websiteCount > 0) {
        Blissbotconfig.Weblink = [];
        Blissbotconfig.googleSearchOptions = [];
        getWebsiteDetails(Blissbotconfig, websiteCount, 0);
      } else {
        console.log('Invalid command');
        editWebLinks(Blissbotconfig);
      }
    });
  }
};

// Function on Editing existing Google Search Options Configuration
const editGoogleSearchOptions = (Blissbotconfig, index) => {
  if (index >= Blissbotconfig.googleSearchOptions.length) {
    proceedToNextStep(Blissbotconfig);
    return;
  }

  const currentOptions = Blissbotconfig.googleSearchOptions[index];
  console.log(`Editing Google Search Options for Website ${index + 1}`);

  promptEditOption('Google Search Text', currentOptions.googlesearch, (newGoogleSearch) => {
    currentOptions.googlesearch = newGoogleSearch;

    promptEditOption('Google Click Text', currentOptions.googleclick, (newGoogleClick) => {
      currentOptions.googleclick = newGoogleClick;

      promptEditOption('Enable Mouse Bot', currentOptions.mousebot, (newMouseBot) => {
        if (newMouseBot === 'Y' || newMouseBot === 'N') {
          currentOptions.mousebot = newMouseBot.toUpperCase();
          editGoogleSearchOptions(Blissbotconfig, index + 1);
        } else {
          console.log('Invalid command');
          editGoogleSearchOptions(Blissbotconfig, index);
        }
      });
    });
  });
};

// Function on Editing existing Website details Configuration
const getWebsiteDetails = (Blissbotconfig, websiteCount, i) => {
  if (i >= websiteCount) {
    fs.writeFileSync(blissbotfile, JSON.stringify(Blissbotconfig, null, 2));
    startBlissBot(Blissbotconfig);
  } else {
    rl.question(`Enter Website Link ${i + 1}: `, (link) => {
      const correctedurl = link.includes('https://') ? link : `https://${link}`;
      Blissbotconfig.Weblink.push(correctedurl);

      rl.question(`Enable Google Search for Website ${i + 1}? (Y/N): `, (google) => {
        google = google.toUpperCase();
        if (google === 'Y' || google === 'N') {
          let googleOptions = { google: google };

          if (google === 'Y') {
            rl.question(`Enter text for Google Search for Website ${i + 1}: `, (searchText) => {
              googleOptions.googlesearch = searchText;

              rl.question(`Enter Web Name text for Website ${i + 1}: `, (clickText) => {
                googleOptions.googleclick = clickText;

                rl.question(`Enable Mouse Bot for Website ${i + 1}? (Y/N): `, (mousebot) => {
                  if (mousebot.toUpperCase() === 'Y' || mousebot.toUpperCase() === 'N') {
                    googleOptions.mousebot = mousebot.toUpperCase();
                    Blissbotconfig.googleSearchOptions.push(googleOptions);
                    getWebsiteDetails(Blissbotconfig, websiteCount, i + 1);
                  } else {
                    console.log('Invalid command');
                    getWebsiteDetails(Blissbotconfig, websiteCount, i);
                  }
                });
              });
            });
          } else {
            rl.question(`Enable Mouse Bot for Website ${i + 1}? (Y/N): `, (mousebot) => {
              if (mousebot.toUpperCase() === 'Y' || mousebot.toUpperCase() === 'N') {
                googleOptions.mousebot = mousebot.toUpperCase();
                Blissbotconfig.googleSearchOptions.push(googleOptions);
                getWebsiteDetails(Blissbotconfig, websiteCount, i + 1);
              } else {
                console.log('Invalid command');
                getWebsiteDetails(Blissbotconfig, websiteCount, i);
              }
            });
          }
        } else {
          console.log('Invalid command');
          getWebsiteDetails(Blissbotconfig, websiteCount, i);
        }
      });
    });
  }
};

// Function to Confirm Starting Bliss Bot with Existing Bliss Bot Configuration
const proceedToNextStep = (Blissbotconfig) => {
  fs.writeFileSync(blissbotfile, JSON.stringify(Blissbotconfig, null, 2));
    startBlissBot(Blissbotconfig);
};