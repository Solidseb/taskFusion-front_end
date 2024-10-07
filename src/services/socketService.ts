import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('message', (data) => {
  console.log('Received message:', data);
});

export default socket;
