import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface GrowsmartWelcomeEmailProps {
  name: string
  signupLink: string
}

export const GrowsmartWelcomeEmail = ({
  name,
  signupLink,
}: GrowsmartWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      The crop production monitoring platform that helps you optimize your
      farming operations.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://growsmart.vercel.app/no-bg.png`}
          width='50'
          height='50'
          alt='Marinduque Provincial Agriculture Office Logo'
          style={logo}
        />
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
          Welcome to Growsmart, the farm monitoring platform designed to track
          the crops and farming activities of farmers, ensuring efficient
          monitoring of crop production across the province.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={signupLink}>
            Login
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          PAO Admin
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Capitol Compound, Boac, Philippines</Text>
        <Text style={disclaimer}>
          If you did not request this email, please disregard it.
        </Text>
      </Container>
    </Body>
  </Html>
)

GrowsmartWelcomeEmail.PreviewProps = {
  name: 'Alan',
} as GrowsmartWelcomeEmailProps

export default GrowsmartWelcomeEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const logo = {
  margin: '0 auto',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const btnContainer = {
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#556B2F',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}

const disclaimer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '20px',
}
