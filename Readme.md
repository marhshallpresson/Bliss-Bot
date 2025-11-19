# Bliss Bot

[![GitHub License](https://img.shields.io/github/license/mobot685/Bliss-Bot?style=flat-square)](https://github.com/mobot685/Bliss-Bot/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/mobot685/Bliss-Bot?style=flat-square)](https://github.com/mobot685/Bliss-Bot/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/mobot685/Bliss-Bot?style=flat-square)](https://github.com/mobot685/Bliss-Bot/network/members)

**Version:** 24.09.2  
**Author:** Marshall Presson  
**Repository:** [https://github.com/mobot685/Bliss-Bot](https://github.com/mobot685/Bliss-Bot)

Bliss Bot is a streamlined and robust virtual user automation tool designed for Windows, drawing inspiration from Okec Bot. It facilitates browser automation across multiple virtual profiles, incorporating device emulation, proxy rotation, and seamless integration with browser extensions. Ideal for web testing, data scraping, SEO analysis, and simulating diverse user interactions at scale.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Use Cases](#use-cases)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration Example](#configuration-example)
- [Troubleshooting](#troubleshooting)
- [Security and Legal Considerations](#security-and-legal-considerations)
- [Contributing](#contributing)
- [License](#license)

## Overview

Bliss Bot empowers developers and testers to automate web interactions efficiently. By managing multiple independent browser profiles, it emulates real-world user behaviors across various devices and networks. Built with Node.js, it leverages Chrome for automation, ensuring reliability and ease of use for tasks requiring scalability and anonymity.

## Features

- **Multi-Profile Management:** Run multiple isolated Chrome profiles concurrently for parallel automation.
- **Device Emulation:** Automatically select and emulate devices (mobile, tablet, desktop) to mimic diverse user environments.
- **Proxy Rotation:** Assign and rotate proxies per profile to enhance privacy and enable geo-specific testing.
- **Extension Support:** Integrate and manage Chrome extensions, such as "I don't care about cookies" and "I'm not robot captcha clicker."
- **Task Automation:** Perform Google searches, navigation, and interactions programmatically.
- **Mouse Simulation:** Implement realistic mouse movements and clicks, including handling iframes.
- **Data Persistence:** Store and retrieve profile data including cookies, localStorage, sessionStorage, and IndexedDB.
- **CLI Interface:** Interactive command-line for configuring profiles, proxies, and tasks.
- **Comprehensive Logging:** Record detailed actions and errors for debugging.
- **Lifecycle Management:** Handle browser launches, shutdowns, and restarts gracefully.

## Use Cases

- **Web Testing:** Simulate user interactions across devices and locations for thorough QA.
- **Data Scraping:** Extract information from websites using varied identities to avoid rate limits.
- **Ad Verification:** Validate advertisement rendering in different geos and device types.
- **SEO Research:** Automate search queries and analyze results for optimization insights.
- **Detection Evasion:** Employ rotation techniques to bypass anti-bot measures.
- **Account Automation:** Manage bulk operations across numerous profiles efficiently.

## Installation

### Prerequisites

- Node.js (version 18 or higher recommended)
- Google Chrome installed at the default path: `C:\Program Files\Google\Chrome\Application\chrome.exe`
- Windows operating system (scripts are tailored for Windows)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mobot685/Bliss-Bot.git
   cd Bliss-Bot
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**

   Optionally, edit the `.env` file to set `PROJECT_KEY` and `AUTH_PHRASE`.

4. **Verify Chrome Installation**

   Ensure Google Chrome is installed at the specified path. If not, update the path in `Bliss_Bot_Script.js`.

5. **Launch the Bot**

   - Via batch file (recommended for Windows):
     ```bash
     run.bat
     ```
   - Directly with Node.js:
     ```bash
     node Bliss_Bot_Script.js
     ```
   - Or use the shortcut: `Bliss-Bot.lnk`

## Usage

Upon first launch, Bliss Bot guides you through an interactive setup via the command line:

- Specify the number of virtual users (profiles).
- Define websites to automate.
- Configure Google search and click behaviors.
- Set up proxies (optional).
- Enable mouse simulation (optional).

The bot then initiates multiple Chrome instances, each with unique configurations, executing the defined tasks. Logs are saved to `Bliss_Bot_logs.txt`.

To manage sessions:
- Use CLI options to pause, restart, or modify settings.
- The system automatically cycles browser instances for continuity.

## Configuration Example

Here's a sample interaction during setup:

```
Enter No. of Users: 5
Enter the number of websites: 2
Enter Website Link 1: https://example.com
Enable Google Search for Website 1? (Y/N): Y
Enter text for Google Search for Website 1: test search
Enter Web Name text for Website 1: Example
Enable Mouse Bot for Website 1? (Y/N): Y
...
Enable Proxy: (Y/N): Y
Enter No. of Proxies (1-10): 2
Enter Proxy 1 (server/ip:port:username:password): 1.2.3.4:8080:user:pass
...
```

## Troubleshooting

- **Chrome Path Issues:** Confirm the installation path or adjust in the script.
- **Permission Errors:** Run the application as an administrator.
- **Proxy Configuration:** Verify the format `server:port:username:password`.
- **Extension Loading:** Ensure extensions are in the designated directories.

For additional support, check the logs or open an issue on the [repository](https://github.com/mobot685/Bliss-Bot/issues).

## Security and Legal Considerations

Utilize Bliss Bot responsibly, adhering to website terms of service and applicable laws. Automation should only occur on permitted sites. The author disclaims liability for any misuse or resulting consequences.

## Contributing

Contributions are welcome! To get involved:
- Fork the repository.
- Create a feature branch.
- Commit your changes.
- Open a pull request.

Please review open issues or suggest improvements via [GitHub Issues](https://github.com/mobot685/Bliss-Bot/issues).

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.