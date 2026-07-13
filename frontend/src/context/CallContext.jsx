import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CallContext = createContext();

export const useCall = () => useContext(CallContext);

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
};

export const CallProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  const [callState, setCallState] = useState("idle"); // 'idle' | 'incoming' | 'outgoing' | 'connected'
  const [callType, setCallType] = useState(null); // 'audio' | 'video'
  const [otherUser, setOtherUser] = useState(null); // { id, username, avatarUrl }
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const otherUserRef = useRef(null);
  const queuedCandidatesRef = useRef([]);

  // Keep otherUser ref in sync for WebRTC handlers
  useEffect(() => {
    otherUserRef.current = otherUser;
  }, [otherUser]);

  const processQueuedCandidates = async () => {
    if (pcRef.current && pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
      while (queuedCandidatesRef.current.length > 0) {
        const candidate = queuedCandidatesRef.current.shift();
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding queued ice candidate", e);
        }
      }
    }
  };

  // Clean up streams on unmount or when call ends
  const cleanupStreams = () => {
    queuedCandidatesRef.current = [];
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming call
    socket.on("incoming-call", async ({ from, offer, type, callerName, callerAvatar }) => {
      if (callState !== "idle") {
        // Busy
        return;
      }
      setCallType(type);
      setOtherUser({ _id: from, username: callerName, avatarUrl: callerAvatar });
      setCallState("incoming");

      // Initialize peer connection in background, store offer
      pcRef.current = new RTCPeerConnection(servers);
      
      // Handle candidates
      pcRef.current.onicecandidate = (event) => {
        if (event.candidate && otherUserRef.current) {
          socket.emit("ice-candidate", {
            to: otherUserRef.current._id,
            candidate: event.candidate,
          });
        }
      };

      pcRef.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        await processQueuedCandidates();
      } catch (err) {
        console.warn("Failed to set remote description on incoming offer:", err);
      }
    });

    // Listen for call answered (outgoing flow)
    socket.on("call-answered", async ({ answer }) => {
      if (pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          await processQueuedCandidates();
        } catch (err) {
          console.warn("Failed to set remote description on answered call:", err);
        }
        setCallState("connected");
      }
    });

    // Listen for ICE candidates
    socket.on("ice-candidate", async ({ candidate }) => {
      if (pcRef.current && pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      } else {
        queuedCandidatesRef.current.push(candidate);
      }
    });

    // Listen for call ended
    socket.on("call-ended", () => {
      toast.info("Call ended");
      setCallState("idle");
      cleanupStreams();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [socket, callState]);

  // Start outgoing call
  const startCall = async (targetUserId, type, targetUserName, targetUserAvatar) => {
    if (!socket) return;
    setCallType(type);
    setOtherUser({ _id: targetUserId, username: targetUserName, avatarUrl: targetUserAvatar });
    setCallState("outgoing");

    let stream = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: type === "video",
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
      } else {
        console.warn("navigator.mediaDevices is not supported in this environment");
      }
    } catch (err) {
      console.warn("Failed to start call media stream:", err);
      toast.info("Using avatar fallback (Camera/Mic blocked or unavailable)");
    }

    try {
      // Create PeerConnection
      const pc = new RTCPeerConnection(servers);
      pcRef.current = pc;

      if (stream) {
        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      }

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            to: targetUserId,
            candidate: event.candidate,
          });
        }
      };

      // Handle remote track
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      // Create Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Emit call signal
      socket.emit("call-user", {
        to: targetUserId,
        offer,
        type,
        callerName: currentUser.username,
        callerAvatar: currentUser.avatarUrl,
      });
    } catch (err) {
      console.error("WebRTC offer setup failed:", err);
      toast.error("Failed to establish WebRTC signal.");
      setCallState("idle");
      cleanupStreams();
    }
  };

  // Accept incoming call
  const acceptCall = async () => {
    if (!socket || !otherUser) return;

    let stream = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: callType === "video",
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
      }
    } catch (err) {
      console.warn("Failed to accept call media stream:", err);
      toast.info("Connected (Camera/Mic blocked or unavailable)");
    }

    try {
      // Add local tracks to our pre-configured RTCPeerConnection
      if (pcRef.current) {
        if (stream) {
          stream.getTracks().forEach((track) => pcRef.current.addTrack(track, stream));
        }

        let answer;
        try {
          answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
        } catch (e) {
          console.warn("Failed to create RTC answer, using fallback:", e);
          answer = { type: "answer", sdp: pcRef.current.localDescription?.sdp || "" };
        }

        // Emit answer
        socket.emit("answer-call", {
          to: otherUser._id,
          answer,
        });

        setCallState("connected");
      }
    } catch (err) {
      console.error("WebRTC answer setup failed:", err);
      toast.error("Failed to establish WebRTC connection.");
      declineCall();
    }
  };

  // Decline/End call
  const declineCall = () => {
    if (socket && otherUser) {
      socket.emit("end-call", { to: otherUser._id });
    }
    setCallState("idle");
    cleanupStreams();
  };

  const endCall = () => {
    declineCall();
  };

  return (
    <CallContext.Provider
      value={{
        callState,
        callType,
        otherUser,
        localStream,
        remoteStream,
        startCall,
        acceptCall,
        declineCall,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
