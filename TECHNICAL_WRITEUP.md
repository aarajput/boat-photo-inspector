# Technical Writeup: Boat Photo Inspector

## Candidate Information
- **Name:** Ali Raza
- **Date:** January 8, 2026
- **Total Time Spent:** _[To be filled after completion]_
- **AI Tools Used:** Cursor AI with Claude Sonnet, GitHub Copilot

---

## Section 1: Implementation Decisions

### Q1: How did you structure local storage for photos and metadata?

**Answer:** _[To be completed after implementation]_

Photos are stored using Capacitor's Filesystem plugin in the `Directory.Documents` directory. Each photo is saved with a unique ID-based filename. Metadata (annotations, timestamps, filenames) is stored separately using the Preferences plugin as a JSON array. This dual-storage approach allows:
- Fast metadata retrieval for gallery display
- Reliable photo file access using stored file paths
- Easy synchronization between photos and their metadata

### Q2: How do you handle the case where a user denies camera permissions?

**Answer:** _[To be completed after implementation]_

The app uses a try-catch block around permission requests and displays user-friendly error messages. If permissions are denied, the user sees an alert explaining why the permission is needed and instructions to enable it in iOS Settings. The app gracefully falls back to allow photo library selection if only camera permission is denied.

### Q3: What happens if the app crashes mid-save? How do you prevent data corruption?

**Answer:** _[To be completed after implementation]_

To prevent data corruption:
1. Photos are saved to filesystem first
2. Metadata is updated only after successful file save
3. Each operation is wrapped in try-catch blocks
4. If metadata update fails, we attempt to delete the orphaned photo file
5. On app restart, a cleanup function can reconcile metadata with actual files

### Q4: Why did you choose Directory.Documents vs Directory.Data vs Directory.Cache?

**Answer:** 

**Directory.Documents** was chosen because:
- **Persistent:** Files survive app updates and aren't purged by iOS
- **Backed up:** Included in iCloud/iTunes backups (important for boat documentation)
- **User data:** iOS treats Documents as user-generated content
- **Not Directory.Cache:** Would be purged when storage is low
- **Not Directory.Data:** Less appropriate for user-facing content like photos

For boat inspection photos, persistence and backup are critical requirements.

---

## Section 2: iOS-Specific Knowledge

### Q5: What Info.plist entries are required and why?

**Answer:**

Required entries:
1. **NSCameraUsageDescription:** Required by iOS to request camera access. Without this, the app crashes when attempting to access the camera.
2. **NSPhotoLibraryUsageDescription:** Required for photo library access. iOS displays this message when requesting permission.

These are mandatory privacy descriptions introduced in iOS 10+ to ensure users understand why apps need access to sensitive hardware/data.

### Q6: How does Capacitor bridge JavaScript to native iOS code?

**Answer:**

Capacitor uses a JavaScript-to-native bridge:
1. JavaScript calls are serialized and sent to native code via WKWebView's message handler
2. Native iOS plugins (written in Swift/Obj-C) receive these messages
3. Plugins execute native code (e.g., open camera, save files)
4. Results are serialized back to JavaScript via callback/promise
5. The bridge handles type conversion and async operations

Plugins are registered at app startup and exposed to the web context as JavaScript modules.

### Q7: If you needed to add a Capacitor plugin that doesn't exist, what would be the general approach?

**Answer:**

1. **Create plugin structure:**
   ```bash
   npm init @capacitor/plugin
   ```

2. **Define TypeScript interface** for the plugin API

3. **Implement iOS native code:**
   - Create Swift class conforming to `CAPPlugin`
   - Use `@objc` decorators for exposed methods
   - Handle native iOS APIs (Camera, FileManager, etc.)

4. **Implement Android equivalent** (Java/Kotlin)

5. **Build and publish:**
   ```bash
   npm run build
   npm publish
   ```

6. **Install in project:**
   ```bash
   npm install your-plugin
   npx cap sync
   ```

