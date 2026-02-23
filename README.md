# Volunteering-Social-Media

## Firebase Auth setup

1. Create a Firebase project in the Firebase Console.
2. In **Authentication** → **Sign-in method**, enable **Email/Password** and **Google**.
3. In **Project settings** → **General** → **Your apps**, create a Web app and copy the config values.
4. Open `script.js` and replace:
	- `YOUR_API_KEY`
	- `YOUR_PROJECT_ID`
	- `YOUR_APP_ID`
5. Serve the project with a local web server (not by opening `index.html` directly), for example:

```bash
npx serve .
```

Then open the local URL, create an account with email/password, sign in, sign in with Google, and sign out.