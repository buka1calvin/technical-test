import { useAuth } from "@/src/context/auth.context";
import Button from "@/src/layout/button.layout";
import Card from "@/src/layout/card.layout";
import Container from "@/src/layout/container.layout";
import Input from "@/src/layout/input.layout";
import MarketingSection from "@/src/layout/section-marketing.layout";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>("");

  const { login } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is Required!");
    }
    if (!validateEmail(email)) {
      setError("Email must be a Valid Email!!");
    }
    try {
      setIsLoading(true);
      await login(email);
      router.push("/");
    } catch (error) {
      console.log("failed to Log In User!!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container.Split
    left={<MarketingSection/>}
    right={
        <Card variant="elevated" padding="lg" rounded="xl">
          <form onSubmit={handleSubmit}>
            <Card.Header>
              <Card.Title>Welcome Back</Card.Title>
            </Card.Header>
            
            <Card.Content>
              <Input
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email address"
                error={error}
                disabled={isLoading}
              />
              
              <p>We'll create an account for you if this is your first time.</p>
            </Card.Content>

            <Card.Footer>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={!email || isLoading}
              >
                Continue with Email
              </Button>
            </Card.Footer>
          </form>
        </Card>
    }
    />
  )
}
