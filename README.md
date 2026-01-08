# Boat Photo Inspector

A React + Capacitor iOS application for documenting boat conditions through photos with annotations. Built for SeaSure assessment.

## 📋 Overview

This application allows users to:
- ✅ Capture photos using device camera or select from photo library
- ✅ Add text annotations to photos (up to 200 characters)
- ✅ Save annotated photos locally with persistence after app restart
- ✅ View a gallery of saved photos in a grid layout
- ✅ Delete photos from the gallery with confirmation

## 🛠 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework (Functional components only) |
| TypeScript | 5.9.3 | Type safety (Strict mode enabled) |
| Capacitor | 6.x | Native iOS bridge |
| TailwindCSS | 4.1.18 | Styling |
| Vite | 7.x | Build tool & dev server |
| iOS Target | 15.0+ | Minimum iOS version |

## 📦 Required Capacitor Plugins

- `@capacitor/camera@8.0.0` - Camera and photo library access
- `@capacitor/filesystem@8.0.0` - Local file persistence
- `@capacitor/preferences@8.0.0` - Metadata storage

## 🚀 Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18+
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Xcode** (v14 or higher) - Required for iOS development
   - Install from Mac App Store
   - Install Command Line Tools:
     ```bash
     xcode-select --install
     ```

4. **CocoaPods** (for iOS dependencies)
   ```bash
   sudo gem install cocoapods
   ```

5. **macOS** - iOS development requires macOS

## 📥 Installation & Setup

### Step 1: Clone or Download the Repository

```bash
cd /path/to/your/projects
# If you have the repo URL:
git clone <repository-url>
cd boat-photo-inspector

# Or if you extracted from a zip:
cd boat-photo-inspector
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all Node.js dependencies including React, Capacitor, and plugins.

### Step 3: Build the React Application

```bash
npm run build
```

This compiles the TypeScript and bundles the React app into the `dist/` directory.

### Step 4: Sync with iOS

```bash
npx cap sync ios
```

This copies the web assets to the iOS project and updates native dependencies.

## 🏃‍♂️ Running the Application

### Option 1: Run on iOS Simulator (Recommended for Testing)

1. **Open Xcode:**
   ```bash
   npx cap open ios
   ```

2. **In Xcode:**
   - Wait for Xcode to finish indexing (progress bar at top)
   - Select a simulator from the device dropdown (e.g., "iPhone 15 Pro")
   - Click the **Play (▶️)** button or press `Cmd + R`

3. **First Launch:**
   - The app will build and launch in the iOS Simulator
   - Grant camera and photo library permissions when prompted

### Option 2: Run on Physical iOS Device

1. **Connect your iPhone via USB**

2. **Open Xcode:**
   ```bash
   npx cap open ios
   ```

3. **Configure Signing:**
   - Select the project in Xcode navigator
   - Go to "Signing & Capabilities" tab
   - Select your Apple ID team
   - Change bundle identifier if needed

4. **Select your device** from the device dropdown

5. **Run the app** (Click Play or `Cmd + R`)

6. **Trust Developer on iPhone:**
   - Go to Settings > General > VPN & Device Management
   - Trust your developer certificate

## 🔧 Development Workflow

### Making Changes to the React App

1. **Edit files** in `src/` directory

2. **Rebuild:**
   ```bash
   npm run build
   ```

3. **Sync changes to iOS:**
   ```bash
   npx cap sync ios
   ```

4. **Re-run in Xcode** (or hot reload if using live reload)

### Development Server (Web Preview)

For rapid development, you can run the web version:

```bash
npm run dev
```

**Note:** Camera and filesystem features won't work in the browser. This is only for UI development.

## 📱 iOS Permissions

The app requires the following iOS permissions (already configured in `Info.plist`):

- **NSCameraUsageDescription**: "This app needs access to your camera to capture photos of your boat's condition for documentation."
- **NSPhotoLibraryUsageDescription**: "This app needs access to your photo library to select existing photos of your boat."

## 📁 Project Structure

```
boat-photo-inspector/
├── src/
│   ├── components/         # React components
│   │   ├── PhotoCapture.tsx
│   │   ├── PhotoAnnotation.tsx
│   │   ├── PhotoGallery.tsx
│   │   └── PhotoDetail.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── usePhotoStorage.ts
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/              # Helper functions
│   │   └── storage.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles (Tailwind)
├── ios/                    # Capacitor iOS project
│   └── App/
│       └── App/
│           └── Info.plist  # iOS permissions
├── dist/                   # Built web assets (generated)
├── capacitor.config.ts     # Capacitor configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🧪 Testing Checklist

### Camera & Photo Library
- [ ] Camera opens and captures photos
- [ ] Photo library opens and allows selection
- [ ] Permission denied shows appropriate error message

### Annotation
- [ ] Can add text annotation up to 200 characters
- [ ] Character count displays correctly
- [ ] Can edit annotation before saving

### Persistence
- [ ] Photos save to local filesystem
- [ ] Photos persist after app restart
- [ ] Metadata (annotation, timestamp) is retained

### Gallery
- [ ] Gallery displays all saved photos in grid
- [ ] Thumbnails load correctly
- [ ] Empty state shows when no photos

### Delete
- [ ] Delete shows confirmation dialog
- [ ] Confirmed delete removes photo from filesystem
- [ ] Gallery updates after deletion

## 🐛 Troubleshooting

### "Command not found: npx"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### "xcrun: error: SDK 'iphoneos' cannot be located"
**Solution:** 
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcode-select --install
```

### Build fails in Xcode
**Solution:**
1. Clean build folder: `Product > Clean Build Folder` (`Shift + Cmd + K`)
2. Delete derived data: `Xcode > Preferences > Locations > Derived Data > Delete`
3. Rebuild the project

### "Pod install failed"
**Solution:**
```bash
cd ios/App
pod install --repo-update
cd ../..
npx cap sync ios
```

### Changes not reflected in app
**Solution:** Always rebuild and sync after code changes:
```bash
npm run build
npx cap sync ios
```
Then re-run in Xcode.

### Camera/Gallery not working in Simulator
**Note:** Some simulators have limited camera support. Try:
- iPhone 15 Pro Simulator (recommended)
- Physical device for full testing

## 📝 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (web only) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on codebase |

## 🔗 Useful Commands

```bash
# Build and sync in one go
npm run build && npx cap sync ios

# Open iOS project in Xcode
npx cap open ios

# Update Capacitor dependencies
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/ios@latest @capacitor/camera@latest @capacitor/filesystem@latest @capacitor/preferences@latest
npx cap sync ios
```

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 🎯 Assessment Criteria

This project was built to meet the following requirements:
- ✅ React 18.x/19.x with functional components
- ✅ TypeScript with strict mode
- ✅ Capacitor 5.x/6.x for iOS
- ✅ TailwindCSS for styling
- ✅ Photo capture from camera and library
- ✅ Text annotations with validation
- ✅ Local persistence using Filesystem
- ✅ Gallery with delete functionality
- ✅ iOS permissions properly configured

## 📄 License

This project is part of a technical assessment for SeaSure.

## 👤 Author

Ali Raza
Assessment Date: January 2026

---

**Need Help?** 
- Check the Troubleshooting section above
- Review Capacitor docs for iOS-specific issues
- Ensure all prerequisites are installed
