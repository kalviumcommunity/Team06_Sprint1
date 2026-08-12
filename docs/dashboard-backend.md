# Dashboard Backend Documentation

## Overview
This document outlines the backend foundation built for the User Dashboard. It provides read-only API endpoints for populating the dashboard UI, standardized responses, and a reliable seeding script for test data. 

**Note**: Authentication, authorization, and write operations belong to other modules and are intentionally excluded here.

## Prisma Models
The dashboard relies on the following Prisma models to fetch data:
- **User**: The central entity, though the dashboard APIs currently return all mock data without filtering by user ID (pending auth module integration).
- **Subscription**: Contains `medicine`, `frequency`, `nextDelivery`, and `status`.
- **Delivery**: Contains `name`, `quantity`, `date`, and `status`.
- **Order**: Contains `orderNumber`, `medicine`, `amount`, `status`, and `deliveredDate`.
- **Reminder**: Contains `medicine` and `time`.
- **Product**: Contains `name`, `price`, `originalPrice`, `discount`, `rating`, `image`, and `tag`.
- **Category**: Contains `name`, `description`, and `href`.

## Response Formats
All dashboard APIs return a standardized JSON structure ensuring consistency across the frontend.

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [...] // Array or Object depending on endpoint. Null-safe (returns [] or null if empty).
}
```

**Failure Response (500 Internal Server Error)**:
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## API Endpoints

### `GET /api/dashboard/subscriptions`
Returns a list of all subscriptions.
- **Sorting**: `createdAt` descending.
- **Null Safety**: Returns `[]` if no subscriptions exist.

### `GET /api/dashboard/deliveries`
Returns a list of upcoming deliveries.
- **Sorting**: `date` ascending.
- **Null Safety**: Returns `[]` if no deliveries exist.

### `GET /api/dashboard/orders`
Returns a list of user orders.
- **Sorting**: `createdAt` descending.
- **Null Safety**: Returns `[]` if no orders exist.

### `GET /api/dashboard/reminder`
Returns the most recent reminder.
- **Sorting**: `createdAt` descending (fetches the first).
- **Null Safety**: Returns `null` if no reminder exists.

### `GET /api/dashboard/products`
Returns a list of products.
- **Sorting**: `createdAt` descending.
- **Null Safety**: Returns `[]` if no products exist.

### `GET /api/dashboard/categories`
Returns a list of product categories.
- **Null Safety**: Returns `[]` if no categories exist.

### `GET /api/dashboard/summary`
Returns aggregated count data for the dashboard summary cards.
- **Data**: 
  - `activeSubscriptions`: Count of subscriptions where `status === "Active"`.
  - `upcomingDeliveries`: Count of deliveries where `status` is `"Processing"` or `"Out for Delivery"`.
  - `totalOrders`: Count of all orders.
- **Null Safety**: Returns `0` for counts if no matching records exist.

Example Response:
```json
{
  "success": true,
  "data": {
    "activeSubscriptions": 2,
    "upcomingDeliveries": 1,
    "totalOrders": 15
  }
}
```

## Seed Command
A robust seed script is provided to populate the database with realistic sample data. 

**Execution**:
Run the following command in the project root:
```bash
npx tsx --env-file=.env prisma/seed.ts
```

**Features**:
- Automatically wipes old data for `Reminder`, `Order`, `Delivery`, `Subscription`, `User`, `Product`, and `Category` before inserting to prevent duplicate entries on repeated runs.
- Does not contain complex authentication data (uses placeholder for password) as auth belongs to a separate module.
- Fully idempotent.
