import {
  Body,
  Container,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  verificationLink: string;
  userName: string;
}

export const VerificationEmail = ({
  verificationLink,
  userName,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Preview>Vérifiez votre adresse email pour Century 21</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Bonjour {userName},</Text>
          <Text style={paragraph}>
            Merci de vous être inscrit sur Century 21. Pour activer votre
            compte, veuillez cliquer sur le lien ci-dessous :
          </Text>
          <Link href={verificationLink} style={button}>
            Vérifier mon email
          </Link>
          <Text style={paragraph}>
            Si vous n&apos;avez pas créé de compte, vous pouvez ignorer cet
            email.
          </Text>
          <Text style={footer}>Ce lien expirera dans 24 heures.</Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 40px 0",
};

const paragraph = {
  margin: "0 40px 20px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#484848",
};

const button = {
  backgroundColor: "#8b5cf6",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "14px",
  margin: "20px auto",
};

const footer = {
  fontSize: "14px",
  color: "#999",
  margin: "20px 40px",
};
