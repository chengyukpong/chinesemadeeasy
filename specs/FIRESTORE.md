# Firestore

## Setup Procedures

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project**
3. Enter project name: `chinesemadeeasy`
4. Disable Google Analytics (optional)
5. Click **Create project**

### 2. Create Web App

1. In Firebase Console, click **Web** icon (`</>`)
2. Enter app nickname: `chinesemadeeasy-web`
3. Check **Also set up Firebase Hosting** (optional)
4. Click **Register app**
5. Copy the `firebaseConfig` values
6. Create `public/config.json` with your config (see [PROJECT.md](PROJECT.md#config-format) for format)

### 3. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add authorized domain: `localhost`
4. Save

### 4. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose location (e.g., `us-central1`)
3. Start in **production mode**
4. Enable

### 5. Set Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

### 6. Create Composite Index

1. Go to **Firestore Database** → **Indexes**
2. Add composite index:
   - Collection: `todos`
   - Fields: `userId` (Ascending) + `createdAt` (Descending)
3. Click **Create**

---

## Enabled Features

| Feature | Status | Usage |
|---------|--------|-------|
| Firestore Database | Enabled | Production mode |
| Real-time listeners | Enabled | `onSnapshot` for live todo updates |
| Queries | Enabled | `where` + `orderBy` filtering |
| Composite index | Enabled | Required for userId + createdAt query |
| Security rules | Enabled | Per-user data isolation |

## Collections

### `todos`

Schema defined in [`src/entities/todo.ts`](../src/entities/todo.ts)

**Document path:** `todos/{todoId}`

## Indexes

| Collection | Fields | Order |
|------------|--------|-------|
| `todos` | `userId` (ASC) | `createdAt` (DESC) |

Required for query: `where("userId", "==", uid)` + `orderBy("createdAt", "desc")`

## Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

| Operation | Condition |
|-----------|-----------|
| Read | Authenticated + owner |
| Create | Authenticated |
| Update | Authenticated + owner |
| Delete | Authenticated + owner |

## Costs

- Pay per read, write, delete
- Real-time listeners count as reads on each update
- Free tier: 50K reads/day, 20K writes/day
