"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ChatModalProps {
  adId: number;
  adTitle: string;
  sellerId: string;
  onClose: () => void;
}

export default function ChatModal({ adId, adTitle, sellerId, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initChat() {
      // 🚨 Check karein ke sellerId valid UUID hai ya nahi
      if (!sellerId || sellerId.length < 10) {
        alert("Yeh ad demo ya local hai, is par direct chat available nahi hai!");
        onClose();
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Chat karne ke liye pehle login karein!");
        onClose();
        return;
      }
      setCurrentUser(user);

      if (user.id === sellerId) {
        alert("Aap apne hi ad par chat nahi kar sakte!");
        onClose();
        return;
      }

      // Check karein kya pehle se chat mojod hai ya nahi
      let { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('ad_id', adId)
        .eq('buyer_id', user.id)
        .single();

      let currentChatId = existingChat?.id;

      if (!currentChatId) {
        // Nayi chat create karein
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert([{ ad_id: adId, buyer_id: user.id, seller_id: sellerId }])
          .select('id')
          .single();

        if (createError) {
          console.error(createError);
          alert("Chat start karne mein masla hua. Dubara koshish karein!");
          setLoading(false);
          onClose();
          return;
        }
        currentChatId = newChat.id;
      }

      setChatId(currentChatId);
      fetchMessages(currentChatId);
      setLoading(false);
    }

    initChat();
  }, [adId, sellerId, onClose]);

  const fetchMessages = async (cId: number) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', cId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !currentUser) return;

    const { error } = await supabase.from('messages').insert([{
      chat_id: chatId,
      sender_id: currentUser.id,
      message_text: newMessage.trim()
    }]);

    if (!error) {
      setNewMessage('');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', width: '450px', height: '550px', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        
        <div style={{ padding: '15px 20px', backgroundColor: '#002f34', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Chat with Seller</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '320px' }}>{adTitle}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>Loading chat...</div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>Koi message nahi hai. Pehla message bhejiye!</div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUser?.id;
              return (
                <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  <div style={{ backgroundColor: isMe ? '#002f34' : '#e2e8f0', color: isMe ? '#fff' : '#0f172a', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', wordBreak: 'break-word' }}>
                    {msg.message_text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={sendMessage} style={{ padding: '15px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Type a message..." 
            style={{ flex: 1, padding: '10px 15px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#002f34', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
        </form>

      </div>
    </div>
  );
}