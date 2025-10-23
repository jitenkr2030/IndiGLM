import { Server } from 'socket.io';

interface UserSession {
  id: string;
  name: string;
  language: string;
  region: string;
  joinedAt: Date;
  isActive: boolean;
}

interface CollaborationRoom {
  id: string;
  name: string;
  participants: UserSession[];
  messages: Array<{
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    language: string;
    culturalContext: boolean;
  }>;
  sharedContext: {
    topic?: string;
    culturalTheme?: string;
    region?: string;
    objectives?: string[];
  };
  createdAt: Date;
}

interface IndiGLMMessage {
  id: string;
  type: 'user_message' | 'ai_response' | 'system_message' | 'collaboration_action';
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  language: string;
  culturalContext: boolean;
  region?: string;
  collaborationData?: {
    action: 'join' | 'leave' | 'typing' | 'stop_typing' | 'context_update';
    data?: any;
  };
}

const collaborationRooms = new Map<string, CollaborationRoom>();
const userSessions = new Map<string, UserSession>();

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle room creation
    socket.on('create_room', (data: { roomName: string; userName: string; language: string; region: string }) => {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userSession: UserSession = {
        id: socket.id,
        name: data.userName,
        language: data.language,
        region: data.region,
        joinedAt: new Date(),
        isActive: true
      };

      const room: CollaborationRoom = {
        id: roomId,
        name: data.roomName,
        participants: [userSession],
        messages: [],
        sharedContext: {
          region: data.region
        },
        createdAt: new Date()
      };

      collaborationRooms.set(roomId, room);
      userSessions.set(socket.id, userSession);

      socket.join(roomId);
      socket.emit('room_created', { roomId, room });
      
      console.log(`Room created: ${roomId} by ${data.userName}`);
    });

    // Handle joining existing room
    socket.on('join_room', (data: { roomId: string; userName: string; language: string; region: string }) => {
      const room = collaborationRooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      const userSession: UserSession = {
        id: socket.id,
        name: data.userName,
        language: data.language,
        region: data.region,
        joinedAt: new Date(),
        isActive: true
      };

      room.participants.push(userSession);
      userSessions.set(socket.id, userSession);

      socket.join(data.roomId);
      
      // Notify all participants
      const joinMessage: IndiGLMMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'collaboration_action',
        content: `${data.userName} joined the collaboration`,
        senderId: 'system',
        senderName: 'System',
        timestamp: new Date(),
        language: 'en',
        culturalContext: false,
        collaborationData: {
          action: 'join',
          data: { userName: data.userName, userId: socket.id }
        }
      };

      room.messages.push(joinMessage);
      io.to(data.roomId).emit('user_joined', { 
        user: userSession, 
        message: joinMessage,
        totalParticipants: room.participants.length 
      });

      // Send room history to new user
      socket.emit('room_history', {
        room: room,
        messages: room.messages
      });

      console.log(`User ${data.userName} joined room: ${data.roomId}`);
    });

    // Handle IndiGLM collaboration messages
    socket.on('indiglm_message', (data: { 
      roomId: string; 
      text: string; 
      language: string; 
      culturalContext: boolean;
      region?: string;
    }) => {
      const userSession = userSessions.get(socket.id);
      if (!userSession) return;

      const room = collaborationRooms.get(data.roomId);
      if (!room) return;

      const message: IndiGLMMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'user_message',
        content: data.text,
        senderId: socket.id,
        senderName: userSession.name,
        timestamp: new Date(),
        language: data.language,
        culturalContext: data.culturalContext,
        region: data.region || userSession.region
      };

      room.messages.push(message);

      // Broadcast to all participants in room
      io.to(data.roomId).emit('message', message);

      // Emit typing stopped
      socket.to(data.roomId).emit('user_stopped_typing', { userId: socket.id });

      console.log(`Message in room ${data.roomId} from ${userSession.name}: ${data.text}`);
    });

    // Handle AI response broadcasting
    socket.on('ai_response', (data: { 
      roomId: string; 
      response: string; 
      originalMessageId: string;
      language: string;
      culturalContext: boolean;
    }) => {
      const room = collaborationRooms.get(data.roomId);
      if (!room) return;

      const aiMessage: IndiGLMMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'ai_response',
        content: data.response,
        senderId: 'indiglm_ai',
        senderName: 'IndiGLM AI',
        timestamp: new Date(),
        language: data.language,
        culturalContext: data.culturalContext
      };

      room.messages.push(aiMessage);
      io.to(data.roomId).emit('ai_response', aiMessage);

      console.log(`AI response broadcasted to room ${data.roomId}`);
    });

    // Handle typing indicators
    socket.on('typing', (data: { roomId: string }) => {
      const userSession = userSessions.get(socket.id);
      if (!userSession) return;

      socket.to(data.roomId).emit('user_typing', { 
        userId: socket.id, 
        userName: userSession.name 
      });
    });

    socket.on('stop_typing', (data: { roomId: string }) => {
      socket.to(data.roomId).emit('user_stopped_typing', { userId: socket.id });
    });

    // Handle shared context updates
    socket.on('update_context', (data: { 
      roomId: string; 
      context: { 
        topic?: string; 
        culturalTheme?: string; 
        region?: string; 
        objectives?: string[] 
      } 
    }) => {
      const room = collaborationRooms.get(data.roomId);
      if (!room) return;

      room.sharedContext = { ...room.sharedContext, ...data.context };

      const contextMessage: IndiGLMMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'collaboration_action',
        content: 'Collaboration context updated',
        senderId: 'system',
        senderName: 'System',
        timestamp: new Date(),
        language: 'en',
        culturalContext: false,
        collaborationData: {
          action: 'context_update',
          data: data.context
        }
      };

      room.messages.push(contextMessage);
      io.to(data.roomId).emit('context_updated', { 
        context: data.context, 
        message: contextMessage 
      });

      console.log(`Context updated for room ${data.roomId}`);
    });

    // Handle room listing
    socket.on('list_rooms', () => {
      const roomsList = Array.from(collaborationRooms.values()).map(room => ({
        id: room.id,
        name: room.name,
        participantCount: room.participants.length,
        createdAt: room.createdAt,
        sharedContext: room.sharedContext
      }));

      socket.emit('rooms_list', roomsList);
    });

    // Handle leaving room
    socket.on('leave_room', (data: { roomId: string }) => {
      const room = collaborationRooms.get(data.roomId);
      if (!room) return;

      const userSession = userSessions.get(socket.id);
      if (!userSession) return;

      // Remove user from room
      room.participants = room.participants.filter(p => p.id !== socket.id);
      userSession.isActive = false;

      const leaveMessage: IndiGLMMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'collaboration_action',
        content: `${userSession.name} left the collaboration`,
        senderId: 'system',
        senderName: 'System',
        timestamp: new Date(),
        language: 'en',
        culturalContext: false,
        collaborationData: {
          action: 'leave',
          data: { userName: userSession.name, userId: socket.id }
        }
      };

      room.messages.push(leaveMessage);
      socket.leave(data.roomId);
      
      // Notify remaining participants
      io.to(data.roomId).emit('user_left', { 
        user: userSession, 
        message: leaveMessage,
        totalParticipants: room.participants.length 
      });

      // Delete room if empty
      if (room.participants.length === 0) {
        collaborationRooms.delete(data.roomId);
        console.log(`Room ${data.roomId} deleted (empty)`);
      }

      console.log(`User ${userSession.name} left room ${data.roomId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      const userSession = userSessions.get(socket.id);
      if (userSession) {
        userSession.isActive = false;
        
        // Find and remove user from all rooms
        for (const [roomId, room] of collaborationRooms.entries()) {
          const userIndex = room.participants.findIndex(p => p.id === socket.id);
          if (userIndex !== -1) {
            const [user] = room.participants.splice(userIndex, 1);
            
            const leaveMessage: IndiGLMMessage = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: 'collaboration_action',
              content: `${user.name} disconnected`,
              senderId: 'system',
              senderName: 'System',
              timestamp: new Date(),
              language: 'en',
              culturalContext: false,
              collaborationData: {
                action: 'leave',
                data: { userName: user.name, userId: socket.id }
              }
            };

            room.messages.push(leaveMessage);
            io.to(roomId).emit('user_left', { 
              user, 
              message: leaveMessage,
              totalParticipants: room.participants.length 
            });

            // Delete room if empty
            if (room.participants.length === 0) {
              collaborationRooms.delete(roomId);
              console.log(`Room ${roomId} deleted (empty after disconnect)`);
            }
          }
        }
        
        userSessions.delete(socket.id);
      }
    });

    // Send welcome message
    socket.emit('message', {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'system_message',
      content: 'Welcome to IndiGLM Collaboration Server! You can create or join collaboration rooms.',
      senderId: 'system',
      senderName: 'System',
      timestamp: new Date(),
      language: 'en',
      culturalContext: false
    });
  });
};