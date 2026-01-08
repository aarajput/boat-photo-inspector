# Technical Writeup: Boat Photo Inspector

## Candidate Information

- **Name:** Ali Abbas
- **Date:** January 8, 2026
- **Total Time Spent:** 4 hours
- **AI Tools Used:** Cursor AI with Claude Sonnet 4.5

---

## Section 1: Implementation Decisions

### Q1: How did you structure local storage for photos and metadata?

**Answer:**

I implemented a **dual-storage architecture** separating photos and metadata:

**Photo Storage (Filesystem):**

- Photos saved as base64-encoded files in `Directory.Documents`
- Filename format: `PHOTO_{timestamp}_{uuid}.jpg`
- Each file is written using `Filesystem.writeFile()` with base64 encoding
- Files persist across app restarts and survive iOS updates

**Metadata Storage (Preferences):**

- All photo metadata stored as JSON array under key `boat_photos_metadata`
- Each metadata object contains:
  ```typescript
  {
    id: string,           // Unique identifier
    filepath: string,     // Filename in Documents directory
    annotation: string,   // User's text description
    timestamp: number     // Date captured (ms since epoch)
  }
  ```
- Used `Preferences.set()` and `Preferences.get()` for atomic read/write operations

**Benefits of this approach:**

- Fast metadata retrieval for gallery display (no file I/O needed)
- Efficient: Only load image data when user views specific photo
- Atomic updates: Metadata saved only after successful file write
- Easy to implement search/filter (just parse metadata JSON)

### Q2: How do you handle the case where a user denies camera permissions?

**Answer:**

Implemented **graceful error handling with user guidance**:

**1. Try-Catch Pattern:**

```typescript
try {
  const photo = await Camera.getPhoto({...});
} catch (err) {
  if (errorMessage.includes('permission')) {
    setError('Camera permission denied. Please enable camera access in Settings > Boat Photo Inspector > Camera.');
  }
}
```

**2. User Experience Flow:**

- If camera permission denied → Show clear error message with Settings path
- Modal remains open, allowing user to try photo library instead
- Error message includes specific instructions for iOS Settings navigation
- User can cancel and return to gallery at any time

**3. Fallback Strategy:**

- Two independent photo sources: Camera OR Photo Library
- If one is denied, user can use the other
- Both options visible simultaneously in modal

**4. iOS-Level Protection:**

- App includes `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` in Info.plist
- iOS shows these descriptions before permission prompt
- Permissions requested only when user initiates action (not on app launch)

### Q3: What happens if the app crashes mid-save? How do you prevent data corruption?

**Answer:**

Implemented **write-order protection** to prevent data corruption:

**Save Order (Critical):**

```typescript
// 1. Save photo to filesystem FIRST
const fileName = await savePhoto(photo);

// 2. Only if successful, update metadata
await savePhotoMetadata(photo, annotation);
```

**Why this order matters:**

- **Orphaned files** (file exists, no metadata) → Safe, just unused disk space
- **Missing files** (metadata exists, no file) → Would cause crashes when loading
- Therefore: Write file first, metadata second

**Error Handling Strategy:**

```typescript
try {
  await Filesystem.writeFile(...);
  try {
    await Preferences.set(...);
  } catch (metadataError) {
    // Rollback: Delete the orphaned photo file
    await Filesystem.deleteFile({ path: fileName });
    throw metadataError;
  }
} catch (error) {
  // User sees error, no partial state saved
}
```

**Additional Protections:**

- Each operation wrapped in try-catch
- User-facing error messages (not silent failures)
- Loading states prevent multiple concurrent saves
- Save button disabled during save operation

**Future Enhancement:**
Could add a cleanup function on app startup to reconcile metadata with filesystem and remove orphaned files.

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

**Three Info.plist entries are required** (all added to `ios/App/App/Info.plist`):

1. **NSCameraUsageDescription:**

   ```xml
   <key>NSCameraUsageDescription</key>
   <string>This app needs access to your camera to capture photos of your boat's condition for documentation.</string>
   ```

   - Required for `Camera.getPhoto()` with `source: CameraSource.Camera`
   - Without this, app crashes immediately when accessing camera
   - iOS displays this message in permission prompt

2. **NSPhotoLibraryUsageDescription:**

   ```xml
   <key>NSPhotoLibraryUsageDescription</key>
   <string>This app needs access to your photo library to select existing photos of your boat.</string>
   ```

   - Required for `Camera.getPhoto()` with `source: CameraSource.Photos`
   - Allows reading from photo library

