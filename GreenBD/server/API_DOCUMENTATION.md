# GreenBD API Documentation

Base URL: `http://localhost:3000` (development)

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### POST /auth/register

Register a new user with phone number.

Request:
```json
{
  "phone": "+8801712345678",
  "name": "John Doe"
}
```

Response:
```json
{
  "message": "OTP sent to phone",
  "otpId": "uuid"
}
```

### POST /auth/verify-otp

Verify OTP and complete registration.

Request:
```json
{
  "phone": "+8801712345678",
  "otp": "123456"
}
```

Response:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "phone": "+8801712345678",
    "name": "John Doe",
    "role": "user",
    "points": 0
  }
}
```

### POST /auth/login

Login with phone number.

Request:
```json
{
  "phone": "+8801712345678"
}
```

Response:
```json
{
  "message": "OTP sent to phone",
  "otpId": "uuid"
}
```

### POST /auth/admin/login

Admin login with username and password.

Request:
```json
{
  "username": "admin",
  "password": "password"
}
```

Response:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "username": "admin",
    "role": "admin"
  }
}
```

### POST /auth/security/login

Security user login with user ID and password.

Request:
```json
{
  "userId": "SEC001",
  "password": "password"
}
```

Response:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "userId": "SEC001",
    "role": "security"
  }
}
```

## Users

### GET /users/me

Get current user profile.

Response:
```json
{
  "id": "uuid",
  "phone": "+8801712345678",
  "name": "John Doe",
  "role": "user",
  "points": 150,
  "grade": "bronze",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### PUT /users/me

Update current user profile.

Request:
```json
{
  "name": "John Smith",
  "avatar": "base64_image_data"
}
```

Response:
```json
{
  "id": "uuid",
  "name": "John Smith",
  "avatar": "https://cdn.example.com/avatar.jpg"
}
```

### GET /users/stats

Get user statistics.

Response:
```json
{
  "totalSubmissions": 25,
  "approvedSubmissions": 20,
  "pendingSubmissions": 3,
  "rejectedSubmissions": 2,
  "totalPoints": 150,
  "rank": 42
}
```

## Submissions

### POST /submissions

Create a new submission.

Request (multipart/form-data):
```
activityType: "recycling"
description: "Recycled plastic bottles"
location: {"lat": 23.8103, "lng": 90.4125}
media: [File, File]
```

Response:
```json
{
  "id": "uuid",
  "activityType": "recycling",
  "description": "Recycled plastic bottles",
  "status": "pending",
  "points": 0,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET /submissions

Get user's submissions.

Query params:
- `status`: pending | approved | rejected
- `page`: number (default: 1)
- `limit`: number (default: 20)

Response:
```json
{
  "submissions": [
    {
      "id": "uuid",
      "activityType": "recycling",
      "description": "Recycled plastic bottles",
      "status": "approved",
      "points": 10,
      "media": ["url1", "url2"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 2
}
```

### GET /submissions/:id

Get submission details.

Response:
```json
{
  "id": "uuid",
  "activityType": "recycling",
  "description": "Recycled plastic bottles",
  "status": "approved",
  "points": 10,
  "media": ["url1", "url2"],
  "location": {"lat": 23.8103, "lng": 90.4125},
  "reviewComment": "Great work!",
  "reviewedBy": "admin",
  "reviewedAt": "2024-01-01T01:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Points

### GET /points/history

Get points history.

Query params:
- `page`: number (default: 1)
- `limit`: number (default: 20)

Response:
```json
{
  "history": [
    {
      "id": "uuid",
      "points": 10,
      "type": "earned",
      "reason": "Submission approved",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 3
}
```

### GET /points/chart

Get points chart data.

Query params:
- `period`: week | month | year

Response:
```json
{
  "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "data": [10, 20, 15, 30, 25, 40, 35]
}
```

## Leaderboard

### GET /leaderboard

Get leaderboard.

Query params:
- `period`: week | month | all
- `limit`: number (default: 100)

Response:
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "uuid",
      "name": "John Doe",
      "avatar": "url",
      "points": 500
    }
  ],
  "userRank": {
    "rank": 42,
    "points": 150
  }
}
```

## Benefits

### GET /benefits

Get available benefits.

Response:
```json
{
  "benefits": [
    {
      "id": "uuid",
      "title": "10% Discount at EcoStore",
      "description": "Get 10% off on all products",
      "pointsRequired": 100,
      "category": "discount",
      "available": true
    }
  ]
}
```

### POST /benefits/:id/redeem

Redeem a benefit.

Response:
```json
{
  "id": "uuid",
  "benefitId": "uuid",
  "code": "DISCOUNT10",
  "redeemedAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-02-01T00:00:00Z"
}
```

### GET /benefits/redeemed

Get redeemed benefits.

Response:
```json
{
  "redeemed": [
    {
      "id": "uuid",
      "benefit": {
        "title": "10% Discount at EcoStore"
      },
      "code": "DISCOUNT10",
      "redeemedAt": "2024-01-01T00:00:00Z",
      "expiresAt": "2024-02-01T00:00:00Z",
      "used": false
    }
  ]
}
```

## Challenges

### GET /challenges

Get active challenges.

Response:
```json
{
  "challenges": [
    {
      "id": "uuid",
      "title": "Recycle 10 items",
      "description": "Recycle 10 items this week",
      "points": 100,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-07T23:59:59Z",
      "progress": 5,
      "target": 10,
      "completed": false
    }
  ]
}
```

### POST /challenges/:id/join

Join a challenge.

Response:
```json
{
  "id": "uuid",
  "challengeId": "uuid",
  "progress": 0,
  "joinedAt": "2024-01-01T00:00:00Z"
}
```

## Notifications

### GET /notifications

Get user notifications.

Query params:
- `unread`: boolean
- `page`: number (default: 1)
- `limit`: number (default: 20)

Response:
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Submission Approved",
      "body": "Your submission has been approved!",
      "type": "submission",
      "data": {"submissionId": "uuid"},
      "read": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

### PUT /notifications/:id/read

Mark notification as read.

Response:
```json
{
  "id": "uuid",
  "read": true
}
```

### POST /notifications/register-token

Register push notification token.

Request:
```json
{
  "token": "expo_push_token",
  "platform": "android"
}
```

Response:
```json
{
  "success": true
}
```

## Admin Endpoints

### GET /admin/users

Get all users (admin only).

Query params:
- `search`: string
- `role`: user | security | admin
- `page`: number (default: 1)
- `limit`: number (default: 20)

Response:
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "phone": "+8801712345678",
      "role": "user",
      "points": 150,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

### PUT /admin/users/:id/block

Block/unblock a user.

Request:
```json
{
  "blocked": true,
  "reason": "Spam submissions"
}
```

Response:
```json
{
  "id": "uuid",
  "status": "blocked"
}
```

### POST /admin/security-users

Create a security user.

Request:
```json
{
  "name": "Security User",
  "userId": "SEC001",
  "password": "generated_password"
}
```

Response:
```json
{
  "id": "uuid",
  "name": "Security User",
  "userId": "SEC001",
  "password": "generated_password",
  "role": "security"
}
```

### GET /admin/submissions/pending

Get pending submissions for review.

Response:
```json
{
  "submissions": [
    {
      "id": "uuid",
      "user": {
        "name": "John Doe",
        "phone": "+8801712345678"
      },
      "activityType": "recycling",
      "description": "Recycled plastic bottles",
      "media": ["url1", "url2"],
      "location": {"lat": 23.8103, "lng": 90.4125},
      "aiReview": {
        "score": 0.85,
        "flagged": false,
        "reason": null
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### PUT /admin/submissions/:id/review

Review a submission.

Request:
```json
{
  "status": "approved",
  "points": 10,
  "comment": "Great work!"
}
```

Response:
```json
{
  "id": "uuid",
  "status": "approved",
  "points": 10,
  "reviewComment": "Great work!"
}
```

### POST /admin/notices

Send a notice to all users.

Request:
```json
{
  "title": "New Feature",
  "body": "Check out our new challenges!",
  "type": "announcement"
}
```

Response:
```json
{
  "id": "uuid",
  "title": "New Feature",
  "sentTo": 1000,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Security Endpoints

### GET /security/submissions/flagged

Get flagged submissions for review.

Response:
```json
{
  "submissions": [
    {
      "id": "uuid",
      "user": {
        "name": "John Doe"
      },
      "activityType": "recycling",
      "media": ["url1", "url2"],
      "aiReview": {
        "score": 0.45,
        "flagged": true,
        "reason": "Low quality image"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### PUT /security/submissions/:id/review

Review a flagged submission.

Request:
```json
{
  "status": "approved",
  "comment": "Verified manually"
}
```

Response:
```json
{
  "id": "uuid",
  "status": "approved"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

Common error codes:
- `UNAUTHORIZED`: Missing or invalid token
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input
- `RATE_LIMIT`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API endpoints are rate limited:
- Authentication: 5 requests per minute
- Submissions: 10 requests per minute
- General: 100 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Pagination

Paginated endpoints return:

```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "pages": 10,
  "limit": 10
}
```

## File Uploads

File uploads use multipart/form-data:

- Max file size: 5MB (images), 50MB (videos)
- Supported formats: JPG, PNG, MP4, MOV
- Multiple files: Use array field name (e.g., `media[]`)

## Webhooks

Configure webhooks for events:

Events:
- `submission.created`
- `submission.approved`
- `submission.rejected`
- `user.registered`
- `points.earned`

Webhook payload:
```json
{
  "event": "submission.approved",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "points": 10
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```
