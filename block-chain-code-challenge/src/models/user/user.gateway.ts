import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";

/*
|--------------------------------------------------------------------------
| ******* Documentation *********
| To join a room use: socket.join(roomName);
| To send an event to a particular Socket: socket.emit(event, payload);
| To send event to other members of a room use: socket.broadcast.to(chat_room_name).emit('event-name', payload);
| To send event to all members in a room use: io.to('roomName').emit('event-name', jsonObject);
|
| Create a private room that would accommodate the initiating User and the selected friend.
| This would enable sent messages to be sent to the room harboring only the two Users.
|--------------------------------------------------------------------------
*/

@WebSocketGateway({
  namespace: '/negotiation',
  cors: {
    origin: '*',
    credentials: true,
  },
  allowEIO3: true,
})
export class UserGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {

    return 'Hello world!';
  }
}
