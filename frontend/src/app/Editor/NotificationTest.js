import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Notifications from './Notifications';
import firebase from 'firebase/app';
import 'firebase/firestore';

jest.mock('firebase/app', () => ({
  firestore: jest.fn(),
}));

const mockCollection = jest.fn();
const mockGet = jest.fn();
const mockOnSnapshot = jest.fn();

beforeEach(() => {
  firebase.firestore.mockReturnValue({
    collection: mockCollection,
  });
  mockCollection.mockReturnValue({
    orderBy: jest.fn().mockReturnThis(),
    get: mockGet,
    onSnapshot: mockOnSnapshot,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders notifications correctly', async () => {
  mockGet.mockResolvedValueOnce({
    docs: [
      {
        id: '1',
        data: () => ({
          message: 'Test Notification 1',
          timestamp: new Date('2024-03-10T12:00:00'),
          read: false,
        }),
      },
      {
        id: '2',
        data: () => ({
          message: 'Test Notification 2',
          timestamp: new Date('2024-03-11T09:30:00'),
          read: true,
        }),
      },
    ],
  });

  const { getByText, queryByText } = render(<Notifications />);

  // Check if notifications are rendered correctly
  await waitFor(() => {
    expect(getByText('Test Notification 1')).toBeInTheDocument();
    expect(getByText('Test Notification 2')).toBeInTheDocument();
  });

  // Check if timestamps are displayed correctly
  expect(getByText('March 10, 2024, 12:00:00 PM')).toBeInTheDocument();
  expect(getByText('March 11, 2024, 9:30:00 AM')).toBeInTheDocument();

  // Check if unread notification has correct styling
  expect(getByText('Test Notification 1')).toHaveClass('unread');
  expect(queryByText('Test Notification 2')).not.toHaveClass('unread');
});

test('marks notification as read when clicked', async () => {
  const mockUpdate = jest.fn();
  mockOnSnapshot.mockImplementation(callback => {
    // Simulate a change in the notifications
    callback({
      docs: [
        {
          id: '1',
          data: () => ({
            message: 'Test Notification 1',
            timestamp: new Date('2024-03-10T12:00:00'),
            read: false,
          }),
        },
      ],
    });

    return jest.fn();
  });
  firebase.firestore.mockReturnValue({
    collection: mockCollection,
  });
  mockCollection.mockReturnValue({
    doc: jest.fn().mockReturnValue({
      update: mockUpdate,
    }),
  });

  const { getByText } = render(<Notifications />);

  const notification = getByText('Test Notification 1');
  fireEvent.click(notification);

  await waitFor(() => {
    expect(mockUpdate).toHaveBeenCalledWith({ read: true });
  });
});
