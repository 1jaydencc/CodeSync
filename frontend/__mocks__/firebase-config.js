export const auth = {
  signInWithPopup: jest.fn(() => Promise.resolve({ user: { uid: '123' } })),
};

export const db = {};