import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';  // Adjust the import path according to your project structure
import '@testing-library/jest-dom';
import { useRouter } from "next/navigation";
import { auth } from "@/firebase-config";
import { onAuthStateChanged, signInWithPopup, GithubAuthProvider } from "firebase/auth";

// Mocking useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mocking auth functions
jest.mock('@/firebase-config', () => ({
  auth: {
    signInWithPopup: jest.fn(),
  },
  GithubAuthProvider: jest.fn(),
}));

// Mocking onAuthStateChanged
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn().mockImplementation((auth, callback) => {
    callback(null); // Simulates user not signed in
    return jest.fn(); // Mocks the unsubscribe function
  }),
  signInWithPopup: jest.fn(),
  GithubAuthProvider: jest.fn(),
}));

describe('Home', () => {
  it('renders login button and allows user to attempt GitHub login', async () => {
    render(<Home />);

    const loginButton = screen.getByRole('button', { name: /login with github/i });
    expect(loginButton).toBeInTheDocument();

    // Simulate a user clicking the login button
    fireEvent.click(loginButton);

    // signInWithPopup should be called since the button's onClick is triggered
    expect(auth.signInWithPopup).toHaveBeenCalled();
  });
});
