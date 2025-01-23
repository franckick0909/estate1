"use client";

import Image from "next/image";
import { useState } from "react";
import { MdClose, MdSend } from "react-icons/md";

export default function Chat() {
  const [activeChat, setActiveChat] = useState<boolean>(true);
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full">
      {/* Section Messages - Toujours visible */}
      <div
        className={`flex flex-col ${
          activeChat ? "h-[40%]" : "h-full"
        } transition-all duration-300`}
      >
        <h2 className="text-xl text-gray-800 font-semibold p-4">Messages</h2>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-violet-50 hover:scrollbar-thumb-violet-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div
              key={item}
              onClick={() => setActiveChat(true)}
              className="flex items-center gap-4 p-4 hover:bg-indigo-50 cursor-pointer border-b transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                  alt="user"
                  width={48}
                  height={48}
                  className="object-cover rounded-full w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">Jane Doe</h3>
                <p className="text-gray-600 truncate text-sm">
                  Dernier message reçu...
                </p>
              </div>
              <span className="text-xs text-gray-500">14:30</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section Chat - Visible uniquement quand activeChat est true */}
      {activeChat && (
        <div className="flex flex-col h-1/2 border-t border-indigo-400">
          <h2 className="text-xl text-gray-800 font-semibold p-4">Chat</h2>
          {/* En-tête du chat */}
          <div className="flex items-center justify-between p-4 bg-indigo-300 rounded-t-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                  alt="user"
                  width={40}
                  height={40}
                  className="object-cover rounded-full w-full h-full"
                />
              </div>
              <span className="font-medium text-gray-800">Jane Doe</span>
            </div>
            <button
              type="button"
              aria-label="Fermer le chat"
              title="Fermer le chat"
              onClick={() => setActiveChat(false)}
              className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
            >
              <MdClose className="text-xl text-gray-800" />
            </button>
          </div>

          {/* Zone des messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-violet-50 hover:scrollbar-thumb-violet-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full bg-white">
            <div className="self-start max-w-[80%] bg-green-100 rounded-lg p-3">
              <p className="text-gray-800">
                Bonjour! Comment puis-je vous aider?
              </p>
              <span className="text-xs text-gray-500 mt-1">14:30</span>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-blue-100 rounded-lg p-3">
                <p className="text-gray-800">
                  Je voudrais plus d&apos;informations sur le logement.
                </p>
                <span className="text-xs text-gray-500 mt-1">14:31</span>
              </div>
            </div>
            <div className="self-start max-w-[80%] bg-green-100 rounded-lg p-3">
              <p className="text-gray-800">
                Bonjour! Comment puis-je vous aider?
              </p>
              <span className="text-xs text-gray-500 mt-1">14:30</span>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-blue-100 rounded-lg p-3">
                <p className="text-gray-800">
                  Je voudrais plus d&apos;informations sur le logement.
                </p>
                <span className="text-xs text-gray-500 mt-1">14:31</span>
              </div>
            </div>
          </div>

          {/* Zone de saisie */}
          <div className="border-t border-indigo-300 p-2 bg-white">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 resize-none p-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-violet-300 text-gray-700"
                rows={2}
              />
              <button
                type="submit"
                aria-label="Envoyer le message"
                title="Envoyer le message"
                onClick={() => setMessage("")}
                disabled={!message}
                className="bg-indigo-400 text-white px-4 rounded-sm hover:bg-indigo-500 disabled:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <MdSend />
                <span className="hidden sm:inline">Envoyer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
