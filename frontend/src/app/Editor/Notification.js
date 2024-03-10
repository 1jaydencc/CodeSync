import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import './App.css'; // Import your CSS file

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from Firestore
    const fetchNotifications = async () => {
      try {
        const snapshot = await firebase.firestore().collection('notifications').orderBy('timestamp', 'desc').get();
        const notificationsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, message: data.message, timestamp: data.timestamp.toDate(), read: data.read };
        });
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Subscribe to realtime updates
    const unsubscribe = firebase.firestore().collection('notifications').onSnapshot(snapshot => {
      const notificationsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, message: data.message, timestamp: data.timestamp.toDate(), read: data.read };
      });
      setNotifications(notificationsData);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await firebase.firestore().collection('notifications').doc(notificationId).update({ read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notifications-overlay">
      <div className="notifications-container">
        <h2>Notifications</h2>
        <ul>
          {notifications.map(notification => (
            <li key={notification.id} className={notification.read ? '' : 'unread'} onClick={() => markAsRead(notification.id)}>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-timestamp">{notification.timestamp.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
