import { motion } from 'framer-motion'
import { memo } from 'react'

/**
 * Animated Button Component
 */
export const MotionButton = memo(({ children, onClick, style, whileHover = {}, whileTap = {}, delay = 0, ...props }) => (
  <motion.button
    onClick={onClick}
    style={style}
    whileHover={{ scale: 1.02, ...whileHover }}
    whileTap={{ scale: 0.98, ...whileTap }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.button>
))

MotionButton.displayName = 'MotionButton'

/**
 * Animated Card Component
 */
export const MotionCard = memo(({ children, style, delay = 0, onClick, ...props }) => (
  <motion.div
    style={style}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3, ease: 'easeOut' }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    onClick={onClick}
    {...props}
  >
    {children}
  </motion.div>
))

MotionCard.displayName = 'MotionCard'

/**
 * Animated Modal Component
 */
export const MotionModal = memo(({ isOpen, onClose, children, style }) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={style}
      >
        {children}
      </motion.div>
    </motion.div>
  )
})

MotionModal.displayName = 'MotionModal'

/**
 * Animated Container for Lists
 */
export const MotionContainer = memo(({ children, delay = 0, style, ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.3 }}
    style={style}
    {...props}
  >
    {children}
  </motion.div>
))

MotionContainer.displayName = 'MotionContainer'

/**
 * Staggered List Animation
 */
export const StaggerContainer = memo(({ children, delay = 0 }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay
        }
      }
    }}
  >
    {children}
  </motion.div>
))

StaggerContainer.displayName = 'StaggerContainer'

/**
 * Staggered Item Animation
 */
export const StaggerItem = memo(({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    }}
  >
    {children}
  </motion.div>
))

StaggerItem.displayName = 'StaggerItem'

/**
 * Page Transition Animation
 */
export const PageTransition = memo(({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ delay, duration: 0.4 }}
  >
    {children}
  </motion.div>
))

PageTransition.displayName = 'PageTransition'

/**
 * Hover Scale Effect
 */
export const HoverScale = memo(({ children, scale = 1.05, ...props }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: scale * 0.98 }}
    {...props}
  >
    {children}
  </motion.div>
))

HoverScale.displayName = 'HoverScale'

/**
 * Preset animation variants
 */
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 }
  },
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 }
  }
}

/**
 * Button Variants for Framer Motion
 */
export const buttonVariants = {
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
  },
  tap: {
    scale: 0.98
  }
}

/**
 * Card Variants for Framer Motion
 */
export const cardVariants = {
  hover: {
    y: -4,
    boxShadow: '0 12px 24px rgba(0,168,168,0.12)'
  }
}