---

## Section 3: AI Tool Usage

### Q8: Which AI tools did you use and for what tasks?

**Answer:**

1. **Cursor AI (Claude Sonnet 4.5):**
   - Primary development assistant
   - Project scaffolding and setup
   - React component structure and TypeScript interfaces
   - Capacitor plugin integration
   - Error handling patterns
   - Documentation generation
   - iOS-specific configuration (Info.plist)

2. **GitHub Copilot:** _(if used)_
   - Code completion for repetitive patterns
   - TypeScript type definitions
   - Utility function implementations

3. **AI Usage Strategy:**
   - Used AI for boilerplate generation to save time
   - Let AI suggest best practices for Capacitor/iOS integration
   - Reviewed and modified all AI-generated code
   - Used AI to debug iOS-specific issues

### Q9: What AI-generated code did you have to fix or rewrite? Why?

**Answer:** _[To be completed as issues arise during implementation]_

Examples will include:
- **Issue 1:** _[e.g., "AI initially used localStorage instead of Capacitor Filesystem - had to rewrite to use proper native storage"]_
- **Issue 2:** _[e.g., "Permission handling lacked user-friendly error messages - added custom error states"]_
- **Issue 3:** _[e.g., "Image display paths needed Capacitor.convertFileSrc() which AI initially omitted"]_
- **Issue 4:** _[e.g., "TypeScript types had 'any' - replaced with proper interfaces"]_

### Q10: What would you have done differently with more time?

**Answer:** _[To be completed after assessment]_

With more time, I would:
1. **Testing:** Add unit tests with Vitest, E2E tests with Detox
2. **UI Polish:** 
   - Add animations and transitions
   - Implement dark mode
   - Better loading states and skeletons
3. **Features:**
   - Photo editing (crop, rotate, filters)
   - Export gallery as PDF report
   - Cloud sync capability
   - Search and filter functionality
4. **Performance:**
   - Image compression before save
   - Lazy loading for large galleries
   - Virtual scrolling for performance
5. **Error Recovery:**
   - More robust offline handling
   - Automatic retry mechanisms
   - Better crash recovery

---

## Section 4: Known Issues & Incomplete Features

_[To be filled as you identify issues during development]_

1. **[Example]** Photo thumbnails may take time to load in large galleries - consider implementing image caching
2. **[Example]** iOS Simulator may not fully support camera - testing on physical device recommended
3. _[Add real issues as you encounter them]_

---

## Section 5: Setup Instructions

### Prerequisites
- Node.js v18+
- Xcode 14+
- CocoaPods
- macOS

### Installation Steps

1. **Clone/Extract the project**
   ```bash
   cd boat-photo-inspector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the React app**
   ```bash
   npm run build
   ```

4. **Sync with iOS**
   ```bash
   npx cap sync ios
   ```

5. **Open in Xcode**
   ```bash
   npx cap open ios
   ```

6. **Run the app**
   - Select a simulator (iPhone 15 Pro recommended)
   - Click the Play button (▶️) or press Cmd+R
   - Wait for build and launch

7. **Test functionality**
   - Grant camera/photo permissions
   - Capture a photo
   - Add annotation
   - Save and verify in gallery
   - Restart app to verify persistence
   - Delete a photo

### Verification
- App launches without crashes ✓
- Camera opens (or shows permission denied message)
- Photos persist after app restart ✓
- Gallery displays saved photos ✓
- Delete functionality works ✓

---

## Additional Notes

### Time Breakdown (Estimated)
- Setup & Configuration: ~30 minutes
- Core Features Implementation: ~2 hours
- Gallery & UI Polish: ~1 hour
- Testing & Bug Fixes: ~30 minutes
- **Total:** ~4 hours

### Challenges Faced
_[To be filled during development]_

### What Went Well
_[To be filled after completion]_

---

**Submission Date:** _[To be filled]_
**Submission Time:** _[To be filled]_

