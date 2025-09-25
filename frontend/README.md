# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

C:\nvm4w\nodejs\node_modules\nodejs

1. Download the Installer:

Go to the official nvm-windows GitHub repository releases page: https://github.com/coreybutler/nvm-windows/releases
Scroll down to the "Assets" section of the latest release.
Download the nvm-setup.zip file. 2. Uninstall Existing Node.js Versions (Important):

Before installing nvm-windows, it's highly recommended to uninstall any existing Node.js installations from your computer.
Go to "Add or remove programs" (or "Programs and Features") in your Windows Control Panel.
Find "Node.js" in the list of installed programs and uninstall it. 3. Run the Installer:

Locate the downloaded nvm-setup.zip file and extract its contents.
Run the extracted nvm-setup.exe file.
You will see the nvm-windows setup wizard. 4. Follow the Setup Wizard:

License Agreement: Read and accept the license agreement.
Installation Directory: Choose the installation directory for nvm-windows. The default location is usually fine. Make a note of this directory.
Node.js Symlink Directory: Choose the directory where nvm-windows will create symbolic links to your Node.js versions. This is also usually fine at the default location. Make a note of this directory as well.
Ready to Install: Review your installation settings and click "Install". 5. Verify Installation:

Open a new Command Prompt or PowerShell window. It's crucial to open a new window after installation for the changes to take effect.

Type the following command and press Enter:

nvm --version

If the installation was successful, you should see the version number of nvm-windows printed in the console.

6. Install Node.js Versions using nvm-windows:

Now that nvm-windows is installed, you can install different versions of Node.js.

To see a list of available Node.js versions, run:

nvm list available

To install a specific version (e.g., the latest LTS version, which is recommended for compatibility with many tools like Vite):

nvm install lts

To install a specific version by number (e.g., version 20.19.0 as required by Vite):

nvm install 20.19.0

To switch to a specific installed version:

nvm use lts # To use the latest LTS version

or

nvm use 20.19.0 # To use version 20.19.0

To see which Node.js versions are installed and which one is currently active:

nvm list

Verify the currently active Node.js version:

node -v

By following these steps, you will have nvm-windows installed and configured, allowing you to manage different Node.js versions on your Windows machine. Remember to always open a new terminal window after using nvm use to ensure the correct Node.js version is active.

Balu
PS C:\Users\balus\Documents\Auto Apply\frontend> npm --version 10.1.0

Gemini
Okay, that confirms your npm version is 10.1.0. This is a relatively recent version of npm.

Knowing your npm version is useful, but it doesn't directly address the issues you were having:

Node.js Version Mismatch: Your current Node.js version (v20.8.0) is not compatible with the Vite version your project uses.
'vite' package not found: This indicates an issue with your project's dependencies.
The steps I outlined previously are still the correct way to resolve these issues:

Upgrade your Node.js version using nvm-windows (or nvm on other platforms) to meet Vite's requirements (20.19.0+ or 22.12.0+).
Clean and reinstall your project's dependencies by deleting node_modules and the lock file (package-lock.json, yarn.lock, or pnpm-lock.yaml) and then running npm install.
