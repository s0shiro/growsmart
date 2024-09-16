// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//   Leaf,
//   BarChart2,
//   CloudSun,
//   Users,
//   Phone,
//   Mail,
//   MapPin,
// } from 'lucide-react'
// import Link from 'next/link'

// export default function LandingPage() {
//   return (
//     <div className='flex flex-col min-h-screen bg-gray-50'>
//       <header className='bg-green-800 text-white sticky top-0 z-50 shadow-md'>
//         <div className='container mx-auto px-4 py-4'>
//           <div className='flex justify-between items-center'>
//             <div className='flex items-center space-x-2'>
//               <Leaf className='h-8 w-8' />
//               <span className='text-2xl font-semibold'>GrowSmart</span>
//             </div>
//             <nav className='hidden md:flex space-x-6'>
//               <Link className='hover:underline' href='#about'>
//                 About
//               </Link>
//               <Link className='hover:underline' href='#services'>
//                 Services
//               </Link>
//               <Link className='hover:underline' href='#contact'>
//                 Contact
//               </Link>
//               <Link href='/login'>
//                 <Button variant='secondary' size='sm'>
//                   Login
//                 </Button>
//               </Link>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className='flex-grow'>
//         <section
//           className='bg-green-700 text-white py-16 bg-cover bg-center bg-blend-overlay bg-opacity-50'
//           style={{
//             backgroundImage:
//               "url('https://i.pinimg.com/736x/a8/1f/e9/a81fe95e5d694770eb9c5ff726c0d5b9.jpg')",
//           }}
//         >
//           <div className='container mx-auto px-4'>
//             <div className='max-w-2xl bg-green-800 bg-opacity-75 p-8 rounded-lg'>
//               <h1 className='text-4xl font-bold mb-4'>
//                 Crop Production Monitoring System
//               </h1>
//               <p className='text-xl mb-8'>
//                 Empowering our agricultural community with data-driven insights
//               </p>
//               <Button size='lg' asChild>
//                 <Link href='#services'>Learn More</Link>
//               </Button>
//             </div>
//           </div>
//         </section>

//         <section id='about' className='py-16'>
//           <div className='container mx-auto px-4'>
//             <h2 className='text-3xl font-semibold mb-8 text-center'>
//               About Our System
//             </h2>
//             <p className='text-lg text-gray-700 max-w-3xl mx-auto text-center'>
//               The Provincial Agriculture Office's Crop Production Monitoring
//               System is a state-of-the-art tool designed to support our local
//               farmers and agricultural officers. By providing real-time data and
//               analytics, we aim to enhance crop yields, optimize resource usage,
//               and promote sustainable farming practices across our province.
//             </p>
//           </div>
//         </section>

//         {/* <section id='services' className='py-16 bg-white'>
//           <div className='container mx-auto px-4'>
//             <h2 className='text-3xl font-semibold mb-8 text-center'>
//               Our Services
//             </h2>
//             <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
//               <Card>
//                 <CardHeader>
//                   <CardTitle className='flex items-center'>
//                     <BarChart2 className='h-6 w-6 mr-2 text-green-600' />
//                     Data Analytics
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>
//                     Access real-time data on crop growth, yield predictions, and
//                     resource utilization to make informed decisions.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle className='flex items-center'>
//                     <CloudSun className='h-6 w-6 mr-2 text-green-600' />
//                     Weather Insights
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>
//                     Get localized weather forecasts and climate data to plan
//                     your agricultural activities effectively.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle className='flex items-center'>
//                     <Users className='h-6 w-6 mr-2 text-green-600' />
//                     Community Support
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>
//                     Connect with agricultural officers and experts for guidance
//                     and knowledge sharing.
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section> */}

//         <section id='contact' className='py-16'>
//           <div className='container mx-auto px-4'>
//             <h2 className='text-3xl font-semibold mb-8 text-center'>
//               Contact Us
//             </h2>
//             <div className='grid md:grid-cols-2 gap-8'>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Get in Touch</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <form className='space-y-4'>
//                     <Input placeholder='Your Name' />
//                     <Input type='email' placeholder='Your Email' />
//                     <Input placeholder='Subject' />
//                     <textarea
//                       className='w-full p-2 border rounded-md'
//                       rows={4}
//                       placeholder='Your Message'
//                     ></textarea>
//                     <Button type='submit'>Send Message</Button>
//                   </form>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Contact Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <div className='flex items-center'>
//                     <Phone className='h-5 w-5 mr-2 text-green-600' />
//                     <span>+1 (123) 456-7890</span>
//                   </div>
//                   <div className='flex items-center'>
//                     <Mail className='h-5 w-5 mr-2 text-green-600' />
//                     <span>info@provincialagriculture.gov</span>
//                   </div>
//                   <div className='flex items-center'>
//                     <MapPin className='h-5 w-5 mr-2 text-green-600' />
//                     <span>123 Agriculture Street, Province City, Country</span>
//                   </div>
//                   <p className='text-sm text-gray-600 mt-4'>
//                     Office Hours: Monday to Friday, 8:00 AM to 5:00 PM
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>
//       </main>

//       <footer className='bg-green-800 text-white py-8'>
//         <div className='container mx-auto px-4'>
//           <div className='flex flex-col md:flex-row justify-between items-center'>
//             <div className='mb-4 md:mb-0'>
//               <p>
//                 &copy; 2023 Provincial Agriculture Office. All rights reserved.
//               </p>
//             </div>
//             <nav className='flex space-x-4'>
//               <Link className='hover:underline' href='#'>
//                 Privacy Policy
//               </Link>
//               <Link className='hover:underline' href='#'>
//                 Terms of Service
//               </Link>
//               <Link className='hover:underline' href='#'>
//                 Accessibility
//               </Link>
//             </nav>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }
import Hero from '@/components/Hero'
import LandingPage from '@/components/LandingPage'
import NavBar from '@/components/Navbar'

export default async function Index() {
  return (
    <div>
      <LandingPage />
      {/* <NavBar />
      <Hero /> */}
    </div>
  )
}
