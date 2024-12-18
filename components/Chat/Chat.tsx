"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import profile from "@/public/default_profile.png";
import useWebSocketStore from "@/store/useSocketStore";
import DefaultProfile from "../UI/DefaultProfile";
import axiosInstance from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface props {
  chatRoomId: string;
  onSendMessage: ({
    chatRoomId,
    content,
  }: {
    chatRoomId: string;
    content: string;
  }) => void;
}

export default function Chat({ chatRoomId, onSendMessage }: props) {
  const [text, setText] = useState("");
  const { connect, messages, setAgoMessage, disconnect } = useWebSocketStore();

  useEffect(() => {
    // 숫자 부분만 chatroomid적어주면 됨
    if (chatRoomId) {
      connect("/backend" + "/ws", chatRoomId, (message) => {
        console.log("New message:", message.body);
      });
    }

    return () => {
      disconnect();
    };
  }, [chatRoomId]);

  // const { data: agoMessage } = useQuery({
  //   queryKey: ["agoMessage", chatRoomId],
  //   queryFn: async () => await axiosInstance.get(`/api/chatroom/${chatRoomId}`),
  //   staleTime: 10000,
  // });

  // useEffect(() => {
  //   if (agoMessage) {
  //     setAgoMessage(agoMessage.data);
  //   }
  // }, [agoMessage]);

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (text.trim().length === 0) {
      return;
    }
    //senderId랑 chatRoomId 1번 고정
    onSendMessage({ chatRoomId, content: text });
    setText("");
  };

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  const buttonStyle = text.trim().length ? "bg-blue-300" : "bg-gray-300";

  return (
    <form
      onSubmit={handleSubmitMessage}
      className="relative flex h-[100%] w-[70%] flex-col bg-blue-200 bg-opacity-40 p-4"
    >
      <div className="flex h-[calc(100%-10rem)] flex-col overflow-y-auto p-2 scrollbar-hide">
        {/* 채팅 데이터 받아오면 위에 코드로 교체 예정 */}
        {messages.map((chat) => {
          return chat.senderId === 1 ? (
            <div className="chat chat-start" key={chat.createdAt}>
              <div className="avatar chat-image">
                <DefaultProfile width="10" />
              </div>
              <div className="chat-header opacity-50">전민혁</div>
              <div className="chat-bubble bg-white text-gray-600">
                {chat.content}
              </div>
              <div className="chat-footer opacity-50">Deliverd</div>
            </div>
          ) : (
            <div className="chat chat-end" key={chat.createdAt}>
              <div className="avatar chat-image">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <div className="chat-header">
                Anakin
                <time className="text-xs opacity-50">12:46</time>
              </div>
              <div className="chat-bubble bg-blue-500 text-white">
                {chat.content}
              </div>
              <div className="chat-footer opacity-50">Seen at 12:46</div>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-0 left-0 flex h-40 w-full bg-white p-2">
        <textarea
          className="flex-[4] focus:outline-none"
          placeholder="메세지를 입력해주세요"
          onChange={handleText}
          onKeyDown={handleKeyDown}
          value={text}
        />
        <div className="flex flex-[1] items-center justify-center">
          <button
            type="submit"
            className="btn btn-info border-blue-500 bg-blue-500 text-white"
            disabled={text.trim().length === 0}
          >
            전송
          </button>
        </div>
      </div>
    </form>
  );
}
