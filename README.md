# 📁 FileHub — Collaborative File Management & Project Sharing Platform


<a href="https://filehub-gamma.vercel.app/">FileHub</a> is a full-stack file collaboration platform built with React and Firebase that enables users to create or join projects, securely upload and share files, manage collaborators with granular access control, and maintain a trash and restore system with automatic cleanup.
<br/>
<br/>
<img src="https://github.com/user-attachments/assets/5d6b6a4e-a0a8-487e-b2b6-c2d0d3df85f1" width="380px"/>
<img src="https://github.com/user-attachments/assets/26f6a202-833c-4d86-901e-54c3774ba2e7" width="380px"/>
![image](https://github.com/user-attachments/assets/1215e66e-70ea-419d-aeba-da51817da691)

## 🧱 Tech Stack

| Layer         | Technologies                              |
| :-------------- | :--------------------------------------- |
| Frontend           | React.js, Tailwind CSS |
| Authentication           | Firebase Auth (Google OAuth popup) |
| Database           | Firebase Firestore |
| Storage |	Firebase Storage |
| Hosting |	Firebase Hosting |

<h2>🚀 Features</h2>

<h3>🔐 Authentication</h3>

- Firebase Authentication with Google sign-in popup.
- Extensible to multiple providers (GitHub, Microsoft, etc.) via Firebase Auth.
- User sessions are persisted for smooth re-logins.

<h3>🧑‍🤝‍🧑 Project Management</h3>

- Create new projects or join existing ones via invite link.
- The project creator is automatically assigned the Admin role.
- Admins can invite new members by sharing a generated invite link.

<h3>🗂️ File Management</h3>

- Upload, view, copy links, and delete files (up to 10 MB per file).
- Multimedia Upload ( Includind Video, Image, Audio, Files )
- Deleted files move to a Trash section for 15 days, after which they’re automatically removed.
- Files in trash can be restored anytime before expiry.
- Includes a JSON View tab where all project files are displayed in JSON format (filename + link) — making it easy to reuse or integrate file data into other applications

<h3>🧾 Role-Based Authorization</h3>

- FileHub supports three roles with distinct permissions (Role	Privileges):
  - Admin:	Full control — delete project, promote/demote/remove members, upload/download/delete any files.
  - Moderator:	Manage members (promote/demote), upload/download/delete files, cannot delete the project.
  - Member:	Can view and download files only.

<h3>🧹 Automated Maintenance</h3>

- Files in trash older than 15 days are automatically deleted on login.
- Upload validation prevents files larger than 10 MB.

<h3>🧑‍💻 Future Enhancements</h3>

- Integrate more OAuth providers (GitHub, Microsoft, etc.)
- Add email notifications for file uploads or role changes.
- Enable folder structure for advanced file organization.
- Add activity logs (audit trail for uploads/deletions).
- Migrate to a custom GCP bucket instead of default Firebase Storage to use Lifecycle Management Policies to auto-delete files older than 15 days for scalableity 
  

### Cloning the repository

```shell
git clone https://github.com/Omkar-kamble82/Filehub.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_RESEND_KEY=
```


### Start the app

```shell
npm run dev
```


## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
