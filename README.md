# TDDD27_2026

## Getting started


<!-- ## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.liu.se/deeso509/tddd27_2026/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html) -->
<!-- 
---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information. -->

## Name

LiU-Courses

## Description

A website that lets you keep up with your courses, HP:s and grades. It allows you to log in to save your progress and manually imput courses and programs.

By using Claude AI, we could create a JSON file for MT courses to start working with.


## Application Data Flow

The diagram below gives an overview of how data moves through the application. It shows how the user interacts with the React frontend, how Firebase handles authentication and database communication, how Firestore Security Rules control access, and how updated data is returned to the user interface.

The application uses local JSON files for static course data, while user-specific data such as saved courses, grades, sharing information, notifications, and course change requests are stored in Cloud Firestore.

![LiU-Courses data flow](tddd27-project/src/assets/images/liu_courses_data_flow.svg)

In this flow, Firebase Authentication identifies the logged-in user, while Firestore Security Rules use values such as `uid`, `isPublic`, and `sharedWith` to decide whether a database request should be allowed. Cloud Firestore stores both top-level collections and user-specific subcollections, and real-time listeners update the React interface when data changes.


### Features {what we have now! 1 June}

- User login with Firebase Authentication
- Select an engineering program from local JSON data
- Load courses automatically based on the selected program
- Search and select a course with component autocomplete
- Show course department automatically from the selected course data
- Display courses grouped by year and semester
- Show course cards with course code, name, credits, and period
- Save selected course data to Firebase per user and per education
- Store course grade, and rating
- Save public course ratings for shared course statistics (not implemented to focus on client to client functionality instead)
- Ability to set profile to private/public to change visibility in profile search
- The user can share its course plan with other users to propose changes
- The above is displayed in a "pending course changes" component and other notificatiosn can be seen in a similar component
- GitLab is connected to a GitHub repository that uses vercel to host a webpage for the project: https://tddd27.vercel.app/

### Firebase data structure {version 1 June}

User course data is stored under `users/{userId}/educations/{educationId}`. Each education has its own course collections, such as `mandatoryCourses` and `selectedCourses`, so changing or adding a new education does not overwrite previous data. Each course is saved by `courseId` and contains fields like `grade`, `notes`, and `rating`.

Public course ratings are also saved under `courseStats/{courseId}/ratings`, so everyone can view course statistics without seeing private user data.

Users visibility is stored under `users/{userId}/{isPublic}` and the user they have shared their porifle with, under `users/{userId}/{sharedWith}`.

## Installation

This project uses Node.js and npm, together with JavaScript libraries and tools defined in package.json, such as React, React Router, Firebase Authentication (including Google sign-in), Vite, and ESLint.



## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

* Public users can:
    * show specialization (plan)
    * allow others to see who selected the same course
* Ratings remain optionally anonymous depending on user privacy settings.
* Create tracking for HP:s requirments for CSN, doing the Bachelors/master thesis, etc.
* Be able to input peronal notes about each course
* Having public statistics of vourses based on users anonymous rating 


## Project status

Done. 