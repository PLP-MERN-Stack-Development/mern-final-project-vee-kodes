# AgriTrace Wireframe and Design Documentation

## Overview
This document outlines the wireframes and design decisions for the AgriTrace agricultural management application. The wireframes focus on key user flows: login, farmer registration, dashboard overview, adding activities, and recording collections.

## Design Principles
- **Simplicity**: Clean, uncluttered interfaces with clear navigation
- **Consistency**: Uniform styling, color scheme, and component usage across all screens
- **Accessibility**: Proper labeling, keyboard navigation, and screen reader support
- **Mobile-First**: Responsive design that works on all device sizes
- **User-Centric**: Intuitive workflows that minimize cognitive load

## Color Scheme
- Primary: Green (#10B981) for actions and highlights
- Background: Light gray (#F9FAFB)
- Text: Dark gray (#111827) for primary, medium gray (#6B7280) for secondary
- Borders: Light gray (#D1D5DB)
- Focus: Green ring for interactive elements

## Typography
- Font Family: System fonts (Inter, sans-serif)
- Headings: Bold, 24px for main titles
- Body: Regular, 14px for labels, 16px for inputs
- Buttons: Semibold, 14px

## Component Patterns
- Forms: Centered, max-width 512px, white background with shadow
- Cards: Rounded corners, shadow, padding
- Buttons: Full-width, green background, hover effects
- Inputs: Rounded borders, focus scaling animation
- Selects: Standard dropdown styling

## User Experience Considerations

### Login Flow
- **Goal**: Secure authentication for admins and field officers
- **UX Focus**: Quick access, password visibility toggle for usability
- **Accessibility**: Proper form labels, error announcements
- **Edge Cases**: Invalid credentials, network errors, loading states

### Farmer Registration
- **Goal**: Efficient onboarding of new farmers
- **UX Focus**: Dropdown for regions to prevent typos, clear field labels
- **Validation**: Required fields highlighted, real-time feedback
- **Flow**: Redirect to farmer profile after successful registration

### Dashboard Overview
- **Goal**: High-level insights for managers
- **UX Focus**: Visual data representation with charts, key metrics at top
- **Interactivity**: Clickable chart segments for filtering
- **Performance**: Lazy loading for charts, PDF export option

### Adding Activities
- **Goal**: Record farm operations accurately
- **UX Focus**: Conditional fields based on activity type, farmer selection
- **Progressive Disclosure**: Show relevant fields only when needed
- **Data Integrity**: Farmer pre-selection, date defaults to today

### Recording Collections
- **Goal**: Log harvest data with payment calculations
- **UX Focus**: Auto-populate crop from farmer selection, formatted payment rate
- **Validation**: Numeric inputs for weight and rate, date constraints
- **Feedback**: Success toast with recorded amount

## Wireframe Files
- `login-wireframe.html`: Login form mockup
- `register-farmer-wireframe.html`: Farmer registration form
- `dashboard-wireframe.html`: Dashboard with stats and charts
- `add-activity-wireframe.html`: Activity logging form
- `record-collection-wireframe.html`: Collection recording form

## Technical Implementation Notes
- Wireframes created as static HTML/CSS for easy viewing
- Uses Tailwind CSS classes for styling consistency
- Responsive grid layouts for mobile/desktop
- Placeholder content for dynamic elements
- No JavaScript functionality (static mockups)

## Wireframe Descriptions

### Login Flow Wireframe
```
+--------------------------------------------------+
|                 AgriTrace Login                  |
+--------------------------------------------------+
|                                                  |
|  [Green Checkmark Icon]                          |
|                                                  |
|  Sign in to your Account                         |
|  Enter your official email and password.         |
|                                                  |
|  Email address: [___________________________]   |
|                                                  |
|  Password: [___________________________] [👁️]    |
|                                                  |
|  [Sign in]                                       |
|                                                  |
+--------------------------------------------------+
```

**Layout**: Centered form on full-height page background.
**Components**:
- Header with icon and title
- Two input fields: email (text) and password (with visibility toggle)
- Primary button for submission
**Responsive**: Mobile-friendly with padding adjustments

### Farmer Registration Flow Wireframe
```
+--------------------------------------------------+
|            Register New Farmer                   |
+--------------------------------------------------+
|                                                  |
|  Name: [___________________________]             |
|                                                  |
|  Region: [Select ▼]                              |
|    - Central                                     |
|    - Coast                                       |
|    - ...                                         |
|                                                  |
|  Contact (Phone): [___________________________]  |
|                                                  |
|  Contracted Crop: [___________________________]  |
|                                                  |
|  Contract ID: [___________________________]      |
|                                                  |
|  [Register Farmer]                               |
|                                                  |
+--------------------------------------------------+
```

**Layout**: Centered card with form fields.
**Components**:
- Text inputs for name, contact, crop, contract ID
- Dropdown select for region with predefined options
- Submit button
**UX Notes**: Region dropdown prevents input errors, clear labeling for all fields.

### Dashboard Overview Wireframe
```
+--------------------------------------------------+
|              Manager Dashboard                   |
|  [Print Report]                                  |
+--------------------------------------------------+
|  Stats Cards:                                    |
|  +-------+ +-------+ +-------+ +-------+ +-----+ |
|  |Total  | |Total  | |Avg.   | |Total  | |Outst.| |
|  |Farmers| |Collect| |Cost   | |Paid   | |Paym. | |
|  |150    | |12.5t  | |25.50  | |~250k  | |50k   | |
|  +-------+ +-------+ +-------+ +-------+ +-----+ |
|                                                  |
|  Charts Grid (2x2):                              |
|  +-------------------+ +-----------------------+ |
|  |Collections Over   | |Yield by Quality Grade| |
|  |Time (Line Chart)   | |(Pie Chart)            | |
|  +-------------------+ +-----------------------+ |
|  +-------------------+ +-----------------------+ |
|  |Yield by Region    | |Yield by Crop          | |
|  |(Bar Chart)        | |(Bar Chart)            | |
|  +-------------------+ +-----------------------+ |
|                                                  |
|  AI Insights:                                    |
|  +---------------------------------------------+ |
|  | General AI Insights                         | |
|  | - Insight 1...                              | |
|  | - Insight 2...                              | |
|  +---------------------------------------------+ |
|  +---------------------------------------------+ |
|  | AI Yield Forecast (Next 90 Days)            | |
|  | Forecast: ...                               | |
|  | Key Risks: ...                              | |
|  | Opportunities: ...                          | |
|  +---------------------------------------------+ |
+--------------------------------------------------+
```

**Layout**: Full-width with header, stats grid, charts grid, insights cards.
**Components**:
- Header with title and print button
- 5 stat cards in responsive grid
- 4 chart placeholders (line, pie, bar x2)
- 2 insight cards with AI-generated content
**Interactivity**: Charts clickable for filtering, print generates PDF.

### Adding Activities Flow Wireframe
```
+--------------------------------------------------+
|             Record Farm Operations               |
+--------------------------------------------------+
|                                                  |
|  Select Farmer: [Farmer Name - Region ▼]         |
|                                                  |
|  Operation Type: [Planting ▼]                    |
|    - Planting                                    |
|    - Fertilizer Application                      |
|    - ...                                         |
|                                                  |
|  Activity Date: [2024-11-18]                     |
|                                                  |
|  [Conditional Fields for Planting]               |
|  Seed Variety: [___________________________]     |
|  Seed Source: [___________________________]      |
|  Seed Quantity: [___________________________]    |
|  Seed Lot Number: [___________________________]  |
|                                                  |
|  Cost (KES, optional): [________________________]|
|                                                  |
|  [Submit]                                        |
|                                                  |
+--------------------------------------------------+
```

**Layout**: Centered form card.
**Components**:
- Farmer select dropdown
- Activity type select (shows conditional fields)
- Date picker
- Dynamic input fields based on type
- Optional cost field
- Submit button
**UX Notes**: Progressive disclosure - fields appear based on selection, farmer pre-selection for context.

### Recording Collections Flow Wireframe
```
+--------------------------------------------------+
|                 Record Harvest                   |
+--------------------------------------------------+
|                                                  |
|  Select Farmer: [Farmer Name - Region ▼]         |
|                                                  |
|  Crop: [Maize] (read-only)                       |
|                                                  |
|  +-------------------+ +-----------------------+ |
|  |Harvest Date:      | |Collection Date:       | |
|  |[2024-11-18]       | |[2024-11-18]           | |
|  +-------------------+ +-----------------------+ |
|                                                  |
|  Weight (in Kg): [___________________________]  |
|                                                  |
|  +-------------------+ +-----------------------+ |
|  |Quality Grade:     | |Payment Rate (KES/Kg): | |
|  |[A ▼]              | |[25.50]                | |
|  | - A               |                         | |
|  | - B               |                         | |
|  | - C               |                         | |
|  | - Reject          |                         | |
|  +-------------------+ +-----------------------+ |
|                                                  |
|  [Record Collection]                             |
|                                                  |
+--------------------------------------------------+
```

**Layout**: Centered form with grid for dates and quality/rate.
**Components**:
- Farmer select (auto-fills crop)
- Read-only crop field
- Two-column date inputs
- Weight number input
- Quality grade select and payment rate input
- Submit button
**UX Notes**: Auto-population from farmer selection, formatted payment input, clear labeling.

## Future Enhancements
- Dark mode support
- Advanced chart interactions
- Offline capability indicators
- Multi-language support
- Voice input for forms