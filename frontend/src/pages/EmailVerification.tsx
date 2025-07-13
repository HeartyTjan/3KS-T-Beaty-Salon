import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import ThreeJSBackground from "@/components/ThreeJSBackground";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage("Invalid verification link. Please check your email for the correct link.");
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setVerificationStatus('loading');
      const response = await api.post('/users/verify-email', { token });
      
      if (response.data.success) {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
        setErrorMessage(response.data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error('Email verification error:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('expired')) {
        setVerificationStatus('expired');
        setErrorMessage("This verification link has expired. Please request a new one.");
      } else {
        setVerificationStatus('error');
        setErrorMessage(error.response?.data?.message || "Verification failed. Please try again.");
      }
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setErrorMessage("Email address not found. Please try registering again.");
      return;
    }

    try {
      setIsResending(true);
      setResendSuccess(false);
      await api.post('/users/resend-verification', { email });
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error) {
      console.error('Resend verification error:', error);
      setErrorMessage(error.response?.data?.message || "Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const renderLoading = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Verifying Your Email</h2>
        <p className="text-muted-foreground">Please wait while we verify your email address...</p>
      </div>
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-2 text-green-600">Email Verified!</h2>
        <p className="text-lg text-muted-foreground mb-4">
          Congratulations! Your email has been successfully verified.
        </p>
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-4 h-4 mr-1" />
          Account Active
        </Badge>
      </div>
      <Card className="max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">What's Next?</h3>
          <div className="space-y-3 text-sm text-left">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <span>You can now log in to your account</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <span>Book appointments and track your services</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <span>Receive updates and special offers</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={() => navigate('/login')}
          className="brand-gradient text-white transition-all duration-200 hover:scale-105"
        >
          Log In Now
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/')}
          className="transition-all duration-200 hover:scale-105"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-12 h-12 text-red-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h2>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
      </div>
      <Card className="max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Need Help?</h3>
          <div className="space-y-3 text-sm text-left">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary" />
              <span>Check your spam folder for the verification email</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-primary" />
              <span>Request a new verification email</span>
            </div>
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-4 h-4 text-primary" />
              <span>Contact support if the issue persists</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={resendVerificationEmail}
          disabled={isResending}
          className="brand-gradient text-white transition-all duration-200 hover:scale-105"
        >
          {isResending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Resend Email
            </>
          )}
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/login')}
          className="transition-all duration-200 hover:scale-105"
        >
          Back to Login
        </Button>
      </div>
      {resendSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Verification email sent! Please check your inbox.</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderExpired = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-12 h-12 text-orange-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2 text-orange-600">Link Expired</h2>
        <p className="text-muted-foreground mb-4">
          This verification link has expired. Please request a new one.
        </p>
        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
          <XCircle className="w-4 h-4 mr-1" />
          Expired Link
        </Badge>
      </div>
      <Card className="max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Get a New Link</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We'll send you a fresh verification email that you can use to activate your account.
          </p>
          {email && (
            <div className="p-3 bg-muted rounded-lg mb-4">
              <p className="text-sm font-medium">Email: {email}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={resendVerificationEmail}
          disabled={isResending}
          className="brand-gradient text-white transition-all duration-200 hover:scale-105"
        >
          {isResending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send New Link
            </>
          )}
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/login')}
          className="transition-all duration-200 hover:scale-105"
        >
          Back to Login
        </Button>
      </div>
      {resendSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>New verification email sent! Please check your inbox.</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return renderLoading();
      case 'success':
        return renderSuccess();
      case 'error':
        return renderError();
      case 'expired':
        return renderExpired();
      default:
        return renderLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Email
            <span className="text-transparent bg-clip-text brand-gradient block">
              Verification
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {verificationStatus === 'loading' && "Verifying your email address..."}
            {verificationStatus === 'success' && "Your account is now verified!"}
            {verificationStatus === 'error' && "We encountered an issue with verification"}
            {verificationStatus === 'expired' && "Your verification link has expired"}
          </p>
        </div>
        
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-8">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
      <ThreeJSBackground />
    </div>
  );
};

export default EmailVerification; 