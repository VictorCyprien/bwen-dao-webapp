/**
 * Unified Design System
 * 
 * This file contains reusable CSS classes for common components and patterns.
 * It ensures visual consistency throughout the application.
 */

// Common container classes
export const containers = {
  page: "flex flex-col min-h-screen bg-background text-text",
  section: "w-full mb-6",
  content: "p-6",
  
  // Card variants
  card: "bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60 transition-all duration-200",
  cardHighlight: "bg-[#111]/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-700/60 hover:border-purple-800/60 transition-all duration-200",
  cardHeader: "flex justify-between items-center mb-5",
  cardTitle: "font-medium text-white",
  cardContent: "text-sm text-gray-300",
  cardFooter: "mt-4 pt-4 border-t border-gray-800/60 flex justify-between items-center",
  
  // Grid layouts
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  gridWide: "grid grid-cols-1 md:grid-cols-3 gap-6",
  gridTwoThirdsOneThird: "grid grid-cols-1 md:grid-cols-3 gap-6",
  
  // Flex layouts
  flexRow: "flex flex-row items-center",
  flexBetween: "flex justify-between items-center",
  flexCenter: "flex justify-center items-center",
  flexColumn: "flex flex-col",
};

// UI components
export const ui = {
  // Headers and navigation
  header: "w-full p-2 bg-[#0c0c0c]/80 backdrop-blur-sm border-b border-gray-800/40",
  sidebar: "bg-[#0c0c0c] border-r border-gray-800/40",
  
  // Buttons
  button: {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200",
    secondary: "bg-[#222]/80 hover:bg-[#333]/80 text-white font-medium py-2 px-4 rounded-lg border border-gray-700/40 transition-all duration-200",
    outline: "bg-transparent hover:bg-[#222]/40 text-white font-medium py-2 px-4 rounded-lg border border-gray-700 transition-all duration-200",
    icon: "bg-[#1A1A1A] hover:bg-[#222] p-2 rounded-full text-gray-300 hover:text-white transition-all duration-200",
    menu: "flex items-center gap-2 bg-[#111]/60 backdrop-blur-sm text-white py-1.5 px-3 rounded-full hover:bg-[#222]/60 transition-colors border border-gray-800/60",
    action: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-full text-sm transition-colors",
    vote: "bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1 px-4 rounded-md text-xs font-medium hover:opacity-90 transition-all",
  },
  
  // Form elements
  input: "bg-[#111]/80 border border-gray-800/60 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-all duration-200",
  select: "bg-[#111]/80 border border-gray-800/60 rounded-lg px-4 py-2 text-white appearance-none focus:outline-none focus:border-purple-500 transition-all duration-200",
  
  // Status indicators
  badge: {
    primary: "bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs",
    success: "bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-xs",
    warning: "bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full text-xs",
    error: "bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full text-xs",
    neutral: "bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded-full text-xs",
  },
  
  // Chart and data visualization
  chart: {
    container: "h-full flex items-center justify-center",
    legend: "flex flex-col gap-1.5 ml-6",
    legendItem: "flex items-center text-xs text-gray-300",
    legendColor: "h-2.5 w-2.5 rounded-full mr-2",
  },
  
  // Stats display
  stat: {
    container: "flex flex-col",
    value: "text-2xl font-bold text-white",
    label: "text-xs text-gray-400 mt-1",
    positive: "text-green-400",
    negative: "text-red-400",
  },
  
  // Tables
  table: {
    container: "w-full border-collapse",
    header: "text-left text-xs text-gray-400 border-b border-gray-800/60 pb-2",
    row: "border-b border-gray-800/20 hover:bg-[#222]/30 transition-colors",
    cell: "py-3 text-sm",
  },
  
  // Gradients
  gradients: {
    purple: "bg-gradient-to-r from-purple-600 to-blue-600",
    blue: "bg-gradient-to-r from-blue-600 to-cyan-600",
    green: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
};

// Typography styles
export const typography = {
  h1: "text-3xl font-bold text-white",
  h2: "text-2xl font-bold text-white",
  h3: "text-xl font-medium text-white",
  h4: "text-lg font-medium text-white",
  body: "text-sm text-gray-300",
  small: "text-xs text-gray-400",
  label: "text-xs text-gray-400",
  gradient: "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500",
};

// Utility classes for common patterns
export const utils = {
  glassmorphism: "bg-[#111]/80 backdrop-blur-sm border border-gray-800/60",
  scrollHidden: "scrollbar-hide overflow-auto",
  truncate: "truncate",
  ellipsis: "overflow-hidden text-ellipsis whitespace-nowrap",
  transition: "transition-all duration-200",
  hoverHighlight: "hover:bg-[#222]/60 transition-colors",
  shadow: "shadow-lg shadow-black/40",
};

// Exporting combined object for easier importing
const theme = {
  containers,
  ui,
  typography,
  utils,
};

export default theme; 