3. **NSPhotoLibraryAddUsageDescription:**
   ```xml
   <key>NSPhotoLibraryAddUsageDescription</key>
   <string>This app needs to save photos to your photo library for documentation purposes.</string>
   ```
   - Required if app saves photos back to library (though we don't in current implementation)
   - Camera plugin may request this even for temporary photo access
   - Added to prevent permission errors

**Why These Are Mandatory:**

- Introduced in iOS 10+ for privacy compliance
- Missing keys = instant app crash (not just permission denial)
- Displayed to users in system permission dialogs
- Required by App Store review process

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

2. **AI Usage Strategy:**
   - Used AI for boilerplate generation to save time
   - Let AI suggest best practices for Capacitor/iOS integration
   - Reviewed and modified all AI-generated code
   - Used AI to debug iOS-specific issues

### Q9: What AI-generated code did you have to fix or rewrite? Why?

**Answer:**

Several significant issues required debugging and fixes:

**Issue 1: Capacitor Version Compatibility (Critical)**

- **Problem:** Initial setup used Capacitor 8.x, but plugins used 6.x API
- **Error:** `Value of type 'CAPPluginCall' has no member 'reject'` - API breaking changes
- **Root Cause:** Capacitor 8.x changed plugin API, but `@capacitor/camera` and `@capacitor/filesystem` hadn't updated
- **Fix:** Downgraded entire Capacitor stack to 6.x (LTS version):
  ```bash
  npm install @capacitor/core@^6.0.0 @capacitor/cli@^6.0.0 @capacitor/ios@^6.0.0
  npm install @capacitor/camera@^6.0.0 @capacitor/filesystem@^6.0.0 @capacitor/preferences@^6.0.0
  ```
- **Lesson:** Always verify plugin compatibility with core framework version

**Issue 2: TailwindCSS 4.x Configuration**

- **Problem:** Build error: "It looks like you're trying to use tailwindcss directly as a PostCSS plugin"
- **Root Cause:** Tailwind 4.x changed PostCSS integration - requires new `@tailwindcss/postcss` package
- **Fix:**
  ```bash
  npm install @tailwindcss/postcss
  ```
  Updated `postcss.config.js`:
  ```javascript
  export default {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };
  ```

**Issue 3: TypeScript Strict Mode Violations**

- **Problem:** `TS1484: 'PhotoMetadata' is a type and must be imported using a type-only import`
- **Root Cause:** `verbatimModuleSyntax` enabled in tsconfig requires explicit type imports
- **Fix:** Changed all type imports across files:

  ```typescript
  // Before
  import { PhotoMetadata } from "./types";

  // After
  import type { PhotoMetadata } from "./types";
  ```

**Issue 4: iOS Status Bar Overlap**

- **Problem:** App content rendered behind iOS status bar
- **Root Cause:** No safe area insets applied to headers
- **Fix:**
  - Added CSS safe area variables to `index.css`
  - Applied `pt-safe` class to all screen headers
  - Added `contentInset: 'always'` to capacitor.config.ts

**Issue 5: iOS Simulator Photo Library Error**

- **Problem:** `PHAssetExportRequestErrorDomain error` when selecting from gallery
- **Root Cause:** iOS Simulator photo conversion service sometimes fails
- **Fix:**
  - Reduced quality from 90 to 80
  - Added `correctOrientation: true` and `saveToGallery: false`
  - Implemented helpful error message explaining simulator limitation

**Issue 6: UI Polish Issues**

- **Problem 1:** Photo annotations not visible on thumbnails (only on hover)
- **Fix:** Removed `opacity-0` class, made annotation overlay always visible
- **Problem 2:** "Pick Image" text instead of styled floating button
- **Fix:** Restored full floating button component with gradient and icon

**What I Learned:**

- Always verify framework/plugin version compatibility before starting
- iOS Simulator has limitations; test on real device for production
- Safe area insets are critical for modern iOS devices
- TypeScript strict mode requires discipline with type imports

### Q10: What would you have done differently with more time?

**Answer:**

With more time, I would:

1. **Testing:** Add unit tests with Vitest
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

### Known Issues

1. **iOS Simulator Photo Library Limitations**

   - **Issue:** Selecting photos from gallery in iOS Simulator sometimes fails with `PHAssetExportRequestErrorDomain error`
   - **Cause:** Simulator's photo conversion service is unreliable
   - **Workaround:** Use camera option instead, or test on physical device
   - **Status:** Not fixable on our end - simulator limitation

2. **No Image Compression**

   - **Issue:** Photos saved at full resolution (base64 encoded)
   - **Impact:** Large gallery could consume significant storage
   - **Future Enhancement:** Implement client-side image compression before save
   - **Temporary Mitigation:** Camera quality set to 80 (was 90)

3. **No Photo Editing**

   - **Missing:** Crop, rotate, filter capabilities
   - **Current State:** Photos saved exactly as captured/selected
   - **Reason:** Time constraint - core functionality prioritized

4. **Gallery Performance with Many Photos**

   - **Issue:** Loading 50+ photos could slow initial render
   - **Current Implementation:** All photos loaded eagerly
   - **Future Enhancement:** Virtual scrolling, lazy loading, thumbnail optimization

5. **No Offline Indicator**
   - **Issue:** App assumes device storage always available
   - **Missing:** Error handling for full disk scenarios
   - **Risk:** Low (iOS manages storage well, but could add disk space check)

### Incomplete Features

1. **Search/Filter Functionality**

   - No way to search annotations or filter by date
   - Would require: Search bar in gallery, filter by date range

2. **Export Capability**

   - Cannot export photos as PDF report or zip file
   - Would be valuable for sharing inspection results

3. **Photo Metadata**

   - No GPS location capture
   - No EXIF data preservation
   - Could be useful for boat location tracking

4. **Batch Operations**

   - Cannot select multiple photos for deletion
   - No bulk export or sharing

5. **Cloud Sync**
   - Photos only stored locally
   - No backup to cloud storage
   - Risk of data loss if device is damaged/lost

### Testing Limitations

- **No Unit Tests:** Time constraint prevented test suite implementation
- **Manual Testing Only:** Tested on iPhone 14 Pro simulator
- **No Real Device Testing:** Physical iPhone testing not performed
- **No Edge Cases:** Didn't test with 100+ photos, extremely long annotations, etc.

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

### Time Breakdown (Actual)

- **Setup & Configuration:** ~45 minutes

  - Project creation with Vite
  - Capacitor installation and iOS platform setup
  - TailwindCSS 4.x configuration
  - Troubleshooting npm permissions

- **Core Features Implementation:** ~2 hours

  - TypeScript types and interfaces
  - Storage utilities (Filesystem + Preferences)
  - Camera/Photo Library integration
  - Photo annotation component
  - Save/load/delete functionality

- **Gallery & UI Polish:** ~45 minutes

  - Photo gallery grid layout
  - Empty states and loading indicators
  - Floating action button
  - Thumbnail previews with annotations
  - Photo detail view with delete confirmation

- **Bug Fixes & Debugging:** ~1.5 hours

  - Capacitor version compatibility (major issue)
  - iOS status bar safe area fixes
  - Photo library simulator errors
  - TypeScript strict mode compliance
  - UI polish (annotation visibility, button styling)

- **Documentation:** ~30 minutes

  - README with setup instructions
  - This technical writeup

- **Total:** ~4 hours

### Challenges Faced

1. **Capacitor Version Hell**

   - Most time-consuming issue
   - Initial version 8.x incompatible with plugins
   - Had to research breaking changes and downgrade everything
   - Learned importance of checking compatibility matrix

2. **iOS Simulator Limitations**

   - Photo library selection unreliable in simulator
   - Couldn't fully test without physical device
   - Had to implement robust error handling for edge cases

3. **TailwindCSS 4.x Migration**

   - New PostCSS plugin requirement not documented clearly
   - Build errors were cryptic
   - Found solution through error message research

4. **Safe Area Insets**

   - Content initially behind status bar
   - Required CSS environment variables and Capacitor config
   - Needed to test on different device sizes

5. **Type Safety vs Speed**
   - TypeScript strict mode caught many issues early
   - But required more upfront type definitions
   - Trade-off was worth it for maintainability

### What Went Well

1. **AI-Assisted Development**

   - Cursor AI accelerated boilerplate code generation
   - Helped debug cryptic iOS errors quickly
   - Suggested best practices for Capacitor integration
   - Estimated 40% time savings compared to manual coding

2. **Component Architecture**

   - Clean separation of concerns (storage, UI, state)
   - Easy to debug and modify individual pieces
   - Reusable patterns emerged naturally

3. **User Experience**

   - Clean, modern UI with gradients and animations
   - Intuitive flow: Gallery → Capture → Annotate → Save
   - Error messages are helpful and actionable
   - Loading states prevent user confusion

4. **iOS Integration**

   - Proper permissions handling with Info.plist
   - Native feel with Capacitor
   - Safe area support for modern iPhones
   - Smooth transitions between screens

5. **Data Persistence**
   - Photos survive app restart (tested multiple times)
   - No data loss during normal operations
   - Metadata and files stay in sync

### Key Takeaways

1. **Always verify dependency compatibility** before starting
2. **Test on real devices** when possible - simulators have limitations
3. **AI tools are powerful** but require human verification and debugging
4. **Incremental commits** would have been helpful (noted for future)
5. **Documentation matters** - this writeup clarified my own decisions

---

**Submission Date:** January 8, 2026
**Submission Time:** 4 hours from start
