import sgMail from "@sendgrid/mail";

// Définition de l'interface SendGridError
export interface SendGridError extends Error {
  response?: {
    body: {
      errors: Array<{
        message: string;
        field: string;
        help?: string;
      }>;
    };
  };
}

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY manquante");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  console.log("🚀 Début envoi email avec SendGrid");
  console.log("📧 Email destinataire:", email);
  console.log("🔗 Lien de vérification:", verificationLink);

  const msg = {
    to: email,
    from: {
      email: "franckick2@gmail.com", // Votre email vérifié sur SendGrid
      name: "Estate",
    },
    subject: "Vérifiez votre adresse email - Estate App",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6D28D9; text-align: center;">
          🏠 Estate App - Vérification Email
        </h2>
        
        <p style="color: #374151; line-height: 1.5;">
          Bonjour ${name},<br>
          Merci de vous être inscrit ! Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}"
             style="background-color: #6D28D9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Vérifier mon compte
          </a>
        </div>

        <p style="color: #6B7280; font-size: 14px; text-align: center;">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
          <span style="color: #374151;">${verificationLink}</span>
        </p>
      </div>
    `,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ Email envoyé avec succès:", response);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur SendGrid:", error);
    const sendGridError = error as SendGridError;
    if (sendGridError.response?.body) {
      console.error("📝 Détails de l'erreur:", sendGridError.response.body);
    }
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};
