import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD0UdRmr0CM8ZlxuAeArIw2Pl5LiJAmZIg",
  authDomain: "shs-volunteering-app.firebaseapp.com",
  projectId: "shs-volunteering-app",
  storageBucket: "shs-volunteering-app.firebasestorage.app",
  messagingSenderId: "934222129506",
  appId: "1:934222129506:web:d23c9cc805f44b2183643b",
  measurementId: "G-CCWGVSE5WJ"
};


const configIsPlaceholder = Object.values(firebaseConfig).some((value) => value.startsWith('YOUR_'));

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signUpButton = document.getElementById('sign-up-btn');
const signInButton = document.getElementById('sign-in-btn');
const googleSignInButton = document.getElementById('google-sign-in-btn');
const signOutButton = document.getElementById('sign-out-btn');
const statusText = document.getElementById('status');
const googleProvider = new GoogleAuthProvider();

const setStatus = (message, isError = false) => {
	statusText.textContent = message;
	statusText.classList.toggle('error', isError);
};

const readCredentials = () => {
	const email = emailInput.value.trim();
	const password = passwordInput.value;

	if (!email || !password) {
		setStatus('Email and password are required.', true);
		return null;
	}

	return { email, password };
};

signUpButton.addEventListener('click', async () => {
	if (configIsPlaceholder) {
		setStatus('Add your Firebase config in script.js first.', true);
		return;
	}

	const credentials = readCredentials();
	if (!credentials) {
		return;
	}

	try {
		const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
		setStatus(`Account created for ${userCredential.user.email}.`);
	} catch (error) {
		setStatus(error.message, true);
	}
});

signInButton.addEventListener('click', async () => {
	if (configIsPlaceholder) {
		setStatus('Add your Firebase config in script.js first.', true);
		return;
	}

	const credentials = readCredentials();
	if (!credentials) {
		return;
	}

	try {
		const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
		setStatus(`Signed in as ${userCredential.user.email}.`);
	} catch (error) {
		setStatus(error.message, true);
	}
});

googleSignInButton.addEventListener('click', async () => {
	if (configIsPlaceholder) {
		setStatus('Add your Firebase config in script.js first.', true);
		return;
	}

	try {
		const userCredential = await signInWithPopup(auth, googleProvider);
		setStatus(`Signed in with Google as ${userCredential.user.email}.`);
	} catch (error) {
		setStatus(error.message, true);
	}
});

signOutButton.addEventListener('click', async () => {
	if (configIsPlaceholder) {
		setStatus('Add your Firebase config in script.js first.', true);
		return;
	}

	try {
		await signOut(auth);
		setStatus('Signed out.');
	} catch (error) {
		setStatus(error.message, true);
	}
});

onAuthStateChanged(auth, (user) => {
	const signedIn = Boolean(user);
	signOutButton.disabled = !signedIn;
	signInButton.disabled = signedIn;
	signUpButton.disabled = signedIn;
	googleSignInButton.disabled = signedIn;

	if (!signedIn) {
		if (configIsPlaceholder) {
			setStatus('Set Firebase config values in script.js to enable auth.', true);
		} else {
			setStatus('Not signed in');
		}
		return;
	}

	setStatus(`Authenticated as ${user.email}.`);
});