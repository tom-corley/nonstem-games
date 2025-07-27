# Project Alpha – Geography Game MVP  
**Team of 5** | Week 5 | Full Stack App  

---

## 🧭 Problem Statement

Students at the Hive group of secondary schools are struggling to engage with non-STEM subjects. Traditional teaching methods are repetitive and often fail to create lasting interest or knowledge retention in areas like Geography. Our solution is a game that encourages interactive learning through map-based challenges, making non-STEM content more enjoyable.

---

## 💡 Solution Proposal

To improve engagement in Geography lessons, we will create a browser-based educational game where students identify countries by their outline and match them to capitals. The game will:
- Be accessible via login
- Present country outlines as visual challenges
- Track player scores and progress
- Store questions and answers in a database
- Display a leaderboard to encourage friendly competition

The MVP will focus on **one game** only: identifying countries and capitals.

---

## 👥 Stakeholder Analysis

| Stakeholder        | Interest Level | Influence Level | Needs                                                  | Our Approach                      |
|--------------------|----------------|------------------|---------------------------------------------------------|-----------------------------------|
| **Students**       | High           | Medium           | Fun, engaging way to revise geography                  | Provide interactive gameplay with points and ranking |
| **Teachers**       | High           | Medium           | Improved retention and tools to reinforce knowledge    | Clear educational value and tracking features |
| **Parents**        | Medium         | Low              | Confidence in their child’s learning and enjoyment     | Simple and safe platform, visible progress |
| **School Management** | High       | High             | Long-term engagement in non-STEM subjects              | A scalable game that can evolve into other subjects |
| **Development Team**| High          | High             | Clear scope, achievable goals in one week              | Defined user stories, MVP-first mindset |

---

## 🌐 High-Level Solution Diagram

```plaintext
+--------------------+           +---------------------+
|    User Browser    |  <--->    |   Frontend (HTML,   |
|  (Game UI, Forms)  |           |   CSS, JavaScript)  |
+--------------------+           +---------------------+
            |                             |
            v                             v
+---------------------------------------------------+
|           Express Backend (Node.js)               |
|   - User Routes: Register, Login, Profile         |
|   - Game Routes: Get Questions, Submit Answers    |
|   - Controller & Model for Users, Questions       |
+---------------------------------------------------+
            |
            v
+--------------------------+
|   PostgreSQL Database    |
|   - users                |
|   - country_questions    |
|   - scores               |
+--------------------------+
