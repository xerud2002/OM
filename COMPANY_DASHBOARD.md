# Company Dashboard Features

## Overview

The company dashboard provides a comprehensive interface for moving companies to manage customer requests, send detailed offers, and interact with potential clients. This document outlines the key features implemented.

## Features

### 1. Dashboard Metrics & Analytics

The dashboard displays real-time metrics to help companies track their performance:

- **Total Offers**: Shows all offers submitted by the company
- **Accepted Offers**: Number of offers accepted by customers
- **Pending Offers**: Offers awaiting customer response
- **Total Revenue**: Calculated from all accepted offers
- **Average Offer Value**: Mean value of all offers
- **Win Rate**: Percentage of offers that are accepted vs. rejected
- **Recent Activity**: Offers submitted in the last 7 days
- **Response Rate**: Percentage of offers that have received a response

### 2. Request Viewing with Data Visibility Control

#### Limited View (Default)
By default, companies see limited customer information:
- Customer's first name or "Client"
- Cities (from → to)
- Move date (if available)
- General request details

#### Unlocked View (After Payment)
After unlocking (simulated payment of 10 lei), companies can see:
- Full customer name
- Email address (clickable mailto link)
- Phone number (clickable tel link)
- Complete departure address
- Complete arrival address
- All request details

**Why this feature?**
This prevents companies from accessing customer contact information without commitment, while still allowing them to assess if they want to bid on a request.

### 3. Enhanced Offer Submission

Companies can submit detailed offers with:

#### Basic Information (Required)
- **Price**: Estimated cost in lei
- **Message**: Description of services, terms, etc.

#### Advanced Options (Optional)
Expandable section that includes:

**Date Proposals**
- Propose up to 3 alternative dates for the move
- Helps when the customer's preferred date isn't available
- Dates are displayed in a highlighted section with calendar formatting

**Information Requests**
- Request additional information from the customer
- Examples: "Do you have an elevator?", "How many boxes need packing?"
- Helps companies prepare more accurate offers
- Displayed prominently for the customer to see and respond

### 4. Offer Management

Companies can manage their submitted offers:

#### View Offers
- All offers are displayed in a clean card layout
- Color-coded status indicators:
  - Green: Accepted
  - Amber: Pending
  - Red: Rejected/Declined
- Shows offer details, proposed dates, and info requests

#### Edit Offers
- Edit price and message while offer is pending
- Cannot edit after customer accepts/rejects
- Real-time updates via Firestore

#### Withdraw Offers
- Remove an offer at any time
- Confirmation dialog to prevent accidental deletions
- Permanently removes the offer from the system

### 5. Two-Tab Interface

#### Tab 1: My Offers
- View all offers submitted by the company
- Filter by status (all, pending, accepted, declined, rejected)
- Search by message or request ID
- Detailed statistics and metrics

#### Tab 2: Customer Requests
- Browse all active customer requests
- Real-time updates when new requests arrive
- Sort by newest/oldest
- Infinite scroll pagination
- See how long ago each request was posted

### 6. Real-time Updates

All data is synced in real-time via Firestore:
- New requests appear immediately
- Offer status changes update instantly
- No need to refresh the page
- Live metrics and statistics

## User Flow

### For a New Request

1. Company browses "Customer Requests" tab
2. Sees limited information about the request
3. Decides if they want to bid
4. Unlocks full customer data (if needed)
5. Submits an offer with:
   - Price
   - Detailed message
   - Optional: Proposed dates
   - Optional: Information request
6. Offer appears in "My Offers" tab
7. Can edit or withdraw while pending
8. Receives real-time notification when customer responds

### For Managing Existing Offers

1. Navigate to "My Offers" tab
2. Filter by status or search
3. Click on an offer to see details
4. View proposed dates and info requests
5. Edit price/message if still pending
6. Withdraw if no longer interested
7. Track which offers are accepted

## Technical Implementation

### Data Structure

**Offer Type** (`types/index.ts`):
```typescript
export type Offer = {
  id: string;
  requestId: string;
  requestCode?: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  status?: "pending" | "accepted" | "declined" | "rejected";
  createdAt: Timestamp;
  // New fields
  proposedDates?: string[]; // Array of ISO date strings
  infoRequest?: string;
  dataUnlocked?: boolean;
};
```

### Components

1. **RequestsView** (`components/company/RequestsView.tsx`)
   - Main component for viewing customer requests
   - Includes OfferForm, OfferList, OfferItem, CustomerDataSection

2. **CustomerDataSection**
   - Manages data visibility
   - Handles unlock simulation
   - Shows limited or full customer information

3. **OfferForm**
   - Collapsible advanced options
   - Date picker inputs (up to 3)
   - Info request textarea
   - Form validation

4. **OfferItem**
   - Display offer details
   - Show proposed dates and info requests
   - Edit/delete functionality

### Future Enhancements

The current implementation includes placeholders for:

1. **Real Payment Processing**
   - Integrate Stripe or PayPal
   - Process actual payments for data unlocking
   - Store transaction history

2. **Persistent Unlock Status**
   - Store unlock status in Firestore
   - Track which companies unlocked which requests
   - Prevent duplicate charges

3. **Communication System**
   - Allow back-and-forth messaging
   - Notifications for new messages
   - Email notifications

4. **Analytics & Reporting**
   - Track conversion rates
   - Date acceptance statistics
   - Revenue forecasting
   - Performance metrics over time

5. **Enhanced Filtering**
   - Filter by location
   - Filter by date range
   - Filter by service type
   - Save filter preferences

## Accessibility

All features have been designed with accessibility in mind:
- No emoji characters that interfere with screen readers
- Proper text labels on all interactive elements
- Keyboard navigation support
- ARIA labels where appropriate
- High contrast color schemes
- Clear visual hierarchy

## Performance

- Real-time updates via Firestore listeners
- Efficient pagination (10 items per page)
- Infinite scroll for seamless browsing
- Optimistic UI updates for better UX
- Minimal re-renders with React hooks

## Security

- Role-based access control (RequireRole component)
- Companies can only edit/delete their own offers
- Customer data is protected until unlocked
- No security vulnerabilities detected (CodeQL scan passed)
