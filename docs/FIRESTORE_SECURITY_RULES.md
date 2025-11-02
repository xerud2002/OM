# Firestore Security Rules Documentation

## Overview
The Firestore security rules implement a robust permission system with role-based access control, preventing unauthorized data access and ensuring data integrity.

## Architecture

### Role System
- **Customers**: Create requests, manage their own data
- **Companies**: View active requests, create offers
- **Dual-role prevention**: Users cannot be both customer and company

### Helper Functions
```javascript
function isSignedIn() { return request.auth != null; }
function isCustomer() { return exists(/databases/$(database)/documents/customers/$(request.auth.uid)); }
function isCompany() { return exists(/databases/$(database)/documents/companies/$(request.auth.uid)); }
```

## Collections Security

### 1. Customers Collection (`/customers/{customerId}`)
- **Read**: Owner only (`request.auth.uid == customerId`)
- **Create**: Owner only + no dual-role (`canCreateCustomer()`)
- **Update**: Owner only
- **Delete**: Forbidden (data retention)

### 2. Companies Collection (`/companies/{companyId}`)
- **Read**: Owner only
- **Create**: Owner only + no dual-role (`canCreateCompany()`)
- **Update**: Owner only
- **Delete**: Forbidden (data retention)

#### Company Notifications Subcollection
- **Read**: Company owner only
- **Write**: Forbidden (server-managed via API routes)

### 3. Requests Collection (`/requests/{requestId}`)
- **Read**: 
  - Request owner (customer)
  - Companies (for active, non-archived requests only)
- **Create**: Customers only (`isCustomer()` + owner validation)
- **Update**: Request owner only
- **Delete**: Forbidden (use `archived` flag)

#### Offers Subcollection (`/requests/{requestId}/offers/{offerId}`)
- **Read**: 
  - Offer creator (company)
  - Request owner (customer)
- **Create**: Companies only (`isCompany()` + owner validation)
- **Update**:
  - Company: Own offers only
  - Customer: Can update status (accept/decline)
- **Delete**: Forbidden

### 4. Upload Tokens Collection (`/uploadTokens/{tokenId}`)
- **Read/Write**: Forbidden (API routes with Admin SDK only)
- Used for secure media upload links with expiration

### 5. Meta Collection (`/meta/{docId}`)
- **Read/Write**: Customers only
- Used for sequence counters (request ID generation)

## Firebase Storage Rules

### Request Media (`/requests/{requestId}/customers/{customerId}/{filename}`)
- **Read**: Any authenticated user (companies need to view media)
- **Write/Delete**: File owner only (`customerId` must match `request.auth.uid`)

### Company Assets (`/companies/{companyId}/{filename}`)
- **Read**: Public (company logos)
- **Write/Delete**: Company owner only

### Customer Assets (`/customers/{customerId}/{filename}`)
- **Read**: Any authenticated user
- **Write/Delete**: Customer owner only

## Security Considerations

### ✅ Implemented Protections
1. **Role separation**: Cannot be both customer and company
2. **Data isolation**: Users only see their own data
3. **Archive pattern**: No hard deletes, uses `archived` flag
4. **Server-managed data**: Upload tokens, notifications via API routes
5. **Path-based storage security**: File ownership validation

### ⚠️ Potential Improvements
1. **Request visibility**: Companies can see all active requests (by design for matching)
2. **Media access**: Any authenticated user can read media (necessary for offers)
3. **Rate limiting**: Consider API-level rate limiting for offer creation

## Deployment Commands

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules  
firebase deploy --only storage

# Deploy both
firebase deploy --only firestore:rules,storage
```

## Testing Rules

```bash
# Install emulator
npm install -g firebase-tools

# Start emulator with rules
firebase emulators:start --only firestore,storage

# Test in browser
http://localhost:4000/firestore
```

## Common Patterns

### Customer Operations
```javascript
// Create request (customer only)
allow create: if isSignedIn() && isCustomer() && 
  request.resource.data.customerId == request.auth.uid;

// Read own data
allow read: if isSignedIn() && request.auth.uid == customerId;
```

### Company Operations  
```javascript
// Read active requests (companies only)
allow read: if isSignedIn() && isCompany() && 
  !(resource.data.archived == true);

// Create offer (company only)
allow create: if isSignedIn() && isCompany() && 
  request.resource.data.companyId == request.auth.uid;
```

### Cross-collection Validation
```javascript
// Verify request ownership for offer access
get(/databases/$(database)/documents/requests/$(requestId)).data.customerId == request.auth.uid
```

Last updated: November 2, 2025