import {
  qrLoginCheckApi,
  qrLoginRequestApi,
} from '#/services/apis/security/qr-login';
import { decryptQrData } from '#/utils/decrypt-qr-data';
import { usePostAuthNavigation } from '#/hooks/use-post-auth-navigation';
import { confirmSignIn, signIn } from 'aws-amplify/auth';
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import { cn } from '#/lib/utils';
import { getErrorMessage } from '#/utils/get-error-message';
import type { QrLoginSessionData } from '#/services/apis/security/qr-login';
import { useAuth } from '#/stores/auth-store.ts';

export default function QrLogin() {
  const [qrCode] = useState<QRCodeStyling>(
    new QRCodeStyling({
      width: 200,
      height: 200,
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
      dotsOptions: {
        type: 'square',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#000000' },
            { offset: 1, color: '#000000' },
          ],
        },
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 2,
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#000000' },
            { offset: 1, color: '#000000' },
          ],
        },
      },
      cornersDotOptions: {
        type: 'dot',
        color: '#000000',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    }),
  );
  const ref = useRef<HTMLDivElement>(null);
  const [secret, setSecret] = useState<QrLoginSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useAuth();
  const goToPostLoginDestination = usePostAuthNavigation();

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  const initQr = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await qrLoginRequestApi();
      if (res?.data?.session) {
        const secretKey =
          import.meta.env.VITE_QR_LOGIN_SECRET_KEY || 'XMETA_SECRET_KEY';
        const decrypted = await decryptQrData(res.data.session, secretKey);
        setSecret(decrypted as QrLoginSessionData);
        qrCode.update({
          data: res.data.session,
        });
      } else {
        throw new Error('No session data received from server');
      }
    } catch (err) {
      console.error('Failed to initialize QR:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initQr();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      if (!secret || error) return;

      try {
        const res = await qrLoginCheckApi({
          sessionId: secret.id,
          nonce: secret.nonce,
        });
        if (res?.data?.isLogin) {
          clearInterval(intervalId);
          await completeLogin({
            uid: res.data.userId,
            sessionId: secret.id,
          });
          // Small delay lets the refresh token propagate before navigating.
          setTimeout(() => {
            void goToPostLoginDestination();
          }, 500);
        }
      } catch (err) {
        console.error('Login check error:', err);
      }
    };
    if (secret && !error) {
      intervalId = setInterval(checkStatus, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [secret, error, goToPostLoginDestination]);

  const completeLogin = async ({
    uid,
    sessionId,
  }: {
    uid: string;
    sessionId: string;
  }) => {
    try {
      const signInResult = await signIn({
        username: uid,
        options: {
          authFlowType: 'CUSTOM_WITHOUT_SRP',
        },
      });

      if (
        signInResult.nextStep.signInStep ===
        'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
      ) {
        const res = await confirmSignIn({
          challengeResponse: sessionId,
          options: {
            clientMetadata: {
              sessionId: sessionId,
            },
          },
        });
        if (res.isSignedIn) {
          await refresh();
        }
      }
    } catch (err) {
      console.error('QR login failed:', err);
    }
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center rounded-3xl p-4 transition-all duration-500',
      )}
    >
      <div className="flex flex-col items-center mb-8 space-y-2 z-10">
        <div className="flex items-center space-y-1">
          <div className="relative flex items-center justify-center">
            <div
              className={cn(
                'absolute h-3 w-3 rounded-full animate-ping',
                loading
                  ? 'bg-violet-400'
                  : error
                    ? 'bg-red-400'
                    : 'bg-emerald-400',
              )}
            />
            <div
              className={cn(
                'relative h-2 w-2 rounded-full',
                loading
                  ? 'bg-violet-500'
                  : error
                    ? 'bg-red-500'
                    : 'bg-emerald-500',
              )}
            />
          </div>
          <span className="ml-3 text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">
            {loading
              ? 'Initializing...'
              : error
                ? 'System Error'
                : 'Ready to Scan'}
          </span>
        </div>
        <h2 className="text-xl font-bold bg-clip-text">Secure Login</h2>
      </div>
      <div className="relative z-10">
        <div
          className={cn(
            'relative rounded-3xl bg-white shadow-[0_0_40px_rgba(0,0,0,0.03)] border border-gray-100/50',
            'transition-transform duration-500 group-hover:scale-[1.02]',
          )}
        >
          <div
            ref={ref}
            className={cn(
              'w-[230px] h-[230px] transition-all duration-700 rounded-2xl overflow-hidden flex justify-center items-center',
              loading || error ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
            )}
          />
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20 rounded-3xl">
              <ScaleLoader
                color="#6d55d1"
                height={30}
                width={4}
                radius={4}
                margin={4}
              />
              <p className="mt-4 text-[12px] font-medium text-purple-600/60 animate-pulse">
                Establishing tunnel...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
