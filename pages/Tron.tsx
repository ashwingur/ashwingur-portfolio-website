import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Socket, io } from "socket.io-client";
import { AiOutlineLoading } from "react-icons/ai";
import BasicNavbar from "../components/BasicNavbar";

interface AvailableRoomsResponse {
  rooms: Room[];
  connected_users: number;
}

interface Room {
  room_code: string;
  max_players: number;
  players: string[];
  game_started: boolean;
}

interface JoinRoomResponse {
  success: boolean;
  room?: Room;
  error?: string;
}

interface PingPacket {
  timestamp: number;
}

enum GAME_STATE {
  Connecting,
  Lobby,
  WaitingRoom,
  Game,
  GameOver,
}

const Tron = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GAME_STATE>(GAME_STATE.Connecting);
  const [room, setRoom] = useState<string | null>(null);
  const [roomInput, setRoomInput] = useState("");
  const [availableRooms, setAvailableRooms] = useState<AvailableRoomsResponse>({
    rooms: [],
    connected_users: 0,
  });
  const [latency, setLatency] = useState<number | null>(null);
  const [joinError, setJoinError] = useState(false);

  const createRoom = () => {
    socket?.emit("create_room", { max_players: 3 });
    socket?.emit("available_rooms");
  };
  const joinRoom = (room?: Room) => {
    if (room !== undefined) {
      socket?.emit("join_room", { room_code: room.room_code });
    } else {
      socket?.emit("join_room", { room_code: roomInput });
    }
    socket?.emit("room_details");
    socket?.emit("available_rooms");
  };

  const leaveRoom = () => {
    socket?.emit("leave_room");
    socket?.emit("available_rooms");
  };

  const updateRoomInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomInput(event.target.value.toUpperCase());
  };

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_ASHWINGUR_API}/tron`, {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    setGameState(GAME_STATE.Lobby);

    newSocket.emit("available_rooms");
    newSocket.emit("ping", { timestamp: Date.now() });

    const pingInterval = setInterval(() => {
      if (newSocket) {
        newSocket.emit("available_rooms");
        newSocket.emit("ping", { timestamp: Date.now() });
      }
    }, 3000);

    newSocket.on("pong", (data: PingPacket) => {
      setLatency(Date.now() - data.timestamp);
    });

    // Response to both create and join room
    newSocket.on("join_room", (data: JoinRoomResponse) => {
      if (data.success && data.room !== undefined) {
        setRoom(data.room.room_code);
        setRoomInput("");
        setJoinError(false);
        setGameState(GAME_STATE.WaitingRoom);
      } else if (!data.success) {
        setJoinError(true);
      }
    });

    newSocket.on("available_rooms", (data: AvailableRoomsResponse) => {
      setAvailableRooms(data);
    });

    newSocket.on("leave_room", () => {
      setRoom(null);
      setGameState(GAME_STATE.Lobby);
    });

    return () => {
      clearInterval(pingInterval);
      newSocket.close();
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#001724] to-[#001c26] h-screen text-slate-100 flex flex-col items-stretch">
      <BasicNavbar
        fixed={false}
        className="bg-slate-800/100 dark:bg-slate-800/100"
      />
      <h1 className="text-center mt-4">Tron</h1>
      {gameState !== GAME_STATE.Connecting && (
        <div className="flex gap-8 justify-center mt-2 md:mt-4 mb-2 font-mono">
          <div>Total Online: {availableRooms.connected_users}</div>
          <div className="w-20">ms: {latency ?? "NA"}</div>
        </div>
      )}
      {gameState === GAME_STATE.Connecting && (
        <div className="flex flex-col items-center text-3xl mt-8">
          <div>Connecting to server...</div>
          <AiOutlineLoading className="text-4xl animate-spin mt-4" />
        </div>
      )}
      {gameState === GAME_STATE.Lobby && (
        <div className="flex flex-col items-center justify-center gap-4 bg-black self-center w-11/12 lg:w-2/3 xl:w-2/5 p-4 md:p-8 mt-4 rounded-2xl border-4 border-tron-blue animate-pulse-glow">
          <button
            onClick={createRoom}
            disabled={room !== null}
            className="p-4 w-48 border-2 rounded-lg border-tron-orange shadow-glow-orange-md hover:shadow-glow-orange-2xl hover:text-tron-orange hover:font-bold transition-all text-lg"
          >
            Create Room
          </button>
          <button
            onClick={() => {
              joinRoom;
            }}
            disabled={room !== null}
            className="p-4 w-48 border-2 rounded-lg border-tron-orange shadow-glow-orange-md hover:shadow-glow-orange-2xl hover:text-tron-orange hover:font-bold transition-all text-lg mt-2"
          >
            Join Room
          </button>
          <div>
            <input
              value={roomInput}
              type="text"
              maxLength={4}
              placeholder="JOIN CODE"
              onChange={updateRoomInput}
              className="px-4 py-2 bg-slate-800 border-tron-blue border-2 rounded-lg shadow-glow-blue-lg text-center text-lg w-32 mt-2"
            />
          </div>
          <div className="w-full overflow-x-auto mt-4 border-tron-blue border-2 rounded-lg shadow-glow-blue-lg">
            <table className="w-full bg-slate-950 rounded-lg text-center">
              <thead>
                <tr>
                  <th className="px-4 py-4">Room</th>
                  <th className="px-4 py-4">Players</th>
                  <th className="px-4 py-4">Join</th>
                </tr>
              </thead>
              <tbody>
                {availableRooms.rooms.length === 0 ? (
                  <tr className="border-t border-tron-blue/40">
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-lg font-mono"
                    >
                      No rooms available
                    </td>
                  </tr>
                ) : (
                  availableRooms.rooms.map((room, index) => (
                    <tr key={index} className="border-t border-tron-blue/40">
                      <td className="px-4 py-2">{room.room_code}</td>
                      <td className="px-4 py-2">
                        {room.players.length}/{room.max_players}
                      </td>

                      <td className="px-4 py-2">
                        <button
                          onClick={() => joinRoom(room)}
                          disabled={room.game_started}
                          className={`p-2 rounded-lg bg-black border-tron-orange shadow-glow-orange transition-all ${
                            room.game_started
                              ? "cursor-not-allowed"
                              : "hover:shadow-glow-orange-md hover:text-tron-orange"
                          }`}
                        >
                          {room.game_started ? "In Progress" : "Join"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {gameState == GAME_STATE.WaitingRoom && (
        <div className="flex flex-col items-center justify-center gap-4 bg-black self-center w-11/12 lg:w-2/3 xl:w-2/5 p-4 md:p-8 mt-4 rounded-2xl border-4 border-tron-blue shadow-2xl shadow-tron-blue/50">
          <h2>Room: {room}</h2>
          <div className="font-mono text-xl">
            Players:{" "}
            {
              availableRooms.rooms.find((item) => item.room_code === room)
                ?.players.length
            }
            /
            {
              availableRooms.rooms.find((item) => item.room_code === room)
                ?.max_players
            }
          </div>
          <button
            onClick={leaveRoom}
            className="p-4 w-48 border-2 rounded-lg border-tron-orange shadow-md shadow-tron-orange hover:bg-tron-orange/20 transition-all text-lg"
          >
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
};

export default Tron;
