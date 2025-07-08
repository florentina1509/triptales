# TripTales

TripTales is a travel-based social app where users can log their trips, keep a wishlist of dream destinations, and unlock achievements as they explore. Users can post their trips and personalise their profile.

This was created as my Project 2 for General Assembly’s Software Engineering Bootcamp. Built using the MEN stack (MongoDB, Express, Node.js) with EJS templating and Cloudinary for media uploads.

---

## Features

- Full authentication (sign up, log in, log out)
- Create a user profile with profile photo
- Add, edit, and delete trips (with photos or videos)
- Like and comment on other users' trips
- Create a wishlist of places you want to visit
- Add upcoming trips with notes and dates
- Unlock achievements as you post more trips
- Follow and unfollow users
- Filter homepage by “All” or “Following”
- Fully responsive design with mobile navigation

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS Templating
- Cloudinary + Multer for file uploads
- express-session for user auth
- Flexbox & CSS Grid for layout

---

## Models

### User

```js
{
  username: String,
  email: String,
  password: String (hashed),
  profilePicture: String,
  wishlist: [String],
  achievements: [String],
  followers: [ObjectId],
  following: [ObjectId]
}
```

### Trip

```js
{
  title: String,
  location: String,
  description: String,
  date: Date,
  photo: String,
  media: [{ url: String, type: String }],
  user: ObjectId,
  likes: [ObjectId],
  comments: [ObjectId]
}
```

---

## Authentication

Session-based authentication using `express-session`.

Only logged-in users can create, edit, or delete their own trips, wishlist items, and upcoming trips.  
Users can follow others and see a feed of trips from people they follow.

---

## Achievements

Users earn badges automatically as they post more trips:

- **New Explorer** – 1+ trip
- **Globetrotter** – 3+ trips
- **World Wanderer** – 5+ trips

Achievements appear automatically on the user’s profile once unlocked.

---

## Data Strategy

- Trips reference the User (`user: ObjectId`)
- Comments and Likes are stored as arrays of references
- Wishlist is embedded in the User model
- Achievements are stored as an array of strings

---

## Sample Routes

| Method | Route           | Description             |
|--------|------------------|-------------------------|
| GET    | /trips           | View all trips          |
| POST   | /trips           | Create a new trip       |
| GET    | /trips/:id/edit  | Edit an existing trip   |
| PUT    | /trips/:id       | Update a trip           |
| DELETE | /trips/:id       | Delete a trip           |
| POST   | /likes/:id       | Like a trip             |
| POST   | /comments/:id    | Add a comment to a trip |

---

## Screenshots

_Add screenshots here using Markdown:_

```md
![Homepage](./public/images/screenshot-homepage.png)
![Profile](./public/images/screenshot-profile.png)
```

---

## Planning Docs

- [TripTales PLAN updated.docx](https://github.com/user-attachments/files/21120499/TripTales.PLAN.updated.docx)
- [Wireframes (Excalidraw)](https://excalidraw.com/#json=eTlcGe3wLjTy5RC6pqpOH,sXSFQvN9sUnvLAzT4GMy6Q)

---

## Future Features

These are features I plan to add in future updates:

- Integrate Google Maps to display trip locations visually
- Improve user profiles to show followers/following lists with links
- Allow users to send direct messages to each other

---

## Made By

**Florentina Ramadani**
