import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const videoRef= useRef(null);
  const startRef= useRef(null);
  const stopRef= useRef(null);
  const [downloadUrl, setDownloadUrl]= useState(null);
  const mediaRecorder= useRef(null);
  const videoChunks=useRef({});

  const streamStart=async()=>{
    const stream=await navigator.mediaDevices.getUserMedia({
      video:{
        width:{ideal:1920},
        height:{ ideal: 1080}
      },
      audio:true
    });
    videoRef.current.srcObject= stream;
  }

  const startRecording=()=>{
    const stream= videoRef.current.srcObject;
    mediaRecorder.current= new MediaRecorder(stream);
    videoChunks.current=[];
    
    mediaRecorder.current.start();

    mediaRecorder.current.ondataavailable=(e)=>{
      if(e.data.size>0){
        videoChunks.current.push(e.data);
      }
    }

    mediaRecorder.current.onstop=()=>{
      const blob= new Blob(videoChunks.current, {type:'video/webm'});
      const url= URL.createObjectURL(blob);
      setDownloadUrl(url)
    }
  }

  const stopRecording=()=>{
    if(mediaRecorder.current){
      mediaRecorder.current.stop();

    }
  }
  useEffect(()=>{
    streamStart();
  },[])
  return (
    <>
      <div className=''>
        <h1>WebRTC Streaming</h1>
        <video ref={videoRef} className='border w-full h-[500px]' autoPlay muted playsInline></video>
        <div className='flex justify-center gap-6.5'>
        <button ref={startRef} onClick={startRecording}>Start Recording</button>
        <button ref={stopRef} onClick={stopRecording}>Stop Recording</button>
        <a href={downloadUrl} download="recording.webm">Download</a>
        </div>
      </div>
    </>
  )
}

export default App
