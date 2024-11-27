// 'use client'

// import { motion, AnimatePresence } from 'framer-motion'
// import { usePathname } from 'next/navigation'

// export const PageTransition = ({ children }: { children: React.ReactNode }) => {
//   const pathname = usePathname()

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={pathname}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.3 }}
//       >
//                         <main className="relative flex justify-center min-h-screen overflow-hidden">
//                 {children}
//               </main>    
//       </motion.div>
//     </AnimatePresence>
//   )
// }

