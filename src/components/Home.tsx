import { useState, useRef, useEffect } from 'react';
import { 
  CircleDollarSign,
  Vote,
  Users,
  Activity,
  Loader,
  RefreshCw,
  LogIn,
  LogOut,
  Settings
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { treasuryService } from '../services/TreasuryService';
import { daosService } from '../services/DaosService';
import { userService } from '../services/UserService';
import { Treasury, Token, User } from '../core/modules/dao-api';
import { Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  ChartData,
  TooltipItem,
  ChartOptions,
  PointElement,
  LinearScale,
  CategoryScale,
  Title
} from 'chart.js';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolanaTransaction } from '../hooks/useSolanaTransaction';
import DaoUpdateModal from './DaoUpdateModal';
import { useAuth } from '../context/AuthContext';
import Button from './common/Button';
import { proposalService } from '../services/ProposalService';
import { SOLANA_RPC_ENDPOINT } from '../config/solana';
import PopupProposal from './PopupProposal';
import TokenCard from './TokenCard';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  PointElement,
  LinearScale,
  CategoryScale,
  Title
);

// Define the refresh interval in milliseconds (30 minute)
const REFRESH_INTERVAL = 1800000;

// Network Node Types
const NODE_TYPES = {
  REGION: 'region',
  MEMBER: 'member'
};

// Define regions with colors matching the image
const REGION_COLORS = {
  'North America': 'rgba(54, 162, 235, 0.7)',
  'Europe': 'rgba(255, 99, 132, 0.7)',
  'Asia': 'rgba(255, 206, 86, 0.7)',
  'South America': 'rgba(75, 192, 192, 0.7)',
  'Africa': 'rgba(153, 102, 255, 0.7)',
  'Oceania': 'rgba(255, 159, 64, 0.7)'
};

