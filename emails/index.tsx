import { Html } from '@react-email/html'
import { Button } from '@react-email/button'

export default function Welcome({ name, signupLink }) {
  return (
    <Html>
      <h1>Welcome to Growsmart, {name}!</h1>
      <p>
        Your account has been created. To get started, please click the button
        below to log in:
      </p>
      <Button href={signupLink}>Log In to Your Account</Button>
    </Html>
  )
}
