import { useRef, useState, useCallback } from "react";
import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Webcam from "react-webcam";

const videoConstraints = {
  width: 540,
  height: 360,
  facingMode: "user"
};

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  if (session && session.user) {
    return (
        <>
          <header>
            <h1>カメラアプリ</h1>
          </header>
          {isCaptureEnable || (
            <button onClick={() => setCaptureEnable(true)}>開始</button>
          )}
          {isCaptureEnable && (
            <>
              <button onClick={() => setCaptureEnable(false)}>終了</button>
              <Webcam
                audio={false}
                width={540}
                height={360}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
              <button onClick={capture}>キャプチャ</button>
            </>
          )}
          {url && (
            <>
              <button
                onClick={() => {
                  setUrl(null);
                }}
              >
                削除
              </button>
              <img src={url} alt="Screenshot" />
            </>
          )}
        </>
    )};
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default Home;