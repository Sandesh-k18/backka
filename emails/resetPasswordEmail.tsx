import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  username: string;
  resetLink: string;
}

export default function ResetPasswordEmail({ username, resetLink }: ResetPasswordEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset your password</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Reset your backKA password</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            We received a request to reset your password. Click the button below to proceed.
            This link will expire in 1 hour.
          </Text>
        </Row>
        <Row>
          <Button
            href={resetLink}
            style={{ color: '#ffffff', backgroundColor: '#4f46e5', padding: '10px 20px', borderRadius: '5px' }}
          >
            Reset Password
          </Button>
        </Row>
        <Row>
          <Text>If you did not request this, please ignore this email.</Text>
        </Row>
      </Section>
    </Html>
  );
}