// Network visualization component
const NetworkVisualization = ({ memberLocations }: { memberLocations: {[key: string]: number} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [offset, setOffset] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const dotsRef = useRef<{[region: string]: {x: number, y: number, size: number}[]}>({});
  const renderRef = useRef<() => void>(() => {});
  
  // Generate static dot positions on mount only
  useEffect(() => {
    if (!Object.keys(memberLocations).length) return;
    
    // Only generate dots if we haven't generated them yet
    if (Object.keys(dotsRef.current).length === 0) {
      const dotPositions: {[region: string]: {x: number, y: number, size: number}[]} = {};
      
      Object.keys(memberLocations).forEach(region => {
        const dotCount = Math.min(Math.floor(memberLocations[region] / 30), 12);
        const dots: {x: number, y: number, size: number}[] = [];
        
        // Generate fixed positions for dots (using deterministic approach for consistency)
        for (let i = 0; i < dotCount; i++) {
          // Use a deterministic approach for positioning
          const angle = (2 * Math.PI * i) / dotCount;
          // Distance varies but is deterministic
          const distance = 0.6 * (0.7 + 0.3 * ((i * 7919) % 3)); // Using prime number 7919 for good distribution
          const dotSize = 1.5 + ((i * 104729) % 10) / 10; // Another prime number for variety
          
          dots.push({ 
            x: Math.cos(angle) * distance, 
            y: Math.sin(angle) * distance, 
            size: dotSize 
          });
        }
        
        dotPositions[region] = dots;
      });
      
      dotsRef.current = dotPositions;
    }
  }, [memberLocations]);
  
  // Setup and render visualization
  useEffect(() => {
    if (!canvasRef.current || !Object.keys(memberLocations).length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Calculate total members for sizing
    const totalMembers = Object.values(memberLocations).reduce((sum, count) => sum + count, 0);
    
    // Main DAO bubble parameters
    const daoCenter = { x: width / 2, y: height / 2 };
    const daoRadius = Math.min(width, height) * 0.4; // Main bubble takes 80% of the smaller dimension
    
    // Calculate positions for region bubbles inside the main bubble
    // Using a stable layout pattern
    const regionPositions: {[key: string]: {x: number, y: number, radius: number}} = {};
    const regions = Object.keys(memberLocations);
    
    // Place regions using a fixed angle arrangement
    regions.forEach((region, i) => {
      const count = memberLocations[region];
      const percentage = count / totalMembers;
      
      // Scale radius based on member count with a minimum size
      const radius = Math.max(daoRadius * Math.sqrt(percentage) * 0.5, daoRadius * 0.15);
      
      // Position nodes at equal angles in a circle
      const angle = (2 * Math.PI * i) / regions.length;
      const distance = daoRadius * 0.5; // Fixed distance from center
      
      const x = daoCenter.x + Math.cos(angle) * distance;
      const y = daoCenter.y + Math.sin(angle) * distance;
      
      regionPositions[region] = { x, y, radius };
    });
    
    // Render once (no animation loop to avoid flashing)
    const render = () => {
      // Apply zoom and pan transformations
      ctx.save();
      ctx.clearRect(0, 0, width, height);
      
      // Set dark blue background
      ctx.fillStyle = 'rgb(13, 15, 30)';
      ctx.fillRect(0, 0, width, height);
      
      // Apply zoom and offset
      ctx.translate(offset.x, offset.y);
      ctx.scale(zoom, zoom);
      ctx.translate(width / 2, height / 2);
      ctx.translate(-width / 2, -height / 2);
      
      // Draw main DAO bubble with glow
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        daoCenter.x, daoCenter.y, 0,
        daoCenter.x, daoCenter.y, daoRadius
      );
      gradient.addColorStop(0, 'rgba(66, 95, 235, 0)');
      gradient.addColorStop(0.8, 'rgba(66, 95, 235, 0.2)');
      gradient.addColorStop(1, 'rgba(66, 95, 235, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.arc(daoCenter.x, daoCenter.y, daoRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw subtle outline for main bubble
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw region bubbles
      regions.forEach(region => {
        const { x, y, radius } = regionPositions[region];
        const color = REGION_COLORS[region as keyof typeof REGION_COLORS];
        
        // Draw bubble with glow
        const regionGradient = ctx.createRadialGradient(
          x, y, radius * 0.2,
          x, y, radius
        );
        
        // Extract base color and create glow
        const baseColor = color.replace('0.7', '0.8');
        const edgeColor = color.replace('0.7', '0.1');
        
        regionGradient.addColorStop(0, baseColor);
        regionGradient.addColorStop(0.7, color);
        regionGradient.addColorStop(1, edgeColor);
        
        ctx.fillStyle = regionGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle stroke to define bubble edges
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Draw region label
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(region, x, y);
        
        // Draw static dots (no animation/flashing) using pre-calculated positions
        if (dotsRef.current[region]) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          dotsRef.current[region].forEach((dot: {x: number, y: number, size: number}) => {
            ctx.beginPath();
            ctx.arc(
              x + dot.x * radius, 
              y + dot.y * radius, 
              dot.size, 
              0, 
              Math.PI * 2
            );
            ctx.fill();
          });
        }
      });
      
      // Restore the canvas context
      ctx.restore();
      
      // Draw zoom controls
      drawZoomControls(ctx, width, height);
    };
    
    // Store render function in ref for access from other hooks
    renderRef.current = render;
    
    // Draw zoom controls - clearly visible and labeled
    const drawZoomControls = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const buttonSize = 24; // Smaller buttons
      const margin = 16;
      const buttonY = height - margin - buttonSize;
      const spacing = 8; // Space between buttons
      
      // Create a semi-transparent background for controls
      const controlWidth = 3 * buttonSize + 2 * spacing + 10;
      const controlHeight = buttonSize + 5;
      const controlX = width - margin - controlWidth;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.roundRect(controlX, buttonY - controlHeight/2, controlWidth, controlHeight, 12);
      ctx.fill();
      
      // Zoom in button
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(width - margin - buttonSize/2, buttonY, buttonSize/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width - margin - buttonSize/2, buttonY, buttonSize/2 - 2, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', width - margin - buttonSize/2, buttonY);
      
      // Zoom out button
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(width - margin - buttonSize/2 - buttonSize - spacing, buttonY, buttonSize/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width - margin - buttonSize/2 - buttonSize - spacing, buttonY, buttonSize/2 - 2, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = 'white';
      ctx.fillText('-', width - margin - buttonSize/2 - buttonSize - spacing, buttonY);
      
      // Reset button
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(width - margin - buttonSize/2 - 2*buttonSize - 2*spacing, buttonY, buttonSize/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width - margin - buttonSize/2 - 2*buttonSize - 2*spacing, buttonY, buttonSize/2 - 2, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText('R', width - margin - buttonSize/2 - 2*buttonSize - 2*spacing, buttonY);
      
      // Don't add the text label to make it cleaner
    };
    
    // Initial render
    render();
    
    // Add event listeners for mouse wheel to handle zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
      setZoom(newZoom);
      
      // Re-render with new zoom
      requestAnimationFrame(render);
    };
    
    // Add event listeners for mouse down to handle panning
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };
    
    // Add event listeners for mouse move to handle panning
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        
        setOffset({
          x: offset.x + dx,
          y: offset.y + dy
        });
        
        setPanStart({ x: e.clientX, y: e.clientY });
        
        // Re-render with new offset
        requestAnimationFrame(render);
      }
    };
    
    // Add event listeners for mouse up to handle panning
    const handleMouseUp = () => {
      setIsPanning(false);
    };
    
    // Add event listener for mouse click to handle zoom buttons
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const buttonSize = 24; // Match the size in drawZoomControls
      const margin = 16;
      const spacing = 8;
      const buttonY = height - margin - buttonSize;
      
      // Check if zoom in button was clicked
      const distZoomIn = Math.sqrt(
        Math.pow(x - (width - margin - buttonSize/2), 2) + 
        Math.pow(y - buttonY, 2)
      );
      
      if (distZoomIn < buttonSize/2) {
        const newZoom = Math.min(3, zoom + 0.2);
        setZoom(newZoom);
        return;
      }
      
      // Check if zoom out button was clicked
      const distZoomOut = Math.sqrt(
        Math.pow(x - (width - margin - buttonSize/2 - buttonSize - spacing), 2) + 
        Math.pow(y - buttonY, 2)
      );
      
      if (distZoomOut < buttonSize/2) {
        const newZoom = Math.max(0.5, zoom - 0.2);
        setZoom(newZoom);
        return;
      }
      
      // Check if reset button was clicked
      const distReset = Math.sqrt(
        Math.pow(x - (width - margin - buttonSize/2 - 2*buttonSize - 2*spacing), 2) + 
        Math.pow(y - buttonY, 2)
      );
      
      if (distReset < buttonSize/2) {
        // Fix for reset functionality - immediately apply the changes
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        // Force immediate render rather than waiting for state updates

        // We use setTimeout to ensure state changes have been applied
        if (canvasRef.current) {
          ctx.save();
          ctx.clearRect(0, 0, width, height);
          
          // Reset transformations
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          
          // Set dark blue background
          ctx.fillStyle = 'rgb(13, 15, 30)';
          ctx.fillRect(0, 0, width, height);
          
          // Render with reset values
          render();
        }
        return;
      }
    };
    
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [memberLocations, zoom, offset, isPanning, panStart]);
  
  // Resize canvas on mount
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const resize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      
      if (parent) {
        const { width, height } = parent.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        
        // Re-render after resize
        const ctx = canvas.getContext('2d');
        if (ctx && Object.keys(memberLocations).length > 0) {
          // Force a re-render by triggering the effect
          setZoom((zoom: number) => zoom);
        }
      }
    };
    
    // Initial resize
    resize();
    
    // Resize on window resize
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [memberLocations]);
  
  // Force initial render
  useEffect(() => {
    // Use setTimeout to ensure the canvas has fully mounted and sized properly
    const timer = setTimeout(() => {
      if (canvasRef.current && renderRef.current && Object.keys(memberLocations).length > 0) {
        // Call the current render function
        renderRef.current();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [memberLocations]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full cursor-move"
      title="DAO Member Distribution (Scroll to zoom, drag to pan)"
    />
  );
};

// Define type for the selected proposal to solve typing issues
interface SelectedProposal {
  id: string;
  title: string;
  votesFor: number;
  votesAgainst: number;
  closingDate: Date;
  fullDetails?: {
    id: string;
    name: string;
    description: string;
    status: string;
    creator: string;
    createdAt: string;
    startTime: string;
    endTime: string;
    votes: {
      for: number;
      against: number;
    };
    actions: Array<{
      type: string;
      description: string;
      walletAddress?: string;
      amount?: string;
      token?: string;
    }>;
    quorum: number;
    minApproval: number;
    daoId: string;
  }
}

// Define type for community links
interface CommunityLinks {
  twitter: string | null;
  discordServer: string | null;
  telegram: string | null;
  instagram: string | null;
  tiktok: string | null;
  website: string | null;
}

const Dashboard = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [memberLocations, setMemberLocations] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [proposalsLoading, setProposalsLoading] = useState<boolean>(true);
  const [membersLoading, setMembersLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [userIsDaoMember, setUserIsDaoMember] = useState<boolean>(false);
  const [membershipLoading, setMembershipLoading] = useState<boolean>(false);
  const [isDaoUpdateModalOpen, setIsDaoUpdateModalOpen] = useState<boolean>(false);
  const [hasUpdatePermission, setHasUpdatePermission] = useState<boolean>(false);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  // Add state for token address
  const [tokenAddress, setTokenAddress] = useState<string>("Bshgs87zjajQ3jPcsxntTWjpEZqrsKfKNS7A5rgRpump");
  const [daoProfile, setDaoProfile] = useState<{
    name: string | null;
    description: string | null;
    profilePicture: string | null;
  }>({
    name: null,
    description: null,
    profilePicture: null
  });
  const [communityLinks, setCommunityLinks] = useState<CommunityLinks>({
    twitter: null,
    discordServer: null,
    telegram: null,
    instagram: null,
    tiktok: null,
    website: null
  });
  
  const { publicKey, connected } = useWallet();
  const { sendTransaction } = useSolanaTransaction();
  const { userInfo } = useAuth();

  // Add these mock data arrays near the top of the file, with other state/data declarations
  const mockRegions = [
    { region: "Asia", members: 320, percentage: 25, color: "#7B5CFF" },
    { region: "Europe", members: 280, percentage: 22, color: "#9C5CFF" },
    { region: "North America", members: 250, percentage: 20, color: "#4E78FF" },
    { region: "South America", members: 180, percentage: 14, color: "#8C45FF" },
    { region: "Africa", members: 160, percentage: 12, color: "#7D45FF" },
    { region: "Oceania", members: 90, percentage: 7, color: "#4EA0FF" }
  ];

  const mockTokens = [
    { name: "USD Coin", symbol: "USDC", amount: 4250.8, percentage: 25, color: "#7B5CFF" },
    { name: "Cardano", symbol: "ADA", amount: 3400.2, percentage: 20, color: "#9C5CFF" },
    { name: "Solana", symbol: "SOL", amount: 2550.5, percentage: 15, color: "#4E78FF" },
    { name: "Polkadot", symbol: "DOT", amount: 1700.9, percentage: 10, color: "#4EA0FF" },
    { name: "Avalanche", symbol: "AVAX", amount: 1360.4, percentage: 8, color: "#8C45FF" }
  ];

  // Chart helper functions
  const createDonutChartData = (items: any[], colorKey: string = 'color') => {
    return {
      labels: items.map(item => item.region || item.name),
      datasets: [
        {
          data: items.map(item => item.percentage),
          backgroundColor: items.map(item => item[colorKey]),
          borderWidth: 0,
          borderRadius: 0,
          hoverOffset: 5,
          cutout: '70%'
        }
      ]
    };
  };

  const donutChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        displayColors: false,
        backgroundColor: 'rgba(17, 17, 17, 0.9)',
        titleColor: '#fff',
        bodyColor: '#6B7280',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => {
            const item = context.dataset.data[context.dataIndex];
            return `${item}%`;
          },
          afterLabel: (context: any) => {
            // Get the corresponding mock data item
            const index = context.dataIndex;
            const dataset = context.dataset;
            
            if (dataset.label === 'Members') {
              const regionData = mockRegions[index];
              return regionData ? `${regionData.members} members` : '';
            } else if (dataset.label === 'Tokens') {
              const tokenData = mockTokens[index];
              return tokenData ? `${tokenData.amount.toFixed(1)} ${tokenData.symbol}` : '';
            }
            return '';
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0,
        borderRadius: 0
      }
    },
    rotation: -0.5 * Math.PI
  };

  // Function to fetch treasury data
  const fetchTreasuryData = async (showRefreshIndicator = true) => {
    if (!daoId) {
      setError('No DAO ID provided');
      setLoading(false);
      return;
    }

    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Use mock data instead of API calls for now
      setTimeout(() => {
        // Mock treasury data
        const mockTreasury = {
          totalValue: 10500000,
          dailyChange: 250000,
          weeklyChange: 780000,
          monthlyChange: 2100000
        };
        setTreasury(mockTreasury as Treasury);
        
        // Mock tokens data
        const mockTokens = [
          { tokenId: '1', name: 'Solana', symbol: 'SOL', amount: 12500.45, contract: '0x123...' },
          { tokenId: '2', name: 'Ethereum', symbol: 'ETH', amount: 487.32, contract: '0x456...' },
          { tokenId: '3', name: 'USD Coin', symbol: 'USDC', amount: 350000, contract: '0x789...' },
          { tokenId: '4', name: 'Bitcoin', symbol: 'BTC', amount: 10.75, contract: '0xabc...' },
          { tokenId: '5', name: 'Avalanche', symbol: 'AVAX', amount: 2800.12, contract: '0xdef...' },
          { tokenId: '6', name: 'Cardano', symbol: 'ADA', amount: 45000, contract: '0xghi...' },
          { tokenId: '7', name: 'Polkadot', symbol: 'DOT', amount: 8500, contract: '0xjkl...' },
        ];
        
        // Sort by amount and take top 5
        const sortedTokens = [...mockTokens].sort((a, b) => b.amount - a.amount).slice(0, 5);
        setTokens(sortedTokens as Token[]);
        
        setLastUpdated(new Date());
        setRefreshing(false);
        setLoading(false);
        setError(null);
      }, 800); 
      
      // Simulate network delay

      /* Original API code - commented out for now
      // Fetch treasury data
      const treasuryData = await treasuryService.getTreasury(daoId);
      setTreasury(treasuryData);
      
      // Fetch tokens for the pie chart
      const tokensData = await treasuryService.getTokens(daoId);
      // Sort by amount and take top 5
      const sortedTokens = [...tokensData].sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5);
      setTokens(sortedTokens);
      
      setLastUpdated(new Date());
      setRefreshing(false);
      setLoading(false);
      setError(null);
      */
     
    } catch (err) {
      console.error('Error fetching treasury data:', err);
      setError('Failed to load treasury data. Please try again.');
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Function to fetch proposals data
  const fetchProposalsData = async () => {
    if (!daoId) return;
    
    try {
      setProposalsLoading(true);
      
      // Get all proposals data from the API
      const proposalsData = await proposalService.getAllProposals(daoId);
      
      // Transform API proposals to our component's format, filtering for active proposals only
      const formattedProposals = proposalsData
        .filter(p => p.isActive) // Only keep active proposals
        .map(p => ({
          id: p.proposalId || '',
          title: p.name || '',
          votesFor: p.forVotesCount || 0,
          votesAgainst: p.againstVotesCount || 0,
          closingDate: p.endTime ? new Date(p.endTime) : new Date()
        }));
      
      // Sort by closing date (soonest first)
      const sortedProposals = formattedProposals.sort((a, b) => a.closingDate.getTime() - b.closingDate.getTime());
      setProposals(sortedProposals);
      setProposalsLoading(false);
    } catch (err) {
      console.error('Error fetching proposals data:', err);
      setProposalsLoading(false);
    }
  };

  // Function to fetch member data
  const fetchMemberData = async () => {
    if (!daoId) return;
    
    try {
      setMembersLoading(true);
      
      // Get members of the DAO
      const membersData = await daosService.getDaoMembers(daoId);
      setMembers(membersData);
      
      // Mock location data (in a real app, you'd get this from user profiles)
      // Count members by country/region
      const locationCounts: {[key: string]: number} = {
        'North America': 450,
        'Europe': 380,
        'Asia': 320,
        'South America': 120,
        'Africa': 52,
        'Oceania': 20
      };
      
      setMemberLocations(locationCounts);
      setMembersLoading(false);
    } catch (err) {
      console.error('Error fetching member data:', err);
      setMembersLoading(false);
    }
  };

  // Function to update token percentages
  const updateTokenPercentages = async () => {
    if (!daoId) return;
    
    try {
      setRefreshing(true);
      
      // Use mock data instead of API call
      setTimeout(() => {
        // Mock tokens data with updated percentages
        const mockTokens = [
          { tokenId: '1', name: 'Solana', symbol: 'SOL', amount: 13200.88, contract: '0x123...' },
          { tokenId: '2', name: 'Ethereum', symbol: 'ETH', amount: 492.15, contract: '0x456...' },
          { tokenId: '3', name: 'USD Coin', symbol: 'USDC', amount: 345000, contract: '0x789...' },
          { tokenId: '4', name: 'Bitcoin', symbol: 'BTC', amount: 11.02, contract: '0xabc...' },
          { tokenId: '5', name: 'Avalanche', symbol: 'AVAX', amount: 2950.75, contract: '0xdef...' },
          { tokenId: '6', name: 'Cardano', symbol: 'ADA', amount: 44500, contract: '0xghi...' },
          { tokenId: '7', name: 'Polkadot', symbol: 'DOT', amount: 8750, contract: '0xjkl...' },
        ];
        
        // Sort by amount and take top 5
        const sortedTokens = [...mockTokens].sort((a, b) => b.amount - a.amount).slice(0, 5);
        setTokens(sortedTokens as Token[]);
        
        // Update treasury total value
        setTreasury((prev: Treasury | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            totalValue: 10750000,
            dailyChange: 270000
          };
        });
        
        setRefreshing(false);
        setLastUpdated(new Date());
      }, 1000); // Simulate network delay
      
      /* Original API code - commented out for now
      // Update the token percentages
      await treasuryService.updateDAOTokenPercentages(daoId);
      
      // Refresh the data to show updated percentages
      await fetchTreasuryData(false);
      
      setRefreshing(false);
      setLastUpdated(new Date());
      */
    } catch (err) {
      console.error('Error updating token percentages:', err);
      setRefreshing(false);
    }
  };

  // Check if the current user is a member of the DAO
  const checkDaoMembership = async () => {
    if (!daoId || !publicKey) return;
    
    try {
      setMembershipLoading(true);
      
      // Get the current user's ID
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setUserIsDaoMember(false);
        setMembershipLoading(false);
        return;
      }
      
      // Call the DAO-API SDK to check membership
      const members = await daosService.getDaoMembers(daoId);
      console.log('DAO members:', members);
      console.log('Current user ID:', currentUser.userId);
      
      // Check if the user is a member by userId
      const isMember = members.some((member: any) => member.userId === currentUser.userId);
      
      console.log('User is DAO member:', isMember);
      setUserIsDaoMember(isMember);
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error checking DAO membership:', err);
      setUserIsDaoMember(false);
      setMembershipLoading(false);
    }
  };

  // Join a DAO
  const handleJoinDao = async () => {
    if (!daoId || !publicKey) {
      console.error("Missing required data for joining DAO");
      return;
    }
    
    try {
      setMembershipLoading(true);
      
      // Get the user ID - this should be retrieved from the user service
      // rather than using the public key directly
      const currentUser = await userService.getCurrentUser();
      
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setMembershipLoading(false);
        return;
      }
      
      console.log("Found user ID for adding to DAO:", currentUser.userId);
      
      // Call the DAO-API SDK to join the DAO with the correct user ID
      const result = await daosService.addMemberToDao(daoId, currentUser.userId);
      if (result) {
        console.log('Successfully joined DAO');
        setUserIsDaoMember(true);
        // Refresh member data
        fetchMemberData();
      } else {
        console.error('Failed to join DAO');
        // Re-check membership to be sure
        checkDaoMembership();
      }
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error joining DAO:', err);
      setMembershipLoading(false);
      // Re-check membership to be sure
      checkDaoMembership();
    }
  };
  
  // Leave a DAO
  const handleLeaveDao = async () => {
    if (!daoId || !publicKey) {
      console.error("Missing required data for leaving DAO");
      return;
    }
    
    try {
      setMembershipLoading(true);
      
      // Get the current user's ID directly from the user service
      const currentUser = await userService.getCurrentUser();
      
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setMembershipLoading(false);
        return;
      }
      
      console.log("Found user ID for removal:", currentUser.userId);
      
      // Call the DAO-API SDK to leave the DAO with the correct user ID
      const result = await daosService.removeMemberFromDao(daoId, currentUser.userId);
      if (result) {
        console.log('Successfully left DAO');
        setUserIsDaoMember(false);
        // Refresh member data
        fetchMemberData();
      } else {
        console.error('Failed to leave DAO');
        // Re-check membership to be sure
        checkDaoMembership();
      }
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error leaving DAO:', err);
      setMembershipLoading(false);
      // Re-check membership to be sure
      checkDaoMembership();
    }
  };

  // Check membership when component loads or when relevant data changes
  useEffectOnce(() => {
    // Only run checks if we have a daoId and auth context
    if (!daoId) return;
    
    // Check membership if wallet is connected
    if (publicKey && connected) {
      checkDaoMembership();
    }
    
    // Check update permission if we have user info
    if (userInfo?.userId) {
      checkUpdatePermission();
    }
    
  }, [daoId, publicKey, connected, userInfo?.userId]);

  // Set up initial data load
  useEffectOnce(() => {
    if (!daoId) return;
    
    const loadData = async () => {
      await fetchTreasuryData();
      await fetchProposalsData();
      await fetchMemberData();
    };
    
    loadData();
    
    // Set up the automatic refresh timer
    timerRef.current = setInterval(() => {
      fetchTreasuryData(false);
    }, 60000); // Refresh every minute
    
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [daoId]);

  // Initialize Solana connection once on component mount
  useEffectOnce(() => {
    // Initialize the Solana connection with our configured endpoint
    proposalService.initializeSolanaConnection(SOLANA_RPC_ENDPOINT);
  });

  // Prepare data for the pie chart
  const tokenChartData: ChartData<'pie'> = {
    labels: tokens.map((token: Token) => token.name),
    datasets: [
      {
        data: tokens.map((token: Token) => token.amount || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Format currency value
  const formatCurrency = (value: any): string => {
    if (value === null || value === undefined) return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number(value));
  };

  // Calculate percentage change
  const calculatePercentageChange = (current: any, previous: any): string => {
    if (!current || !previous || previous === 0) return '0%';
    
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  // Format the last updated time
  const formatLastUpdated = (): string => {
    if (!lastUpdated) return 'Never';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(lastUpdated);
  };

  // Format date for proposals
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return `< 1h`;
    }
  };

  // Add a function to check if the current user is the owner or an admin of the DAO
  const checkUpdatePermission = async () => {
    if (!daoId || !userInfo?.userId) {
      setHasUpdatePermission(false);
      return;
    }
    
    try {
      const daoInfo = await daosService.getDaoById(daoId);
      
      if (!daoInfo) {
        setHasUpdatePermission(false);
        return;
      }
      
      // Check if current user is the owner
      if (daoInfo.ownerId === userInfo.userId) {
        setHasUpdatePermission(true);
        return;
      }
      
      // Check if current user is an admin
      const isAdmin = daoInfo.admins?.some(admin => admin.userId === userInfo.userId);
      setHasUpdatePermission(Boolean(isAdmin));
      
    } catch (err) {
      console.error('Error checking update permission:', err);
      setHasUpdatePermission(false);
    }
  };

  // Handle vote on proposal
  const handleVoteOnProposal = async (proposalId: string, vote: 'for' | 'against') => {
    if (!daoId || !publicKey) {
      console.error("Missing required data for voting");
      return;
    }
    
    try {
      // Create Solana transaction for voting
      const result = await proposalService.createVoteTransaction(
        daoId,
        proposalId,
        publicKey,
        vote
      );
      
      if (!result) {
        console.error("Failed to create vote transaction");
        return null;
      }
      
      const { transaction, voteAccount } = result;

      // Send transaction to be signed and processed
      const signature = await sendTransaction(transaction);
      
      if (!signature) {
        console.error("Failed to sign and send transaction");
        return null;
      }

      
      // Update the API with the vote information
      await proposalService.voteOnProposal(daoId, proposalId, vote, signature, voteAccount.publicKey.toString());
      
      // Refresh proposals data
      await fetchProposalsData();
      return signature;
    } catch (err) {
      console.error("Error voting on proposal:", err);
      return null;
    }
  };

  // Close proposal popup
  const handleCloseProposal = () => {
    setSelectedProposal(null);
  };

  // Load full proposal details when selected
  const loadFullProposalDetails = async (proposalId: string) => {
    if (!daoId || !proposalId) return;
    
    try {
      const proposalDetails = await proposalService.getProposalById(daoId, proposalId);
      if (proposalDetails) {
        // Update the selected proposal with full details
        setSelectedProposal((prevProposal: SelectedProposal | null) => {
          if (!prevProposal) return null;
          
          return {
            ...prevProposal,
            fullDetails: {
              id: proposalDetails.proposalId || prevProposal.id,
              name: proposalDetails.name || prevProposal.title,
              description: proposalDetails.description || "No description available",
              status: proposalDetails.isActive ? "Active" : proposalDetails.hasPassed ? "Passed" : "Rejected",
              creator: proposalDetails.createdByUsername || "Unknown",
              createdAt: proposalDetails.createdAt ? new Date(proposalDetails.createdAt).toLocaleDateString() : "Unknown date",
              startTime: proposalDetails.startTime ? new Date(proposalDetails.startTime).toLocaleDateString() : "Unknown",
              endTime: proposalDetails.endTime ? new Date(proposalDetails.endTime).toLocaleDateString() : "Unknown",
              votes: {
                for: proposalDetails.forVotesCount || prevProposal.votesFor || 0,
                against: proposalDetails.againstVotesCount || prevProposal.votesAgainst || 0
              },
              actions: proposalDetails.actions ? Object.values(proposalDetails.actions).map((action: any) => ({
                type: action.type || "",
                description: action.description || "",
                walletAddress: action.wallet_address,
                amount: action.amount,
                token: action.token
              })) : [],
              quorum: 100, // Default values
              minApproval: 51,
              daoId: daoId
            }
          };
        });
      }
    } catch (err) {
      console.error("Error loading full proposal details:", err);
    }
  };

  // Fonction pour récupérer les liens de la communauté
  const fetchCommunityLinks = async () => {
    if (!daoId) return;
    
    try {
      // Récupérer les informations de la DAO depuis l'API
      const daoInfo = await daosService.getDaoById(daoId);
      
      if (daoInfo) {
        // Récupérer les liens sociaux depuis l'objet DAO
        const socialLinks = {
          twitter: daoInfo.twitter || null,
          discordServer: daoInfo.discordServer || null,
          telegram: daoInfo.telegram || null,
          instagram: daoInfo.instagram || null,
          tiktok: daoInfo.tiktok || null,
          website: daoInfo.website || null
        };
        
        // Set DAO profile information
        setDaoProfile({
          name: daoInfo.name || null,
          description: daoInfo.description || null,
          profilePicture: daoInfo.profilePicture || null
        });
        
        console.log('Social links retrieved from API:', socialLinks);
        setCommunityLinks(socialLinks);
      } else {
        console.log('No DAO information found');
        // Réinitialiser à null si aucune information n'est trouvée
        setCommunityLinks({
          twitter: null,
          discordServer: null,
          telegram: null,
          instagram: null,
          tiktok: null,
          website: null
        });
      }
    } catch (err) {
      console.error('Error fetching community links:', err);
      // En cas d'erreur, réinitialiser à null
      setCommunityLinks({
        twitter: null,
        discordServer: null,
        telegram: null,
        instagram: null,
        tiktok: null,
        website: null
      });
    }
  };

  // Fetch community links when component loads or when relevant data changes
  useEffectOnce(() => {
    // Only run checks if we have a daoId
    if (!daoId) return;
    
    // Fetch community links
    fetchCommunityLinks();
  }, [daoId]);

  // Fonction pour vérifier si des liens de communauté existent
  const hasCommunityLinks = (): boolean => {
    return Object.values(communityLinks).some(link => link !== null);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h1 className="text-3xl font-bold">Home</h1>
        <div className="flex flex-wrap gap-2">
          {connected && userIsDaoMember && (
            <Button 
              variant="outline"
              onClick={handleLeaveDao}
              disabled={membershipLoading}
              className="flex items-center gap-2 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 border-2 border-red-500/50 hover:border-red-500 bg-transparent hover:bg-red-500/10"
            >
              {membershipLoading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <LogOut size={14} className="text-red-500" />
                  <span className="text-red-500">Leave DAO</span>
                </>
              )}
            </Button>
          )}
          {hasUpdatePermission && (
            <Button 
              variant="outline"
              onClick={() => setIsDaoUpdateModalOpen(true)}
              className="flex items-center gap-2 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 border-2 border-gray-800 hover:border-purple-500/50 bg-[#151515]"
            >
              <Settings size={14} />
              <span>Update DAO</span>
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {/* Left Column: DAO Portfolio + News + Proposals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-4">
            {/* Overall DAO Portfolio */}
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
              <div className="mb-3">
                <h2 className="text-xl font-medium text-white">Overall DAO Stats</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-400 flex items-center">
                    <span>DAO Balance</span>
                    <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">+24%</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">{formatCurrency(treasury?.totalValue)}</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-400 flex items-center">
                    <span>DAO Members</span>
                    <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">+12 this week</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">{members.length || 1342}</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-400 flex items-center">
                    <span>Active Proposals</span>
                    <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">{proposals.filter(p => p.closingDate.getTime() - Date.now() < 48 * 60 * 60 * 1000).length} closing soon</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">{proposals.length}</div>
                </div>
              </div>
            </div>
            
            {/* DAO News */}
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">DAO News</h3>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">Latest updates</span>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-[#1A1A1A]/70 rounded-lg border-l-4 border-l-indigo-500">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-white">Treasury growth surpasses expectations</span>
                    <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                  <p className="text-gray-400 text-sm">The DAO's treasury has grown by 24% this month, exceeding our target of 15%. This positions us well for upcoming project funding.</p>
                </div>
                
                <div className="p-3 bg-[#1A1A1A]/70 rounded-lg border-l-4 border-l-purple-500">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-white">New partnership announcement</span>
                    <span className="text-xs text-gray-400">4 days ago</span>
                  </div>
                  <p className="text-gray-400 text-sm">We've established a strategic partnership with DecentralFi to expand our DeFi capabilities and provide additional yield opportunities.</p>
                </div>
                
                <div className="p-3 bg-[#1A1A1A]/70 rounded-lg border-l-4 border-l-blue-500">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-white">Community call scheduled</span>
                    <span className="text-xs text-gray-400">1 week ago</span>
                  </div>
                  <p className="text-gray-400 text-sm">Our next community call is scheduled for June 15th. We'll be discussing Q3 plans and voting on new governance proposals.</p>
                </div>
              </div>
            </div>
            
            {/* Proposals Activity */}
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Active Proposals</h3>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">{proposals.length} Active</span>
              </div>
              
              {proposalsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader className="animate-spin text-primary" size={30} />
                </div>
              ) : proposals.length > 0 ? (
                <div className="space-y-3">
                  {proposals.map((proposal, index) => (
                    <div 
                      key={proposal.id} 
                      className="p-3 bg-[#1A1A1A]/70 rounded-lg hover:bg-[#222]/90 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedProposal(proposal);
                        loadFullProposalDetails(proposal.id);
                      }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-white">{proposal.title}</span>
                        <span className="text-xs text-gray-400">Closes in {formatDate(proposal.closingDate)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-4">
                          <span className="text-green-400 text-sm">For: {proposal.votesFor}</span>
                          <span className="text-red-400 text-sm">Against: {proposal.votesAgainst}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <p>No active proposals at the moment</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column: Share Holders + Token Distribution */}
          <div className="col-span-1 space-y-4">
            {/* DAO Profile and Community Links - Moved up */}
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
              {/* DAO Profile Section */}
              {daoProfile.name || daoProfile.description || daoProfile.profilePicture ? (
                <div className="flex flex-col md:flex-row items-center mb-5 border-b border-gray-800 pb-5">
                  {/* Profile picture container - Made consistently circular with responsive sizing */}
                  <div className="w-full md:w-[30%] flex justify-center items-center mb-4 md:mb-0 md:pr-3">
                    {daoProfile.profilePicture ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-gray-700/50 flex-shrink-0">
                        <img 
                          src={daoProfile.profilePicture} 
                          alt={`${daoProfile.name || 'DAO'} profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=DAO';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center border border-gray-700/50 flex-shrink-0">
                        <Users size={40} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Right column - Name and description (adjusted for better mobile view) */}
                  <div className="w-full md:w-[70%] md:pl-2 flex flex-col justify-center text-center md:text-left">
                    {daoProfile.name ? (
                      <h4 className="text-lg font-medium text-white mb-1">{daoProfile.name}</h4>
                    ) : (
                      <h4 className="text-lg font-medium text-white mb-1">Unnamed DAO</h4>
                    )}
                    
                    {daoProfile.description ? (
                      <p className="text-sm text-gray-400">
                        {daoProfile.description.length > 300 
                          ? `${daoProfile.description.substring(0, 300)}...` 
                          : daoProfile.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No description available
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center mb-5 border-b border-gray-800 pb-5">
                  {/* Left column - Profile picture (made consistently circular) */}
                  <div className="w-full md:w-[30%] flex justify-center items-center mb-4 md:mb-0 md:pr-3">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center border border-gray-700/50 flex-shrink-0">
                      <Users size={40} className="text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Right column - Name and description (adjusted for mobile) */}
                  <div className="w-full md:w-[70%] md:pl-2 flex flex-col justify-center text-center md:text-left">
                    <h4 className="text-lg font-medium text-white mb-1">Loading DAO...</h4>
                    <p className="text-sm text-gray-400">
                      Fetching DAO information...
                    </p>
                  </div>
                </div>
              )}
              
              {hasCommunityLinks() ? (
                <div className="flex flex-wrap justify-center items-center gap-6 py-2">
                  {communityLinks.twitter && (
                    <a href={communityLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">X</span>
                    </a>
                  )}
                  
                  {communityLinks.discordServer && (
                    <a href={communityLinks.discordServer} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 127.14 96.36" fill="#fff">
                          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Discord</span>
                    </a>
                  )}
                  
                  {communityLinks.telegram && (
                    <a href={communityLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Telegram</span>
                    </a>
                  )}
                  
                  {communityLinks.instagram && (
                    <a href={communityLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.072-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Instagram</span>
                    </a>
                  )}
                  
                  {communityLinks.tiktok && (
                    <a href={communityLinks.tiktok} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">TikTok</span>
                    </a>
                  )}
                  
                  {communityLinks.website && (
                    <a href={communityLinks.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Website</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="py-1 text-center">
                  <p className="text-xs text-gray-500 mt-2">This DAO has no community links</p>
                </div>
              )}
            </div>
            
            {/* Replace the DAO Token card with our TokenCard component */}
            <TokenCard tokenAddress={tokenAddress} />
            
            {/* Member Distribution */}
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="font-medium text-white mb-1 sm:mb-0">Share Holders</h3>
                <div className="text-xs text-gray-500">
                  Last updated: {formatLastUpdated()}
                </div>
              </div>
              
              {membersLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader className="animate-spin text-primary" size={24} />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Left column - Chart */}
                  <div className="w-full sm:w-2/5 flex justify-center">
                    <div className="relative w-full aspect-square" style={{ maxWidth: "120px", margin: "0 auto" }}>
                      <Pie 
                        data={{
                          ...createDonutChartData(mockRegions),
                          datasets: [
                            {
                              ...createDonutChartData(mockRegions).datasets[0],
                              label: 'Members'
                            }
                          ]
                        }} 
                        options={donutChartOptions} 
                      />
                    </div>
                  </div>
                  
                  {/* Right column - Legend */}
                  <div className="w-full sm:w-3/5 flex items-center justify-center sm:justify-start mt-4 sm:mt-0">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {mockRegions.map(region => (
                        <div key={region.region} className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: region.color }} />
                          <span className="text-xs text-gray-400">{region.region}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Token Distribution */}
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="font-medium text-white mb-1 sm:mb-0">Token Distribution</h3>
                <div className="text-xs text-gray-500">
                  Last updated: {formatLastUpdated()}
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader className="animate-spin text-primary" size={24} />
                </div>
              ) : tokens.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Left column - Chart */}
                  <div className="w-full sm:w-2/5 flex justify-center">
                    <div className="relative w-full aspect-square" style={{ maxWidth: "120px", margin: "0 auto" }}>
                      <Pie 
                        data={{
                          ...createDonutChartData(mockTokens),
                          datasets: [
                            {
                              ...createDonutChartData(mockTokens).datasets[0],
                              label: 'Tokens'
                            }
                          ]
                        }} 
                        options={donutChartOptions}
                      />
                    </div>
                  </div>
                  
                  {/* Right column - Legend */}
                  <div className="w-full sm:w-3/5 flex items-center justify-center sm:justify-start mt-4 sm:mt-0">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {mockTokens.map(token => (
                        <div key={token.name} className="flex items-center">
                          <div 
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: token.color }}
                          />
                          <span className="text-xs text-gray-400 truncate">{token.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400">
                  <p>No tokens found for this DAO</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DAO Update Modal */}
      <DaoUpdateModal 
        isOpen={isDaoUpdateModalOpen} 
        onClose={() => setIsDaoUpdateModalOpen(false)} 
      />
      
      {/* Proposal Modal */}
      {selectedProposal && (
        <PopupProposal
          proposal={selectedProposal.fullDetails || {
            id: selectedProposal.id,
            name: selectedProposal.title,
            description: "Loading proposal details...",
            status: "Active",
            creator: "Loading...",
            createdAt: "Loading...",
            startTime: "Loading...",
            endTime: formatDate(selectedProposal.closingDate),
            votes: {
              for: selectedProposal.votesFor,
              against: selectedProposal.votesAgainst
            },
            actions: [],
            quorum: 100,
            minApproval: 51,
            daoId: daoId || ""
          }}
          onClose={handleCloseProposal}
          onVote={handleVoteOnProposal}
          onVoteSubmitted={fetchProposalsData}
        />
      )}
    </div>
  );
};

export default Dashboard;